(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['authService'];

  function run(authService) {

    console.log("======authService=======");
    if (authService.isAuthenticated() === 'true') {
      console.log("is logged in true");
      authService.renewAccessToken();
    } else {
      // Handle the authentication
      // result in the hash
      console.log("is logged in false");
      authService.handleAuthentication();
    }
  }

})();