class AddCurrentHifzInSurahToStudents < ActiveRecord::Migration[8.0]
  def change
    add_column :students, :current_hifz_in_surah, :string, null: false, default: "Al-Fatihah"
  end
end
