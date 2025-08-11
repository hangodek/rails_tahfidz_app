class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.references :student, null: false, foreign_key: true

      t.timestamps
    end
  end
end
