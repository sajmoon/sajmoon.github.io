---
title: Summary of Swift language features
date: "2017-01-07T20:52:03.284Z"
draft: true
---

# Summary of Swift language features

### Swith value bining

In a switch statement you can sort of pattern match on tuples.

```
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

The complete example can be read [here.]https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ControlFlow.html#//apple_ref/doc/uid/TP40014097-CH9-ID120)

### var title: String!

### Guard

Assignments are kept in scope

### Named function arguments

Not strange in general but we are allowed to have two names for a paramter, an internal and an external.

```
func methodName(external internal : String) {
 use internal
}
```

called as `methodName(external: "value")`

## Xcode was slow

I had enabled slow animations. Check the debug menu.

## Extra stuff

class func vs static func
