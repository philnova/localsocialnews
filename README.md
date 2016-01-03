# localsocialnews
One destination to find everything going on in your city

This is the code powering localsocialnews.com (LSN). LSN supports simultaneous queries for information relevant to your city: New York Times, Yelp, Twitter, Instagram, Wikipedia, and Eventbrite.

## Structure

index.html contains the main page. It uses a built-in script to build tabs containing the various sites tha can be queried. It loads other external scripts, held in the scripts folder, to execute those queries. The API for each resource is unique and impmentation details are in the respective javascript files.

## Implementation

All APIs are accessed directly on the client side using JavaScript, except for Twitter, whose API requires more sophisticated validation. The module twitter.js calls search_server.php. Users should obtain API keys from Twitter and fill them into api_tokens.php, which should be kept private.

## Citations

This site depends on the work of many other programmers, but two resources stand out in particular:
1) http://140dev.com/ which provided the PHP code used on the server side for Twitter queries, and the CSS for styling Tweets and the search bar
2) http://www.elated.com/articles/javascript-tabs/ which provided the code for building the tabs in JavaScript, and some additional CSS
