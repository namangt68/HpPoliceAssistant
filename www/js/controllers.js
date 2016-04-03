angular.module('starter.controllers', ['ngCordova'])

.controller('ChallanCtrl', function($scope, $cordovaGeolocation, $cordovaCamera, $ionicPopup, $cordovaToast){
	console.log('ChallanCtrl');

	$scope.captureImage = function() {
		var options = {
		  quality: 10,
		  destinationType: Camera.DestinationType.DATA_URL
		  // sourceType: Camera.PictureSourceType.CAMERA,
		  // allowEdit: true,
		  // encodingType: Camera.EncodingType.JPEG,
		  // targetWidth: 100,
		  // targetHeight: 100,
		  // popoverOptions: CameraPopoverOptions,
		  // saveToPhotoAlbum: false,
		  // correctOrientation:true
		};

		$cordovaCamera
			.getPicture(options)
			.then(function(imageData){
				$scope.data.image = imageData;
				console.log(imageData);
			}, function(err){console.log(err)});
	}

	$scope.$on('$ionicView.enter', function(){
		$scope.data = {}
		$scope.data.offence = []

		if (window.cordova) {
			var posOptions = {timeout: 1000, enableHighAccuracy: true};
			$cordovaGeolocation
			    .getCurrentPosition(posOptions)
			    .then(function (position) {
			    	$scope.gps = position.coords;
			    }, function(err) {
			    	console.log('Error in $cordovaGeolocation: ', err);
			    	$scope.gps = {latitude: 13.32, longitude: -13.32};
			    });
		} else {
			navigator.geolocation.getCurrentPosition(function(x){
				$scope.gps = x.coords;
			});	
		}
		
		var d = new Date();
		$scope.data.date = d.toDateString();
		$scope.data.time = d.toTimeString().slice(0,8);
	});

	$scope.onChallanSubmit = function(){

		if(window.cordova){$cordovaToast.show('Challan submission in progress.', 'short', 'bottom');}

		var Challan = Parse.Object.extend("Challan");
		var challan = new Challan();

		var base64 = $scope.data.image;
		var imageFile = new Parse.File(Date.now().toString() + '.jpg', { base64: base64 });

		challan.set("Offences", $scope.data.offence);
		challan.set("OffencesSection", $scope.data.section);
		challan.set("Place", $scope.data.place);
		challan.set("imageFile", imageFile);

		var point = new Parse.GeoPoint({latitude: $scope.gps.latitude, longitude: $scope.gps.longitude});
		challan.set("GPS", point);

		challan.save(null, {
			success: function(challan) {
				console.log('New object created with objectId: ' + challan.id);
				$ionicPopup.alert({
					title: 'Success',
					template: 'Challan entry was successfully submitted.'
				});
			},
			error: function(VehicleEntry) {
				console.log('No object created');
				$ionicPopup.alert({
					title: 'Error',
					template: 'Error occured during Challan submittion.'
				});
			}
		});

		$scope.data = {};
		$scope.data.offence = []

		var d = new Date();
		$scope.data.date = d.toDateString();
		$scope.data.time = d.toTimeString().slice(0,8);
	}


	console.log($scope.data);


})

