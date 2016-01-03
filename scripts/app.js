function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
}

jQuery(document).ready(function($) {

	// Run when Search button is clicked
	$('#search_button').click(function(){
		
		var $body = $('body');
		var $greeting = $('#greeting')

		var $nytHeaderElem = $('#nytimes-header');
		var $nytContent = $('#nytimes-content');
    	
    	var $redditHeaderElem = $('#reddit-header');
		var $redditContent = $('#reddit-content');

		var $twitterHeaderElem = $('#twitter-header');
		var $twitterContent = $('#twitter-content');

		var $eventbriteHeaderElem = $('#eventbrite-header');
		var $eventbriteContent = $('#eventbrite-content');

		var $wikiHeaderElem = $('#wiki-header');
		var $wikiContent = $('#wiki-content');

		var $yelpHeaderElem = $('#yelp-header');
		var $yelpContent = $('#yelp-content');

		var $instagramHeaderElem = $('#instagram-header');
		var $instagramContent = $('#instagram-content');
    	

    	//get the value supplied by the user
    	var search_value_uri = encodeURIComponent($('input[name=search_terms]').val());
    	var search_value = $('input[name=search_terms]').val()
    	//console.log(search_value);
    	//console.log(search_value_uri);

    	//update greeting
    	$greeting.text("What's new in "+search_value+'?');

    	//clear old text before making new requests
    	$nytContent.text("");
    	$redditContent.text("");
    	$twitterContent.text("");
    	$eventbriteContent.text("");
    	$wikiContent.text("");
    	$yelpContent.text("");
    	$instagramContent.text("");

    	//update all headers
    	$nytHeaderElem.text("Times Articles About "+search_value);
    	$redditHeaderElem.text("Top Reddit Threads From /r/"+search_value);
    	$twitterHeaderElem.text("Tweets About "+search_value);
    	$eventbriteHeaderElem.text("Events in "+search_value);
    	$wikiHeaderElem.text("Wikipedia Articles About "+search_value);
    	$yelpHeaderElem.text("Top Restaurants in "+search_value);
    	$instagramHeaderElem.text("Photos Tagged #"+search_value);


    	//load NYT
    	var NYT_API = '488c37410e0fd34051a6862ce48709b1:12:66301836';
    	var NYT_BASE_URL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=search term&api-key=####';

    	NYT_BASE_URL = NYT_BASE_URL.replace('search term', search_value_uri);
    	NYT_BASE_URL = NYT_BASE_URL.replace('####', NYT_API);
    

    	$.getJSON(NYT_BASE_URL, function(data) {
        	var nyt_element = '<ul id="nytimes-articles"><a href="*URL*">*HEADLINE*</a><p>*SNIPPET*</p></ul><br />';
        	for (var i = 0; i < data.response.docs.length; i++) {
            	//console.log(data.response.docs[i]);
            	to_append = nyt_element.replace('*URL*', data.response.docs[i].web_url);
            	to_append = to_append.replace('*HEADLINE*', data.response.docs[i].headline.main);
            	to_append = to_append.replace('*SNIPPET*', data.response.docs[i].snippet);
            	$nytContent.append(to_append);
        	}
    	}).fail( function() {
        	//chain .fail(handler) to the AJAX request to NYTimes to display error message if request fails
        	$nytContent.text('ERROR: Articles Could Not be Loaded!');
    	});

    	//load wikipedia
    	var wikiRequestTimeout = setTimeout(function(){
        	$wikiContent.text("ERROR: Failed to get wikipedia resources!");
    	}, 10000);

    	var WIKI_BASE_URL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + search_value_uri + '&format=json';
    	$.ajax(WIKI_BASE_URL, {
        	dataType: "jsonp",
        	success: function(response) {
           	 	//console.log(response);
            	var articleList = response[1];

            	for (var i = 0; i < articleList.length; i++) {
                	articleStr = articleList[i];
                	var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                	$wikiContent.append('<li><a href="' + url + '">' + 
                    	articleStr + '</a></li>')
            	};

            	clearTimeout(wikiRequestTimeout);
            	//clearTimeout prevents the timeout we initiated at the start of the call from occuring, so long as we finish within 8 seconds
        	}
        	//jsonp: true,
        	//jsonpCallback: wikiCallback
        	});

    	//load reddit
    	var REDDIT_BASE_URL = 'http://www.reddit.com/r/*CITY*/.json?jsonp=?';
    	REDDIT_BASE_URL = REDDIT_BASE_URL.replace('*CITY*', replaceAll(search_value, ' ', ''));

    	function formatRedditPost(author, score, comments, timestamp, link, title, thumbnail, thumbnail_height, thumbnail_width) {

        	return '<li><div class="reddit-post"><table style="width:100%"><tr><td rowspan="3" width="15%"><img src="'
                +thumbnail+'" height=75 width=75></td><th><a href="'+link+'">'+title+'</th></tr><tr><td>'+
                '<strong>Score: </strong>'+score+'</td></tr><tr><td><strong>Comments: </strong>'+comments+
                '</td></tr></table></div></li><br />'
    	};

    	

    	$.getJSON(REDDIT_BASE_URL, function(response) {
        	$redditContent.text('');
        	for (var i = 0; i < response.data.children.length; i++) {
	            var author = response.data.children[i].data.author;
	            var score = response.data.children[i].data.score;
	            var comments = response.data.children[i].data.num_comments;
	            var timestamp = response.data.children[i].data.created;
	            var link = "http://www.reddit.com" + response.data.children[i].data.permalink;
	            var title = response.data.children[i].data.title;
	            if (response.data.children[i].data.hasOwnProperty('preview')) {
	                var thumbnail = response.data.children[i].data.preview.images[0].source.url;
	                var thumbnail_height = response.data.children[i].data.preview.images[0].source.height;
	                var thumbnail_width = response.data.children[i].data.preview.images[0].source.width;
	            }
	            else {
	                //var thumbnail = 'http://www.adweek.com/socialtimes/files/2014/11/snoobyebye.jpg';
	                var thumbnail = 'images/snoo.jpg';
	            }

	            //console.log(link);

	            var formattedPost = formatRedditPost(author, score, comments, timestamp, link, title, thumbnail, thumbnail_height, thumbnail_width);
	            $redditContent.append(formattedPost);
	            
	        }
    	}).fail(function() {$redditContent.text('ERROR: le reddit army is curiously silent');});
		

		


	})
});