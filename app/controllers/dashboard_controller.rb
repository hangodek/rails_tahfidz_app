class DashboardController < ApplicationController
  include ActionView::Helpers::DateHelper

  def index
    user = Current.user

    # Stats for cards
    today_submissions = Activity.where(created_at: Date.current.all_day).count
    students_revising_today = Activity.joins(:student)
                                    .where(created_at: Date.current.all_day, activity_type: "revision")
                                    .select(:student_id)
                                    .distinct
                                    .count
    students_memorizing_today = Activity.joins(:student)
                                      .where(created_at: Date.current.all_day, activity_type: "memorization")
                                      .select(:student_id)
                                      .distinct
                                      .count
    total_active_students = Student.where(status: "active").count

    # Top students by recent activity (last 30 days)
    top_students = Student.joins(:activities)
                         .where(activities: { created_at: 30.days.ago..Time.current })
                         .group("students.id")
                         .order("COUNT(activities.id) DESC")
                         .limit(5)
                         .select("students.*, COUNT(activities.id) as activity_count")
                         .map do |student|
                           {
                             id: student.id,
                             name: student.name,
                             current_juz: student.current_hifz_in_juz,
                             activity_count: student.activity_count,
                             progress: calculate_progress(student.current_hifz_in_juz.to_i),
                             avatar: student.avatar.attached? ? url_for(student.avatar) : nil
                           }
                         end

    # Recent activities (last 10)
    recent_activities = Activity.joins(:student)
                              .order(created_at: :desc)
                              .limit(10)
                              .select("activities.*, students.name as student_name")
                              .map do |activity|
                                {
                                  student: activity.student_name,
                                  activity: format_activity_description(activity),
                                  time: time_ago_in_words(activity.created_at) + " ago",
                                  type: activity.activity_type
                                }
                              end

    # Daily submissions for chart (configurable date range)
    from_date = params[:from]&.to_date || 6.days.ago.to_date
    to_date = params[:to]&.to_date || Date.current
    
    daily_submissions = (from_date..to_date).map do |date|
      {
        date: date.strftime("%m/%d"),
        submissions: Activity.where(created_at: date.all_day).count
      }
    end

    # Juz distribution data
    juz_distribution = (1..30).map do |juz|
      student_count = Student.where(current_hifz_in_juz: juz.to_s).count
      {
        juz: "Juz #{juz}",
        students: student_count
      }
    end.select { |data| data[:students] > 0 }

    render inertia: "Dashboard/Index", props: {
      user: user,
      stats: {
        today_submissions: today_submissions,
        students_revising_today: students_revising_today,
        students_memorizing_today: students_memorizing_today,
        total_active_students: total_active_students
      },
      top_students: top_students,
      recent_activities: recent_activities,
      daily_submissions: daily_submissions,
      juz_distribution: juz_distribution
    }
  end

  private

  def calculate_progress(current_juz)
    # Calculate progress as percentage (30 Juz = 100%)
    ((current_juz.to_f / 30) * 100).round
  end

  def format_activity_description(activity)
    type_text = activity.activity_type == "memorization" ? "Memorized" : "Reviewed"
    if activity.surah_from == activity.surah_to
      "#{type_text} #{activity.surah_from} pages #{activity.page_from}-#{activity.page_to}"
    else
      "#{type_text} from #{activity.surah_from} to #{activity.surah_to}"
    end
  end
end
