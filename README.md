# Anime-Today

This is a simple web-app built using the [AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs) for displaying the shows currently airing today and tomorrow. Can be seen live [here](http://anime-today.com)


## Setup
This was built using just vanilla JS (& JQuery), CSS, and HTML. Nothing fancy. Just open `index.html` in your browser and you should be good to go. 

Only thing to note is you will see an errors related to the GA setup. `js/googleAnalyticsid.js 404 (File not found)` and `getGoogleAnalyticsId is not defined`. Doesn't affect anything running locally, I was just lazy and didn't want to stub in a dummy key every time I committed. 


## Update:
Migrated to V2 of AniList's API. It's using GraphQL for data retrieval and doesn't require any Access Tokens for publically accessible info like what this site pulls. 

If you want to checkout GraphQL AniList has a helpful [getting started guide](https://anilist.gitbooks.io/anilist-apiv2-docs/graphql/getting-started.html) on their site, along with the [full docs](https://anilist.github.io/ApiV2-GraphQL-Docs/) for what you can query. They also have a [live query editor](https://anilist.co/graphiql) which is super helpful. 

##### Note: You have to be signed into an [anilist.co](https://anilist.co/) account that's setup as a developer for the live editor to work.



## Author & License 

Built by [Aystub](https://github.com/Aystub) 

```
Copyright 2018 Aystub

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```