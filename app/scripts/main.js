console.log('The Iron Yard Rocks');

function renderTemplate(templateId, container, finalArgument) {
    var templateString = $('#' + templateId).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(finalArgument);
    $(container).append(renderedTemplate);
};

//GET INITIAL LIST OF POSTS
$.getJSON("http://tiny-pizza-server.herokuapp.com/collections/plove").done(function(data) {
    //console.log(data);
    var postArray = data.map(function(item) {
        return {
            "title": item.title,
            "author": item.author,
            "body": item.body,
            "_id": item._id
        };
    });
    _.each(postArray, function(post) {
        renderTemplate('listTemplateScript', '.biggerBox', post);
    });
});

//LOAD POST YOU CLICK ON INTO NEW FORM FROM TEMPLATE...document is just another method of having clickableList there and removing the second argument
$(document).on('click', ".clickableList", function(loaded) {

    var clickedPost = $(this).attr("id");
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
    $("form").submit(function(event) {
        var dataArray = $(this).serializeArray();
        event.preventDefault();

        $.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove", {
            type: "POST",
            dataType: "json",
            data: dataArray
        });
    });

//UPDATE POST CURRENTLY IN FORM
    $("button[name='updatePost']").on('click', function() {
    	;
    });

//DELETE POST CURRENTLY IN FORM
    $("button[name='delete']").on('click', function(loaded) {

    	var clickedPost = $(".getThisOne").attr("id");
    	$.ajax("http://tiny-pizza-server.herokuapp.com/collections/plove/" + clickedPost, {
            type: "DELETE"
        });
        loaded.preventDefault();

        //ADD FUNCTION BELOW TO HAVE IT RELOAD POSTS AFTER A DELETION, BUT RIGHT NOW DELETE IS POSTING OR ELSE JUST THE REFRESH IS DOING SO.

    });

//REFRESH LIST OF POSTS
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