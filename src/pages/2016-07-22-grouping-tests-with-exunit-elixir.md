---
title: Grouping tests with ExUnit (Elixir)
slug: grouping-tests-with-exunit-elixir
date: 2016-07-22T06:26:20.684Z
---

In an old post I talked about `tags` in elixir and how we could use them to fake grouping of tests. See [Elixir testing - Tag tests in ExUnit](http://blog.simonstrom.xyz/elixir-testing-tag-tests-in-exunit/).

That is no longer needed.

Since 1.3 Elixir and ExUnit will let developer group tests. The syntax will be familiar to people used with `rspec`. The classic `describe` keyword.

Here is an example (shamelessly copied from the [Elixir 1.3 Change log](http://elixir-lang.org/blog/2016/06/21/elixir-v1-3-0-released/#named-setups-and-describes))

```
defmodule StringTest do
  use ExUnit.Case, async: true

  describe "String.capitalize/2" do
    test "uppercases the first grapheme" do
      assert "T" <> _ = String.capitalize("test")
    end

    test "lowercases the remaining graphemes" do
      assert "Test" = String.capitalize("TEST")
    end
  end
end
```

__Describes are not nestable!__

See the [Elixir 1.3 Change log](http://elixir-lang.org/blog/2016/06/21/elixir-v1-3-0-released/) for a complete reference of what has changed recently.
