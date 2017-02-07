"use strict";

//мышка и реакция на клавиатуру
//тач

var form = document.querySelector('.form');
form.addEventListener('submit', submitForm);

var checkboxInputs = document.querySelectorAll('.field-checkbox__input');

var blockSearchSystem = document.querySelector('.form__step-inner--seach-system');


function submitForm(event) {
  if ( !validCheckbox() ) {
    event.preventDefault();
    showCheckboxError();
    return false;
  }

  if ( !validUrl() ) {
    event.preventDefault();
    return false;
  }

  sentPostRequestForm();
  // return true;
}

function showCheckboxError() {
  var message = blockSearchSystem.querySelector('.note--error');
  if ( !message ) {
    var errorMessage = document.createElement('p');
    errorMessage.className = 'note  note--error';
    errorMessage.innerHTML = 'Выберите минимум одну поисковую систему';
    blockSearchSystem.appendChild(errorMessage);
    console.log('checkbox invalid');
  }
}

function validCheckbox() {
  var sum = 0;
  for ( var i = 0; i < checkboxInputs.length; i++ ) {
    if (!(checkboxInputs[i].checked)) {
      sum = sum + 1;
    }
  }

  if (sum === checkboxInputs.length) {
    return false;
  } else {
    return true;
  }
}

function validUrl() {
  var inputUrl = document.getElementById('text-field-url');
  var adress = inputUrl.value;
  var link = document.createElement('a');
  link.setAttribute('href', adress);
  var domen = window.location.host;
  var linkHref = link.getAttribute('href');
  var symbolsIndex = link.protocol.length + 2;

  if ( domen === link.host ) {
    console.log('it\'s not ok');
    return false;
  }

  if ( link.username !== '' ) {
    console.log('it\'s not ok');
    return false;
  }

  if ( linkHref.indexOf('@') === symbolsIndex ) {
    console.log('it\'s not ok');
    return false;
  }

  if ( link.protocol !== 'http:' && link.protocol !== 'https:' && link.protocol !== 'ftp:' ) {
    console.log('it\'s not ok');
    return false;
  }

  return true;
}

// function checkURL(adress) {
//   var link = document.createElement('a');
//   link.setAttribute('href', adress);
//   var domen = window.location.host;
//   var linkHref = link.getAttribute('href');
//   var symbolsIndex = link.protocol.length + 2;
//   console.log(link.href, link.protocol);

//   if ( domen === link.host ) {
//     console.log('it\'s not ok');
//     return false;
//   }

//   if ( link.username !== '' ) {
//     console.log('it\'s not ok');
//     return false;
//   }

//   if ( linkHref.indexOf('@') === symbolsIndex ) {
//     console.log('it\'s not ok');
//     return false;
//   }

//   if ( link.protocol !== 'http:' && link.protocol !== 'https:' && link.protocol !== 'ftp:' ) {
//     console.log('it\'s not ok');
//     return false;
//   }

//   return true;
// }

// function test() {
//   var array = [
//   'http://userid@example.com:8080',
//   'http://@example.com:8080',
//   '123',
//   'http://➡.ws/䨹',
//   "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
//   'http://',
//   'http://foo.bar?q=Spaces should be encoded',
//   'http://10.1.1.0'
//   ];
//   for ( var i = 0; i < array.length; i++ ) {
//     if ( checkURL(array[i]) === true ) {
//     }
//   }
// }
