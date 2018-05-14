var ANIME;
var block_adult_content = true;

// Run all the things
$(function() {
    init();
});


function init(){
    welcomeJonn();
    initTabs();
    getAnime();
    initTodayOnClickListener();
    initTomorrowOnClickListener();
    initSortOnClickListener();
    initAdultFilterClickListener();
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


function getAnime() {
    $.ajax({
        type: "POST",
        url: "https://graphql.anilist.co",
        data: { query: graphQLQuery, variables: graphQLVariables },
        success: function(result){
            console.log(result);
            ANIME = result.data.Page.airingSchedules;
            processAnime();
            setErrorMessageDisplay(false);
        },
        error: function(result){
            console.log("Wat?");
            console.log(result);
            setErrorMessageDisplay(true);
        }
    })
}

//Sets the visibility of the connection error message
function setErrorMessageDisplay(state){
    $('#error-message').attr('hidden',!state);
}

// Returns a list (shows) that contains all the animes for either Today or Tomorrow
function processAnime(){
    clearCardHolder();
    for(var i = 0; i < ANIME.length; i++){
        if (ANIME[i].media.isAdult == false || !block_adult_content) {
            addCard(ANIME[i]);
        }
    }
}


// Nuke all the card views in the UI so we can populate it with new ones
function clearCardHolder(){
    $("#card-holder").empty();
}


// Generate a "card" view. This is the part of the UI containing all the anime info
function addCard(data) {
    var time = new Date(data.media.nextAiringEpisode.airingAt * 1000).toLocaleTimeString().replace(":00", "");
    var title = data.media.title.english != null ? data.media.title.english : data.media.title.romaji
    var cardBody = '<a style="text-decoration: none;" href="https://anilist.co/anime/' + data.media.id + '"><div> \
                        <div class="uk-card uk-card-default uk-card-hover"> \
                        <div class="uk-card-media-top" style="height: 325px; background: ' + "url('" + data.media.coverImage.large + "');" + 'background-size: cover; background-position: center center;"> \
                        </div> \
                        <div class="uk-card-body"> \
                            <h4>' + title + '</h4> \
                        </div> \
                    <div class="uk-card-footer"><span class="uk-margin-small-right" uk-icon="icon: clock"></span>'+ time +'</div> \
                    </div> \
                    </div></a>';

    $("#card-holder").append(cardBody);
}

// Setup a listener on the "Today" tab in the UI
function initTodayOnClickListener(){
    $("#today").click(function(){
        graphQLVariables = {
            "last": (new Date().setHours(0,0,0,0) / 1000),
            "next": (new Date().setHours(24,0,0,0) / 1000)
        };
        getAnime();
    });
}


// Setup a listener on the "Tomorrow" tab in the UI
function initTomorrowOnClickListener(){
    $("#tomorrow").click(function(){
        graphQLVariables = {
            "last": (new Date().setHours(24,0,0,0) / 1000),
            "next": (new Date().setHours(48,0,0,0) / 1000)
        };
        getAnime();
    });
}


// Setup listeners on the switches in the UI
function initSortOnClickListener(){
    $("#sort-by-time").click(function(){
        setButtonState("#sort-by-time", true);
        setButtonState("#sort-by-name", false);
        ANIME.sort(sort_functions[0]);
        processAnime();
    });
    $("#sort-by-name").click(function(){
        setButtonState("#sort-by-time", false);
        setButtonState("#sort-by-name", true);
        ANIME.sort(sort_functions[1]);
        processAnime();
    });
}


var sort_functions = [
    function(a, b) { // Sort function for time
        return (new Date(a.media.nextAiringEpisode.airingAt)).valueOf() - (new Date(b.media.nextAiringEpisode.airingAt).valueOf())
    },
    function(a, b) { // Sort function for Name
        var aTitle = a.media.title.english != null ? a.media.title.english : a.media.title.romaji;
        var bTitle = b.media.title.english != null ? b.media.title.english : b.media.title.romaji;
        if(aTitle < bTitle) return -1;
        if(aTitle > bTitle) return 1;
        return 0;
    }
];


function initAdultFilterClickListener() {
    $("#block-adult").click(function(){
        isActive = getButtonState("#block-adult");
        block_adult_content = !block_adult_content;
        setButtonState("#block-adult");
        processAnime();
    });
}

// Setup the active state of the buttons
function setButtonState(button_id) {
    $(button_id).toggleClass("uk-button-default");
    $(button_id).toggleClass("uk-button-active"); 
    if(button_id == "#block-adult" && getButtonState(button_id)){
        $(button_id).html('HIDE 18+ CONTENT');
    } else if (button_id == "#block-adult") {
        $(button_id).html('SHOW 18+ CONTENT');
    }
}

// Get the active state of the buttons
function getButtonState(button_id) {
    return $(button_id).hasClass("uk-button-active");
}

// Initial setup of the Today and Tomorrow tabs so they can show the date in them
function initTabs(){
    var date = new Date();
    var tomorrow_date = new Date();
    tomorrow_date.setDate(tomorrow_date.getDate() + 1);
    var today = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    var tomorrow = tomorrow_date.getMonth() + 1 + "/" + tomorrow_date.getDate() + "/" + tomorrow_date.getFullYear();
    $("#today").html("Today (" + today + ")");
    $("#tomorrow").html("Tomorrow (" + tomorrow + ")");
}
