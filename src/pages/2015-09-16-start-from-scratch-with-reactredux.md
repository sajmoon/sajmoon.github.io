---
title: Start from scratch with React/Redux
slug: start-from-scratch-with-reactredux
date: 2015-09-16T12:31:19.718Z
tags: Javascript, React, Frontend
---

Using a javascript front end framework is very nice. You might start with tools like Yeoman for scaffolding out everything you need.

However, you really shouldn't. You get tons of feature you don't need and the setup can be complicated or impossible for you to debug or tweak.


So let us setup the environment from scratch using nothing but npm.

```language-bash
$ mkdir app-name
$ cd app-name
$ npm init
$ mkdir dist
$ touch dist/index.html
$ mkdir src
$ touch src/index.jsx
```

index.html:
```language-html
<html>
<body>
  <div id="app"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

index.jsx:
```language-javascript
console.log('Hello world');
```
With this simple console.log statement we can ensure that it has started correctly.

## Building and starting a server.

`npm install --save-dev webpack webpack-dev-server`

`npm install --save-dev babel-core babel-loader` For es6 and jsx support.

Add them to webpack.config.js:
```language-javascript
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
```

We can now build with webpack: `./node_modules/webpack/bin/webpack.js`
Serve a development server: `./node_modules/webpack-dev-server/bin/webpack-dev-server.js`

We can make handy shortcuts for npm:
```language-javascript
"scripts": {
  "build": "./node_modules/webpack/bin/webpack.js",
  "start": "./node_modules/webpack-dev-server/bin/webpack-dev-server.js"
}
```

We can use it like this
```language-bash
$ npm run build
$ npm run start
```

### React: 

`npm install --save react` and 
`npm install --save-dev react-hot-loader`

Modify webpack.config.js

```language-javascript
var path = require("path");
var webpack = require('webpack');

module.exports = {
 entry: [
   'webpack-dev-server/client?http://localhost:8080',
   'webpack/hot/only-dev-server',
   './src/index.jsx'
 ],
 module: {
   loaders: [{
     test: /\.jsx?$/,
     exclude: /node-modules/,
     include: path.join(__dirname, "src"),
     loader: 'react-hot!babel'
   }]
 },
 resolve: {
   extensions: ['', '.js', '.jsx']
 },
 output: {
   path: __dirname + '/dist',
   publicPath: '/',
   filename: 'bundle.js'
 },
 devServer: {
  contentBase: './dist',
   hot: true
 },
 plugins: [
   new webpack.HotModuleReplacementPlugin()
 ]
};
```
If you run `npm run start` and check console output you should see something like this: 
```
Hello world (FROM THE CONSOLE.LOG)
[WDS] Hot Module Replacement enabled.
```



## Testing

Now that we have a working dev server. Lets add support for testing.

`npm install --save-dev mocha chai`

`npm install --save-dev jsdom@3`

`npm install --save-dev chai-immutable`

`npm install --save immutable`

Open `test/test_helper.js` and add the following:

```language-javascript
import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);
```

add these to scripts in package.json:
```language-bash
   "test": "mocha --compilers js:babel-core/register --require ./test/test_helper.j    s 'test/**/*.@(js|jsx)'",
   "test:watch": "npm run test -- --watch"
```

Running tests is simple:

`$ npm test` or to invoke the watch command `npm test:watch`

### Conclusion. 
This is just a note for me to remember some steps during setup/bootstraping a project.

You really don't have to use stuff like Yeoman and boilerplate code to get up and running, and if you do use scaffolding tools, you often get more code then you need that does stuff you really don't understand. Keep it simple, and evolve your stack as you need.
