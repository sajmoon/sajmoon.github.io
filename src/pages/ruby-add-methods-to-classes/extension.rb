puts "===== Ruby Class Extensions ===== \n"

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
