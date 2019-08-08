'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 80;
  var FILE_TYPES = ['.gif', '.jpg', '.jpeg', '.png'];
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
  var roomsField = adForm.querySelector('select[name=rooms]');
  var guestsField = adForm.querySelector('select[name=capacity]');
  var guestsOption = guestsField.querySelectorAll('option');
  var previewAvatar = adForm.querySelector('.ad-form-header__preview img');
  var avatarChooser = adForm.querySelector('.ad-form-header__input');
  var previewHousePhotoContainer = adForm.querySelector('.ad-form__photo-container');
  var previewHouseBlock = previewHousePhotoContainer.querySelector('.ad-form__photo');
  var housePhotoChooser = previewHousePhotoContainer.querySelector('.ad-form__input');

  window.setAddressField = function (pointData) {
    var addressField = adForm.querySelector('input[name=address]');
    addressField.value = (pointData.x + Math.round(mainPinWidth / 2)) + ',' + (pointData.y + MAIN_PIN_HEIGHT);
  };

  var setTimeField = function (selectElement, value) {
    selectElement.value = value;
  };

  var onTypeFieldClick = function () {
    priceField.placeholder = HOUSE_PRICE[houseTypeField.value];
    priceField.min = HOUSE_PRICE[houseTypeField.value];
  };

  var checkValidity = function (rooms) {
    if (parseInt(rooms, 10) < parseInt(guestsField.value, 10)) {
      guestsField.setCustomValidity('Гостей не должно быть больше чем комнат!');
    } else {
      guestsField.setCustomValidity('');
    }
  };

  var checkCapacity = function (rooms) {
    for (var i = 0; i < guestsOption.length; i++) {
      guestsOption[i].disabled = false;
      if (parseInt(rooms, 10) < parseInt(guestsOption[i].value, 10)) {
        guestsOption[i].disabled = true;
      }
    }
  };

  var onRoomFieldChange = function (rooms) {
    checkCapacity(rooms);
    checkValidity(rooms);
  };

  var renderNewPreviewPhoto = function () {
    var newImg;
    var previewHouseImg = previewHouseBlock.querySelector('img');
    if (!previewHouseImg) {
      newImg = document.createElement('img');
      previewHouseBlock.appendChild(newImg);
    } else {
      var newDiv = previewHouseBlock.cloneNode(true);
      previewHousePhotoContainer.appendChild(newDiv);
      newImg = newDiv.querySelector('img');
    }
    newImg.alt = 'Фото жилья';
    newImg.width = 70;
    newImg.height = 70;
  };

  var renderPreview = function (chooser, aim) {
    var file = chooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        aim.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  houseTypeField.addEventListener('change', onTypeFieldClick);

  timeInField.addEventListener('change', function () {
    setTimeField(timeOutField, timeInField.value);
  });

  timeOutField.addEventListener('change', function () {
    setTimeField(timeInField, timeOutField.value);
  });

  roomsField.addEventListener('change', function () {
    onRoomFieldChange(roomsField.value);
  });

  guestsField.addEventListener('change', function () {
    checkValidity(roomsField.value);
  });

  avatarChooser.addEventListener('change', function () {
    renderPreview(avatarChooser, previewAvatar);
  });

  housePhotoChooser.addEventListener('change', function () {
    var previewImg;
    renderNewPreviewPhoto();
    previewImg = previewHousePhotoContainer.querySelector('.ad-form__photo img');
    renderPreview(housePhotoChooser, previewImg);
  });

  onRoomFieldChange(roomsField.value);
  onTypeFieldClick();
})();
