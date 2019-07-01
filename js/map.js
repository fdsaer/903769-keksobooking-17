'use strict';

(function () {
  var MAP_HEIGHT_MAX = 630;
  var MAP_HEIGHT_MIN = 130;
  var MAIN_PIN_HEIGHT = 80;

  var documentFragment = document.createDocumentFragment();
  var map = document.querySelector('.map');
  var mapWidth = map.offsetWidth;
  var adForm = document.querySelector('.ad-form');
  var formElements = document.querySelectorAll('.map__filters fieldset, .map__filters select, .ad-form fieldset');
  var pinList = map.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');
  var mainPinWidth = mainPin.offsetWidth;
  var pageIsActive = false;
  var pinsRendered = false;
  var startingPoint = {
    x: parseInt(mainPin.style.left, 10),
    y: parseInt(mainPin.style.top, 10) + Math.round(mainPin.offsetHeight / 2) - MAIN_PIN_HEIGHT
  };

  var renderPins = function () {
    for (var i = 0; i < window.pinsData.length; i++) {
      documentFragment.appendChild(window.createPinElement(window.pinsData[i]));
    }
    pinList.appendChild(documentFragment);
    pinsRendered = true;
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

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!pageIsActive) {
      activatePage();
      window.setAddressField({
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
      window.setAddressField(finalCoordinates);
    };
    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
      if (!pinsRendered) {
        renderPins();
      }
    };
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  toggleDisabled(true);
  window.setAddressField(startingPoint);
})();
