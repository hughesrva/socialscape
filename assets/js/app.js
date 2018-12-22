// Initialize Firebase
var config = {
    apiKey: "AIzaSyATvEEuE5HWcpeiiYbIB5vPx2FYTQ6alIM",
    authDomain: "socialscapen.firebaseapp.com",
    databaseURL: "https://socialscapen.firebaseio.com",
    projectId: "socialscapen",
    storageBucket: "socialscapen.appspot.com",
    messagingSenderId: "360016702089"
};
firebase.initializeApp(config);

$(document).ready(function () {

    // on-click function for hamburger menu
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");

    });
});