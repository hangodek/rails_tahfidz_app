class ActivitiesController < ApplicationController
  before_action :set_student
  before_action :set_activity, only: [ :destroy ]

  def create
    @activity = @student.activities.build(create_activity_params)

    if @activity.save
      # Update student's hifz progress if it's a memorization activity and new progress is provided
      if @activity.memorization? && params.dig(:activity, :new_hifz_juz).present? && params.dig(:activity, :new_hifz_pages).present?
        new_juz = params.dig(:activity, :new_hifz_juz).to_i
        new_pages = params.dig(:activity, :new_hifz_pages).to_i
        current_juz = @student.current_hifz_in_juz.to_i
        current_pages = @student.current_hifz_in_pages.to_i

        # Only update if new progress is greater than current
        if new_juz > current_juz || (new_juz == current_juz && new_pages > current_pages)
          @student.update!(
            current_hifz_in_juz: new_juz.to_s,
            current_hifz_in_pages: new_pages.to_s
          )
        end
      end

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
    params.expect(activity: [ :activity_type, :activity_grade, :surah_name, :page_from, :page_to, :juz, :notes ])
  end
end
