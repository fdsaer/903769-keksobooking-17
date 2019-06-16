'use strict';

var MAP_WIDTH = 1200;
var MAP_HEIGHT_MAX = 630;
var MAP_HEIGHT_MIN = 130;
var NUMBER_OF_PINS = 8;

var pinList = document.querySelector('.map__pins');
var houseType = ['palace', 'flat', 'house', 'bungalo'];
var pinTemlate = document.querySelector('#pin').content.querySelector('.map__pin');
var documentFragment = document.createDocumentFragment();

var getRandom = function (arr) {
  var randomItem = Math.floor(Math.random() * arr.length);
  return arr[randomItem];
};

var getPinsData = function () {
  var pinsAround = [];
  for (var i = 0; i < NUMBER_OF_PINS; i++) {
    var xPoint = Math.floor(Math.random() * MAP_WIDTH);
    var yPoint = Math.floor(Math.random() * (MAP_HEIGHT_MAX - MAP_HEIGHT_MIN + 1) + MAP_HEIGHT_MIN);
    pinsAround[i] = {'author': {'avatar': 'img/avatars/user0' + (i + 1) + '.png'},
      'offer': {'type': getRandom(houseType)},
      'location': {'x': xPoint, 'y': yPoint}
    };
  }
  return pinsAround;
};

var getPins = function (a) {
  var mapPin = pinTemlate.cloneNode(true);
  mapPin.style = 'left: ' + (getPinsData()[a].location.x - 25) + 'px; top: ' + (getPinsData()[0].location.y - 70) + 'px;';
  mapPin.querySelector('img').src = getPinsData()[a].author.avatar;
  mapPin.querySelector('img').alt = getPinsData()[a].offer.type;
  return mapPin;
};

for (var i = 0; i < NUMBER_OF_PINS; i++) {
  documentFragment.appendChild(getPins(i));
}

pinList.appendChild(documentFragment);
document.querySelector('.map').classList.remove('map--faded');
