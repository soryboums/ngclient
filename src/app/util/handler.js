angular.module( 'ngclient.util', [])

.factory('stateHandler', ['$rootScope', '$window', 'Auth', 'Main', function stateHandler($rootScope, $window, Auth, Main){
  return {
    initialize: initialize
  };

  function initialize(){

    var stateChangeStart = $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState){
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      $rootScope.fromState = fromState;

      // Redirect to a state with an external URL (http://stackoverflow.com/a/30221248/1098564)
      if (toState.external){
        event.preventDefault();
        $window.open(toState.url, '_self');
      }

      if (Main.isIdentityResolved()){
        Auth.authorize();
      }
    });

    $rootScope.$on('$destroy', function(){
      if (angular.isDefined(stateChangeStart) && stateChangeStart !== null){
        stateChangeStart();
      }
    });
  }
}]);