.controller('EntryCtrl', function($scope, $state, $cordovaToast, $cordovaCamera, $localstorage, $ionicPopup, $rootScope, $cordovaNetwork) {
	console.log('EntryCtrl');

	// $localstorage.clear();

	// listen for Online event
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		
		var offlineState = networkState;
		console.log(networkState);

		var data = $localstorage.get('data');
		if(Object.keys(data).length != 0){
			
			if(window.cordova){$cordovaToast.show('Pending data submission in progress.', 'short', 'bottom');}
			var VehicleEntry = Parse.Object.extend("VehicleEntry");
			for (var i = 0; i< data.length; i++) {
				
				console.log(data[i]);
				
				var vehicleEntry = new VehicleEntry();

				var base64 = data[i].image;
				var imageFile = new Parse.File(Date.now().toString() + '.jpg', { base64: base64 });

				vehicleEntry.set("district", $localstorage.gets('district'));
				vehicleEntry.set("policeStation", $localstorage.gets('policeStation'));
				vehicleEntry.set("policePost", $localstorage.gets('policePost'));
				vehicleEntry.set("nakaAddress", $localstorage.gets('naka'));
				vehicleEntry.set("phoneNumInt", data[i]["phone"]);
				vehicleEntry.set("vehicleNum", data[i]["vehicle"]);
				vehicleEntry.set("description", data[i]["info"]);
				vehicleEntry.set("ImageFile", imageFile);
				
				vehicleEntry.save(null, {
					success: function(VehicleEntry) {
						console.log('New object created with objectId: ' + vehicleEntry.id);
						// $ionicPopup.alert({
						// 	title: 'Success',
						// 	template: 'Entry was successfully submitted.'
					 //   	});
						// $-cordovaToast.show('Data successfully submitted !', 'short', 'bottom');
					},
					error: function(VehicleEntry) {
						console.log('No object created');
						$ionicPopup.alert({
							title: 'Error',
							template: 'Error occurred in pending data submission.'
						});
						// $-cordovaToast.show('Error occurred in data submission !', 'short', 'bottom');
					}
				});

			};

			if(window.cordova){$cordovaToast.show('Pending data successfully submitted !', 'short', 'bottom');}
			$localstorage.set('data', {});
		}

	})

	$scope.$on('$ionicView.enter', function(){
		if ($localstorage.get('isAuthorized') === true) {
			console.log('isAuthorized');
		} else {
			$state.go('login');
			console.log('notAuthorized');
		}
	});


	$scope.data = {};
	$scope.captureImage = function() {
		var options = {
		  quality: 10,
		  destinationType: Camera.DestinationType.DATA_URL
		  // sourceType: Camera.PictureSourceType.CAMERA,
		  // allowEdit: true,
		  // encodingType: Camera.EncodingType.JPEG,
		  // targetWidth: 100,
		  // targetHeight: 100,
		  // popoverOptions: CameraPopoverOptions,
		  // saveToPhotoAlbum: false,
		  // correctOrientation:true
		};

		$cordovaCamera
			.getPicture(options)
			.then(function(imageData){
				$scope.data.image = imageData;
				console.log(imageData);
			}, function(err){console.log(err)});
	}


	$scope.onVehicleEntrySubmit = function(){

		if(window.cordova){
			if ($cordovaNetwork.isOnline()) {

				if(window.cordova){$cordovaToast.show('Data submission in progress.', 'short', 'bottom');}

				var VehicleEntry = Parse.Object.extend("VehicleEntry");
				var vehicleEntry = new VehicleEntry();

				console.log($scope.data);

				var base64 = $scope.data.image;
				var imageFile = new Parse.File(Date.now().toString() + '.jpg', { base64: base64 });

				vehicleEntry.set("district", $localstorage.gets('district'));
				vehicleEntry.set("policeStation", $localstorage.gets('policeStation'));
				vehicleEntry.set("policePost", $localstorage.gets('policePost'));
				vehicleEntry.set("nakaAddress", $localstorage.gets('naka'));			
				vehicleEntry.set("phoneNumInt", $scope.data["phone"]);
				vehicleEntry.set("vehicleNum", $scope.data["vehicle"]);
				vehicleEntry.set("description", $scope.data["info"]);
				vehicleEntry.set("ImageFile", imageFile);
				
				vehicleEntry.save(null, {
					success: function(VehicleEntry) {
						console.log('New object created with objectId: ' + vehicleEntry.id);
						$ionicPopup.alert({
							title: 'Success',
							template: 'Entry was successfully submitted.'
						});
						// $-cordovaToast.show('Data successfully submitted !', 'short', 'bottom');
					},
					error: function(VehicleEntry) {
						console.log('No object created');
						$ionicPopup.alert({
							title: 'Error',
							template: 'Error occurred in data submission.'
						});
						// $-cordovaToast.show('Error occurred in data submission !', 'short', 'bottom');
					}
				});

				$scope.data.image = ''
				$scope.data = {}
			} else {

				if(window.cordova){$cordovaToast.show('Data will be submitted when connected to internet.', 'short', 'bottom');}

				var data = $localstorage.get('data');
				
				if(Object.keys(data).length === 0){			
					console.log('Data queued for offline storage');
					data = [];
				}
				
				data.unshift($scope.data);
				$localstorage.set('data', data);

				$scope.data.image = ''
				$scope.data = {}

			}
		} else {
			if(window.cordova){$cordovaToast.show('Data submission in progress.', 'short', 'bottom');}

			var VehicleEntry = Parse.Object.extend("VehicleEntry");
			var vehicleEntry = new VehicleEntry();

			console.log($scope.data);

			var base64 = $scope.data.image;
			var imageFile = new Parse.File(Date.now().toString() + '.jpg', { base64: base64 });

			vehicleEntry.set("district", $localstorage.gets('district'));
			vehicleEntry.set("policeStation", $localstorage.gets('policeStation'));
			vehicleEntry.set("policePost", $localstorage.gets('policePost'));
			vehicleEntry.set("nakaAddress", $localstorage.gets('naka'));			
			vehicleEntry.set("phoneNumInt", $scope.data["phone"]);
			vehicleEntry.set("vehicleNum", $scope.data["vehicle"]);
			vehicleEntry.set("description", $scope.data["info"]);
			vehicleEntry.set("ImageFile", imageFile);
			
			vehicleEntry.save(null, {
				success: function(VehicleEntry) {
					console.log('New object created with objectId: ' + vehicleEntry.id);
					$ionicPopup.alert({
						title: 'Success',
						template: 'Entry was successfully submitted.'
					});
					// $-cordovaToast.show('Data successfully submitted !', 'short', 'bottom');
				},
				error: function(VehicleEntry) {
					console.log('No object created');
					$ionicPopup.alert({
						title: 'Error',
						template: 'Error occurred in data submission.'
					});
					// $-cordovaToast.show('Error occurred in data submission !', 'short', 'bottom');
				}
			});

			$scope.data.image = ''
			$scope.data = {}
		}
	}
})

