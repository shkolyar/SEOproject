'use strict';

var radioEnterHand = document.getElementById('enter-type-1');
var radioEnterCopypaste = document.getElementById('enter-type-2');

var blockinputEnterHand = document.getElementById('step-enter-1');
var blockEnterCopypaste = document.getElementById('step-enter-2');

var inputUrl = document.getElementById('text-field-url');
inputUrl.required = true;

var inputForOneKeyword = document.getElementById('text-field-keyword');
var inputForKeywords = document.getElementById('textarea-keywords');

var textarea = document.querySelector('.field-text__textarea');
textarea.addEventListener('input', calcEnterWords);
// textarea.addEventListener('focus', showWordsCount);

document.addEventListener('DOMContentLoaded', showInputMessage);

var btnNewKeyword = document.querySelector('.btn--new-keyword');
var btnDeleteKeyword = document.querySelector('.btn--delete-keyword');

var btnScroll = document.querySelector('.btn--scroll');
btnScroll.addEventListener('click', scrollToForm);

btnNewKeyword.addEventListener('click', showInput);
btnDeleteKeyword.addEventListener('click', deleteInput);

function showInput() {
  var blockForInputs = blockinputEnterHand.querySelector('.field-text--keyword');
  var inputOneKey = blockForInputs.querySelector('.field-text__input-wrap');
  var elements = blockForInputs.querySelectorAll('.field-text__input-wrap');
  var input = blockForInputs.querySelector('.field-text__input');
  var inputData = input.dataset;
  var wordCount = inputData.wordCount;
  if ( elements.length < wordCount ) {
    var inputClone = inputOneKey.cloneNode('true');
    var inputInClone = inputClone.querySelector('.field-text__input');
    inputInClone.value = '';
    blockForInputs.appendChild(inputClone);
  }
}

function deleteInput() {
  var blockForInputs = blockinputEnterHand.querySelector('.field-text--keyword');
  var inputOneKey = blockForInputs.querySelector('.field-text__input-wrap');
  var elements = blockForInputs.querySelectorAll('.field-text__input-wrap');
  var input = blockForInputs.querySelector('.field-text__input');
  var inputData = input.dataset;
  var wordCount = inputData.wordCount;
  if ( elements.length > 1 ) {
    blockForInputs.removeChild(elements[elements.length - 1]);
  }
}

function showInputMessage() {
  var blockForInputs = blockinputEnterHand.querySelector('.field-text--keyword');
  var input = blockForInputs.querySelector('.field-text__input');
  var inputData = input.dataset;
  var wordCount = inputData.wordCount;

  var mainBlock1 = document.querySelector('.form__step--copypaste-enter-keys');
  var blockForNote1 = mainBlock1.querySelector('.form__note-wrapper');

  var mainBlock2 = document.querySelector('.form__step--hand-enter-keys');
  var blockForNote2 = mainBlock2.querySelector('.form__note-wrapper');

  var newText = document.createElement('p');
  newText.className = 'note  note--words-count';
  newText.innerHTML = 'У вас осталось <span>' + wordCount + '</span> ключевых слов';

  blockForNote1.insertBefore(newText, blockForNote1.children[0]);

  var newTextClone = newText.cloneNode(true);

  blockForNote2.insertBefore(newTextClone, blockForNote2.children[0]);
}

radioEnterHand.onchange = function() {
  blockinputEnterHand.classList.toggle('form__step--hide');
  blockEnterCopypaste.classList.toggle('form__step--hide');
  setAttributes();
}

radioEnterCopypaste.onchange = function() {
  blockinputEnterHand.classList.toggle('form__step--hide');
  blockEnterCopypaste.classList.toggle('form__step--hide');
  setAttributes();
}

function setAttributes() {
  var elements = [];
  elements.push(blockinputEnterHand, blockEnterCopypaste);
  for ( var i = 0; i < elements.length; i ++ ) {
    if ( !(elements[i].classList.contains('form__step--hide')) ) {
      elements[i].querySelector('.field-text__input--required').setAttribute('required', 'required');
      elements[i].querySelector('.field-text__input--required').removeAttribute('disabled');
    }

    if ( elements[i].classList.contains('form__step--hide') ) {
      elements[i].querySelector('.field-text__input--required').removeAttribute('required');
      elements[i].querySelector('.field-text__input--required').setAttribute('disabled', 'disabled');
    }
  }
}

function calcEnterWords() {
  var value = textarea.value;
  var re = /\n/;
  var wordList = value.split(re);
  var wordListFiltered = wordList.filter(function(word) {
    return word != '';
  });
  var wordsCount = wordListFiltered.length;
  showLeftWords(wordsCount);
}

