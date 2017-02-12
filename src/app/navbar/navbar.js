angular.module( 'ngclient.navbar', [])

.controller( 'NavbarCtrl', ['LoginService', 'Main', 'Auth', '$rootScope', '$state', function NavbarCtrl(LoginService, Main, Auth, $rootScope, $state) {
  var self = this;
  self.login = login;
  self.logout = logout;

  function login(){
    console.log('login');
    LoginService.open();
  }

  function logout(){
    console.log('logout');
    Auth.logout();
    self.user = {};
    $state.go('home');
  }

  self.isAuthenticated = Main.isAuthenticated;
  if (self.isAuthenticated){
    Main.identity().then(function(user){
      self.user = user;
    });
  }

  $rootScope.$on('authenticationSuccess', function(event){
    Main.identity().then(function(user){
      self.user = user;
    });
  });
}]);
