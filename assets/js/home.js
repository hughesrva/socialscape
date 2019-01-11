// map variables
var map;
var geocoder;
var markers = [];
// variable for formatDate, defaults to today
var weekday = "Today";

var initMap = function () {
    geocoder = new google.maps.Geocoder();
    var address = localStorage.getItem("city");
    geocoder.geocode({ address: address }, function (results, status) {
        if (status == "OK") {
            var mapOptions = {
                zoom: 10,
                center: results[0].geometry.location
            }
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
        }
    })
}

$(document).on("ready", function () {
    setCity();
    initMap();
});

// converts user's chosen day of the week to a format the Eventful API can use
// output will be date as string in format YYYYMMDD00-YYYYMMDD00
var setDate = function (weekday) {
    // some user inputs are already valid so they are returned as is
    if (weekday.toLowerCase() === "today") {
        return "Today";
    } else if (weekday.toLowerCase() === "this week") {
        return "This week"
    } else if (weekday.toLowerCase() === "next week") {
        return "Next week"
    }
    // for if today's weekday is entered
    else if (moment().format("dddd") === moment(weekday, "dddd").format("dddd")) {
        // sets to *next* weekday
        day = moment(weekday, "dddd").add(7, "days")
        // weekday switched to YYYYMMDD format
        date = day.format("YYYYMMDD");
        // add the extra 00 required by eventful API
        formatDate = date + "00";
        // converts to a range (of one day, so not really much of a range)
        rangeDate = formatDate + "-" + formatDate;
        return rangeDate;
    } else {
        // if today is after the day of the week requested
        if (moment().day() > moment(weekday, "dddd").day()) {
            // sets to *next* weekday
            day = moment(weekday, "dddd").add(7, "days")
            // weekday switched to YYYYMMDD format
            date = day.format("YYYYMMDD");
            // add the extra 00 required by eventful API
            formatDate = date + "00";
            // converts to a range (of one day, so not really much of a range)
            rangeDate = formatDate + "-" + formatDate;
            return rangeDate;
        }
        // if today is before the day of the week requested
        else if (moment().day() < moment(weekday, "dddd").day()) {
            // moment.js version of weekday
            day = moment(weekday, "dddd")
            // weekday switched to YYYYMMDD format
            date = day.format("YYYYMMDD");
            // add the extra 00 required by eventful API
            formatDate = date + "00";
            // converts to a range (of one day, so not really much of a range)
            rangeDate = formatDate + "-" + formatDate;
            return rangeDate;
        }
    };
};

var setCity = function () {
    // sets city to Richmond if one isn't saved in storage
    if (localStorage.getItem("city") === null) {
        var city = "Richmond, VA"
        localStorage.setItem("city", city);
        return city;
    }
    else {
        var city = localStorage.getItem("city");
        return city;
    }
};
// eventful URL
eventful = {
    api_key: "app_key=V8VVQZh9Ghmf7bGQ",
    end: "http://api.eventful.com/json/events/search?",
    city: setCity(),
    date: setDate(weekday),
    queryURL: function (search) {
        url = this.end + this.api_key + "&category=" + search + "&location=" + this.city + "&date=" + this.date;
        return url;
    },
};
$("body").on("click", ".testButton", function () {
    $.ajax({
        url: eventful.queryURL(localStorage.getItem("selInts").toString()),
        dataType: "jsonp",
        method: "GET"
    }).then(function (response) {

        function clearMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        };
        clearMarkers();
        for (var i = 0; i < response.events.event.length; i++) {
            // set variable to clean up code
            let eventResult = response.events.event[i];
            // creates elements for response data and pushes to page
            var eventCard = $("<div>").addClass("card");
            var eventContent = $("<div>").addClass("card-content").appendTo(eventCard);
            var eventTop = $("<div>").addClass("media").appendTo(eventContent);
            var eventImgPosition = $("<div>").addClass("media-left").appendTo(eventTop);
            var eventImgHolder = $("<figure>").addClass("image").addClass("is-48x48").appendTo(eventImgPosition);
            var eventImg = $("<img>").attr("src", "assets/images/logo.png").attr("id", "eventIcon").appendTo(eventImgHolder); //event icon 
            var eventTitlePosition = $("<div>").addClass("media-content").appendTo(eventTop);
            var eventLink = $("<a>").attr("href", eventResult.url).appendTo(eventTitlePosition); //event link
            var eventTitle = $("<p>").addClass("title").addClass("is-4").text(eventResult.title).attr("id", "eventTitle").appendTo(eventLink); //event title
            var eventVenue = $("<div>").addClass("content").text(eventResult.venue_name).attr("id", "eventVenue").appendTo(eventContent); //event venue
            var eventTime = $("<div>").addClass("content").text(eventResult.start_time).attr("id", "eventTime").appendTo(eventContent); //event time
            $("#resultsContainer").prepend(eventCard);
            var eventPosition = { lat: JSON.parse(eventResult.latitude), lng: JSON.parse(eventResult.longitude) };
            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h1 id="firstHeading" class="firstHeading">' + eventResult.title + "</h1>'" +
                '<div id="bodyContent">' +
                '<p><b>' + eventResult.venue_name + ' - ' + eventResult.start_time + '</b></p>'
            '</div>' +
                '</div>';

            var marker = new google.maps.Marker({
                position: eventPosition,
                title: eventResult.title
            });

            markers.push(marker);

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            function addMarkers() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            }
            addMarkers();

            // marker.addListener('click', function () {
            //     infowindow.open(map, marker);
            // });

            google.maps.event.addListener(marker, 'click', (function (marker, contentString, infowindow) {
                return function () {
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                };
            })(marker, contentString, infowindow));
        };
    });
});