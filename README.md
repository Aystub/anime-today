# Anime-Today

This is a simple web-app built using the [AniList API](http://anilist-api.readthedocs.io/en/latest/) for displaying the shows currently airing today and tomorrow. Can be seen live [here](http://anime-today.com)

## Setup
This was built using just vanilla JS (& JQuery), CSS, and HTML. Nothing fancy. Only thing to note is needing to edit the methods in `auth.js` You need a Client Id and Secret from AniList, this app only requires Client Credientials though see [AniList - Client Credentials](http://anilist-api.readthedocs.io/en/latest/authentication.html#grant-client-credentials) for more info. An example `auth.js` would be: 

```
function getId() {
    return "abcdefghijklmnop" // Your <ID>;
}

function getSecret() {
    return "a1b2c3d4e5f6g7h8" // Your <Secret>
}

function getGoogleAnalyticsId() {
    return ""; // Not needed for testing
}
```

Then just open `index.html` in your browser and you should be good to go

#####  Note: [V2 of the AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs) is in development and this project will be updated once that is stable, V2 of the API does not require Client Creds for public info (what this app accesses) so should simplify things a bit

## Author & License 

Built by [Aystub](https://github.com/Aystub) 

```
Copyright 2017 Aystub

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