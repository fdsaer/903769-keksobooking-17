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
var startingPoint = {
  x: parseInt(mainPin.style.left, 10),
  y: parseInt(mainPin.style.top, 10) + Math.round(mainPin.offsetHeight / 2) - MAIN_PIN_HEIGHT
};
var formElements = document.querySelectorAll('.map__filters fieldset, .map__filters select, .ad-form fieldset');
var priceField = adForm.querySelector('input[name=price]');
var timeInField = adForm.querySelector('select[name=timein]');
var timeOutField = adForm.querySelector('select[name=timeout]');
var houseTypeField = adForm.querySelector('select[name=type]');
var mainPinWidth = mainPin.offsetWidth;
var pageIsActive = false;

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
  pageIsActive = true;
};

var setAddressField = function (point) {
  var addressField = adForm.querySelector('input[name=address]');
  addressField.value = (point.x + Math.round(mainPinWidth / 2)) + ',' + (point.y + MAIN_PIN_HEIGHT);
};

var setTimeField = function (selectElement, value) {
  selectElement.value = value;
};

var onTypeFieldClick = function () {
  priceField.placeholder = HOUSE_PRICE[houseTypeField.value];
  priceField.min = HOUSE_PRICE[houseTypeField.value];
};

houseTypeField.addEventListener('change', onTypeFieldClick);

timeInField.addEventListener('change', function () {
  setTimeField(timeOutField, timeInField.value);
});

timeOutField.addEventListener('change', function () {
  setTimeField(timeInField, timeOutField.value);
});

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  if (!pageIsActive) {
    activatePage();
    setAddressField({
      x: parseInt(mainPin.style.left, 10),
      y: parseInt(mainPin.style.top, 10)
    });
  }
  var startingCoordinates = {
    x: evt.clientX,
    y: evt.clientY
  };
  var xOffset = Math.round(mainPinWidth / 2);
  var currentX;
  var currentY;
  var yTopRange = 0;
  var yBottomRange = Infinity;
  var onDocumentMouseMove = function (moveEvt) {
    evt.preventDefault();
    if (moveEvt.clientX > map.offsetLeft && moveEvt.clientX < map.offsetLeft + mapWidth) {
      currentX = moveEvt.clientX;
    }
    if (moveEvt.clientY > yTopRange && moveEvt.clientY < yBottomRange) {
      currentY = moveEvt.clientY;
    }
    var shift = {
      x: startingCoordinates.x - currentX,
      y: startingCoordinates.y - currentY
    };
    startingCoordinates = {
      x: currentX,
      y: currentY
    };
    var finalCoordinates = {
      x: parseInt(mainPin.style.left, 10) - shift.x,
      y: parseInt(mainPin.style.top, 10) - shift.y
    };
    mainPin.style.left = finalCoordinates.x + 'px';
    if (finalCoordinates.x < -xOffset) {
      mainPin.style.left = -xOffset + 'px';
      currentX = map.offsetLeft;
    } else if (finalCoordinates.x > mapWidth - xOffset) {
      mainPin.style.left = mapWidth - xOffset + 'px';
      currentX = map.offsetLeft + mapWidth;
    }
    mainPin.style.top = finalCoordinates.y + 'px';
    if (finalCoordinates.y < MAP_HEIGHT_MIN - MAIN_PIN_HEIGHT) {
      mainPin.style.top = MAP_HEIGHT_MIN - MAIN_PIN_HEIGHT + 'px';
      yTopRange = currentY;
      currentY = yTopRange;
    } else if (finalCoordinates.y > MAP_HEIGHT_MAX - MAIN_PIN_HEIGHT) {
      mainPin.style.top = MAP_HEIGHT_MAX - MAIN_PIN_HEIGHT + 'px';
      yBottomRange = currentY;
      currentY = yBottomRange;
    }
    setAddressField(finalCoordinates);
  };
  var onMainPinMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
    pinList.appendChild(documentFragment);
  };
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onMainPinMouseUp);
});

onTypeFieldClick();

pinsData = getPinsData();

for (var i = 0; i < pinsData.length; i++) {
  documentFragment.appendChild(createPinElement(pinsData[i]));
}

toggleDisabled(true);
setAddressField(startingPoint);
