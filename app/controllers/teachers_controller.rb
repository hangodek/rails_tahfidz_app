class TeachersController < ApplicationController
  def index
    render inertia: "Teacher/Index", props: {
      students: Student.all.as_json(only: [ :id, :name, :class_level, :current_hifz_in_juz ])
    }
  end
end
