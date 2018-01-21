---
title: "Angular: Caching of remote data in services."
slug: angular-caching-of-data-in-services
date: 2015-11-08T00:24:04.081Z
tags: Angular, Coffescript, Frontend
---

Often data displayed to the user doesn't change that often. And when that is the case caching is vital. Not only so your site doesn't make lots of unnecessary requests, putting the load on your servers, but mostly for user experience.

Switching between two states in an Angular application built with [ui-router](https://github.com/angular-ui/ui-router) might do a new request each time. With a slow connection that will be a problem. But even with a faster connection the content of the site will be blank until the fetch is complete creating a "flash" when the content arrives.

To test how slower internet connections work on your application you can throttle the page in Chrome. In the `developer console` under the `Network` tab you can set a limit.

All code will be in `CoffeeScript`.

## How we started out.
In this case I had a factory for the $resource. Several actions were defined. In this article I will only talk about one to keep it brief and on point.

The factory looked something like this:

```language-javascript
App.factory "News", ($resource) ->
  $resource "/api/v1/news/:action",
    {
      action: "@action"
    },
    {
      other_action: {
        method: "GET",
        params: { action: "some_other_action" }
      }
    }

```

We used that factory in the controller as follows:

```language-javascript
App.controller "NewsController", class NewsController
  constructor: (News) ->
    News.get (data) =>
      // data contained the request.
      @functionToSetAllVariablesNeedByViews(data)

  functionToSetAllVariablesNeedByViews: (data) ->
    // Ignored for brevity
```

Simple, clean and to the point. Of course it could be improved etc. We will get to that. The problem was when the user navigated to the state connected to this controller, it always did a request to the backend. That was by design, we couldn't cache it. The data needs to be pristine. The browser on the other hand did the request, got a 304: Not modified and displayed the data.

We got this middle state when no data was displayed.

## Caching in a service.
To fix this we could start by setting the `cache: true`option of $resource. And have to deal with cache invalidations etc. A requirement is that the data should always be the latest, so it might be or become a headache.

Instead, creating a Service to wrap the factory with two methods. `getData` that returns the cached value, and `request` that handles http requests.

Here it goes:
```language-javascript
App.service "NewsService", class NewsService
  constructor: (News, $q) ->
    @News = News // This is the original factory.
    @data = {}
    @q = $q

  getData: =>
    deferred = @q.defer()
    deferred.resolve(@data)

    return deferred.promise

  request: =>
    @News.get().$promise
    .then (data) =>
      @data = data

```
Simple. We also change what to return. We always return promises. Because of the nature of promises, we can chain them, and guarantee order of execution. That is what the controller has to deal with.

We are using the fact that angular services are singletons. Any controller where we request the service to be injected into will have the same instance, thus the same cached data.

```language-javascript
App.controller "NewsController", class NewsController
  constructor: (NewsService) ->
    @newsService = NewsService

    @newsService.getData()
      .then(@setData)
      .then =>
        @newsService.request()
      .then @setData
      .catch (e) ->
        console.error "Error: Could not fetch News.", e

  setData: (data) =>
    // Ignored for brevity
```

The controller askes for the cached value by calling `getData`. That data is the same as the result from the last request. If this is the first request, the data would be empty.
Then we ask the service to do a request to the backend. When that resolves we set the data as we always do, with `setData()`.

The service stores the the payload from the request, so we have a cached value next time.

## Conclusion.
It's not a perfect solution. We need to add logic to cancel the request if the user makes another request before the first request is completed.

But in general this is a viable solution. It fits the requirements perfectly. The user always gets new and fresh data, and there is never an unnecessary delay before the data is displayed.

Since we did not change anything in the original factory we also have ensured that all functionality in our application works as before. The News Factory was used in several places, and now we do not have to change them all at the same time. That should of course be refactored later.