.controller('StolenCtrl', function($scope, $state, $ionicFilterBar, $cordovaToast) {

	var VehicleStolen = Parse.Object.extend("VehicleStolen");
	var query = new Parse.Query(VehicleStolen);
	query.find({
		success: function(results){
			if(window.cordova){$cordovaToast.show('Fetching !', 'short', 'bottom');}
			$scope.vehicles = [];
			for (var i = 0; i < results.length; i++) {
				var item = {
					VehicleType: results[i].get('VehicleType'),
					LocationType: results[i].get('Location'),
					VehicleNumber: results[i].get('VehicleNumber')
				};
				$scope.vehicles.push(item);
			}
			console.log($scope.vehicles);
			$state.go($state.current, {}, {reload: true});
		},
		error: function(error){
			console.log(error);
		}
	});

	$scope.doRefresh = function(){
		query.find({
			success: function(results){
				$scope.vehicles = [];
				for (var i = 0; i < results.length; i++) {
					var item = {
						VehicleType: results[i].get('VehicleType'),
						LocationType: results[i].get('Location'),
						VehicleNumber: results[i].get('VehicleNumber')
					};
					$scope.vehicles.push(item);
				}
			},
			error: function(error){
				console.log(error);
			}
		});
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$apply()
	};

	$scope.showFilterBar = function () {

	  console.log('Show ?');
	  
	  var filterBarInstance = $ionicFilterBar.show({
		items: $scope.vehicles,
		update: function (filteredItems) {
		  $scope.vehicles = filteredItems;
		}
		// expression: ['LocationType']
	  });
	};

})

.controller('SearchCtrl', function($scope, $state, $localstorage) {

	$scope.$on('$ionicView.enter', function(){
		if ($localstorage.get('isAuthorized') === true) {
			console.log('isAuthorized');
		} else {
			$state.go('login');
			console.log('notAuthorized');
		}
	});


	$scope.data = {}
	$scope.search = function(){
		console.log($scope.data.search)

		if (! $scope.data.search) {
			console.log('Empty string')
			return
		}

		var VehicleEntry = Parse.Object.extend("VehicleEntry");
		var query = new Parse.Query(VehicleEntry);
		query.equalTo("vehicleNum", $scope.data.search);
		query.find({
			success: function(results) {
				$scope.vehicles = [];
				for (var i = results.length - 1; i >= 0; i--) {
					console.log(i);
					console.log(results[i].get("description"));
					console.log(results[i].get("ImageFile"));
					var item = {
						vehicleNum: results[i].get('vehicleNum'),
						district: results[i].get('district'),
						policeStation: results[i].get('policeStation')
					};
					$scope.vehicles.push(item);
				}
				console.log($scope.vehicles);
				$state.go($state.current, {}, {reload: true});
			},
			error: function(error) {
				console.log(error);
			}
		});


	}

})

