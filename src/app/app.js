angular.module( 'ngclient', [
  'templates-app',
  'templates-common',
  'ngclient.auth',
  'ngclient.navbar',
  'ngclient.home',
  'ngclient.login',
  'ngclient.util',
  'ngclient.about',
  'ui.bootstrap',
  'ui.router',
  'ngStorage',
  'ngResource',
  'ngMaterial'
])

.factory('authInterceptor', ['$localStorage', '$sessionStorage', function authInterceptor($localStorage, $sessionStorage){
  var service = {
    request: request
  };

  return service;

  function request(config){
    config.headers = config.headers || {};
    var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
    if (token){
      config.headers['x-access-token'] = token;
    }
    return config;
  }
}])

.factory('authExpiredInterceptor', ['$localStorage', '$sessionStorage', '$injector', '$q', function authExpiredInterceptor($localStorage, $sessionStorage, $injector, $q){
  var service = {
    responseError: responseError
  };

  return service;

  function responseError(response){
    if (response.status === 401){
      delete $localStorage.authenticationToken;
      delete $sessionStorage.authenticationToken;
      var Main = $injector.get('Main');
      if (Main.isAuthenticated()){
        var Auth = $injector.get('Auth');
        Auth.authorize(true);
      }
    }
    return $q.reject(response);
  }
}])

.run(['stateHandler', function myAppRun(stateHandler){
  stateHandler.initialize();
}])

.config(['$stateProvider','$urlRouterProvider', '$httpProvider', function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider ) {
  $stateProvider.state( 'app', {
    abstract: true,
    views: {
      "navbar@": {
        controller: 'NavbarCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'navbar/navbar.tpl.html'
      }
    }
  });
  $urlRouterProvider.otherwise( '/home' );
  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.interceptors.push('authExpiredInterceptor');
}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngclient' ;
    }
  });
})

;

