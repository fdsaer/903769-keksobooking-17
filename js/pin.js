'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  window.createPinElement = function (pinData) {
    var mapPin = pinTemplate.cloneNode(true);
    var avatarImg = mapPin.querySelector('img');
    mapPin.style = 'left: ' + (pinData.location.x - PIN_WIDTH / 2) + 'px; top: ' + (pinData.location.y - PIN_HEIGHT) + 'px;';
    avatarImg.src = pinData.author.avatar;
    avatarImg.alt = pinData.offer.type;
    return mapPin;
  };
})();
