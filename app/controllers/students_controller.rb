class StudentsController < ApplicationController
  def index
    render inertia: "Student/Index"
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
      render inertia: "Student/Create", props: {
        errors: @student.errors
      }
    end
  end

  private

  def student_params
    params.require(:student).permit(:name, :address, :birth_date, :mother_name, :father_name, :date_joined, :hifz_in_juz, :hifz_in_page)
  end
end
