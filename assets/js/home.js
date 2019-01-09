// converts user's chosen day of the week to a format the Eventful API can use
// output will be date as string in format YYYYMMDD00-YYYYMMDD00
formatDate = function (weekday) {
    // if user wants to see today, "today" is a valid format for eventful, so is just returned
    if (weekday.toLowerCase() === "today") {
        return "today";
    } else if (moment().format("dddd") === moment(weekday, "dddd").format("dddd")) {
        // if today is Tuesday, we want next Tuesday, not today. So this step adds 7 days if today's weekday is entered
        day = moment(weekday, "dddd").add(7, "days")
        // weekday switched to YYYYMMDD format
        date = day.format("YYYYMMDD");
        // add the extra 00 required by eventful API
        formatDate = date + "00";
        // converts to a range (of one day, so not really much of a range)
        rangeDate = formatDate + "-" + formatDate;
        return rangeDate;
    } else {
        // moment() version of "next weekday"
        day = moment(weekday, "dddd");
        // weekday switched to YYYYMMDD format
        date = day.format("YYYYMMDD");
        // add the extra 00 required by eventful API
        formatDate = date + "00";
        // converts to a range (of one day, so not really much of a range)
        rangeDate = formatDate + "-" + formatDate;
        return rangeDate;
    };
}
// weekday variable, defaults to "today"
var weekday = "today";
var map;

function initMap() {
    var uluru = { lat: 37.5407, lng: -77.4360 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: uluru,
        zoom: 11
    });
};


$("body").on("click", ".testButton", function () {
    console.log("clicked");
    // console.log(formatDate("wednesday"));
    // sets city to Richmond if one isn't saved in storage
    if (localStorage.getItem("city") === null) {
        var city = "Richmond,VA";
    }
    else {
        var city = localStorage.getItem("city");
    }

    // eventful URL object
    eventful = {
        api_key: "app_key=V8VVQZh9Ghmf7bGQ",
        // end point for search url
        end: "http://api.eventful.com/json/events/search?",
        // change value to switch to different city
        city: city,
        // function converts "weekday" variable into format eventful can read
        date: formatDate(weekday),
        // function concatenates all above values into ajax url
        queryURL: function (search) {
            url = this.end + this.api_key + "&category=" + search + "&location=" + this.city + "&date=" + this.date;
            return url;
        },
    };
    $.ajax({
        url: eventful.queryURL(localStorage.getItem("selInts").toString()),
        dataType: "jsonp",
        method: "GET"
    }).then(function (response) {
        console.log(eventful.queryURL("music"), response);
        for (var i = 0; i < response.events.event.length; i++) {
            // set variable to clean up code
            let eventResult = response.events.event[i];
            // console logs each value from response
            // console.log("title "+event.title, "start "+event.start_time, "end "+event.stop_time, "venue "+event.venue_name, "address "+event.venue_address, "url "+event.url);

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
            var marker = new google.maps.Marker({
                position: eventPosition,
                map: map
            });
        };
    });
});