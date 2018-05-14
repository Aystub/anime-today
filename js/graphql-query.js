var graphQLQuery = "\
  query($last: Int, $next: Int) {\
      Page {\
        airingSchedules(airingAt_greater: $last, airingAt_lesser: $next) {\
          media {\
            id\
            title {\
              english\
              romaji\
            }\
            coverImage {\
              large\
            }\
            nextAiringEpisode {\
                airingAt\
                timeUntilAiring\
                episode\
            }\
            isAdult\
            siteUrl\
          }\
        }\
      }\
  }\
";

var graphQLVariables = {
    "last": (new Date().setHours(0,0,0,0) / 1000),
    "next": (new Date().setHours(24,0,0,0) / 1000)
  };