---
title: Goolge map directive - Angular
slug: goolge-map-directive-angular
date: 2015-05-08T12:46:56.641Z
---

A simple way to add a Map to your webapplication. This example uses a directive in which we pass two paramters: city and address.

```angular
directives.directive("simpleMap", function() {
  return  {
    restrict: 'AE',
    replace: true,
    scope: {
      city: '@',
      address: '@'
    },
    template: "< iframe id='clientLocationMap' src='' height='250' width='100%' frameborder='0' rullning='no' marginheight='0' marginwidth='0'></ iframe>",
    link: function(scope, element, attrs) {

      attrs.$set('src',"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=" + scope.city + "," + scope.address);
      scope.$watch('city', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        attrs.$set('src',"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=" + scope.city + "," + scope.address);
      });

      scope.$watch('address', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        attrs.$set('src',"https://www.google.com/maps/embed/v1/place?key=AIzaSyD2HZFYGa0xssWVdp6KokHnM3GvKHXEQ7o&zoom=15&q=" + scope.city + "," + scope.address);
      });
    }
  };
});
```

To include it on your page you use our new tag, but remember to pass along the search terms.

```
< simple-map city="{{client.city}}" address="{{client.address}}">< /simple-map>
```
