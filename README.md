# Authentication Demo using Istio, OIDC, JWT, Keycloak, and Vue.js

This demo shows a very simple and effective way to implement client authentication using Istio with OpenID Connect, and use the JWT token for claims-based routing. Keycloak is used as the OIDC provider, and the demo applicaiton has a Vue.js front-end and a simple REST backend service.

## Features

* [Istio end-user `RequestAuthentication` with JWKS endpoint ](https://istio.io/latest/docs/tasks/security/authentication/authn-policy/#end-user-authentication)
* [Istio Ingress routing based on JWT claims](https://istio.io/latest/docs/tasks/security/authentication/jwt-route/#configuring-ingress-routing-based-on-jwt-claims)
* [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
* Single-page application built with Vue.js
* Local Kubernetes deployment with k3d

## Setup

Tested with the following versions:

* Istio 1.14
* k3d 5.4
* Keycloak 18

### Install Command Line Tools

```
brew install kubernetes-cli
brew install k3d
brew install istioctl
```

### Deploy k3d Cluster

```
k3d cluster create istio-auth --k3s-arg "--disable=traefik@server:0" --port 8080:80@loadbalancer --port 8443:443@loadbalancer
```

### Install Istio (Default Profile)

```
istioctl install -y
```

## Deploy the Keycloak Service

```
kubectl create ns keycloak
kubectl apply -n keycloak -f ./keycloak.yaml
kubectl apply -n keycloak -f ./keycloak-gw-vs.yaml 
```
Go to `http://keycloak.127.0.0.1.nip.io:8080` in your browser to access the Keycloak admin.

### Setup Keycloak Client

1. Create a Realm `petstore`
1. Create a User (i.e. `eric`)
1. Set the User's non-temporary password (i.e. `eric`) 
1. Create a `petstore` Client that has a Root URL of `http://petstore.127.0.0.1.nip.io:3000`

## Deploy the Pet Store Service

```
kubectl create ns petstore
kubectl label namespace petstore istio-injection=enabled --overwrite
kubectl apply -n petstore -f ./petstore.yaml
kubectl apply -n petstore -f ./petstore-gw-vs.yaml 
```

kubectl delete -n istio-system -f ./petstore-gw-vs.yaml 

When deployed, try to call the Pet Store service:

```
curl -v petstore.127.0.0.1.nip.io:8080/api/pets
```

## Run the Pets Application

**Pets** is a single-page application (SPA) written in React that interfaces with the Pet Store API. It uses the Keycloak JavaScript adapter to facilitate authentication.


```
python3 -m http.server 3000
```


## Secure Pet Store

```
kubectl apply -f ingress-jwt-RequestAuthentication.yaml
```

Run the next command again, and you will now receive a 404 not found. This is because there is not an `Authorization` header with a `Bearer` JWT token, so it's not a routable request.

```
curl -v petstore.127.0.0.1.nip.io:8080/api/pets
```

Now to require the JWT for any requests on the path `/api/pets`, you should also apply an AuthorizationPolicy which will result in a `403 Forbidden` with the message `RBAC: access denied`.

```
kubectl apply -f ingress-jwt-AuthorizationPolicy.yaml
```

TODO

## References

* https://www.keycloak.org/getting-started/getting-started-kube
* https://istio.io/latest/docs/tasks/security/authentication/jwt-route/
* https://hasura.io/blog/best-practices-of-using-jwt-with-graphql
* https://blog.logrocket.com/axios-vs-fetch-best-http-requests/


## Debugging

```
istioctl dashboard envoy deployment/istio-ingressgateway -n istio-system
```