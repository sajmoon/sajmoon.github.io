webpackJsonp([59577248741097],{522:function(e,n){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/2015-09-16-start-from-scratch-with-reactredux.md absPath of file >>> MarkdownRemark",html:'<p>Using a javascript front end framework is very nice. You might start with tools like Yeoman for scaffolding out everything you need.</p>\n<p>However, you really shouldn’t. You get tons of feature you don’t need and the setup can be complicated or impossible for you to debug or tweak.</p>\n<p>So let us setup the environment from scratch using nothing but npm.</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-bash"><code>$ mkdir app-name\n$ cd app-name\n$ npm init\n$ mkdir dist\n$ touch dist/index.html\n$ mkdir src\n$ touch src/index.jsx</code></pre>\n      </div>\n<p>index.html:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-html"><code><html>\n<body>\n  <div id="app"></div>\n  <script src="bundle.js"></script>\n</body>\n</html></code></pre>\n      </div>\n<p>index.jsx:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-javascript"><code>console.log(\'Hello world\');</code></pre>\n      </div>\n<p>With this simple console.log statement we can ensure that it has started correctly.</p>\n<h2>Building and starting a server.</h2>\n<p><code>npm install --save-dev webpack webpack-dev-server</code></p>\n<p><code>npm install --save-dev babel-core babel-loader</code> For es6 and jsx support.</p>\n<p>Add them to webpack.config.js:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-javascript"><code>  module: {\n    loaders: [{\n      test: /\\.jsx?$/,\n      exclude: /node_modules/,\n      loader: \'babel\'\n    }]\n  },\n  resolve: {\n    extensions: [\'\', \'.js\', \'.jsx\']\n  },</code></pre>\n      </div>\n<p>We can now build with webpack: <code>./node_modules/webpack/bin/webpack.js</code>\nServe a development server: <code>./node_modules/webpack-dev-server/bin/webpack-dev-server.js</code></p>\n<p>We can make handy shortcuts for npm:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-javascript"><code>"scripts": {\n  "build": "./node_modules/webpack/bin/webpack.js",\n  "start": "./node_modules/webpack-dev-server/bin/webpack-dev-server.js"\n}</code></pre>\n      </div>\n<p>We can use it like this</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-bash"><code>$ npm run build\n$ npm run start</code></pre>\n      </div>\n<h3>React:</h3>\n<p><code>npm install --save react</code> and\n<code>npm install --save-dev react-hot-loader</code></p>\n<p>Modify webpack.config.js</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-javascript"><code>var path = require("path");\nvar webpack = require(\'webpack\');\n\nmodule.exports = {\n entry: [\n   \'webpack-dev-server/client?http://localhost:8080\',\n   \'webpack/hot/only-dev-server\',\n   \'./src/index.jsx\'\n ],\n module: {\n   loaders: [{\n     test: /\\.jsx?$/,\n     exclude: /node-modules/,\n     include: path.join(__dirname, "src"),\n     loader: \'react-hot!babel\'\n   }]\n },\n resolve: {\n   extensions: [\'\', \'.js\', \'.jsx\']\n },\n output: {\n   path: __dirname + \'/dist\',\n   publicPath: \'/\',\n   filename: \'bundle.js\'\n },\n devServer: {\n  contentBase: \'./dist\',\n   hot: true\n },\n plugins: [\n   new webpack.HotModuleReplacementPlugin()\n ]\n};</code></pre>\n      </div>\n<p>If you run <code>npm run start</code> and check console output you should see something like this: </p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>Hello world (FROM THE CONSOLE.LOG)\n[WDS] Hot Module Replacement enabled.</code></pre>\n      </div>\n<h2>Testing</h2>\n<p>Now that we have a working dev server. Lets add support for testing.</p>\n<p><code>npm install --save-dev mocha chai</code></p>\n<p><code>npm install --save-dev jsdom@3</code></p>\n<p><code>npm install --save-dev chai-immutable</code></p>\n<p><code>npm install --save immutable</code></p>\n<p>Open <code>test/test_helper.js</code> and add the following:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-javascript"><code>import jsdom from \'jsdom\';\nimport chai from \'chai\';\nimport chaiImmutable from \'chai-immutable\';\n\nconst doc = jsdom.jsdom(\'<!doctype html><html><body></body></html>\');\nconst win = doc.defaultView;\n\nglobal.document = doc;\nglobal.window = win;\n\nObject.keys(window).forEach((key) => {\n  if (!(key in global)) {\n    global[key] = window[key];\n  }\n});\n\nchai.use(chaiImmutable);</code></pre>\n      </div>\n<p>add these to scripts in package.json:</p>\n<div class="gatsby-highlight">\n      <pre class="language-language-bash"><code>   "test": "mocha --compilers js:babel-core/register --require ./test/test_helper.j    s \'test/**/*.@(js|jsx)\'",\n   "test:watch": "npm run test -- --watch"</code></pre>\n      </div>\n<p>Running tests is simple:</p>\n<p><code>$ npm test</code> or to invoke the watch command <code>npm test:watch</code></p>\n<h3>Conclusion.</h3>\n<p>This is just a note for me to remember some steps during setup/bootstraping a project.</p>\n<p>You really don’t have to use stuff like Yeoman and boilerplate code to get up and running, and if you do use scaffolding tools, you often get more code then you need that does stuff you really don’t understand. Keep it simple, and evolve your stack as you need.</p>',frontmatter:{title:"Start from scratch with React/Redux",date:"September 16, 2015"}}},pathContext:{slug:"/2015-09-16-start-from-scratch-with-reactredux/"}}}});
//# sourceMappingURL=path---2015-2015-09-16-start-from-scratch-with-reactredux-1d2ef1f379890126a207.js.map