(function() {
  var app = angular.module('marketFinder', ['marketFilters']);
  
  
  app.controller('marketsController', ['$http', function ($http) {
    var markets = this;
    markets.loaded = false;
    function navSuccess(pos) {
      markets.position = pos.coords;
      markets.markets = [];
      
      $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + markets.position.latitude + "&lng=" + markets.position.longitude).success(function(data){
        markets.markets = data.results;
        angular.forEach(markets.markets, function (market) {
          $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + market.id).success(function(data) {
            market.details = data.marketdetails;
          });
        });
      });
      markets.loaded = true;
    };
    function navError(error){};
    navigator.geolocation.getCurrentPosition(navSuccess, navError);
  }]);

  app.controller('marketController', ['$http', function($http) {
    var market = this;
    market.show = false;
    this.showDetail = function() {
      market.show ? market.show = false : market.show = true;
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
  });
})();
