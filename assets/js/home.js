eventful= {
    api_key: "app_key=V8VVQZh9Ghmf7bGQ",
    end: "http://api.eventful.com/json/events/search?",
    city: "Richmond",
    queryURL: function (search) {
       url = this.end + this.api_key + "&keywords=" + search + "&location=" + this.city + "&date=Future";
        return url;
    },
};
ticketmaster= {
    api_key: "apikey=LoeeX4dO34SV1Xl7x72AzwTzSkHRVG0u",
    end: "https://app.ticketmaster.com/discovery/v2/events.json?",
    city: "Richmond",
    queryURL: function (search) {
        url = this.end + this.api_key + "&keyword=" + search +"&source=universe&countryCode=US" + "&city="+this.city
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
            // console logs titles of events
            console.log(response.events.event[i].title);
        };
    });
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