function showLeftWords(number) {
  var textareaData = textarea.dataset;
  var countWords = textareaData.wordCount;
  var numberLeftWords = countWords - number;
  var mainBlock = document.querySelector('.form__step--copypaste-enter-keys');
  var textBlock = mainBlock.querySelector('.form__note-wrapper');

  var noteText = textBlock.querySelector('.note--left-words-count');

  if ( noteText ) {
    if ( numberLeftWords ==  countWords ) {
      var removeText = textBlock.removeChild(noteText);
    } else if ( numberLeftWords > 0 ) {
      noteText.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, осталось <span>' + numberLeftWords + '</span>';
    } else if ( numberLeftWords < 0 ) {
      noteText.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, число допустимых слов превышено. В анализ попадет <span>' + countWords + '</span> слов';
    }
  }

  if ( !noteText ) {
    var newText = document.createElement('p');
    newText.className = 'note  note--left-words-count';
    if ( numberLeftWords > 0 ) {
      newText.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, осталось <span>' + numberLeftWords + '</span>';
      textBlock.insertBefore(newText, textBlock.children[0]);
    } else if ( numberLeftWords < 0 ) {
      newText.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, число допустимых слов превышено. В анализ попадет <span>' + countWords + '</span> слов';
      textBlock.insertBefore(newText, textBlock.children[0]);
    }
  }
}

function scrollToForm(event) {
  event.preventDefault();
  var form = document.getElementById('form')
  var formCordinate = form.getBoundingClientRect();
  var formTop = formCordinate.top;
  var windowYOffset = window.pageYOffset;
  var interval = 10;
  var time = 1000;
  var onePart = time / interval;
  var step = 0;
  var intervalSum = 0;

  var scrollInterval = setInterval(function() {
    step = step + (1 / onePart);
    intervalSum = Math.floor(step * time);
    if ( intervalSum <= time ) {
      windowYOffset =  formTop * quad(step);
      window.scrollTo(0, windowYOffset);
    }
    else clearInterval(scrollInterval);
  }, interval);
}

function quad(progress) {
  return Math.pow(progress, 2)
}

// function showLeftWords(number) {
//   var textareaData = textarea.dataset;
//   var countWords = textareaData.wordCount;
//   var numberLeftWords = countWords - number;
//   var mainBlock = document.querySelector('.form__step--copypaste-enter-keys');
//   var textBlock = mainBlock.querySelector('.form__note-wrapper');

//   var textNote = textBlock.querySelector('.note--words-count');

//   if ( numberLeftWords ==  countWords ) {
//     textNote.innerHtml = 'Осталось <span>' + numberLeftWords + '</span>';
//   } else if ( numberLeftWords > 0 ) {
//     textNote.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, осталось <span>' + numberLeftWords + '</span>';
//   } else if ( numberLeftWords < 0 ) {
//     textNote.innerHTML = 'Введено <span>' + number + '</span> ключевых слов, число допустимых слов превышено. В анализ попадет <span>' + countWords + '</span> слов';
//   }
// }

// function showWordsCount() {
//   var textareaData = textarea.dataset;
//   var countWords = textareaData.wordCount;
//   var mainBlock = document.querySelector('.form__step--copypaste-enter-keys');
//   var textBlock = mainBlock.querySelector('.form__note-wrapper');
//   var noteText = textBlock.querySelector('.note--words-count');

//   if (noteText) {
//     noteText.innerHTML = 'У вас осталось <span>' + countWords + '</span> ключевых слов';
//   }
//   if (!noteText) {
//     var newText = document.createElement('p');
//     newText.className = 'note  note--words-count';
//     newText.innerHTML = 'У вас осталось <span>' + countWords + '</span> ключевых слов';
//     textBlock.insertBefore(newText, textBlock.children[0]);
//   }
// }

// function scrollToForm() {
//   var form = document.getElementById('form')
//   var formCordinate = form.getBoundingClientRect();
//   var formTop = formCordinate.top;
//   var start = Date.now();
//   var timer = setInterval(function() {
//   var timerPassed = Date.now() - start;
//   if (timerPassed >= 1000  && formTop == 0) {
//     clearInterval(timer);
//     return;
//   }

//   draw(timerPassed, formTop);
//   }, 20);

//   function draw(time, coordinate) {
//     console.log(coordinate);
//     coordinate = coordinate - time / 50;
//     console.log(coordinate);
//   }
// }

// function scrollToForm() {
//   var form = document.getElementById('form')
//   var formCordinate = form.getBoundingClientRect();
//   var formTop = formCordinate.top;
//   var newTop = 0;

//   function scroll() {
//     formTop  = Math.floor(formTop - 200);

//     if ( formTop == newTop ) {
//       clearInterval(id);
//     }
//   }

//   var id = setInterval(scroll, 10);
// }

