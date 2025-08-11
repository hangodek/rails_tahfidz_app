class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.references :student, null: false, foreign_key: true

      # Activity type enum (memorization, revision, evaluation)
      t.integer :activity_type, null: false, default: 0

      # Quran details
      t.string :surah_name, null: false
      t.integer :verse_from, null: false
      t.integer :verse_to, null: false
      t.integer :juz

      # Activity metadata
      t.text :notes

      # Evaluation/Assessment
      t.integer :evaluation, null: false, default: 0 # enum: excellent, good, fair, needs_improvement

      t.timestamps
    end
  end
end
