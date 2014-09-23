console.log('The Iron Yard Rocks');

function renderTemplate(templateId, container, finalArgument) {
    var templateString = $('#' + templateId).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(finalArgument);
    $(container).append(renderedTemplate);
};

var defaultPost = {
	title: "<Untitled>",
	body: "",
	createdAt: new Date(0)		/*Need to add date field to list/templates*/
};


var serverUrl = "http://tiny-pizza-server.herokuapp.com/collections/plove";


//GET INITIAL LIST OF POSTS. TURN THIS INTO A FUNCTION YOU CAN CALL AGAIN!
$.getJSON("http://tiny-pizza-server.herokuapp.com/collections/plove").done(function(posts) {
    
	var sortedPostArray = _.sortBy(posts, function(p) {
		return Date.parse(p.createdAt);
	});

	/*var sortedPosts = _.sortBy(posts, 'createdAt').reverse() 			F THIS NOT WORKING*/
    _.each(sortedPostArray, function(post) {
    	_.defaults(post, defaultPost);
        renderTemplate('listTemplateScript', '.biggerBox', post);
    });
});

//LOAD POST YOU CLICK ON INTO NEW FORM FROM TEMPLATE...document is just another method of having clickableList there and removing the second argument
$(document).on('click', ".clickableList", function(loaded) {

    var clickedPost = $(this).attr("data-id");
    $.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove/" + clickedPost, {
        type: "GET",
        dataType: "json"
    }).done(function(data) {
        $("#blogPostMgmt").html("");
        console.log(data);
        renderTemplate('formTemplateScript', '#blogPostMgmt', data);
    });    
    loaded.preventDefault();

});

//POST NEW POST
    $("form").submit(function(event) {			/* .on('submit', function (event) maybe more standard */
    	event.preventDefault();
        var rawData = $(this).serializeArray();


        var model = _.reduce(rawData, function(acum, item) {			/* WTF does this do? */
        	acum[item.name] = item.value;
        	return acum;
        }, {});


        $.ajax(serverUrl, {
            type: "POST",
            dataType: "json",
            data: model
        });
    });

//UPDATE POST CURRENTLY IN FORM
    $("button[name=updatePost]").on('click', function() {			/* use (document).on? */
    	event.preventDefault();
    	var theId = $(this).attr('data-id');
    	var thePost = _.findWhere(postCollection, {_id: theId})
    });

//DELETE POST CURRENTLY IN FORM
    $("button[name=delete]").on('click', function(loaded) {
        loaded.preventDefault();

    	var clickedPost = $(this).attr("data-id");
    	console.log(this);
    	$.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove/" + clickedPost, {
            type: "DELETE"
        });

        //ADD FUNCTION BELOW TO HAVE IT RELOAD POSTS AFTER A DELETION, BUT RIGHT NOW DELETE IS POSTING OR ELSE JUST THE REFRESH IS DOING SO.

    });

//REFRESH LIST OF POSTS.  USE FUNCTION FROM ABOVE!!
    $("button[name='refreshList']").on('click', function() {

        $.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove", {
            type: "GET",
            dataType: "json"
        }).done(function(data) {
            $(".biggerBox").html("");
            _.each(data, function(post) {
                console.log(post);
                renderTemplate('listTemplateScript', '.biggerBox', post);
            });
        });
    });



/*
$('button').on('click', function() {
console.log($('#blogPostMgmt').serializeArray());
});
*/



/*var renderedTemplate = */

/*WORKS BUT TIRED OF POSTING
$.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove", {
	type: "POST",
	dataType: 'json',
	data: {
		title: "Need a title",
		body: "fine"
	}
});
*/