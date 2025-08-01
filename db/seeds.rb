# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Destryoing existing records..."

User.destroy_all
Student.destroy_all

puts "Seeding initial data..."

User.create!(username: "admin", password: "admin", name: "Administrator", role: "admin") unless User.exists?(username: "admin")

20.times do
  student = Student.create!(
    name: Faker::Name.first_name,
    address: Faker::Address.full_address,
    birth_date: Faker::Date.between(from: '2005-01-01', to: '2015-12-31'),
    mother_name: Faker::Name.female_first_name,
    father_name: Faker::Name.male_first_name,
    date_joined: Faker::Date.between(from: '2020-01-01', to: Date.today),
    hifz_in_juz: Faker::Number.between(from: 1, to: 30),
    hifz_in_page: Faker::Number.between(from: 1, to: 20)
  )
  puts "Created student: #{student.name}"
end
