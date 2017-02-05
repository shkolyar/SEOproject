'use strict'

function sentPostRequest() {
  var formData = new FormData();


  formData.append('host', 'https://yandex.ru');
  formData.append('query', 'сайт яндекса');


  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/position');


  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    console.log('Готово!');

    if (xhr.status != 200) {
      console.log('Ошибка!');
    } else {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
      sentGetRequest(data);
    }
  }

  xhr.send(formData);
}

sentPostRequest();

function sentGetRequest(data) {

  var xhr = new XMLHttpRequest();
  var param = 'tid=' + encodeURIComponent(data.tid);

  xhr.open('GET', '/position?' + param, true);

  xhr.onreadystatechange = function() {
    if (this.readyState != 4) {
      return;
    }

    if (xhr.status != 200) {
      console.log('Ошибка!');
    } else {
      var request = JSON.parse(xhr.responseText);
      console.log(request);
    }
  }

  xhr.send();
}


