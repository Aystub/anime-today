var ANIME;
var block_adult_content = true;
var KITSU_URL = "https://kitsu.io/api/edge/anime?filter[text]=";

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


function navigateToKitsu(title) {
    $(".loading-overlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: KITSU_URL + encodeURI(title),
        success: function(result) {
            var found = false;
            if (result.data.length >= 0) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].attributes.status == "current") {
                        window.location = "https://kitsu.io/anime/" + result.data[i].id;
                        found = true;
                        break;
                    }
                }
            } 
            if (!found) {
               UIkit.modal.confirm("<div><h3>Shrug</h3><p>An exact lookup on Kitsu failed, want to be taken to the search results on Kitsu?</div>").then(function() {
                    window.location = "https://kitsu.io/anime?text=" + encodeURI(title);
               });            
            }
        }, 
        error: function(error) {
            console.log(error);
            $(".loading-overlay").css("display", "none");
            UIkit.modal.confirm("<div><h3>Shrug</h3><p>An exact lookup on Kitsu failed, want to be taken to the search results on Kitsu?</div>").then(function() {
                window.location = "https://kitsu.io/anime?text=" + encodeURI(title);
            });
        }
    })
}


function navigateToMAL(title) {
    $(".loading-overlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: "https://api.jikan.moe/search/anime/" + encodeURI(title), // + "?status=airing",
        success: function(data) {
            var foundIndex = -1;
            for (var i = 0; i < data.result.length; i++) { 
                if (similarity(title, data.result[i].title) >= .90) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex > -1) {
                window.location = data.result[foundIndex].url;
            } else {
                UIkit.modal.confirm("<div><h3>Shrug</h3><p>An exact lookup on MAL failed, want to be taken to the search results on MAL?</div>").then(function() {
                    window.location = "https://myanimelist.net/search/all?q=" + encodeURI(title);
                }); 
            }
        },
        error: function(error) {
            console.log(error);
            $(".loading-overlay").css("display", "none");
            UIkit.modal.confirm("<div><h3>Shrug</h3><p>An exact lookup on MAL failed, want to be taken to the search results on MAL?</div>").then(function() {
                window.location = "https://myanimelist.net/search/all?q=" + encodeURI(title);
            });
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
        if (ANIME[i].media.status != "FINISHED" && (ANIME[i].media.isAdult == false || !block_adult_content)) {
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
    var anilink = "https://anilist.co/anime/" + data.media.id;
    var cardBody = '<div class="anime" id="anime-' + data.media.id + '">\
                        <div class="uk-card uk-card-default uk-card-hover"> \
                            <div class="anime-overlay hide-overlay" id="anime-overlay-' + data.media.id + '"><button id="anilist-'+ data.media.id +'"class="uk-button uk-button-default anime-button">AniList</button><button id="kitsu-'+ data.media.id +'"class="uk-button uk-button-default anime-button" anime-title="' + data.media.title.romaji + '">Kitsu</button><button id="mal-'+ data.media.id +'"class="uk-button uk-button-default anime-button" anime-title="' + data.media.title.romaji + '">MAL</button></div>\
                            <div class="uk-card-media-top" style="height: 325px; background: ' + "url('" + data.media.coverImage.large + "');" + 'background-size: cover; background-position: center center;"> \
                            </div> \
                            <div class="uk-card-body"> \
                                <h4>' + title + '</h4> \
                            </div> \
                            <div class="uk-card-footer"><span class="uk-margin-small-right" uk-icon="icon: clock"></span>'+ time +'</div> \
                        </div> \
                    </div>';

    $("#card-holder").append(cardBody);
    applyCardClickedListener(data.media.id);
}


function applyCardClickedListener(id) {
    $("#anime-" + id).click(function() {
        $("#anime-overlay-" + id).toggleClass('hide-overlay');
    });

    $("#anilist-" + id).click(function() {
        $(".loading-overlay").css("display", "flex");
        window.location = "https://anilist.co/anime/" + id;
    });

    $("#kitsu-" + id).click(function() {
        navigateToKitsu($("#kitsu-" + id).attr("anime-title"));
    });

    $("#mal-" + id).click(function() {
        navigateToMAL($("#mal-" + id).attr("anime-title"));
    });
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
    var nameSort = $("#sort-by-name");
    var timeSort = $("#sort-by-time");

    timeSort.click(function(){
        if (!isButtonActive("#menu-button-active")) {
            timeSort.toggleClass("menu-button-active");
            nameSort.toggleClass("menu-button-active");
            ANIME.sort(sort_functions[0]);
            processAnime();
        }
    });
    
    nameSort.click(function(){
        if (!isButtonActive("#menu-button-active")) {
            timeSort.toggleClass("menu-button-active");
            nameSort.toggleClass("menu-button-active");
            ANIME.sort(sort_functions[1]);
            processAnime();
        }
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
        block_adult_content = !block_adult_content;
        $("#block-adult").toggleClass("menu-button-active");
        $("#block-adult").html(block_adult_content ? "SHOW ANY 18+ CONTENT" : "HIDE ANY 18+ CONTENT");
        processAnime();
    });
}


// Get whether or not a button is active
function isButtonActive(button_id) {
    return $(button_id).hasClass("menu-button-active");
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


function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
