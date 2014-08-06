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
    var cleanedInput =  input.replace(/<br>/g, "");
    return cleanedInput
  };
}).filter('listProducts', function() {
  return function (input) {
    var cleanedInput =  input.replace(/\;/g, " *");
    return cleanedInput
  };
});
