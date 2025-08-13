class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.references :student, null: false, foreign_key: true

      t.integer :activity_type, null: false, default: 0
      t.integer :activity_grade, null: false, default: 0

      t.string :surah_from, null: false
      t.string :surah_to, null: false
      t.integer :verse_from, null: false
      t.integer :verse_to, null: false
      t.integer :juz

      t.text :notes

      t.timestamps
    end
  end
end
