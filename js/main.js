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

var getRandom = function (list) {
  var randomItem = Math.floor(Math.random() * list.length);
  return list[randomItem];
};

var getPinData = function (serialNumber) {
  var xPoint = Math.floor(Math.random() * mapWidth);
  var yPoint = Math.floor(Math.random() * (MAP_HEIGHT_MAX - MAP_HEIGHT_MIN + 1) + MAP_HEIGHT_MIN);
  return {
    'author': {
      'avatar': 'img/avatars/user0' + (serialNumber + 1) + '.png'
    },
    'offer': {
      'type': getRandom(HOUSE_TYPE)
    },
    'location': {
      'x': xPoint,
      'y': yPoint
    }
  };
};

var collectPins = function () {
  var pinsAround = [];
  for (var i = 0; i < NUMBER_OF_PINS; i++) {
    pinsAround[i] = getPinData(i);
  }
  return pinsAround;
};

pinsData = collectPins();

var createDomElement = function (objectData) {
  var mapPin = pinTemlate.cloneNode(true);
  var avatarImg = mapPin.querySelector('img');
  mapPin.style = 'left: ' + (objectData.location.x - PIN_WIDTH / 2) + 'px; top: ' + (objectData.location.y - PIN_HEIGHT) + 'px;';
  avatarImg.src = objectData.author.avatar;
  avatarImg.alt = objectData.offer.type;
  return mapPin;
};

for (var i = 0; i < pinsData.length; i++) {
  documentFragment.appendChild(createDomElement(pinsData[i]));
}

pinList.appendChild(documentFragment);
document.querySelector('.map').classList.remove('map--faded');
