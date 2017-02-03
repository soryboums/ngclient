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

.config(['$stateProvider','$urlRouterProvider', function myAppConfig ( $stateProvider, $urlRouterProvider ) {
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
}])

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngclient' ;
    }
  });
})

;

