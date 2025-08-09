class StudentsController < ApplicationController
  def index
    render inertia: "Student/Index", props: {
      students: Student.all
    }
  end

  def show
    render inertia: "Student/Show"
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
