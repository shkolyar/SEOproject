"use strict";

var inputEnterHand = document.getElementById("enter-type-1");
var inputEnterCopypaste = document.getElementById("enter-type-2");
var blockinputEnterHand = document.getElementById("step-enter-1");
var blockEnterCopypaste = document.getElementById("step-enter-2");

inputEnterHand.onclick = function() {
  blockinputEnterHand.classList.toggle("form__step--hide");
  blockEnterCopypaste.classList.toggle("form__step--hide");
}

inputEnterCopypaste.onclick = function() {
  blockinputEnterHand.classList.toggle("form__step--hide");
  blockEnterCopypaste.classList.toggle("form__step--hide");
}
