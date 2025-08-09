class CreateStudents < ActiveRecord::Migration[8.0]
  def change
    create_table :students do |t|
      t.string :name, null: false
      t.string :current_hifz_in_juz, null: false
      t.string :current_hifz_in_pages, null: false
      t.string :class_level, null: false
      t.string :phone
      t.string :email
      t.string :status, null: false
      t.string :gender, null: false
      t.string :birth_place, null: false
      t.date :birth_date, null: false
      t.text :address
      t.string :father_name, null: false
      t.string :mother_name, null: false
      t.string :father_phone
      t.string :mother_phone
      t.date :date_joined, null: false

      t.timestamps
    end
  end
end
