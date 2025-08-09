# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_09_083517) do
  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "students", force: :cascade do |t|
    t.string "name", null: false
    t.string "current_hifz_in_juz", null: false
    t.string "current_hifz_in_pages", null: false
    t.string "avatar"
    t.string "class_level", null: false
    t.string "phone"
    t.string "email"
    t.string "status", null: false
    t.string "gender", null: false
    t.string "birth_place", null: false
    t.date "birth_date", null: false
    t.text "address"
    t.string "father_name", null: false
    t.string "mother_name", null: false
    t.string "father_phone"
    t.string "mother_phone"
    t.date "date_joined", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "role"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "sessions", "users"
end
