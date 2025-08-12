class ActivitiesController < ApplicationController
  before_action :set_student
  before_action :set_activity, only: [ :destroy ]

  def create
    @activity = @student.activities.build(create_activity_params)

    if @activity.save
      redirect_to teachers_path, notice: "Activity was successfully created."
    else
      redirect_to teachers_path, alert: @activity.errors.full_messages.join(", ")
    end
  end

  def destroy
    @activity.destroy
    redirect_to teachers_path, notice: "Activity was successfully deleted."
  end

  private

  def set_student
    @student = Student.find(params[:student_id])
  end

  def set_activity
    @activity = @student.activities.find(params[:id])
  end

  def create_activity_params
    params.expect(activity: [ :activity_type, :activity_grade, :surah_name, :verse_from, :verse_to, :juz, :notes ])
  end
end
