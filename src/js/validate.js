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
  } else {
    console.log('checkbox valid');
    form.submit();
  }
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
      sum =+ 1;
    }
  }

  if (sum = checkboxInputs.length) {
    return false;
  } else {
    return true;
  }
}
