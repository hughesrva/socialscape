eventful= {
    api_key: "app_key=V8VVQZh9Ghmf7bGQ",
    end: "http://api.eventful.com/json/events/search?",
    city: "Richmond, VA",
    queryURL: function (search) {
       url = this.end + this.api_key + "&category=" + search + "&location=" + this.city + "&date=Future";
        return url;
    },
};
ticketmaster= {
    api_key: "&apikey=LoeeX4dO34SV1Xl7x72AzwTzSkHRVG0u",
    end: "https://app.ticketmaster.com/discovery/v2/events.json?",
    city: "Richmond",
    queryURL: function (search) {
        url = this.end + "keyword=" + search +"&source=universe&countryCode=US" + "&city="+this.city + this.api_key;
        return url;
    }
}

$("body").on("click", ".testButton", function () {
    console.log("clicked");
    // let interests = something from storage;
    $.ajax({
        url: eventful.queryURL("music"),
        dataType: "jsonp",
        method: "GET"
    }).then(function(response){
        console.log(response);
        for (var i = 0; i<response.events.event.length; i++) {
            // set variable to clean up code
            let event = response.events.event[i];
            // console logs each value from response
            console.log("title "+event.title, "start "+event.start_time, "end "+event.stop_time, "venue "+event.venue_name, "address "+event.venue_address, "url "+event.url);

            var eventCard = $("<div>").addClass("card");
            var eventContent = $("<div>").addClass("card-content").appendTo(eventCard);
            var eventTop = $("<div>").addClass("media").appendTo(eventContent);
            var eventImgPosition = $("<div>").addClass("media-left").appendTo(eventTop);
            var eventImgHolder = $("<figure>").addClass("image").addClass("is-48x48").appendTo(eventImgPosition);
            var eventImg = $("<img>").attr("src", "assets/images/logo.png").attr("id", "eventIcon").appendTo(eventImgHolder); //event icon 
            var eventTitlePosition = $("<div>").addClass("media-content").appendTo(eventTop);
            var eventLink = $("<a>").attr("href", event.url).appendTo(eventTitlePosition); //event link
            var eventTitle = $("<p>").addClass("title").addClass("is-4").text(event.title).attr("id", "eventTitle").appendTo(eventLink); //event title

            var eventVenue = $("<div>").addClass("content").text(event.venue_name).attr("id", "eventVenue").appendTo(eventContent); //event venue
            var eventTime = $("<div>").addClass("content").text(event.start_time).attr("id", "eventTime").appendTo(eventContent); //event time
            $("#resultsContainer").append(eventCard);

        };
    });
    // url: "https://app.ticketmaster.com/discovery/v2/events.json?keyword=music&source=universe&countryCode=US&city=Richmond&apikey=LoeeX4dO34SV1Xl7x72AzwTzSkHRVG0u",

    $.ajax({
        url: ticketmaster.queryURL("music"),
        async: true,
        dataType: "json",
        method: "GET"
    }).then(function(response){
        console.log(response);
        // for (var i = 0; i<response.events.event.length; i++) {
        //     // console logs titles of events
        //     console.log(response.events.event[i].title);
        // };
    });
});