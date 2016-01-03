function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
}

jQuery(document).ready(function($) {

	// Run when Search button is clicked
	$('#search_button').click(function(){



		var $yelpHeaderElem = $('#yelp-header');
		var $yelpContent = $('#yelp-content');

		var search_value = $('input[name=search_terms]').val();
		var yelp_search_value = replaceAll(search_value, ' ','+');

		$yelpContent.html('<img src="images/ajax_loader.gif" >')

		var auth = {
                //
                // Update with your auth tokens.
                //
                consumerKey : "9nkryeNYMPwlhnpqSHDWtQ",
                consumerSecret : "q0FaSgFc4VsPVI_5gsxFEvXqh9w",
                accessToken : "9dxHDmsnfewZ2rzuytu-vq0vtJrWCo59",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
                accessTokenSecret : "zTtT2KUmcRemBNJ61xY7LJw7Vjw",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };

            var terms = 'food';
            var near = yelp_search_value;

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            //console.log(parameterMap);

            var formatYelpBusinesses = function(image_url, is_closed, street_address, neighborhood, cross_streets, name, phone, rating, rating_image, n_reviews, url, categories){

                var open = "Currently Open";
                if (is_closed) {
                    open = "Currently Closed";
                }
                var category_string = categories[0];
                for (var i = 1; i < categories.length; i++){
                    category_string = category_string + ', ' + categories[i];
                }

                // return <p><img src="'+ rating_image +'"> <strong>Reviews:</strong> '+n_reviews+' <strong>Neighborhood:</strong> '
                // + neighborhood +' <strong>Categories:</strong> ' + category_string + '</p></div></li>';

                return '<li><div class="yelp-businesses"><table style="width:100%"><tr><td rowspan="3" width="15%"><p><img src="'
                +image_url+'" height=75 width=75></p><img src="'+rating_image+'"></td><th><a href="'+url+'">'+name+'</th></tr><tr><td>'+
                '<strong>Neighborhood: </strong>'+neighborhood+'</td></tr><tr><td><strong>Categories: </strong>'+category_string+
                '</td></tr></table></div></li><br />'
            };

            var yelpRequestTimeout = setTimeout(function(){
        		$yelpContent.text("ERROR: Failed to get Yelp resources!");
    			}, 10000);

            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {
                    //console.log(data);
                    $yelpContent.text("");
                    clearTimeout(yelpRequestTimeout);
                    for (var i = 0; i < data.businesses.length; i++){

                        var categories = [];
                        for (var j = 0; j < data.businesses[i].categories.length; j++){
                            categories.push(data.businesses[i].categories[j][0]);
                        }
                        var image_url = data.businesses[i].image_url;
                        var is_closed = data.businesses[i].is_closed;
                        var street_address = data.businesses[i].location.address[0];
                        if (data.businesses[i].location.hasOwnProperty("neighborhoods")){
                        	var neighborhood = data.businesses[i].location.neighborhoods[0]; //this is an array
                    	}
                    	else {
                    		var neighborhood = "Unknown Neighborhood";
                    	}
                        var cross_streets = data.businesses[i].location.cross_streets;
                        var name = data.businesses[i].name;
                        var phone = data.businesses[i].phone;
                        var rating = data.businesses[i].rating;
                        var rating_image = data.businesses[i].rating_img_url;
                        var n_reviews = data.businesses[i].review_count;
                        var url = data.businesses[i].url;

                        $yelpContent.append(formatYelpBusinesses(image_url, is_closed, street_address, neighborhood, cross_streets, name, phone, rating, rating_image, n_reviews, url, categories));

                        //console.log(name);


                    };
                    
                }
            });
        })
    })		
