(function() {
  var app = angular.module('marketFinder', ['marketFilters']);
  
  app.controller('marketsController', ['$http', '$scope', function ($http, $scope) {
    var markets = this;
    markets.loaded = false;

    function navSuccess(pos) {
      markets.position = pos.coords;
      markets.markets = [];
      
      $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + markets.position.latitude + "&lng=" + markets.position.longitude).
      success(function(data){
        markets.markets = data.results;
        angular.forEach(markets.markets, function (market) {
          $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + market.id).
          success(function(data) {
            market.details = data.marketdetails;
          });
        });
      }).
      error(function(data, status, headers, config) {
        console.log("=====data=====");
        console.log(data);
        console.log("=====status=====");
        console.log(status);
        console.log("=====headers=====");
        console.log(headers);
        console.log("=====config=====");
        console.log(config);
        alert("Something is up with the API. Investigations have commenced!!");
      });
      markets.loaded = true;
    };

    $scope.zipSearch = function() 
    {
      markets.loaded = false;
      // markets.markets = [];
      // markets.zip = 11215
      $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + markets.zip).success(function(data){
        markets.markets = data.results;
        angular.forEach(markets.markets, function (market) {
          $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + market.id).success(function(data) {
            market.details = data.marketdetails;
          });
        });
      });
      $scope.$apply();
      markets.loaded = true;
    };

    $scope.init = function() {navigator.geolocation.getCurrentPosition(navSuccess);}
    $scope.init();
  }]);

  app.controller('marketController', ['$http', function($http) {
    var market = this;
    market.show = false;

    this.showDetail = function() {
      market.show = true;
    };

    this.hideDetail = function() {
      market.show = false;
    };
  }]);

  angular.module('marketFilters', []).
  filter('formatMarketName', function() {
    return function (input) {
      var distance = input.match(/^\d.\d/).join();
      return input.replace(distance, "")
    };
  }).filter('formatMarketDistance', function() {
    return function (input) {
      return input.match(/^\d.\d/).join();
    };
  }).filter('removeBreak', function() {
    return function (input) {
      if (input) {
        var cleanedInput =  input.replace(/<br>/g, "");
        return cleanedInput
      }
    };
  }).filter('listProducts', function() {
    return function (input) {
      if (input) { 
        var cleanedInput =  input.replace(/\;/g, " *");
        return cleanedInput
      }
    };
  }).filter('embedMap', function() {
    return function (input) {
      if (input) {
        var cleanedInput =  "https://www.google.com/maps/embed/v1/place" + input.match(/\?q=.+/);
        return cleanedInput
      }
    };
  });
})();
