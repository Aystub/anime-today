var BASE_URL = "https://anilist.co/api";
var TOKEN;
var WINTER = [0, 1, 2];
var SPRING = [3, 4, 5];
var SUMMER = [6, 7, 8];
var FALL = [9, 10, 11];
var ANIME;
var TODAY = 0;
var TOMORROW = 1;
var sort_by = 0; // Sort by time [default]
var block_adult_content = false;
// Run all the things
$(function() {
    init();
});


function init(){
    welcomeJonn();
    initTabs();
    getAniAccessToken();
    initTodayOnClickListener();
    initTomorrowOnClickListener();
    initSortOnClickListener();
}


// Welcoming a friend, nothing more
function welcomeJonn(){
    console.log("%c _    _                   _ \n\
| |  | |                 | | \n\
| |__| | ___ _   _       | | ___  _ __  _ __ \n\
|  __  |/ _ \\ | | |  _   | |/ _ \\| '_ \\| '_ \\ \n\
| |  | |  __/ |_| | | |__| | (_) | | | | | | | \n\
|_|  |_|\\___|\\__, |  \\____/ \\___/|_| |_|_| |_| \n\
              __/ | \n\
             |___/", "font-family:monospace");
}


// Get access token
function getAniAccessToken() {
    $.ajax({
        type: "POST",
        url: buildAniAuthRequestURL(),
        success: function(data){
            TOKEN = data.access_token;
            getAnime();
        },
        error: function(data){
            console.log("Wat?");
            console.log(data);
            setErrorMessageDisplay(true);
        }
    });
}


function buildAniAuthRequestURL(){
    return BASE_URL + "/auth/access_token?" + "&" +
        "grant_type=client_credentials" + "&" +
        "client_id=" + getId() + "&" +
        "client_secret=" + getSecret();
}


// Grab all the currently airing animes from anilist API
function getAnime(){
    $.ajax({
        type: "GET",
        url: buildAnimeRequestURL(),
        success: function(data){
            ANIME = data;
            processAnime(TODAY);
            setErrorMessageDisplay(false);
        },
        error: function(data){
            console.log("Wat?");
            console.log(data);
            setErrorMessageDisplay(true);
        }
    });
}


function buildAnimeRequestURL(){
    return BASE_URL + "/browse/anime?" +
        "status=Currently Airing" + "&" +
        "access_token=" + TOKEN + "&" +
        "airing_data=true" + "&" +
        "full_page=true";
}

//Sets the visibility of the connection error message
function setErrorMessageDisplay(state){
    $('#error-message').attr('hidden',!state);
}

// Returns a list (shows) that contains all the animes for either Today or Tomorrow
function processAnime(flag){
    clearCardHolder();
    var shows;
    switch(flag){
        case TODAY:
            shows = getTodaysAnime();
            break;
        case TOMORROW:
            shows = getTomorrowsAnime();
            break;
    }

    for(var i = 0; i < shows.length; i++){
        addCard(shows[i]);
    }
}


// Nuke all the card views in the UI so we can populate it with new ones
function clearCardHolder(){
    $("#card-holder").empty();
}

var sort_functions = [function(a, b){
    return (new Date(a.airing.time)).valueOf() - (new Date(b.airing.time).valueOf())
}, // Sort function for time
function(a, b){
    if(a.title_english < b.title_english) return -1;
    if(a.title_english > b.title_english) return 1;
    return 0;
} // Sort function for Name
];

// Looks through all data we got back from the API call and figures out if the show is
// airing today, if so, add it to a list to be returned
function getTodaysAnime(){
    var shows = [];
    for(var i = 0; i < ANIME.length; i++){
        var anime = ANIME[i];
        if(anime.airing != null && anime.airing.time != null) {
            var airingDate = new Date(anime.airing.time);
            if (isToday(airingDate)) {
                shows.push(anime);
            }
        }
    }
    //Adult Filter
    if(block_adult_content) shows.filter(function(anime) {return !anime.adult;});
    //Sort
    shows.sort(sort_functions[sort_by]);
    return shows;
}


// Returns true if a given date is today, else false
function isToday(date){
    return isThisMonth(date.getMonth()) && isThisDate(date.getDate()) && isThisYear(date.getFullYear());
}


// Returns true if a given date is for this current month, else false
function isThisMonth(month){
    var thisMonth = new Date().getMonth();
    return month === thisMonth;
}


// Returns true if a given date is todays date ("date" meaning like the 14th), else false
function isThisDate(date){
    var today = new Date().getDate();
    var thisDayNextWeek = today+7;
    return date === today || date === thisDayNextWeek;
}


