---
title: Start from zero with Elm
slug: start-from-zero-with-elm
date: 2015-09-29T16:56:07.760Z
tags: Elm, Front
---

Elm is a functional front end language that compiles down to javascript. It looks neat so let's start from scratch by building something simple for the web.

### Classic Hello World

We should start with a classic hello world, 'cause why not?

```
$ mkdir project-name
$ touch Main.elm
$ vi Main.elm
```

#### Code
Main.elm:
```
import Html exposing (text)
main = text "Hello World"
```

#### Testing it out in the browser.
```
$ elm-reactor
Elm Reactor 0.3.2 (Elm Platform 0.15.1)
Listening on http://0.0.0.0:8000/
```

Look in the browser and you will see we have an error.

```
Downloading elm-lang/core
Packages configured successfully!
Error when searching for modules imported by module 'Main':
    Could not find module 'Html'

Potential problems could be:
  * Misspelled the module name
  * Need to add a source directory or new dependency to elm-package.json
```
Woops! We should install the `html`package.

```
elm-package install evancz/elm-html
```

You will have to press (y) a couple of times.

Restart the server and we have a working HTML Hello World.

#### What do we have now?

If we look in our project directory where we only created a `Main.elm` file, we now have a lot more going on.

```
$ ls
Main.elm         elm-package.json elm-stuff        elm.js
```

 - `elm-package.json` is just like any other package manager file (think *package.json* for _npm_) with dependencies etc.
 - `elm-stuff` is the directory containing all dependencies. 
 - `elm.js` is the elm library code.

We got all those from running `elm-reactor`. It downloaded some dependencies for us and created the elm-package.json file for us.

#### Compiling
In this simple example we are using the development server part of elm, the `elm-reactor`. That is all good, but some times you would like your page to be an actual .html that is ready to be served.

`elm make Main.elm --output index.html`

This will compile our code, and provide us with an index.html file containing everything that is needed.

## Let do it again without html.
The html module was not really needed. We could use other methods of displaying graphics.

```
import Graphics.Element exposing (..)
import Text
  
main : Element
main =
  leftAligned(Text.fromString "Hi everybody!")
```

Excluding the imports, the first part is `main : Element` which just defines what type main should return. Main should always return an Element.

We cannot just return Text.fromString "text" to main. Text is not an element. So we wrapp it in `leftAligned` which returns an `Element`. All good! In the browser we get the expected output.

# Conclusions
Well that was simple. Actually it was way to simple. But it's a start.
