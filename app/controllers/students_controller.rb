class StudentsController < ApplicationController
  include ActionView::Helpers::DateHelper
  def index
    students = Student.all.order(name: :asc).map do |student|
      student.as_json.merge(
        avatar: student.avatar.attached? ? url_for(student.avatar) : nil
      )
    end

    render inertia: "Student/Index", props: {
      students: students
    }
  end

  def show
    student = Student.find(params[:id])
    activities = student.activities.order(created_at: :desc)

    # Get recent activities (last 5 for display)
    recent_activities = activities.limit(5).map do |activity|
      {
        id: activity.id,
        activity: format_activity_description(activity),
        time: time_ago_in_words(activity.created_at) + " ago",
        type: activity.activity_type,
        date: activity.created_at.strftime("%Y-%m-%d"),
        created_at: activity.created_at,
        audio_url: activity.audio.attached? ? url_for(activity.audio) : nil
      }
    end

    # Get all activities for modal
    all_activities = activities.map do |activity|
      {
        id: activity.id,
        activity: format_activity_description(activity),
        time: time_ago_in_words(activity.created_at) + " ago",
        type: activity.activity_type,
        date: activity.created_at.strftime("%Y-%m-%d"),
        created_at: activity.created_at,
        grade: activity.activity_grade.humanize,
        surah_from: activity.surah_from,
        surah_to: activity.surah_to,
        page_from: activity.page_from,
        page_to: activity.page_to,
        juz: activity.juz,
        notes: activity.notes,
        audio_url: activity.audio.attached? ? url_for(activity.audio) : nil
      }
    end

    # Calculate monthly progress (cumulative juz progress)
    monthly_progress = calculate_monthly_progress(student, activities)

    # Calculate activity grade distribution
    grade_distribution = activities.group(:activity_grade).count.map do |grade, count|
      {
        name: grade.humanize,
        value: count,
        color: grade_color(grade)
      }
    end

    # Calculate activity type distribution
    type_distribution = activities.group(:activity_type).count.map do |type, count|
      {
        name: type.humanize,
        value: count,
        color: type_color(type)
      }
    end

    # Calculate monthly activity distribution (last 6 months)
    monthly_activities = (5.months.ago.beginning_of_month.to_date..Date.current.end_of_month).
                        group_by(&:beginning_of_month).map do |month_start, dates|
      month_range = month_start..month_start.end_of_month
      revision_count = activities.where(created_at: month_range, activity_type: "revision").count
      memorization_count = activities.where(created_at: month_range, activity_type: "memorization").count

      {
        month: month_start.strftime("%b"),
        revision: revision_count,
        memorization: memorization_count
      }
    end

    render inertia: "Student/Show", props: {
      student: student.as_json.merge(
        avatar: student.avatar.attached? ? url_for(student.avatar) : nil
      ),
      recent_activities: recent_activities,
      all_activities: all_activities,
      total_activities: activities.count,
      monthly_progress: monthly_progress,
      grade_distribution: grade_distribution,
      type_distribution: type_distribution,
      monthly_activities: monthly_activities
    }
  end

  def new
    render inertia: "Student/New"
  end

  def create
    @student = Student.new(student_params)

    if @student.save
      redirect_to students_path, notice: "Student created successfully!"
    else
      render inertia: "Student/New", props: {
        errors: @student.errors
      }
    end
  end

  private

  def student_params
    params.expect(student: [ :name, :current_hifz_in_juz, :current_hifz_in_pages, :current_hifz_in_surah, :avatar, :class_level, :phone, :email, :status, :gender, :birth_place, :birth_date, :address, :father_name, :mother_name, :father_phone, :mother_phone, :date_joined ])
  end

  def format_activity_description(activity)
    surah_display = activity.surah_from == activity.surah_to ? activity.surah_from : "#{activity.surah_from} - #{activity.surah_to}"

    case activity.activity_type
    when "memorization"
      "Memorized #{surah_display} pages #{activity.page_from}-#{activity.page_to}"
    when "revision"
      "Revised #{surah_display} pages #{activity.page_from}-#{activity.page_to}"
    else
      "#{activity.activity_type.humanize} #{surah_display} pages #{activity.page_from}-#{activity.page_to}"
    end
  end

  def calculate_monthly_progress(student, activities)
    current_juz = student.current_hifz_in_juz.to_i
    join_date = Date.parse(student.date_joined) rescue Date.current

    # Show 3 months back and 3 months forward from current month
    current_month = Date.current.beginning_of_month
    start_date = current_month - 3.months
    end_date = current_month + 3.months

    monthly_data = []

    # Calculate total months since joining
    months_since_joining = ((Date.current.year - join_date.year) * 12 + Date.current.month - join_date.month)

    # Get memorization activities ordered by date
    memorization_activities = activities.where(activity_type: "memorization").order(:created_at)

    # Only calculate progression if there are actual memorization activities
    if memorization_activities.any?
      # Calculate realistic monthly progress rate based on actual activities
      first_activity_date = memorization_activities.first.created_at.to_date
      months_with_activities = ((Date.current.year - first_activity_date.year) * 12 + Date.current.month - first_activity_date.month)
      months_with_activities = [ months_with_activities, 1 ].max # At least 1 month

      # Calculate average rate based on actual progress with activities
      actual_progress = current_juz
      average_monthly_rate = actual_progress.to_f / months_with_activities
      average_monthly_rate = [ average_monthly_rate, 0.5 ].max # Minimum 0.5 juz per month
      average_monthly_rate = [ average_monthly_rate, 2.0 ].min # Maximum 2 juz per month
    else
      # No activities = no progress, flat line at current level
      average_monthly_rate = 0
    end

    # Calculate recent activity intensity (last 3 months) for projections
    recent_activities = memorization_activities.where(
      created_at: (Date.current - 3.months)..Date.current
    )

    # Only project growth if there are recent activities
    if recent_activities.count > 0
      recent_activity_factor = [ 1.0 + (recent_activities.count / 20.0), 2.0 ].min
      projected_monthly_rate = average_monthly_rate * recent_activity_factor
    else
      # No recent activities = no projected growth
      projected_monthly_rate = 0
    end

    month_iterator = start_date

    while month_iterator <= end_date
      month_name = month_iterator.strftime("%b")

      if month_iterator == current_month
        # Current month: use actual current progress
        completed = current_juz
        is_projected = false
      elsif month_iterator < current_month
        # Historical months (3 months back)
        months_back = ((current_month.year - month_iterator.year) * 12 + current_month.month - month_iterator.month)

        # Check if there were actual activities in that historical month
        month_activities = memorization_activities.where(
          created_at: month_iterator.beginning_of_month..month_iterator.end_of_month
        )

        if memorization_activities.any?
          # Calculate backwards from current progress only if there are overall activities
          estimated_progress_back_then = current_juz - (months_back * average_monthly_rate)
          completed = [ estimated_progress_back_then, 0 ].max.round

          # If there were specific activities in that month, ensure some progress was made
          if month_activities.any?
            # Ensure they had at least some progress if they had activities
            min_progress_for_activities = [ completed + 0.5, current_juz ].min
            completed = min_progress_for_activities.round
          end
        else
          # No activities at all = they've always been at current level (no growth)
          completed = current_juz
        end

        is_projected = false
      else
        # Future months (3 months forward)
        months_forward = ((month_iterator.year - current_month.year) * 12 + month_iterator.month - current_month.month)

        # Only project growth if there's recent activity
        if projected_monthly_rate > 0
          projected_progress = current_juz + (months_forward * projected_monthly_rate)
          completed = [ projected_progress, 30 ].min.round
        else
          # No growth projected - stay at current level
          completed = current_juz
        end

        is_projected = true
      end

      # Ensure we never go above 30 or below 0
      completed = completed.clamp(0, 30)

      monthly_data << {
        month: month_name,
        completed: completed, # Always integer, no decimals
        is_projected: is_projected
      }

      month_iterator = month_iterator.next_month
    end

    # Final pass: ensure logical progression for historical data
    # Historical data should gradually increase toward current, but only if there are activities
    if memorization_activities.any?
      historical_data = monthly_data.select { |d| !d[:is_projected] }

      historical_data.each_with_index do |data, index|
        next if index == 0 || data[:month] == current_month.strftime("%b")

        prev_data = historical_data[index - 1]

        # Ensure gradual increase, but don't force it if it doesn't make sense
        if data[:completed] < prev_data[:completed]
          data[:completed] = prev_data[:completed]
        elsif data[:completed] == prev_data[:completed] && index < historical_data.length - 1
          # Small increment if they're the same, but only if it leads toward current
          next_target = current_juz
          if data[:completed] < next_target
            data[:completed] = [ prev_data[:completed] + 1, current_juz ].min
          end
        end
      end
    end

    monthly_data
  end

  def grade_color(grade)
    case grade
    when "excellent"
      "#10b981" # green
    when "good"
      "#3b82f6" # blue
    when "fair"
      "#f59e0b" # yellow/orange
    when "needs_improvement"
      "#ef4444" # red
    else
      "#6b7280" # gray
    end
  end

  def type_color(type)
    case type
    when "memorization"
      "#3b82f6" # blue
    when "revision"
      "#10b981" # green
    else
      "#6b7280" # gray
    end
  end
end
