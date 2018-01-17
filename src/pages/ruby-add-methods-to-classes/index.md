---
title: Add methods to a Ruby class
date: "2018-01-16"
---

We can always extend classes in Ruby. Both predefined and classes we create ourselfs. We say that classes are _always open_.

If you extend a built-in class be sure that it should be there. A string for example probably should not have methods to generate urls to a placeholder image, even if it could. It does not belong in the String class.

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
