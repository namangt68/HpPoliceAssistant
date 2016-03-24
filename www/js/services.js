angular.module('starter.services', [])

.factory('Data', [function(){

  var o = {};
  o['loginInfo'] = {
    'Bilaspur': ['Sadar Bilaspur', 'Ghumarwin', 'Swarghat', 'Bharmana'],
    'Chamba': ['Blah'],
    'Hamirpur': ['Blah'],
    'Kangra': ['Blah'],
    'Kinnaur': ['Blah'],
    'Kullu': ['Blah'],
    'Lahaul': ['Blah'],
    'Mandi': ['Aut', 'Sadar Mandi', 'Sarkaghat'],
    'Shimla': ['Blah'],
    'Sirmaur': ['Blah'],
    'Solan': ['Blah'],
    'Una': ['Blah']
  }

  return o;

}])


.factory('$localstorage', ['$window', function($window) {
  return {
    sets: function(key, value) {
      $window.localStorage[key] = value;
    },
    gets: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    set: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    get: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    clear: function(){
      $window.localStorage.clear();
    }
  }
}]);
