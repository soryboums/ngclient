angular.module( 'ngclient.about', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    parent: 'app',
    url: '/about',
    views: {
      "main@": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html',
        controllerAs: 'ctrl'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'AboutCtrl', function AboutCtrl( ) {
  var self = this;
});
