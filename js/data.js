'use strict';

(function () {
  window.downloadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      xhr.timeout = 1000;
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(' статус ошибки ' + xhr.status + ' ' + xhr.statusText);
      }
      xhr.addEventListener('error', function () {
        onError(' статус ошибки ' + xhr.status + ' ' + xhr.statusText);
      });
      xhr.addEventListener('timeout', function () {
        onError(' запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });
    });
    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  };
})();
