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
    total_active_students = Student.active.count

    # Top students by current Juz level (highest to lowest) - only active students
    top_students = Student.active
                         .where.not(current_hifz_in_juz: [ nil, "" ])
                         .order(Arel.sql("CAST(current_hifz_in_juz AS INTEGER) DESC, CAST(current_hifz_in_pages AS INTEGER) DESC"))
                         .limit(10)
                         .map do |student|
                           {
                             id: student.id,
                             name: student.name,
                             current_juz: student.current_hifz_in_juz,
                             activity_count: student.activities.count,
                             progress: calculate_progress(student.current_hifz_in_juz.to_i),
                             avatar: student.avatar.attached? ? url_for(student.avatar) : nil
                           }
                         end

    # Recent activities (last 5 for display)
    recent_activities = Activity.includes(:student, audio_attachment: :blob)
                              .order(created_at: :desc)
                              .limit(5)
                              .map do |activity|
                                {
                                  id: activity.id,
                                  student: activity.student.name,
                                  activity: format_activity_description(activity),
                                  time: time_ago_in_words(activity.created_at) + " ago",
                                  type: activity.activity_type,
                                  audio_url: activity.audio.attached? ? url_for(activity.audio) : nil
                                }
                              end

    # All activities for modal
    all_activities = Activity.includes(:student, audio_attachment: :blob)
                           .order(created_at: :desc)
                           .map do |activity|
                             {
                               id: activity.id,
                               student: activity.student.name,
                               activity: format_activity_description(activity),
                               time: time_ago_in_words(activity.created_at) + " ago",
                               type: activity.activity_type,
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
      student_count = Student.active.where(current_hifz_in_juz: juz.to_s).count
      {
        juz: "Juz #{juz}",
        students: student_count
      }
    end.select { |data| data[:students] > 0 }

    # Monthly progress data (last 6 months)
    monthly_progress = (5.months.ago.beginning_of_month.to_date..Date.current.end_of_month).
                      group_by(&:beginning_of_month).map do |month_start, dates|
      month_range = month_start..month_start.end_of_month
      revision_count = Activity.where(created_at: month_range, activity_type: "revision").count
      memorization_count = Activity.where(created_at: month_range, activity_type: "memorization").count

      {
        month: month_start.strftime("%b"),
        revision: revision_count,
        memorization: memorization_count
      }
    end

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
      all_activities: all_activities,
      daily_submissions: daily_submissions,
      juz_distribution: juz_distribution,
      monthly_progress: monthly_progress
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
