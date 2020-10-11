"use strict";

console.log("Entering, and exiting!, a template scripts.js file");

const menuIconEl = $('.menu-icon');
const sidenavEl = $('.sidenav');
const sidenavCloseEl = $('.sidenav__close-icon');

// Add and remove provided class names
function toggleClassName(el, className) {
  if (el.hasClass(className)) {
    el.removeClass(className);
  } else {
    el.addClass(className);
  }
}

// Open the side nav on click
menuIconEl.on('click', function() {
  toggleClassName(sidenavEl, 'active');
});

// Close the side nav on click
sidenavCloseEl.on('click', function() {
  toggleClassName(sidenavEl, 'active');
});

function updateElementWithDisplayDetails(elementId) {
  var element = document.getElementById(elementId);
  var response = `<ul><li><strong>Screen width: </strong> ${screen.width}</li><li><strong>Screen height: </strong>${screen.height}</li><li><strong>Avail width: </strong>${screen.availWidth}</li><li><strong>Width: </strong>${window.innerWidth}</li></ul>`
  element.innerHTML = response;
}

window.addEventListener('resize', function(event){
  updateElementWithDisplayDetails('main-card-one');
});

updateElementWithDisplayDetails('main-card-one');