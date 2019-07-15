'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var NUMBER_OF_PINS = 5;

  var comparator = function (a, b) {
    return (a === b || b === 'any');
  };

  var guestsComparator = function (a, b) {
    return (b === '0' && a.toString(10) === b) ||
      (b !== '0' && a >= parseInt(b, 10) || b === 'any');
  };

  var priceComparator = function (a, b) {
    return (b === 'any') ||
      (b === 'low' && a < LOW_PRICE) ||
      (b === 'middle' && a >= LOW_PRICE && a <= HIGH_PRICE) ||
      (b === 'high' && a > HIGH_PRICE);
  };

  var featuresComparator = function (arr1, arr2) {
    return arr2.every(function (it) {
      return arr1.indexOf(it) >= 0;
    });
  };

  var getRandomArr = function (arr) {
    var randomElements = [];
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      var randomElement = Math.floor(Math.random() * (arr.length));
      randomElements.push(arr[randomElement]);
      arr.splice(randomElement, 1);
    }
    return randomElements;
  };

  window.filterData = function (pins, propertiesObj) {
    var filteredPins = pins.filter(function (el) {
      return (el.offer &&
        comparator(el.offer.type, propertiesObj.housingType) &&
        guestsComparator(el.offer.guests, propertiesObj.housingGuests) &&
        priceComparator(el.offer.price, propertiesObj.housingPrice) &&
        comparator((el.offer.rooms).toString(10), propertiesObj.housingRooms) &&
        featuresComparator(el.offer.features, propertiesObj.features));
    });
    if (filteredPins.length > NUMBER_OF_PINS) {
      filteredPins = getRandomArr(filteredPins);
    }
    return filteredPins;
  };
})();
