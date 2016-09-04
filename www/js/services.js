angular.module('starter.services', [])

.factory('Data', [function(){

  var o = {};
  o["loginInfo"] = {
    'Mandi' : ['PS Sadar'],
    'Shimla' : ['PS Sadar', 'PS East', 'PS West', 'PS Dhalli', 'PS New Shimla', 'Malhila PS', 'PS Theog', 'PS K/Sain', 'PS Rampur', 'PS Jhakri', 'PS Rohru', 'PS Chirgaon', 'PS Jubbal', 'PS Kothkai', 'PS Chopal', 'PS Nerwa', 'PS Kupvi', 'PS Sunni'],
    'Bilaspur': ['Blah'],
    'Chamba': ['Blah'],
    'Hamirpur': ['Blah'],
    'Kangra': ['Blah'],
    'Kinnaur': ['Blah'],
    'Kullu': ['Blah'],
    'Lahaul': ['Blah'],
    'Sirmaur': ['Blah'],
    'Solan': ['Blah'],
    'Una': ['Blah']
  }
  o['loginInfoPwd'] = {
    "Mandi" : {
    "PS Sadar" : "Mnd-Sar234"
  },
  
  "Shimla" : {
    "PS Sadar" : "Shi-Sar761", 
    "PS East" : "Shi-Eat778", 
    "PS West" : "Shi-Wet182", 
    "PS Dhalli" : "Shi-Dhi474", 
    "PS New Shimla" : "Shi-Nea540", 
    "Malhila PS" : "Shi-Maa812", 
    "PS Theog" : "Shi-Thg228", 
    "PS K/Sain" : "Shi-KSn587", 
    "PS Rampur" : "Shi-Rar076", 
    "PS Jhakri" : "Shi-Jhi620", 
    "PS Rohru" : "Shi-Rou604", 
    "PS Chirgaon" : "Shi-Chn753", 
    "PS Jubbal" : "Shi-Jul440", 
    "PS Kothkai" : "Shi-Koi608", 
    "PS Chopal" : "Shi-Chl831", 
    "PS Nerwa" : "Shi-Nea630", 
    "PS Kupvi" : "Shi-Kui853", 
    "PS Sunni" : "Shi-Sui680"
    },
  'Bilaspur': {'Blah': ''},
  'Chamba': {'Blah': ''},
  'Hamirpur': {'Blah': ''},
  'Kangra': {'Blah': ''},
  'Kinnaur': {'Blah': ''},
  'Kullu': {'Blah': ''},
  'Lahaul': {'Blah': ''},
  'Sirmaur': {'Blah': ''},
  'Solan': {'Blah': ''},
  'Una': {'Blah': ''}
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
