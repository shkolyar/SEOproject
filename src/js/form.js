'use strict';

var radioEnterHand = document.getElementById('enter-type-1');
var radioEnterCopypaste = document.getElementById('enter-type-2');

var blockinputEnterHand = document.getElementById('step-enter-1');
var blockEnterCopypaste = document.getElementById('step-enter-2');

var inputUrl = document.getElementById('text-field-url');
inputUrl.required = true;

var inputForOneKeyword = document.getElementById('text-field-keyword');
var inputForKeywords = document.getElementById('textarea-keywords');

var form = document.querySelector('.form');
form.addEventListener('submit', submitForm);

var btnNewKeyword = document.querySelector('.btn--new-keyword');

btnNewKeyword.addEventListener('click', showInput);

var checkboxInputs = document.querySelectorAll('.field-checkbox__input');
var btnSubmitForm = document.querySelector('.btn--submit-form');

function showInput() {
  var blockForInputs = blockinputEnterHand.querySelector('.field-text--keyword');
  console.log(blockinputEnterHand);
  console.log(blockForInputs);
  var inputOneKey = blockForInputs.querySelector('.field-text__input-wrap');
  console.log(inputOneKey);
  var elements = blockForInputs.querySelectorAll('.field-text__input-wrap');
  if ( elements.length < 5 ) {
    var inputClone = inputOneKey.cloneNode('true');
    blockForInputs.appendChild(inputClone);
  }
}

radioEnterHand.onclick = function() {
  blockinputEnterHand.classList.toggle('form__step--hide');
  blockEnterCopypaste.classList.toggle('form__step--hide');
  setRequired();
}

radioEnterCopypaste.onclick = function() {
  blockinputEnterHand.classList.toggle('form__step--hide');
  blockEnterCopypaste.classList.toggle('form__step--hide');
  setRequired();
}

function setRequired() {
  var elements = [];
  elements.push(blockinputEnterHand, blockEnterCopypaste);
  console.log(elements);
  for ( var i = 0; i < elements.length; i ++ ) {
    if ( !(elements[i].classList.contains('form__step--hide')) ) {
      console.log(" не содержит класс");
      console.log(elements[i]);
      console.log(elements[i].querySelector('.field-text__input--required'));
      elements[i].querySelector('.field-text__input--required').setAttribute('required', 'required');
    }

    if ( elements[i].classList.contains('form__step--hide') ) {
      console.log("содержит класс");
      console.log(elements[i]);
      console.log(elements[i].querySelector('.field-text__input--required'));
      elements[i].querySelector('.field-text__input--required').removeAttribute('required');
    }
  }
}

function submitForm(event) {
  if ( validCheckbox() ) {
    console.log('checkbox valid');
  } else {
    event.preventDefault();
    return false;
    //СООБЩЕНИЕ ДОБАВИТЬ
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
    //СООБЩЕНИЕ ДОБАВИТЬ
  } else {
    return true;
  }
}
