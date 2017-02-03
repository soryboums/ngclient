angular.module( 'ngclient.auth', [])

.factory('AuthServerProvider', ['$localStorage', '$sessionStorage', '$http', function AuthServerProvider($localStorage, $sessionStorage, $http){
  var service = {
    getToken: getToken,
    login: login,
    loginWithToken: loginWithToken,
    storeAuthenticationToken: storeAuthenticationToken,
    logout: logout
  };

  return service;

  function getToken(){
    return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
  }

  function login(credentials){
    var data = {
      username: credentials.username,
      password: credentials.password,
      rememberMe: credentials.rememberMe
    };

    return $http.post('api/users/login', data).success(authenticateSuccess);

    function authenticateSuccess (data, status, headers) {

      // var token = headers('x-access-token');
      var token = data.token;
      if (angular.isDefined(token)) {
        var jwt = token;
        service.storeAuthenticationToken(jwt, credentials.rememberMe);
        return jwt;
      }
    }
  }

  // Won't be used
  function loginWithToken(){
    var deferred = $q.defer();

    if (angular.isDefined(jwt)) {
      this.storeAuthenticationToken(jwt, rememberMe);
      deferred.resolve(jwt);
    } else {
        deferred.reject();
    }

    return deferred.promise;
  }

  function storeAuthenticationToken(jwt, rememberMe){
    if(rememberMe){
      $localStorage.authenticationToken = jwt;
    } else {
      $sessionStorage.authenticationToken = jwt;
    }
  }

  function logout(){
    delete $localStorage.authenticationToken;
    delete $sessionStorage.authenticationToken;
  }
}])

.factory('Main', ['$q', 'User', function Main($q, User){
  var _identity,
      _authenticated = false;

  var service = {
    identity: identity,
    isIdentityResolved: isIdentityResolved,
    hasAnyAuthority: hasAnyAuthority,
    isAuthenticated: isAuthenticated,
    authenticate: authenticate
  };

  return service;

  function identity(force){
    var deferred = $q.defer();

    if (force === true){
      _identity = undefined;
    }
    if (angular.isDefined(_identity)){
      deferred.resolve(_identity);
      return deferred.promise;
    }
    // Retrieve user information from the server
    User.get().$promise
      .then(getUserThen)
      .catch(getUserCatch);

    return deferred.promise;

    function getUserThen(user){
      _identity = user.data;
      _authenticated = true;
      deferred.resolve(_identity);
    }

    function getUserCatch(){
      _identity = null;
      _authenticated = false;
      deferred.resolve(_identity);
    }
  }

  function isIdentityResolved(){
    return angular.isDefined(_identity);
  }

  function hasAnyAuthority(authorities){
    if (!_authenticated || !_identity || !_identity.authorities) {
      return false;
    }

    for (var i = 0; i < authorities.length; i++) {
      if (_identity.authorities.indexOf(authorities[i]) !== -1) {
        return true;
      }
    }

    return false;
  }

  function isAuthenticated(){
    return _authenticated;
  }

  function authenticate(identity){
    _identity = identity;
    _authenticated = identity !== null;
  }

}])

.factory('User', ['$resource', function User($resource){
  var service = $resource('api/users/current', {}, {
    'get': {method: 'GET', params: {}, isArray: false,
      interceptor: {
        response: function(response){
          return response;
        }
      }
    }
  });

  return service;
}])

.factory('Register', ['$resource', function Register($resource){
  return $resource('api/users/register', {}, {});
}])

.factory('Auth', ['AuthServerProvider', 'Main', 'LoginService', 'Register', '$q', '$rootScope', '$sessionStorage', '$localStorage', function Auth(AuthServerProvider, Main, LoginService, Register, $q, $rootScope, $sessionStorage, $localStorage) {
  var service = {
    login: login,
    logout: logout,
    register: register,
    authorize: authorize,
    getPreviousState: getPreviousState,
    resetPreviousState: resetPreviousState,
    storePreviousState: storePreviousState
  };

  function login (credentials, callback) {
    var cb = callback || angular.noop;
    var deferred = $q.defer();

    AuthServerProvider.login(credentials)
      .then(loginThen)
      .catch(function (e) {
        this.logout();
        deferred.reject(e);
        return cb(e);
      }.bind(this));

      function loginThen(data){
        Main.identity(true).then(function(user){

          deferred.resolve(data);
        });

        return cb();
      }

    return deferred.promise;
  }

  function logout(){
    AuthServerProvider.logout();
    Main.authenticate(null);
  }

  function register(account, callback){
    var cb = callback || angular.noop;
    return Register.save(account,
      function(){
        return cb(account);
      }, function(err){
        this.logout();
        return cb(err);
      }.bind(this)).$promise;

  }

  function authorize(force){
    var authReturn  = Main.identity(force).then(authThen);
    return authReturn;

    function authThen(){
      var isAuthenticated = Main.isAuthenticated();
      // TODO: Authenticated user can not acces to login and register pages
      // recover and clear previousState after external login redirect (e.g. oauth2)
      if (isAuthenticated && !$rootScope.fromState.name && getPreviousState()) {
        var previousState = getPreviousState();
        resetPreviousState();
        $state.go(previousState.name, previousState.params);
      }

      if ($rootScope.toState.data.authorities && $rootScope.toState.data.authorities.length > 0 && !Main.hasAnyAuthority($rootScope.toState.data.authorities)){
        if (isAuthenticated){
          // User is sign but not authorized
          $state.go('accessdenied');
        }else{
          // User is not authenticated, send them to the login page
          storePreviousState($rootScope.toState.name, $rootScope.toState.params);
          $state.go('accessdenied').then(function(){
            LoginService.open();
          });
        }
      }
    }
  }

  function getPreviousState(){
    var previousState = $sessionStorage.previousState;
    return previousState;
  }

  function resetPreviousState(){
    delete $sessionStorage.previousState;
  }

  function storePreviousState(previousStateName, previousStateParams){
    var previousState = { 'name': previousStateName, 'params': previousStateParams};
    $sessionStorage.previousState = previousState;
  }
  return service;
}]);
