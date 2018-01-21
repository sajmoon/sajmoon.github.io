---
title: Tag tests that uses network - ExUnit
slug: tag-tests-that-uses-network-exunit-2
date: 2016-10-22T11:51:43.313Z
---

Tag tests as tests that require network, and only run them when needed.

We do this to speed up that test suite. Ideally you should not rely on network in your tests but sometimes it is necessary.

### How?
Add a tag to the test.

```
@tag :network
test "expensive test" do
end
```

configure ExUnit to exclude these tests in `test/test_helper.ex`
```
ExUnit.configure exclude: [network: true]
ExUnit.start
```

run the test and you will have one test skipped.

```
$ mix test
Excluding tags: [network: true]

.......................................................

Finished in 0.3 seconds
56 tests, 0 failures, 1 skipped
```

When you want to run your network tests use the --include argument to mix test
```

mix test --include network
Including tags: [:network]
Excluding tags: [network: true]

........................................................

Finished in 1.4 seconds
56 tests, 0 failures
```

### Run all by default

if you want to run all your tests by default and only exclude network tests when you explicitly request it you dont have to configure ExUnit inte test_helper.ex

instead use the --exclude argument

```
mix test --exclude network
```
