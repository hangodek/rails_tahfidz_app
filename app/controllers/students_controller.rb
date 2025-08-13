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

    # Get recent activities (last 10)
    recent_activities = activities.limit(10).map do |activity|
      {
        id: activity.id,
        activity: format_activity_description(activity),
        time: time_ago_in_words(activity.created_at) + " ago",
        type: activity.activity_type,
        date: activity.created_at.strftime("%Y-%m-%d"),
        created_at: activity.created_at
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

    render inertia: "Student/Show", props: {
      student: student.as_json.merge(
        avatar: student.avatar.attached? ? url_for(student.avatar) : nil
      ),
      recent_activities: recent_activities,
      total_activities: activities.count,
      monthly_progress: monthly_progress,
      grade_distribution: grade_distribution,
      type_distribution: type_distribution
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
    params.expect(student: [ :name, :current_hifz_in_juz, :current_hifz_in_pages, :avatar, :class_level, :phone, :email, :status, :gender, :birth_place, :birth_date, :address, :father_name, :mother_name, :father_phone, :mother_phone, :date_joined ])
  end

  def format_activity_description(activity)
    case activity.activity_type
    when "memorization"
      "Memorized #{activity.surah_name} pages #{activity.page_from}-#{activity.page_to}"
    when "revision"
      "Revised #{activity.surah_name} pages #{activity.page_from}-#{activity.page_to}"
    else
      "#{activity.activity_type.humanize} #{activity.surah_name} pages #{activity.page_from}-#{activity.page_to}"
    end
  end

  def calculate_monthly_progress(student, activities)
    current_juz = student.current_hifz_in_juz.to_i
    join_date = Date.parse(student.date_joined) rescue Date.current

    # Determine the starting point: either 6 months ago or when they joined, whichever is more recent
    start_date = [ Date.current - 5.months, join_date ].max.beginning_of_month

    monthly_data = []

    # Generate monthly data from start_date to current month
    current_month = Date.current.beginning_of_month

    # Calculate how many months from join_date to current date
    months_since_joining = ((Date.current.year - join_date.year) * 12 + Date.current.month - join_date.month)

    # Analyze activities to understand progress pattern
    memorization_activities = activities.where(activity_type: "memorization").order(:created_at)

    # Estimate initial juz based on current progress and time since joining
    if months_since_joining > 0 && current_juz > 0
      # Assume steady progress, but they might have started with some juz
      average_monthly_progress = [ current_juz.to_f / [ months_since_joining, 1 ].max, 2.0 ].min
      initial_juz = [ current_juz - (months_since_joining * average_monthly_progress), 0 ].max.round
    else
      initial_juz = [ current_juz - 2, 0 ].max # Conservative estimate
    end

    month_iterator = start_date

    while month_iterator <= current_month
      month_name = month_iterator.strftime("%b")

      if month_iterator < join_date.beginning_of_month
        # Before they joined, they had 0 juz
        completed = 0
      elsif month_iterator == join_date.beginning_of_month
        # The month they joined, they started with initial_juz
        completed = initial_juz
      elsif month_iterator == current_month
        # Current month shows their current progress
        completed = current_juz
      else
        # Calculate progressive increase from initial to current
        months_from_joining = ((month_iterator.year - join_date.year) * 12 + month_iterator.month - join_date.month)

        # Check if there were memorization activities in this month
        month_activities = memorization_activities.where(
          created_at: month_iterator.beginning_of_month..month_iterator.end_of_month
        )

        # Progressive calculation with activity-based adjustments
        if months_since_joining > 0
          base_progress_ratio = months_from_joining.to_f / months_since_joining
          base_completed = (initial_juz + (current_juz - initial_juz) * base_progress_ratio).round

          # If there were activities this month, ensure some progress
          if month_activities.any?
            # Ensure at least some progress if there were activities
            previous_completed = monthly_data.any? ? monthly_data.last[:completed] : initial_juz
            completed = [ base_completed, previous_completed + 0.5 ].max.round
          else
            completed = base_completed
          end
        else
          completed = initial_juz
        end

        # Ensure we never go backwards (hifz never decreases)
        if monthly_data.any?
          completed = [ completed, monthly_data.last[:completed] ].max
        end
      end

      monthly_data << {
        month: month_name,
        completed: completed.clamp(0, 30) # Max 30 juz
      }

      month_iterator = month_iterator.next_month
    end

    # Ensure we have at least 6 months of data for the chart
    while monthly_data.length < 6
      previous_start = start_date - (6 - monthly_data.length).months

      monthly_data.unshift({
        month: previous_start.strftime("%b"),
        completed: previous_start < join_date.beginning_of_month ? 0 : initial_juz
      })
    end

    # Take only the last 6 months
    monthly_data.last(6)
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
