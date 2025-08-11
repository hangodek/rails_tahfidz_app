class Activity < ApplicationRecord
  has_one_attached :recording

  belongs_to :student

  enum activity_type: {
    memorization: 0,
    revision: 1,
    evaluation: 2
  }

  enum evaluation: {
    excellent: 0,
    good: 1,
    fair: 2,
    needs_improvement: 3
  }
end
