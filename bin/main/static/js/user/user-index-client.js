$(function (){
	/* current user's id */
	const id = parseInt($('#identifier').html());

	/* templates */
    var $entities = $('#entities');
    var entitiesTemplate = $('#entity-template').html();
    var addTemplate = $('#adding-template').html();
    
    /* This script handles the initial  
     * rendering of the current client's user 
     * - sends an ajax request and renders the api response with Mustache.js*/
    sendGetRequest("User/FindExt?fieldName=id&value=" + id, function (entities) {
        $.each(entities, function(i, entity){
        	renderTemplate(entitiesTemplate, entity, $entities)
        })
    });

    /* This script enables user editing by 
     * changing the non-editable span fields to form inputs. */
    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.pass').val("********");
        $li.addClass('edit');
    });

    /* The script below disables user editing by removing the edit class
     * and changing the form input fields back to non-editable spans. */
    $entities.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    });

    /* This script collects the user edit form input fields and sends 
     * an update, after which manually swaps the old user data with the new updated
     * information. */
    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());
        var pass = $li.find('input.pass').val();
        
        var user = {
            userName: $li.find('input.name').val(),
            password: $li.find('input.pass').val(),
            statusId: parseInt($li.find('span.statusId').html()),
            active: 1
        }
        
        if(pass.length < 8 || pass == "********")
        {
        	renderResponeMessage("#feedback-failure", 
        			"Password must be at least 8 symbols that are not the default field value! ");
        }
        else 
        { 
        	sendPutRequest("User/UpdateItem/" + id, user, function (Response) {
                $li.find('span.name').html(user.userName);
                $li.find('span.pass').html("********");
                $li.removeClass('edit');

                renderResponeMessage("#feedback", Response);
            });
        }
    });
});