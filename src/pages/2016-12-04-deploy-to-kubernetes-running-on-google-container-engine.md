---
title: Deploy to Kubernetes running on Google Container Engine
slug: deploy-to-kubernetes-running-on-google-container-engine
date: 2016-12-04T00:39:23.696Z
tags: Deploy, Kubernetes, Google, Cluster
---

We will setup a small cluster of 3 n1-standard-1 instances. They cost around $25 per month. So the cluster will cost you somewhere above $75 a month for the servers.

This is just a few notes from the tutorial from [kubernetes.io](http://kubernetes.io/docs/hellonode/).

## Setup needed before we start with the cluster
- Install google cloud sdk

```
brew cask install google-cloud-sdk
```

- Create a project on google cloud

Go to [console.cloud.google.com](console.cloud.google.com) and set it up. Remember the project id.

- Install kubectl
```
gcloud components install kubectl
```

- Have a sample project.

In a `server.js` file
```
var http = require('http');
var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};
var www = http.createServer(handleRequest);
www.listen(8080);
```

- Create a docker file.

`Dockerfile`

```
FROM node:4.4
EXPOSE 8080
COPY server.js .
CMD node server.js
```

- Build the docker container

```
docker build -t gcr.io/$PROJECT_ID/hello-node:v1 .
```

- Authenticated for the google api

```
gcloud auth login
gcloud config set project PROJECT_ID
```

- Push the container to the google docker registry

```
gcloud docker -- push gcr.io/$PROJECT_ID/hello-node:v1
```

### Create a cluster

- Create a cluster

```
gcloud container clusters create hello-world
```

Fetch configuration needed

```
gcloud container clusters get-credentials hello-world
```

I had some missing credentials. Had to run this command again:

```
gcloud auth application-default login
```

- Create a pod

```
kubectl run hello-node --image=gcr.io/$PROJECT_ID/hello-node:v1 --port=8080
```

Allow external traffic to the application

```
kubectl expose deployment hello-node --type="LoadBalancer"
```

To find the ip adress run:
```
kubectl get services hello-node
```

You can now see your service running on you kube cluster.

### View the setup

```
kubectl get deployments
kubectl get pods
kubectl logs <POD-NAME>
kubectl cluster-info
kubectl get events
kubectl config view
kubectl get services hello-node
```

Run `kubectl cluser-info` and you will see a list of all Kubernetes services running. One is the `Kubernetes-Dashboard`.

If you open that url in the browser you will be prompted for a username and password. These can we viewed (in plain text) with:

```
gcloud container clusters describe <cluster-name>
```

Somewhere in there you will find a `username` and `password`.

### Scaling

Scale up? Or scale down? Define how many instance you want to have running and the rest is managed for you.
```
kubectl scale deployment hello-node --replicas=4
```

### Deploy a new version

Modify you application.

```
docker build -t gcr.io/$PROJECT_ID/hello-node:v2 .
gcloud docker push gcr.io/$PROJECT_ID/hello-node:v2
```

To run the new version we set which image we want kube to run.

```
kubectl set image deployment/hello-node hello-node=gcr.io/$PROJECT_ID/hello-node:v2
```


### Clean up you cluster

If you did this to test it out you might want to remove your cluster now.

```
kubectl delete service,deployment hello-node
gcloud container clusters delete hello-world
```

List all the images you uploaded
```
gsutil ls
```

Remove them:

```
gsutil rm -r gs://artifacts.$PROJECT_ID.appspot.com/
```

That it.
