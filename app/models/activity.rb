class Activity < ApplicationRecord
  belongs_to :student

  enum activity_type: {
    memorization: 0,
    revision: 1,
    evaluation: 2
  }
end
