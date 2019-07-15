'use strict';

(function () {
  window.workWithServer = {
    downloadData: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Ошибка загрузки данных, статус ошибки ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка загрузки данных при подключении к серверу');
      });
      xhr.addEventListener('timeout', function () {
        onError('Ошибка загрузки данных, запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });
      xhr.timeout = 1000;
      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    },

    uploadData: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Ошибка загрузки объявления, статус ошибки ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    }

  };
})();
