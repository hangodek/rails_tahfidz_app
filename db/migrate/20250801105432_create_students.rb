class CreateStudents < ActiveRecord::Migration[8.0]
  def change
    create_table :students do |t|
      t.string :name
      t.string :address
      t.date :birth_date
      t.string :mother_name
      t.string :father_name
      t.date :date_joined
      t.integer :hifz_in_juz
      t.integer :hifz_in_page

      t.timestamps
    end
  end
end