// Returns true if a given date is for this current year, else false
function isThisYear(year){
    return year === new Date().getFullYear();
}


// Just like getTodaysAnime() but finding tomorrow's shows
function getTomorrowsAnime(){
    var shows = [];
    for(var i = 0; i < ANIME.length; i++){
        var anime = ANIME[i];
        if(anime.airing != null && anime.airing.time != null) {
            var airingDate = new Date(anime.airing.time);
            if (isTomorrow(airingDate)) {
                shows.push(anime);
            }
        }
    }
    //Adult Filter
    if(block_adult_content) shows.filter(function(anime) {return !anime.adult;});
    //Sort
    shows.sort(sort_functions[sort_by]);
    return shows;
}


// Returns true if a given date is tomorrow
function isTomorrow(date){
    return isThisMonth(date.getMonth()) && isThisDateTomorrow(date.getDate()) && isThisYear(date.getFullYear());
}


// Returns true if a given date is tomorrow (if today is the 14th, returns true if the given date is for the 15th), else false
function isThisDateTomorrow(date){
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return date === tomorrow.getDate();
}


// Generate a "card" view. This is the part of the UI containing all the anime info
function addCard(data) {
    var time = new Date(data.airing.time).toLocaleTimeString().replace(":00", "");
    var cardBody = '<a style="text-decoration: none;" href="https://anilist.co/anime/' + data.id + '"><div> \
                        <div class="uk-card uk-card-default uk-card-hover"> \
                        <div class="uk-card-media-top" style="height: 325px; background: ' + "url('" + data.image_url_lge + "');" + 'background-size: cover; background-position: center center;"> \
                        </div> \
                        <div class="uk-card-body"> \
                            <h4>' + data.title_english + '</h4> \
                        </div> \
                    <div class="uk-card-footer"><span class="uk-margin-small-right" uk-icon="icon: clock"></span>'+ time +'</div> \
                    </div> \
                    </div></a>';

    $("#card-holder").append(cardBody);
}

// Setup the active state of the buttons
function setButtonState(button_id, active = true) {
    if(active) {
        $(button_id).removeClass("uk-button-default");
        $(button_id).addClass("uk-button-active");    
    }
    else {
        $(button_id).removeClass("uk-button-active");   
        $(button_id).addClass("uk-button-default");
    }
}

// Get the active state of the buttons
function getButtonState(button_id) {
    return $(button_id).hasClass("uk-button-active");
}

// Setup a listener on the "Today" tab in the UI
function initTodayOnClickListener(){
    $("#today").click(function(){
        processAnime(TODAY);
    });
}


// Setup a listener on the "Tomorrow" tab in the UI
function initTomorrowOnClickListener(){
    $("#tomorrow").click(function(){
        processAnime(TOMORROW);
    });
}

// Setup listeners on the switches in the UI
function initSortOnClickListener(){
    $("#sort-by-time").click(function(){
        setButtonState("#sort-by-time", true);
        setButtonState("#sort-by-name", false);
        sort_by = 0;
        processAnime(TODAY);
        processAnime(TOMORROW);
    });
    $("#sort-by-name").click(function(){
        setButtonState("#sort-by-time", false);
        setButtonState("#sort-by-name", true);
        sort_by = 1;
        processAnime(TODAY);
        processAnime(TOMORROW);
    });

    $("#block-adult").click(function(){
        isActive = getButtonState("#block-adult");
        block_adult_content = !isActive;
        setButtonState("#block-adult", !isActive);
        processAnime(TODAY);
        processAnime(TOMORROW);
    });
}

// Initial setup of the Today and Tomorrow tabs so they can show the date in them
function initTabs(){
    var date = new Date();
    var today = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    var tomorrow = date.getMonth() + 1 + "/" + (date.getDate() + 1) + "/" + date.getFullYear();
    $("#today").html("Today (" + today + ")");
    $("#tomorrow").html("Tomorrow (" + tomorrow + ")");
}


// Meant to use the following two methods in buildAnimeRequestURL() to reduce data usage, but I forgot :D
function getSeason(){
    var month = new Date().getMonth();
    if(WINTER.indexOf(month)){
        return "winter";
    } else if(SPRING.indexOf(month)){
        return "spring";
    } else if(SUMMER.indexOf(month)){
        return "summer";
    } else if(FALL.indexOf(month)){
        return "fall";
    }
}


function getYear(){
    return new Date().getFullYear();
}
