function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace)
}

jQuery(document).ready(function($) {

	// Run when Search button is clicked
	$('#search_button').click(function(){

        var $eventbriteHeaderElem = $('#eventbrite-header');
        var $eventbriteContent = $('#eventbrite-content');

        $eventbriteContent.html('<img src="images/ajax_loader.gif" >')

        var search_value_uri = encodeURIComponent($('input[name=search_terms]').val());

        var token = 'JTWMLETQOD4UPEJJD35C';

        var formatEvent = function(name, text_description, logo, start_time_utc, end_time_utc, url){
            var html_string = '<li><div class="eventbrite-event">'+
            '<table class="tg">'+
                  '<tr>'+
                    '<th class="tg-yw4l" rowspan="3"><img src="'+logo+'" height="100px" width="150px"></th>'+
                    '<th class="tg-yw4l"><a href="'+url+'">'+name+'</a></th>'+
                  '</tr>'+
                  '<tr>'+
                    '<td class="tg-yw4l">'+text_description+'</td>'+
                  '</tr>'+
                  '<tr>'+
                    '<td class="tg-yw4l">'+start_time_utc+'-'+end_time_utc+'</td>'+
                  '</tr>'+
            '<table></div></li><br />';
            return html_string;
        };

        var eventbriteRequestTimeout = setTimeout(function(){
                $eventbriteContent.text("ERROR: Failed to get Eventbrite resources!");
                }, 10000);

        $.get('https://www.eventbriteapi.com/v3/events/search/?token='+token+'&venue.city='+search_value_uri, function(res) {
            if(res.events.length) {
                clearTimeout(eventbriteRequestTimeout);
                $eventbriteContent.text("");
                //console.log(res.events);
                for (var i=0; i < res.events.length; i++){
                    var name = res.events[i].name.text;
                    
                    if (res.events[i].description.text === undefined || res.events[i].description.text === null){
                        var text_description = "No Description Available";
                    }
                    else {
                        var text_description = res.events[i].description.text;
                    }
                    
                    if (text_description.length > 300) {
                        text_description = text_description.slice(0,400) + '...';
                    }
                    if (res.events[i].logo === undefined || res.events[i].logo === null){
                        var logo = 'images/eventbrite-logo.png';
                    }
                    else {
                        var logo = res.events[i].logo.url;
                    }
                    
                    var start_time_utc = new Date(res.events[i].start.utc);
                    var end_time_utc = new Date(res.events[i].end.utc);

                    //console.log(res.events[i]);

                    var url = res.events[i].url;
                    



                    $eventbriteContent.append(formatEvent(name, text_description, logo, start_time_utc, end_time_utc, url));
                }
            } else {
                eventbriteContent.text('No events found for this location');
            }
        });

		
        })
    })		
