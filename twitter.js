function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
}


jQuery(document).ready(function($) {

	// Run when Search button is clicked
	$('#search_button').click(function(){

		var $twitterHeaderElem = $('#twitter-header');
		var $twitterContent = $('#twitter-content');

		var search_value_uri = encodeURIComponent($('input[name=search_terms]').val());
		var search_value = $('input[name=search_terms]').val();
		$twitterContent.html('<img src="images/ajax_loader.gif" >')

		var twitterRequestTimeout = setTimeout(function(){
        		$twitterContent.text("ERROR: Failed to get Twitter resources!");
    			}, 10000);

		//load twitter
		$.ajax({
                url: 'search_server.php?q=' + search_value_uri,
                success: function(data){
                	clearTimeout(twitterRequestTimeout);
                	$twitterContent.text("");
                    //console.log(data);
                    // Display the results
                    var toDisplay = data;
                    console.log(toDisplay);
                    $twitterContent.append(toDisplay);
                }
                    
                
            })
		


	})
});