function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
}

jQuery(document).ready(function($) {

	// Run when Search button is clicked
	$('#search_button').click(function(){

		var $instagramHeaderElem = $('#instagram-header');
		var $instagramContent = $('#instagram-content');

		var city_nospace = replaceAll($('input[name=search_terms]').val(), ' ','');
		$instagramContent.html('<img src="images/ajax_loader.gif" >')

		var client_id = 'b9a72c09d2bb4e7d9e0e6a953141a0e4';
		var client_secret = '9e0e358956ab4c8ab20c2e1fc6d11962';
		var id = 'c1302f417cda4e09968eaec958fe0ae2';

        var instagramRequestTimeout = setTimeout(function(){
                $instagramContent.text("ERROR: Failed to get Instagram resources!");
                }, 10000);
	
		$.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: "https://api.instagram.com/v1/tags/"+city_nospace+"/media/recent?client_id="+id,
            success: function(response) {
                clearTimeout(instagramRequestTimeout);
            	$instagramContent.text("");
                for (var i = 0; i < response.data.length; i++){
                	var image = response.data[i].images.standard_resolution.url;
                	var link = response.data[i].link;
                	var height = response.data[i].images.standard_resolution.height;
                	var width = response.data[i].images.standard_resolution.width;
                	var caption = response.data[i].caption.text;

                	var formatted_html = '<p><a href="'+link+'"><img src="'+image+'" height="'+height+'" width="'+width+'" ></a></p><p>'+caption+'</p><br />;';

                	$instagramContent.append(formatted_html);

                }

            }
        });




	})
});