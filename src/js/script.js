"use strict";

var mainMenuToggler = document.getElementById("main-menu-toggler");
var mainMenuWrapper = document.getElementById("main-menu-wrapper");

mainMenuToggler.onclick = function(event) {
  event.preventDefault();
  mainMenuToggler.classList.toggle("page-header__menu-toggler--close");
  mainMenuToggler.classList.toggle("page-header__menu-toggler--open");
  mainMenuWrapper.classList.toggle("page-header__top-line--open");
}

function closeMenu() {
  if (mainMenuWrapper.classList.contains("page-header__top-line--open")) {
    mainMenuWrapper.classList.remove("page-header__top-line--open");
    mainMenuToggler.classList.remove("page-header__menu-toggler--close")
  }
}

closeMenu();
