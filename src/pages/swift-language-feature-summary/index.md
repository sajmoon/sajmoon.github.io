---
title: Summary of Swift language features
date: "2017-01-13T20:52:03.284Z"
draft: true
---

As I started to learn Swift i wrote a list of things that where notworthy about the language. This is the result: A short summary of interesting Swift language features.

## Features

Listed in no particular order.

### Swith value bining

In a switch statement you can sort of pattern match on tuples.

```swift
let anotherPoint = (2, 0)
switch anotherPoint {
case (let x, 0):
    print("on the x-axis with an x value of \(x)")
case (0, let y):
    print("on the y-axis with a y value of \(y)")
case let (x, y):
    print("somewhere else at (\(x), \(y))")
}
// Prints "on the x-axis with an x value of 2"
```

The complete example can be read [in the Swift documentation.](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ControlFlow.html#//apple_ref/doc/uid/TP40014097-CH9-ID120)

### var title: String!

### Guard

Assignments are kept in scope

### Named function arguments

Not strange in general but we are allowed to have two names for a paramter, an internal and an external. Pretty cool hand handy.

```swift
func methodName(external internal : String) {
  print(internal)
}
```

called as

```swift
methodName(external: "value")
```

Use unnamed parameters.

```swift
func methodName(_ internal: String) {
  print(internal)
}

methodName("string")
```

### Xcode was slow

The app in simulator was really slow. I thought it was a bug in XCode but it turned out that it was my fault. I had enabled slow animations. Check the debug menu where you can disable it.

### class func vs static func

### Interpolation Optional strings

```swift
self.nameLabel.text = feedItem.user.name // No need to unwrapp name.

// if we use user.name in a string interpolation, we need to unwrap it.
if let description = feedItem.description {
    self.descriptionLabel.text = "\(feedItem.user.name!) \(description)"
}
```
