'use strict';

(function () {
  var NUMBER_OF_PINS = 8;
  var MAP_HEIGHT_MAX = 630;
  var MAP_HEIGHT_MIN = 130;
  var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];

  var mapWidth = document.querySelector('.map').offsetWidth;

  var getRandomArrayItem = function (arr) {
    var randomItem = Math.floor(Math.random() * arr.length);
    return arr[randomItem];
  };

  var getPinData = function (index) {
    var xPoint = Math.floor(Math.random() * mapWidth);
    var yPoint = Math.floor(Math.random() * (MAP_HEIGHT_MAX - MAP_HEIGHT_MIN + 1) + MAP_HEIGHT_MIN);
    return {
      'author': {
        'avatar': 'img/avatars/user0' + (index + 1) + '.png'
      },
      'offer': {
        'type': getRandomArrayItem(HOUSE_TYPE)
      },
      'location': {
        'x': xPoint,
        'y': yPoint
      }
    };
  };

  var getPinsData = function () {
    var pinsAround = [];
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      pinsAround[i] = getPinData(i);
    }
    return pinsAround;
  };

  window.pinsData = getPinsData();
})();
