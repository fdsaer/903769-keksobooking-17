'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 80;
  var HOUSE_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adForm = document.querySelector('.ad-form');
  var mainPinWidth = document.querySelector('.map__pin--main').offsetWidth;
  var timeInField = adForm.querySelector('select[name=timein]');
  var timeOutField = adForm.querySelector('select[name=timeout]');
  var houseTypeField = adForm.querySelector('select[name=type]');
  var priceField = adForm.querySelector('input[name=price]');

  window.setAddressField = function (point) {
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

  onTypeFieldClick();
})();
