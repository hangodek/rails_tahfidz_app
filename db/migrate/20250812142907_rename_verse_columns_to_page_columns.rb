class RenameVerseColumnsToPageColumns < ActiveRecord::Migration[8.0]
  def change
    rename_column :activities, :verse_from, :page_from
    rename_column :activities, :verse_to, :page_to
  end
end
