'use strict';

(function () {
  var NUMBER_OF_PINS = 8;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinsData = [];
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  window.documentFragment = document.createDocumentFragment();

  var getPinsData = function () {
    var pinsAround = [];
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      pinsAround[i] = window.getPinData(i);
    }
    return pinsAround;
  };

  var createPinElement = function (pictureData) {
    var mapPin = pinTemplate.cloneNode(true);
    var avatarImg = mapPin.querySelector('img');
    mapPin.style = 'left: ' + (pictureData.location.x - PIN_WIDTH / 2) + 'px; top: ' + (pictureData.location.y - PIN_HEIGHT) + 'px;';
    avatarImg.src = pictureData.author.avatar;
    avatarImg.alt = pictureData.offer.type;
    return mapPin;
  };

  pinsData = getPinsData();

  for (var i = 0; i < pinsData.length; i++) {
    window.documentFragment.appendChild(createPinElement(pinsData[i]));
  }
})();