.controller('LoginCtrl', function($scope, $localstorage, $state, Data, $cordovaNetwork, $ionicPopup, $cordovaToast,$ionicLoading) {
	console.log('LoginCtrl');
	$scope.$on('$ionicView.enter', function(){
		$localstorage.set('isAuthorized', false);
	});

	$scope.selected = {};
	$scope.loginInfo = Data.loginInfo;
	$scope.districts = Object.keys(Data.loginInfo);

	$scope.onLoginSubmit = function(){
		// $-cordovaToast.show('Verifying credentials.', 'short', 'bottom');
		$ionicLoading.show({
		     template: '<ion-spinner icon="lines"></ion-spinner><br/>Verifying credentials'
		   });
		console.log($scope.selected);

		$localstorage.sets("district", $scope.selected.district);
		$localstorage.sets("policeStation", $scope.selected.police);
		$localstorage.sets("policePost", $scope.selected.post);
		$localstorage.sets("naka", $scope.selected.naka);

		if (window.cordova) {
			if ($cordovaNetwork.isOnline()) {
				var Login = Parse.Object.extend("Login");
				var query = new Parse.Query(Login);
				query.equalTo("district", $scope.selected.district);
				query.equalTo("policeStation", $scope.selected.police);
				query.find({
					success: function(results) {
						$ionicLoading.hide();
						if (results.length === 1){
							var password = results[0].get("password");
							if (password === $scope.selected.password) {
								console.log('Logging In...');
								$localstorage.set('isAuthorized', true);
								$state.go('tab.entry');
							} else {
								$ionicPopup.alert({
									title: 'Invalid Credentials',
									template: 'Please check the password and try again.'
								});
								console.log('Invalid Password');
							}

						} else {
							$ionicPopup.alert({
								title: 'Invalid Credentials',
								template: 'District or Police Station not found.'
							});
						}
					},
					error: function(error) {
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Network Problem',
							template: 'Weak Internet connection, try in offline mode.'
						});
						console.log(error);
					}
				});
			} else{

				$ionicLoading.hide();

				if ($scope.selected.district === 'Mandi' &&
					$scope.selected.police === 'Sadar Mandi' &&
					$scope.selected.password === 'password') {

					console.log('Logging In...');
					$localstorage.set('isAuthorized', true);
					$state.go('tab.entry');

				} else if ($scope.selected.district === 'Bilaspur' &&
					$scope.selected.police === 'Sadar Bilaspur' &&
					$scope.selected.password === 'pass') {

					console.log('Logging In...');
					$localstorage.set('isAuthorized', true);
					$state.go('tab.entry');

				} else {
					$ionicPopup.alert({
						title: 'No Internet Connection',
						template: 'Please connect to internet and try again.'
					});
				}
			}
		} else {
			var Login = Parse.Object.extend("Login");
			var query = new Parse.Query(Login);
			query.equalTo("district", $scope.selected.district);
			query.equalTo("policeStation", $scope.selected.police);
			query.find({
				success: function(results) {
					$ionicLoading.hide();
					if (results.length === 1){
						var password = results[0].get("password");
						if (password === $scope.selected.password) {
							console.log('Logging In...');
							$localstorage.set('isAuthorized', true);
							$state.go('tab.entry');
						} else {
							$ionicPopup.alert({
								title: 'Invalid Credentials',
								template: 'Please check the password and try again.'
							});
							console.log('Invalid Password');
						}

					} else {
						$ionicPopup.alert({
							title: 'Invalid Credentials',
							template: 'District or Police Station not found.'
						});
					}
				},
				error: function(error) {
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Network Problem',
						template: 'Weak Internet connection, try in offline mode.'
					});
					console.log(error);
				}
			});
		}
	}
})

.controller('DevelopersCtrl', function($scope, $ionicPopover, $localstorage, $state) {
	$scope.$on('$ionicView.enter', function(){
		if ($localstorage.get('isAuthorized') === true) {
			console.log('isAuthorized');
		} else {
			$state.go('login');
			console.log('notAuthorized');
		}
	});	

	$scope.goBack = function() {
		$state.go('tab.entry');
	}
})

.controller('AppCtrl', function($scope, $ionicPopover, $localstorage, $state, $cordovaToast, $cordovaSplashscreen, $ionicActionSheet) {

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
	scope: $scope,
  }).then(function(popover) {
	$scope.popover = popover;
  });

  $scope.demo = 'ios';
  $scope.setPlatform = function(p) {
	document.body.classList.remove('platform-ios');
	document.body.classList.remove('platform-android');
	document.body.classList.add('platform-' + p);
	$scope.demo = p;
  }

  $scope.logout = function() {

	if(window.cordova){$cordovaToast.show('Logged Out.', 'short', 'bottom');}
	console.log('Logging out...');
	$localstorage.set('isAuthorized', false);
	// $scope.popover.hide();
	$state.go('login');
  }

  var developers = function() {
	// $scope.popover.hide();
	$state.go('developers');
  }


  $scope.showOptions = function(){
	$ionicActionSheet.show({
		buttons: [
			{ text: 'Developers' },
			{ text: 'Log Out' }
		],
		// destructiveText: 'Delete',
		// titleText: 'Update Todo',
		// cancelText: 'Cancel',
		
		buttonClicked: function(index) {
			if (index === 0) {
				developers();
			} else if(index === 1) {
				$scope.logout();
			}
			return true;
		}
	});
  }

});
