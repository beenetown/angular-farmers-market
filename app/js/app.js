(function() {
  var app = angular.module('marketFinder', ['marketFilters']);
  
  app.controller('marketsController', ['$http', function ($http) {
    var markets = this;
    
    function navSuccess(pos) {
      markets.position = pos.coords;
      markets.markets = [];
      
      $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + markets.position.latitude + "&lng=" + markets.position.longitude).success(function(data){
        markets.markets = data.results;
      });
    };
    function navError(error){};
    navigator.geolocation.getCurrentPosition(navSuccess, navError);
  }]);

  app.controller('marketController', ['$http', function($http) {
    var market = this;
    this.showDetail = function(id) {
      $("." + id).toggle();
      $http.get("http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id).success(function(data) {
        market.details = data.marketdetails;
      });
    };
  }]);
})();
