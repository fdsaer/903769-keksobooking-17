'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var NUMBER_OF_PINS = 5;

  var comparator = function (a, b) {
    return (a === b || b === 'any');
  };

  var guestsComparator = function (a, b) {
    var equal;
    if (b === '0' && a.toString(10) === b) {
      equal = true;
    } else if (b !== '0' && a >= parseInt(b, 10) || b === 'any') {
      equal = true;
    }
    return equal;
  };

  var priceComparator = function (a, b) {
    var equal;
    if (b === 'any') {
      equal = true;
    } else if (b === 'low' && a < LOW_PRICE) {
      equal = true;
    } else if (b === 'middle' && a >= LOW_PRICE && a <= HIGH_PRICE) {
      equal = true;
    } else if (b === 'high' && a > HIGH_PRICE) {
      equal = true;
    }
    return equal;
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
      return (comparator(el.offer.type, propertiesObj.housingType) &&
        guestsComparator(el.offer.guests, propertiesObj.housingGuests) &&
        priceComparator(el.offer.price, propertiesObj.housingPrice) &&
        comparator((el.offer.rooms).toString(10), propertiesObj.housingRooms));
    });
    if (filteredPins.length > NUMBER_OF_PINS) {
      filteredPins = getRandomArr(filteredPins);
    }
    return filteredPins;
  };
})();
