$(function (){
	/* authentication token */
	const token = getAuthToken();

	/* users container */
    var $entities = $('#entities');
    
    /* templates */
    var entitiesTemplate = $('#entity-template').html();
    
    $('[data-toggle="tooltip"]').tooltip();
    
    /* This is the initial user seeding - it sends a list all request to the api
     * and renders the response if it successful with Mustache.js */
    sendGetRequest("User/ListAll", function (users) {
        $.each(users, function(i, user){
        	renderTemplate(entitiesTemplate, user, $entities);
        })
    });
    
    /* This function simply redirects the admin to a user creation form. */
    $('#add-user').click(function(){
    	var url = "/user/add?authToken=" + token;
    	
        return window.location = url;
    });
    
    $('#list-all').click(function(){
    	sendGetRequest("User/ListAll", function (users) {
    		$('li').remove();
    		
            $.each(users, function(i, user){
            	renderTemplate(entitiesTemplate, user, $entities);
            })
            
            renderResponeMessage("#feedback", 
            		"All of the system's users are currently shown to display. ");
        });
    })
    
    /* This script functions as a search engine - the admin picks a filter, enters a value
     * and sends a get request to the server, after which if the sought after user/s truly
     * exists - will be displayed via Mustache.js rendering. */
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var filter = $('#select-attribute option:selected').attr('data');
    	var value = $('#search-tool input').val();
    	
    	if(value.length == 0){
    		renderResponeMessage('#feedback-failure', 
    				"Please enter a value in order to use the search tool.");
    	}
    	else{
    		var searchUrl = "User/FindExt?fieldName=" + filter + "&value=" + value;
    		
    		sendGetRequest(searchUrl, function (users) {
	        	if(users.length == 0){
	        		
	        		renderResponeMessage('#feedback-failure', 
	        				"The user you have been looking for hasn't been found. ");
	        	}
	        	else{
	        		
	        		$("li").remove();
	        		
    	            $.each(users, function(i, user){
    	                renderTemplate(entitiesTemplate, user, $entities);
    	            })
    	            
    	            renderResponeMessage('#feedback', 
    	            		"The user you have been looking for has been found. ");
	        	}
	        });
    	}
    });

    /* This function sends a delete request for the current user container('li')
     * that the event .remove was triggered on. If everything goes successfully 
     * the user gets removed manually. */
    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        sendDeleteRequest("User/Delete/" + id, function(Response){
        	
            $li.fadeOut(300, function(){
                $(this).remove();
            });

            renderResponeMessage('#feedback', Response);
        });
    });

    /* This script enables user editing by 
     * changing the non-editable span fields to form inputs. */
    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.pass').val($li.find('span.pass').html());
        
        $li.addClass('edit');
        
        var currentStatus = $li.find('span.staName').html();
        $dropdownStatus = $li.find('select.staName');
        
        sendGetRequest("UserStatus/ListAll", function(statuses){
        	
    		$.each(statuses, function() {
    			
    			var option = $('<option data-toggle="tooltip" data-placement="top" title="'
    					+ this.description +'"/>').val(this.id)
    						.text(this.name);
    			
                if(this.name == currentStatus)
                {
                	$dropdownStatus.append(option.attr('selected', 'selected'));
                }
                else $dropdownStatus.append(option);
            });
    	});
    });

    /* The script below disables user editing by removing the edit class
     * and changing the form input fields back to non-editable spans. */
    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
        $(this).closest('li').removeClass('edit');
        
        $dropdownStatus = $li.find('select.staName option');
        $dropdownStatus.remove();
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
            password: pass,
            statusId: parseInt($li.find('select.staName option:selected').val()),
            active: 1
        }
        
        if(pass.length == 0){
        	renderResponeMessage("#feedback-failure", 
        			"Please enter a password!");
        }
        else{	
	        sendPutRequest("User/UpdateItem/" + id, user, function (Response) {
	            $li.find('span.name').html(user.userName);
	            $li.find('span.pass').html("********");
	            $li.find('span.staName').html($li.find('select.staName option:selected').text());
	            
	            $li.removeClass('edit');
	
	            renderResponeMessage("#feedback", Response);
	            
	            $dropdownStatus = $li.find('select.staName option');
	            $dropdownStatus.remove();
	        });
        }
    });
});