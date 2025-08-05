class StudentsController < ApplicationController
  def index
    render inertia: "Student/Index"
  end

  def show
    render inertia: "Student/Show"
  end
end
