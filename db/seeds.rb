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

puts "Creating new student records..."

# --- Data for random selection ---
CLASSES = [ "Class A", "Class B", "Class C" ]
STATUSES = [ "active", "inactive", "graduated" ]
GENDERS = [ "male", "female" ]

MALE_FIRST_NAMES = [ "Adam", "Yusuf", "Ibrahim", "Musa", "Dawud", "Sulaiman", "Zayd", "Omar", "Ali", "Hassan" ]
FEMALE_FIRST_NAMES = [ "Maryam", "Fatima", "Aisha", "Khadija", "Zainab", "Safiya", "Hafsa", "Ruqayyah", "Asma", "Hajar" ]
LAST_NAMES = [ "Khan", "Ahmed", "Ali", "Hussain", "Malik", "Abdullah", "Rahman", "Siddiqui", "Farooq", "Iqbal" ]
CITIES = [ "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Depok", "Tangerang", "Bekasi" ]

# --- Generate 20 dummy student records ---
20.times do |i|
  gender = GENDERS.sample

  if gender == 'male'
    first_name = MALE_FIRST_NAMES.sample
    mother_first_name = FEMALE_FIRST_NAMES.sample
    father_first_name = MALE_FIRST_NAMES.sample
  else
    first_name = FEMALE_FIRST_NAMES.sample
    mother_first_name = FEMALE_FIRST_NAMES.sample
    father_first_name = MALE_FIRST_NAMES.sample
  end

  last_name = LAST_NAMES.sample
  student_name = "#{first_name} #{last_name}"
  father_name = "#{father_first_name} #{last_name}"
  mother_name = "#{mother_first_name} #{LAST_NAMES.sample}"

  # Assuming your model is named Student. If not, change Student to your model's name.
  Student.create!(
    name: student_name,
    current_hifz_in_juz: rand(1..30).to_s,
    current_hifz_in_pages: rand(1..20).to_s,
    class_level: CLASSES.sample,
    phone: "081#{rand(100..999)}#{rand(1000..9999)}",
    email: "#{first_name.downcase}.#{last_name.downcase}#{i}@example.com",
    status: STATUSES.sample,
    gender: gender,
    birth_place: CITIES.sample,
    birth_date: (Date.today - rand(10..25).years - rand(0..365).days).to_s,
    address: "#{rand(10..100)} Jalan Merdeka, #{CITIES.sample}",
    father_name: father_name,
    mother_name: mother_name,
    father_phone: "085#{rand(100..999)}#{rand(1000..9999)}",
    mother_phone: "087#{rand(100..999)}#{rand(1000..9999)}",
    date_joined: (Date.today - rand(0..3).years - rand(0..365).days).to_s
    # avatar is skipped as requested
  )
end

puts "Finished!"
puts "Created #{Student.count} student records."
