# Authentication Demo using Istio, OIDC, JWT, Keycloak, and React

This demo shows a very simple and effective way to implement client authentication using Istio with OpenID Connect, and use the JWT token for claims-based routing. Keycloak is used as the OIDC provider, and the demo applicaiton has a React JavaScript front-end and a simple REST backend service.

## Features

* [Istio end-user `RequestAuthentication` with JWKS endpoint ](https://istio.io/latest/docs/tasks/security/authentication/authn-policy/#end-user-authentication)
* [Istio Ingress routing based on JWT claims](https://istio.io/latest/docs/tasks/security/authentication/jwt-route/#configuring-ingress-routing-based-on-jwt-claims)
* [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
* Single-page application built with React
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
1. Create a User
1. Set the User's password (Not Temporary)
1. Create a `pets` Client that has a Root URL of `http://pets.127.0.0.1.nip.io:8080`

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

## Deploy the Pets Application

**Pets** is a single-page application (SPA) written in React that interfaces with the Pet Store API. It uses the Keycloak JavaScript adapter to facilitate authentication.

TODO

## References

* https://www.keycloak.org/getting-started/getting-started-kube
* https://blog.logrocket.com/implement-keycloak-authentication-react/

## Debugging

```
istioctl dashboard envoy deployment/istio-ingressgateway -n istio-system
```