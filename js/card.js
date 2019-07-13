'use strict';
(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var documentFragment = document.createDocumentFragment();
  var typeDictionary = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var suffixDictionary = {
    room: ['', 'а', 'ы'],
    guest: ['ей', 'я', 'ей']
  };

  var guestsTranslator = function (number, key) {
    var suffix = suffixDictionary[key][0];
    var lastNumber = parseInt(number.toString(10)[number.toString(10).length - 1], 10);
    var preLastNumber = parseInt(number.toString(10)[number.toString(10).length - 2], 10);
    if (lastNumber === 1 && preLastNumber !== 1) {
      suffix = suffixDictionary[key][1];
    } else if (lastNumber >= 2 && lastNumber <= 4 && preLastNumber !== 1) {
      suffix = suffixDictionary[key][2];
    }
    return suffix;
  };

  window.createCardElement = function (pinData) {
    var mapCard = cardTemplate.cloneNode(true);
    var cardTitle = mapCard.querySelector('.popup__title');
    var cardAddress = mapCard.querySelector('.popup__text--address');
    var cardPrice = mapCard.querySelector('.popup__text--price');
    var cardType = mapCard.querySelector('.popup__type');
    var cardGuests = mapCard.querySelector('.popup__text--capacity');
    var cardTime = mapCard.querySelector('.popup__text--time');
    var cardFeaturesBlock = mapCard.querySelector('.popup__features');
    var cardDescription = mapCard.querySelector('.popup__description');
    var cardPhotosBlock = mapCard.querySelector('.popup__photos');
    var cardPhoto = cardPhotosBlock.querySelector('.popup__photo');
    var cardAvatar = mapCard.querySelector('.popup__avatar');

    cardFeaturesBlock.innerHTML = '';
    pinData.offer.features.forEach(function (it) {
      var newElement = document.createElement('li');
      documentFragment.appendChild(newElement);
      newElement.classList.add('popup__feature', 'popup__feature--' + it);
    });
    cardFeaturesBlock.appendChild(documentFragment);

    for (var i = 0; i < pinData.offer.photos.length; i++) {
      var newPhoto = cardPhoto.cloneNode(false);
      documentFragment.appendChild(newPhoto);
      newPhoto.src = pinData.offer.photos[i];
    }
    cardPhotosBlock.removeChild(cardPhoto);
    cardPhotosBlock.appendChild(documentFragment);

    cardAvatar.src = pinData.author.avatar;
    cardTitle.textContent = pinData.offer.title;
    cardAddress.textContent = pinData.offer.address;
    cardPrice.innerHTML = pinData.offer.price + String.fromCharCode(8381) + '<span>/ночь</span>';
    cardType.textContent = typeDictionary[pinData.offer.type];
    cardGuests.textContent = pinData.offer.rooms + ' комнат' +
      guestsTranslator(pinData.offer.rooms, 'room') + ' для ' +
      pinData.offer.guests + ' гост' +
      guestsTranslator(pinData.offer.rooms, 'guest');
    cardTime.textContent = 'Заезд после ' + pinData.offer.checkin + ' , выезд до ' + pinData.offer.checkout;
    cardDescription.textContent = pinData.offer.description;
    return mapCard;
  };
})();
