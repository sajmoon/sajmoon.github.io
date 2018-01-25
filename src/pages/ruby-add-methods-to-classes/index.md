---
title: Add methods to a Ruby class
date: "2018-01-16"
---

We can always extend classes in Ruby. Both predefined and classes we create ourself. We say that classes are _always open_.

If you want to some concrete examples look at this [gist with some code.](https://gist.github.com/sajmoon/f8b766a7a7da36f7e9a9899e1b8de9b9)

Before you extend a built-in class be sure that it should be there. A string should not have methods to generate urls to a placeholder image, even if it could. It does not belong in the String class.

## Maybe don't?

Most of the time you should not add methods to classes. The placeholder image url example above should not be on the String class. It might fit on some other class, maybe your `ImageUrl` class, or not at all.

```ruby
def placeholder_image_url
  "http://via.placeholder.com/100x100"
end
```
Or in Module if you want it name spaced.

```ruby
module Placeholders
  def Placeholders.image_url size = "200"
    "http://via.placeholder.com/#{size}x#{size}"
  end
end
```

## Create a subclass

An option could be to create a subclass of a known class. For example we could create a class that can count vowels.

```ruby
class VowelString < String
  def vowels
    chars.select{ |char| "aoueiy".include? char }.count
  end
end
```

This is just classic inheritance.

We can use it like any other class.

```
sample_vowel_string = VowelString.new "My super cool string"
puts "My sample string has #{sample_vowel_string.vowels} vowels"
```

In Ruby we have single inheritance, so we can not subclass from both `String` and `Integer`.

## Add an instance method to a built-in class.

Add a method to Integers that returns a random value between 0 and the integer value.

```ruby
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
```

`self` refers to the instance of the object itself. In the case of our Integer self is 19.

## Add a class method

To add a class method is also simple.

```ruby
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
```

We add methods to self.

## Mixins

We can add behaviour to classes with mixins. We `include` a module in the class.

```ruby
module Vowels
  ALL = "aoueiy"

  def vowels
    self.chars.select{ |char| ALL.include? char }
  end

  def count_vowels
    vowels.count
  end
end
```

Now we can access constants just like normal modules `puts "All vowels: #{Vowels::ALL}"`.

We can then make String vowel aware.

```ruby
class String
  include Vowels
end
```

and use it like any method on `String`.

```
"Mu super cool string".count_vowels # 6
```

We can include many modules in our class, and thus achieving a sort of multi inheritance.

## Extend active record

We use Kaminari to paginate our application. We need to render the meta data in the json response, and to do that we extend ActiveRecord to provide this functionalliy.

Extend ActiveRecord::Relation with a `pagination_info` method.

In `lib/active_record_relation_extension.rb`:
```ruby
module ActiveRecordRelationExtension
  def pagination_info
    if respond_to? :total_count
      {
        total_count: total_count,
        current_page: current_page,
        next_page: next_page,
        prev_page: prev_page,
      }
    else
      nil
    end
  end
 end
 ```

 Then we also need to configure it. We push it to the inheritance stack of Relation.

`config/initializers/active_record_relation_pagination.rb`
```ruby
ActiveRecord::Relation.send(:include, ActiveRecordRelationExtension)
```
