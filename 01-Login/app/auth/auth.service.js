(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout'];

  function authService($state, angularAuth0, $timeout) {

    var accessToken;
    var idToken;
    var expiresAt;

    function getIdToken() {
      return idToken;
    }

    function getAccessToken() {
      return accessToken;
    }

    function login() {
      angularAuth0.loginWithRedirect();
    }

    function handleAuthentication() {
      angularAuth0.handleRedirectCallback().then(redirectResult => {
        angularAuth0.getIdTokenClaims().then(id_token => {
          expiresAt = new Date(id_token.exp * 1000);
          console.log(expiresAt);
          idToken = id_token.__raw;
          angularAuth0.getTokenSilently().then(result => {
            console.log("getTokenSilently: " + result);
            accessToken = result;
            angularAuth0.isAuthenticated().then(
              result => {
                console.log("isAuthenticated: " + result);
                if (result) {
                  localStorage.setItem('isLoggedIn', 'true');
                } else {
                  localStorage.setItem('isLoggedIn', 'false');
                }
                $state.go('home');
              }
            )
          })
        });
      }).catch(error => {
        console.log(error);
      });
    }

    function renewAccessToken() {
      angularAuth0.getTokenSilently().then(result => {
          console.log("getTokenSilently: " + result);
          accessToken = result;
      });
    }

    function logout() {
      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;

      angularAuth0.logout({
        returnTo: window.location.origin
      });

      $state.go('home');
    }

    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      getIdToken: getIdToken,
      getAccessToken: getAccessToken,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      renewAccessToken: renewAccessToken
    }
  }
})();
