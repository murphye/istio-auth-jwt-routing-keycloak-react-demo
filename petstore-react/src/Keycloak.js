import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://keycloak.127.0.0.1.nip.io:8080",
 realm: "petstore",
 clientId: "petstore",
 
});

export default keycloak;