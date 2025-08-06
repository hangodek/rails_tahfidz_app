class TeachersController < ApplicationController
  def index
    render inertia: "Teacher/Index"
  end
end
