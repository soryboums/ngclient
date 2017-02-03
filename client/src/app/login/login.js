angular.module( 'ngclient.login', [])


.config(function config( $stateProvider ) {
  $stateProvider.state( 'register', {
    parent: 'app',
    url: '/register',
    views: {
      "main@": {
        controller: 'RegisterCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'login/register.tpl.html'
      }
    },
    data:{ pageTitle: 'Inscription' }
  });
})

.factory( 'LoginService', ['$uibModal', function LoginService($uibModal) {
  var service = {
    open: open
  };

  var modalInstance = null;
  var resetModal = function () {
    modalInstance = null;
  };

  return service;

  function open () {
    if (modalInstance !== null) {
      return;
    }

    modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'login/login.tpl.html',
        controller: 'LoginModalCtrl',
        controllerAs: 'ctrl'
    });

    modalInstance.result.then(
        resetModal,
        resetModal
    );
  }
}])

.controller( 'LoginModalCtrl', ['$uibModalInstance', '$state', '$rootScope', 'Auth', function LoginModalCtrl($uibModalInstance, $state, $rootScope, Auth) {
  var self = this;
  self.cancel = cancel;
  self.login = login;
  self.authenticationError = false;

  function cancel () {

    self.credentials = {
      username: null,
      password: null,
      rememberMe: true
    };
    self.authenticationError = false;
    $uibModalInstance.dismiss('cancel');
  }

  function login (event) {
    event.preventDefault();

    Auth.login({
        username: self.username,
        password: self.password,
        rememberMe: self.rememberMe
    }).then(function () {
        self.authenticationError = false;
        $uibModalInstance.close();

        if ($state.current.name === 'register') {
            $state.go('home');
        }

        $rootScope.$broadcast('authenticationSuccess');

        // previousState was set in the authExpiredInterceptor before being redirected to login modal.
        // since login is succesful, go to stored previousState and clear previousState
        if (Auth.getPreviousState()) {
            var previousState = Auth.getPreviousState();
            Auth.resetPreviousState();
            $state.go(previousState.name, previousState.params);
        }
    }).catch(function () {
        self.authenticationError = true;
    });
}

}])

.controller( 'RegisterCtrl', ['Auth', 'LoginService', function RegisterCtrl( Auth, LoginService ) {
  var self = this;
  self.register = register;
  self.login = login;
  self.doNotMatch = null;
  self.success = null;
  self.error = null;
  self.registerAccount = {};

  function register(){
    if (self.registerAccount.password !== self.confirmPassword){
      self.doNotMatch = 'ERROR';
    }else{
      self.doNotMatch = null;
      self.error = null;

      Auth.register(self.registerAccount)
        .then(function(){
          self.success = 'OK';
        }).catch(function (response){
          // TODO: Manage user/email exists
          self.success = null;
          self.error = 'ERROR';
        });
    }
  }

  function login(){
    LoginService.open();
  }
}]);
