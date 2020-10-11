"use strict";

function log(message) {
  console.log(message);
}

class DamienHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Damien's Header</h1>`;
  }
}
customElements.define('damien-header', DamienHeader);

const logItems = [
  { datetimestamp: '1-Oct', log: 'database created'},
  { datetimestamp: '2-Oct', log: 'database schema created'},
  { datetimestamp: '3-Oct', log: 'entries added to database'},
  { datetimestamp: '4-Oct', log: 'database closed'}
]

console.log(logItems);

// const templateListItem = document.getElementById('template-list-item');
// logItems.forEach(logItem => {
//   // create an instance of the template content
//   const instance = document.importNode(templateListItem.content, true);
//   // add relevant content to the template
//   instance.querySelector('.datetimestamp').innerHTML = logItem.datetimestamp;
//   instance.querySelector('.logentry').innerHTML = logItem.log;
//   // append the instance to the list
//   document.getElementById('my-list').appendChild(instance);
  
// });

// console.log('appending template button');
// const templateButton = document.getElementById('template-button');
// document.body.appendChild(document.importNode(templateButton.content, true));

// begin card template
class DamiensCard extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    let tmpl = document.querySelector('#template-card');
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }

  connectedCallback() {
    log('Entering DamiensCard connectedCallback()');
  }

  disconnectedCallback() {
    log('Entering DamiensCard disconnectedCallback()');
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    log('Entering DamiensCard attributedChangedCallback()');
  }

}
customElements.define('damiens-card', DamiensCard);

// end card template

