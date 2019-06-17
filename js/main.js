'use strict';

var MAP_HEIGHT_MAX = 630;
var MAP_HEIGHT_MIN = 130;
var NUMBER_OF_PINS = 8;
var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var pinList = document.querySelector('.map__pins');
var pinTemlate = document.querySelector('#pin').content.querySelector('.map__pin');
var documentFragment = document.createDocumentFragment();
var mapWidth = pinList.offsetWidth;
var pinsData = [];

var getRandom = function (arr) {
  var randomItem = Math.floor(Math.random() * arr.length);
  return arr[randomItem];
};

var getPinsData = function () {
  var pinsAround = [];
  for (var i = 0; i < NUMBER_OF_PINS; i++) {
    var xPoint = Math.floor(Math.random() * mapWidth);
    var yPoint = Math.floor(Math.random() * (MAP_HEIGHT_MAX - MAP_HEIGHT_MIN + 1) + MAP_HEIGHT_MIN);
    pinsAround[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'type': getRandom(HOUSE_TYPE)
      },
      'location': {
        'x': xPoint,
        'y': yPoint
      }
    };
  }
  return pinsAround;
};

pinsData = getPinsData();

var getPins = function (arr) {
  var mapPin = pinTemlate.cloneNode(true);
  var avatarImg = mapPin.querySelector('img');
  mapPin.style = 'left: ' + (arr.location.x - PIN_WIDTH / 2) + 'px; top: ' + (arr.location.y - PIN_HEIGHT) + 'px;';
  avatarImg.src = arr.author.avatar;
  avatarImg.alt = arr.offer.type;
  return mapPin;
};

for (var i = 0; i < NUMBER_OF_PINS; i++) {
  documentFragment.appendChild(getPins(pinsData[i]));
}

pinList.appendChild(documentFragment);
document.querySelector('.map').classList.remove('map--faded');
