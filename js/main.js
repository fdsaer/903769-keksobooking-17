'use strict';

var MAP_HEIGHT_MAX = 630;
var MAP_HEIGHT_MIN = 130;
var NUMBER_OF_PINS = 8;
var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT = 84;

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var pinTemlate = document.querySelector('#pin').content.querySelector('.map__pin');
var documentFragment = document.createDocumentFragment();
var mapWidth = map.offsetWidth;
var pinsData = [];
var mainPin = pinList.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var startingPoint = [parseInt(mainPin.style.left, 10), parseInt(mainPin.style.top, 10) + mainPin.offsetHeight / 2 - MAIN_PIN_HEIGHT];

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

var createPinElement = function (pictureData) {
  var mapPin = pinTemlate.cloneNode(true);
  var avatarImg = mapPin.querySelector('img');
  mapPin.style = 'left: ' + (pictureData.location.x - PIN_WIDTH / 2) + 'px; top: ' + (pictureData.location.y - PIN_HEIGHT) + 'px;';
  avatarImg.src = pictureData.author.avatar;
  avatarImg.alt = pictureData.offer.type;
  return mapPin;
};

var setElementsAttribute = function (selectorList, attribute) {
  for (var i = 0; i < selectorList.length; i++) {
    var elementList = document.querySelectorAll(selectorList[i]);
    for (var j = 0; j < elementList.length; j++) {
      if (attribute === 'enabled') {
        elementList[j].removeAttribute('disabled', 'disabled');
      } else if (attribute === 'disabled') {
        elementList[j].setAttribute(attribute, attribute);
      }
    }
  }
};

var activatePage = function () {
  document.querySelector('.map').classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setElementsAttribute(['.map__filters fieldset', '.map__filters select', '.ad-form fieldset'], 'enabled');
};

var setAddressField = function (point) {
  var addressField = adForm.querySelector('input[name=address]');
  addressField.value = (point[0] + mainPin.offsetWidth / 2) + ',' + (point[1] + MAIN_PIN_HEIGHT);
};

pinsData = getPinsData();

for (var i = 0; i < pinsData.length; i++) {
  documentFragment.appendChild(createPinElement(pinsData[i]));
}

setElementsAttribute(['.map__filters fieldset', '.map__filters select', '.ad-form fieldset'], 'disabled');
setAddressField(startingPoint);

mainPin.addEventListener('click', function () {
  activatePage();
  pinList.appendChild(documentFragment);
});

mainPin.addEventListener('mouseup', function () {
  setAddressField(['xxx', 'yyy']);
});
