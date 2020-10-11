"use strict";

console.log("Entering, and exiting!, a template scripts.js file");

var app = new Vue({
    el: "#vue-card",
    data: {
        message: "My card from JavaScript"
    },
    methods: {
        counter: function(event) {
            alert('Hello');
            if (event) {
                alert(event.target.tagName)
            }
        }
    }
});

function jscounter(event) {
    alert("Hello there");
    message = "bob's your uncle"
}

Vue.component('card-counter', {
    data: function() {
        return {
            count: 0
        }
    },
    template: '<div class="main-overview-card" v-on:click="count++">You clicked me {{ count }} times.</div>'
})

new Vue({ el: "#main-overvue" })