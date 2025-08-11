class StudentsController < ApplicationController
  def index
    students = Student.all.map do |student|
      student.as_json.merge(
        avatar: student.avatar.attached? ? url_for(student.avatar) : nil
      )
    end

    render inertia: "Student/Index", props: {
      students: students
    }
  end

  def show
    render inertia: "Student/Show", props: {
      student: Student.find(params[:id]).as_json.merge(
        avatar: Student.find(params[:id]).avatar.attached? ? url_for(Student.find(params[:id]).avatar) : nil
      )
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
end
