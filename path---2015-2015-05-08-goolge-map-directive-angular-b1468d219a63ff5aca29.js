webpackJsonp([5923604354466],{517:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Tinkering with Code.",author:"Simon Ström"}},markdownRemark:{id:"/Users/simon/Code/sajmoon.github.io/src/pages/2015-05-08-goolge-map-directive-angular.md absPath of file >>> MarkdownRemark",html:"<p>A simple way to add a Map to your webapplication. This example uses a directive in which we pass two paramters: city and address.</p>\n<div class=\"gatsby-highlight\">\n      <pre class=\"language-angular\"><code>directives.directive(\"simpleMap\", function() {\n  return  {\n    restrict: 'AE',\n    replace: true,\n    scope: {\n      city: '@',\n      address: '@'\n    },\n    template: \"< iframe id='clientLocationMap' src='' height='250' width='100%' frameborder='0' rullning='no' marginheight='0' marginwidth='0'></ iframe>\",\n    link: function(scope, element, attrs) {\n\n      attrs.$set('src',\"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=\" + scope.city + \",\" + scope.address);\n      scope.$watch('city', function(newValue, oldValue) {\n        if (newValue == oldValue) {\n          return;\n        }\n\n        attrs.$set('src',\"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=\" + scope.city + \",\" + scope.address);\n      });\n\n      scope.$watch('address', function(newValue, oldValue) {\n        if (newValue == oldValue) {\n          return;\n        }\n\n        attrs.$set('src',\"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=\" + scope.city + \",\" + scope.address);\n      });\n    }\n  };\n});</code></pre>\n      </div>\n<p>To include it on your page you use our new tag, but remember to pass along the search terms.</p>\n<div class=\"gatsby-highlight\">\n      <pre class=\"language-none\"><code>< simple-map city=\"{{client.city}}\" address=\"{{client.address}}\">< /simple-map></code></pre>\n      </div>",frontmatter:{title:"Goolge map directive - Angular",date:"May 08, 2015"}}},pathContext:{slug:"/2015-05-08-goolge-map-directive-angular/"}}}});
//# sourceMappingURL=path---2015-2015-05-08-goolge-map-directive-angular-b1468d219a63ff5aca29.js.map