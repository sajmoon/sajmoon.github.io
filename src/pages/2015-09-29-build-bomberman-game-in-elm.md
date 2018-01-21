---
title: Build Bomberman Game in Elm
slug: build-bomberman-game-in-elm
date: 2015-09-29T19:20:43.784Z
tags: Elm, Frontend
---

To learn something I often need an entire project. It's not very nice to just read docs, and APIs etc. We all need to code. So this is me doing just that. 

I will try to build something similar to Bomberman.

### Render a simple map

We should have something to call a map. A list of lists of Booleans should be enough to start us off.
```
generateMap = [
    [ True, False, True, True, True, False],
    [True, False, False, False, True, True],
    [True, True, False, False, True, True],
    [True, False, True, True, True, True],
    [True, False, True, True, True, True]
  ]
```

To render those lists we can do the following.
```
renderMap : List ( List Bool) -> Element
renderMap map =
  map
    |> List.map renderRow
    |> List.map (flow right)
    |> flow down
    |> container (cellSize * columns) (cellSize * rows) topLeft


renderRow : List Bool -> List Element
renderRow row = List.map renderCell row

renderCell : Bool -> Element
renderCell on =
  spacer cellSize cellSize
  |> color (if on then (rgb 0 0 0) else (rgb 255 255 255))
```

It will render each cell in either black or white depending on the boolean value.

And finally a starting point: 
```
cellSize = 10
(columns, rows) = (35, 35)

main : Element
main =
  renderMap generateMap
```

Start a server `elm-reactor` and check out `http://0.0.0.0:8000/`

I found an example of the Game of Life in elm. You can read it [here.](http://sonnym.github.io/2014/05/05/writing-game-of-life-in-elm/)
