---
title: React with Bourbon
slug: react-with-bourbon-2
date: 2015-08-28T21:32:25.023Z
---

## What will we do?
We will create a simple react/flux application using yeoman. Then we will install Bourbon and Neat and configure gulp to include those in our build. Then all that is left is to test that it works.

## Yeoman
Yeoman is a generator for getting started quickly. You can read about it at [http://yeoman.io/](http://yeoman.io/).

We have to install a react/flux generator; we will use [this.](https://github.com/banderson/generator-flux-react)

```
$ npm install -g yo
$ npm install -g generator-flux
```

This will install both globally.

### Generate app
Create a folder where you will store your app. In that folder run the `yo` command.

```
$ yo flux
```
You will be asked some questions. Name your app, and give it a description. When you are asked what UI framework you want select `UI Frameworks: None (Vanilla JS/HTML/CSS)`. Then yeoman will not install any extra libraries.

Start server in dev mode: `npm run dev`
The developer mode recompiles and reloads the browser when changes are detected.
When you install new dependencies you might have to restart it manually.

### Bourbon/Neat
```
$ npm install node-bourbon --save
$ npm install node-neat --save
```
Make sure you use `--save` to add the dependencies to your `package.json`.

Now you can mport bourbon and neat in .scss file

in `src/styles/main.scss` add:
```
@import "bourbon";
@import "neat";
```

This will crash your devserver since none of those could be found. To fix this we have to configure the build tool (`gulp`) so it knows the paths to both bourbon and neat.

### Gulp
Open gulp/config.js, and require neat.

```
var neat = require('node-neat').includePaths;
```

Also in gulp/config.js, modify the sass block to include a setting:
ettings:
```
{
  indentedSyntax: false, // Enable .sass syntax?
  includePaths: neat,
  imagePath: '/images' // Used by the image-url helper
}
```
only the `includePaths: neat,` is new.

And we are up an running. We can test this by taking the first example from the bourbon page.

### Test it!

Update your stylesheet, `src/styles/main.scss`, with something that would only work if you had bourbon configured correctly.

I got this example from the bourbon page [http://bourbon.io/](http://bourbon.io/).

```
body {
  @include linear-gradient(to top, red, orange);
}
```

Check out your page now, and you'll see some strange gradients. So now make it pretty.

Setup complete.
