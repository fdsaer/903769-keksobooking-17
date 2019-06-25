'use strict';

var MAP_HEIGHT_MAX = 630;
var MAP_HEIGHT_MIN = 130;
var NUMBER_OF_PINS = 8;
var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT = 80;
var HOUSE_PRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var map = document.querySelector('.map');
var pinList = map.querySelector('.map__pins');
var pinTemlate = document.querySelector('#pin').content.querySelector('.map__pin');
var documentFragment = document.createDocumentFragment();
var mapWidth = map.offsetWidth;
var pinsData = [];
var mainPin = pinList.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var startingPoint = [parseInt(mainPin.style.left, 10), parseInt(mainPin.style.top, 10) + mainPin.offsetHeight / 2 - MAIN_PIN_HEIGHT];
var formElements = document.querySelectorAll('.map__filters fieldset, .map__filters select, .ad-form fieldset');
var priceField = adForm.querySelector('input[name=price]');
var timeInField = adForm.querySelector('select[name=timein]');
var timeOutField = adForm.querySelector('select[name=timeout]');

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

var toggleDisabled = function (disabledValue) {
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].disabled = disabledValue;
  }
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  toggleDisabled(false);
};

var setAddressField = function (point) {
  var addressField = adForm.querySelector('input[name=address]');
  addressField.value = (point[0] + mainPin.offsetWidth / 2) + ',' + (point[1] + MAIN_PIN_HEIGHT);
};

var setTimeField = function (selectElement, value) {
  selectElement.value = value;
};

pinsData = getPinsData();

for (var i = 0; i < pinsData.length; i++) {
  documentFragment.appendChild(createPinElement(pinsData[i]));
}

toggleDisabled(true);
setAddressField(startingPoint);

mainPin.addEventListener('click', function () {
  activatePage();
  pinList.appendChild(documentFragment);
});

mainPin.addEventListener('mouseup', function (evt) {
  setAddressField([parseInt(evt.currentTarget.style.left, 10), parseInt(evt.currentTarget.style.top, 10)]);
});

adForm.querySelector('select[name=type]').addEventListener('change', function (evt) {
  priceField.placeholder = HOUSE_PRICE[evt.currentTarget.value];
  priceField.min = HOUSE_PRICE[evt.currentTarget.value];
});

timeInField.addEventListener('change', function () {
  setTimeField(timeOutField, timeInField.value);
});

timeOutField.addEventListener('change', function () {
  setTimeField(timeInField, timeOutField.value);
});
