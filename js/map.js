'use strict';

(function () {
  var MAP_HEIGHT_MAX = 630;
  var MAP_HEIGHT_MIN = 130;
  var MAIN_PIN_HEIGHT = 80;
  var TIMEOUT = 500;

  var documentFragment = document.createDocumentFragment();
  var mainBlock = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var map = document.querySelector('.map');
  var mapWidth = map.offsetWidth;
  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters');
  var formElements = document.querySelectorAll('.map__filters fieldset, .map__filters select, .ad-form fieldset');
  var pinList = map.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');
  var similarPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
  var mainPinWidth = mainPin.offsetWidth;
  var pageIsActive = false;
  var pinsRendered = false;
  var mapHouseFilters = mapFilters.querySelectorAll('select');
  var mapHouseFeatures = mapFilters.querySelectorAll('input');
  var lastTimeout;
  var startingPoint = {
    x: parseInt(mainPin.style.left, 10),
    y: parseInt(mainPin.style.top, 10) + Math.round(mainPin.offsetHeight / 2) - MAIN_PIN_HEIGHT
  };
  var filterProperties = {
    housingType: mapFilters.querySelector('#housing-type').value,
    housingRooms: mapFilters.querySelector('#housing-rooms').value,
    housingGuests: mapFilters.querySelector('#housing-guests').value,
    housingPrice: mapFilters.querySelector('#housing-price').value,
    features: []
  };
  var pinsData = [];


  var closeCard = function () {
    var card = map.querySelector('.map__card');
    if (card) {
      map.removeChild(card);
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === 27) {
      closeCard();
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var renderCard = function (data) {
    closeCard();
    var card = window.createCardElement(data);
    document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);
    var closePopupButton = map.querySelector('.map__card .popup__close');
    closePopupButton.addEventListener('click', closeCard);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var addListener = function (pin, pinData) {
    pin.addEventListener('click', function () {
      renderCard(pinData);
    });
  };

  var renderPins = function (pinsToRender) {
    similarPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < similarPins.length; i++) {
      pinList.removeChild(similarPins[i]);
    }
    for (i = 0; i < pinsToRender.length; i++) {
      documentFragment.appendChild(window.createPinElement(pinsToRender[i]));
    }
    pinList.appendChild(documentFragment);
    pinsRendered = true;
    similarPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (i = 0; i < similarPins.length; i++) {
      addListener(similarPins[i], pinsToRender[i]);
    }
  };

  var debounce = function (instruction) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(instruction, TIMEOUT);
  };

  var onFilterChange = function (changeEvt, filter) {
    var str = changeEvt.currentTarget.name;
    var selectorName;
    var toggle;
    var newStr = str.slice(str.indexOf('-') + 1);
    selectorName = '#housing-' + newStr;
    toggle = mapFilters.querySelector(selectorName);
    newStr = newStr.replace(newStr[0], newStr[0].toUpperCase());
    filter['housing' + newStr] = toggle.value;
    debounce(function () {
      renderPins(window.filterData(pinsData, filter));
    });
  };

  var onFeaturesChange = function (changeEvt, filter) {
    var list = mapHouseFeatures;
    filter.features = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked) {
        filter.features.push(list[i].value);
      }
    }
    debounce(function () {
      renderPins(window.filterData(pinsData, filter));
    });
  };

  var successHandler = function (serverData) {
    pinsData = serverData;
    renderPins(window.filterData(pinsData, filterProperties));
  };

  var errorHandler = function (errorStatus) {
    var errorModule = errorTemplate.cloneNode(true);
    var errorModuleMessage = errorModule.querySelector('.error__message');
    var errorTryAgain = errorModule.querySelector('.error__button');
    var messageText = errorModuleMessage.textContent + errorStatus;
    var tryHandler = function () {
      errorTryAgain.removeEventListener('click', tryHandler);
      mainBlock.removeChild(errorModule);
      window.downloadData(successHandler, errorHandler);
    };
    errorModuleMessage.textContent = messageText;
    mainBlock.appendChild(errorModule);
    errorTryAgain.addEventListener('click', tryHandler);
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
        window.downloadData(successHandler, errorHandler);
      }
    };
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  for (var i = 0; i < mapHouseFilters.length; i++) {
    mapHouseFilters[i].addEventListener('change', function (evt) {
      onFilterChange(evt, filterProperties);
    });
  }

  for (i = 0; i < mapHouseFeatures.length; i++) {
    mapHouseFeatures[i].addEventListener('change', function (evt) {
      onFeaturesChange(evt, filterProperties);
    });
  }

  toggleDisabled(true);
  window.setAddressField(startingPoint);
})();
