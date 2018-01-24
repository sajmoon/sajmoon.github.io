puts "===== Ruby Class Extensions ===== \n"

def placeholder_image_url
  "http://via.placeholder.com/100x100"
end

puts "A placeholder url: #{placeholder_image_url}"

module Placeholders
  def Placeholders.image_url size = "200"
    "http://via.placeholder.com/#{size}x#{size}"
  end
end

puts "Placeholder module: #{Placeholders.image_url}"
puts "Placeholder module: #{Placeholders::image_url}"

## Subclass

class VowelString < String
  def vowels
    chars.select{ |char| "aoueiy".include? char }.count
  end
end

sample_vowel_string = VowelString.new "My super cool string"
puts "My sample string has #{sample_vowel_string.vowels} vowels"

## Mixins

module Vowels
  ALL = "aoueiy"

  def vowels
    chars.select{ |char| ALL.include? char }
  end

  def count_vowels
    vowels.count
  end
end

puts "All vowels: #{Vowels::ALL}"

class String
  include Vowels
end

sample_string = "My super cool string"

puts "In '#{sample_string}' we have #{sample_string.count_vowels} number of vowels. They are #{sample_string.vowels}"

begin
  19.random # Undefined method 'random' for 19:Integer
rescue NoMethodError
  puts "19.random is not defined"
end

puts "extending Integer"
class Integer
  def random
    Random.rand(self)
  end
end

puts "19.random => #{19.random}"

begin
  Integer.random 3
rescue NoMethodError
  puts "Integer.random is not defined"
end

class Integer
  def self.random number
    Random.rand number
  end
end

puts "Integer.random 3 => #{Integer.random 3}"

puts "\n"
