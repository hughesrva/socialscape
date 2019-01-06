// variables
var unselInts = ["Live Music", "Hiking", "Opera", "Theater", "Movies", "Art Shows"];
var selInts = [];
var btnValue = "";
var btnState = "";

$(document).ready(function () {

    // checks to see if interests are already stored locally and adds defaults if not
    if (localStorage.getItem("unselInts") === null) {
        unselInts = ["Live Music", "Hiking", "Opera", "Theater", "Movies", "Art Shows"];
    }
    else {
        unselInts = JSON.parse(localStorage.getItem("unselInts"));
        console.log(typeof (unselInts));
    };

    if (localStorage.getItem("selInts") !== null) {
        selInts = JSON.parse(localStorage.getItem("selInts"));
    }

    // create buttons for unselected interests array items
    for (i = 0; i < unselInts.length; i++) {
        var intBtn = $("<button>").text(unselInts[i]);
        $(intBtn).addClass("intBtn");
        $(intBtn).data("value", unselInts[i]);
        $(intBtn).data("state", "unsel");
        $("#unselInterests").append(intBtn);
    }

    for (i = 0; i < selInts.length; i++) {
        var intBtn = $("<button>").text(selInts[i]);
        $(intBtn).addClass("intBtn");
        $(intBtn).data("value", selInts[i]);
        $(intBtn).data("state", "sel");
        $("#selInterests").append(intBtn);
    }
});

// on click function for interest input submit button
$("#submitBtn").on("click", function () {
    var inputValue = $("#intInput").val().trim();
    if (inputValue === "") {
    }
    else {
        var newBtn = $("<button>").text(inputValue);
        selInts.push(inputValue);
        $(newBtn).addClass("intBtn");
        $(newBtn).data("value", inputValue);
        $(newBtn).data("state", "sel");
        $("#selInterests").append(newBtn);
        $("#intInput").val("");
    }
});

// on click functions for interest buttons
$("body").on("click", ".intBtn", function () {
    btnValue = $(this).data("value");
    btnState = $(this).data("state");

    // moves to selected and changes state to selected if unselected
    if (btnState === "unsel") {
        unselInts.splice(unselInts.indexOf(btnValue), 1);
        selInts.push(btnValue);
        $(this).detach().appendTo("#selInterests");
        $(this).data("state", "sel");
        console.log("selected are: " + selInts);
        console.log("unselected are: " + unselInts);
    }

    // moves to unselected and changes state to unselcted if selected
    else {
        selInts.splice(selInts.indexOf(btnValue), 1);
        unselInts.push(btnValue);
        $(this).detach().appendTo("#unselInterests");
        $(this).data("state", "unsel");
        console.log("selected are: " + selInts);
        console.log("unselected are: " + unselInts);
    }
});

// clears local storage and saves interests to local storage on save button click
$("#saveBtn").on("click", function () {
    localStorage.clear();
    localStorage.setItem("selInts", JSON.stringify(selInts));
    localStorage.setItem("unselInts", JSON.stringify(unselInts));
    console.log(localStorage.getItem("selInts"));
    console.log(localStorage.getItem("unselInts"));
})