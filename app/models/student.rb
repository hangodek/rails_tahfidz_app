class Student < ApplicationRecord
  has_one_attached :avatar

  has_many :activities, dependent: :destroy

  scope :active, -> { where(status: "active") }
end
