'use strict';

(function () {
  var MAP_HEIGHT_MAX = 630;
  var MAP_HEIGHT_MIN = 130;
  var MAIN_PIN_HEIGHT = 80;
  var TIMEOUT = 500;

  var documentFragment = document.createDocumentFragment();
  var mainBlock = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var map = document.querySelector('.map');
  var mapWidth = map.offsetWidth;
  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters');
  var formElements = document.querySelectorAll('.map__filters fieldset, .map__filters select, .ad-form fieldset');
  var pinList = map.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');
  var mainPinWidth = mainPin.offsetWidth;
  var pageIsActive = false;
  var pinsRendered = false;
  var mapHouseFilters = mapFilters.querySelectorAll('select');
  var mapHouseFeatures = mapFilters.querySelectorAll('input');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var lastTimeout;
  var mainPinTailHeight = Math.round(mainPin.offsetHeight / 2) - MAIN_PIN_HEIGHT;
  var startingPoint = {
    x: parseInt(mainPin.style.left, 10),
    y: parseInt(mainPin.style.top, 10) + mainPinTailHeight
  };
  var filterProperties;
  var pinsData = [];

  var closeCard = function () {
    var card = map.querySelector('.map__card');
    var pin = map.querySelector('.map__pin--active');
    if (card) {
      map.removeChild(card);
      pin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardKeyDownEvent);
    }
  };

  var onMessageKeyDownEvent = function (evt) {
    onEscEvent(evt, closeMessage);
  };

  var onCardKeyDownEvent = function (evt) {
    onEscEvent(evt, closeCard);
  };

  var onEscEvent = function (evt, action) {
    if (evt.keyCode === 27) {
      action();
    }
  };

  var renderCard = function (data) {
    closeCard();
    var card = window.createCardElement(data);
    document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);
    var closePopupButton = map.querySelector('.map__card .popup__close');
    closePopupButton.addEventListener('click', closeCard);
    document.addEventListener('keydown', onCardKeyDownEvent);
  };

  var addListener = function (pin, pinData) {
    pin.addEventListener('click', function () {
      renderCard(pinData);
      pin.classList.add('map__pin--active');
    });
  };

  var deletePins = function () {
    var similarPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < similarPins.length; i++) {
      pinList.removeChild(similarPins[i]);
    }
    pinsRendered = false;
  };

  var renderPins = function (pinsToRender) {
    deletePins();
    if (pinsToRender.length) {
      for (i = 0; i < pinsToRender.length; i++) {
        documentFragment.appendChild(window.createPinElement(pinsToRender[i]));
      }
      pinList.appendChild(documentFragment);
      pinsRendered = true;
      var similarPins = pinList.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (i = 0; i < similarPins.length; i++) {
        addListener(similarPins[i], pinsToRender[i]);
      }
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
    var toggle;
    var newStr = str.slice(str.indexOf('-') + 1);
    var selectorName = '#housing-' + newStr;
    toggle = mapFilters.querySelector(selectorName);
    newStr = newStr.replace(newStr[0], newStr[0].toUpperCase());
    filter['housing' + newStr] = toggle.value;
    closeCard();
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
    closeCard();
    debounce(function () {
      renderPins(window.filterData(pinsData, filter));
    });
  };

  var onDownloadSuccess = function (serverData) {
    pinsData = serverData;
    renderPins(window.filterData(pinsData, filterProperties));
  };

  var closeMessage = function () {
    var type = mainBlock.querySelector('.success') ? 'success' : 'error';
    var messageBlock;
    if (type === 'success') {
      messageBlock = mainBlock.querySelector('.success');
      activatePage(false);
    } else {
      messageBlock = mainBlock.querySelector('.error');
    }
    document.removeEventListener('click', closeMessage);
    document.removeEventListener('keydown', onMessageKeyDownEvent);
    mainBlock.removeChild(messageBlock);
  };

  var onLoadError = function (errorStatus) {
    var errorModule = errorTemplate.cloneNode(true);
    var errorModuleMessage = errorModule.querySelector('.error__message');
    var tryAgainButton = errorModule.querySelector('.error__button');
    errorModuleMessage.textContent = errorStatus;
    mainBlock.appendChild(errorModule);
    tryAgainButton.addEventListener('click', closeMessage);
    document.addEventListener('click', closeMessage);
    document.addEventListener('keydown', onMessageKeyDownEvent);
  };

  var onUploadSuccess = function () {
    var successModule = successTemplate.cloneNode(true);
    mainBlock.appendChild(successModule);
    document.addEventListener('click', closeMessage);
    document.addEventListener('keydown', onMessageKeyDownEvent);
  };

  var toggleDisabled = function (disabledValue) {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = disabledValue;
    }
  };

  var activatePage = function (activateValue) {
    var toDo = 'remove';
    if (!activateValue) {
      toDo = 'add';
      closeCard();
      deletePins();
      adForm.reset();
      mapFilters.reset();
      window.setAddressField(startingPoint);
      mainPin.style.left = startingPoint.x + 'px';
      mainPin.style.top = startingPoint.y - mainPinTailHeight + 'px';
    } else {
      filterProperties = {
        housingType: mapFilters.querySelector('#housing-type').value,
        housingRooms: mapFilters.querySelector('#housing-rooms').value,
        housingGuests: mapFilters.querySelector('#housing-guests').value,
        housingPrice: mapFilters.querySelector('#housing-price').value,
        features: []
      };
    }
    map.classList[toDo]('map--faded');
    adForm.classList[toDo]('ad-form--disabled');
    toggleDisabled(!activateValue);
    pageIsActive = activateValue;
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (!pageIsActive) {
      activatePage(true);
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
        window.workWithServer.downloadData(onDownloadSuccess, onLoadError);
      }
    };
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  resetButton.addEventListener('mouseup', function () {
    activatePage(false);
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.workWithServer.uploadData(new FormData(adForm), onUploadSuccess, onLoadError);
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
