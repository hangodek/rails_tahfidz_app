class TeachersController < ApplicationController
  def index
    students = Student.includes(:activities).order(name: :asc)

    render inertia: "Teacher/Index", props: {
      students: students.as_json(only: [ :id, :name, :class_level, :current_hifz_in_juz, :current_hifz_in_pages ]),
      recent_activities: Activity.includes(:student)
                                .order(created_at: :desc)
                                .limit(20)
                                .as_json(
                                  include: { student: { only: [ :id, :name ] } },
                                  only: [ :id, :activity_type, :activity_grade, :surah_name, :page_from, :page_to, :juz, :notes, :created_at ]
                                )
    }
  end
end
