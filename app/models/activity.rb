class Activity < ApplicationRecord
  has_one_attached :audio

  belongs_to :student

  enum :activity_type, {
    memorization: 0,
    revision: 1
  }

  enum :activity_grade, {
    excellent: 0,
    good: 1,
    fair: 2,
    needs_improvement: 3
  }
end
