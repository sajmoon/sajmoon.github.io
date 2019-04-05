---
title: "Automated testing of universal links"
date: 2018-03-15
tags: iOS, Testing
draft: true
---

To add some smoke tests we can give a list of universal links we want to make sure are opened in our app and just ensure they actually launch the application. Between each test we exit the app, either by `XCUIApplication().terminate()` or by simulating a tap on the Home button.

```swift
  func testOpenUniversalLinks() {
      XCUIDevice().press(XCUIDevice.Button.home)
      
      let validLinks = [
          "https://supercoachapp.com/practices/1/comments",
          "https://supercoachapp.com/practices/1",
          "https://supercoachapp.com/teams/1/invite",
      ]
  
      validLinks.forEach( { link in
          let url = URL(string: link)
          UIApplication.shared.open(url!, options: [:], completionHandler: nil)

          sleep(1)
          XCTAssert(XCUIApplication().label == "Supercoach")

          XCUIDevice().press(XCUIDevice.Button.home)
          sleep(1)
      })
  }
```

It seems that this method cannot be used to open custom schema urls such as `exampleapp://settings`. You can trigger those via `xcrun` command from the terminal.

https://blog.branch.io/ui-testing-universal-links-in-xcode-9/
