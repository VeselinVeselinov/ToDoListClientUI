$(function (){
	/* current user's id */
	const id = parseInt($('#identifier').html());

	/* accounts container */
    var $entities = $('#entities');
    
    /* templates */
    var entitiesTemplate = $('#entity-template').html();
    var addTemplate = $('#adding-template').html();
    
    /* Enables tooltip pop-up messages. */
    $('[data-toggle="tooltip"]').tooltip();
    
    // dec2hex :: Integer -> String
    // i.e. 0-255 -> '00'-'ff'
    function dec2hex (dec) {
    	return ('0' + dec.toString(16)).substr(-2)
	}

    // generateId :: Integer -> String
	function generateId (len) {
		var arr = new Uint8Array((len || 40) / 2)
		window.crypto.getRandomValues(arr)
		
		return Array.from(arr, dec2hex).join('')
	}
    
	/* The script below sends a request, retrieves the current user's accounts 
	  	and renders them into html elements. */
	sendGetRequest("Acc/FindExt?fieldName=userid&value=" + id, function (entities) {
        $.each(entities, function(i, entity){
        	renderTemplate(entitiesTemplate, entity, $entities);
        })
    });
	
	/* The script below generates default account field values and creates the
	 * account by sending a post request to the api, after which it renders the 
	 * api response with Mustache.js */
    $('#add-acc').click(function(){
    	var uuid = generateId(10);

    	var account = {
    			code: generateId(3),
    			name: "NewlyAdded Account",
    			description: "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Robot-512.png",
    			firstName: "Anonymous",
    			lastName: "Anonymous",
    			address: "-",
    			phone: "-",
    			statusId: 1,
    			email: uuid + "@gmail.com",
    			userId: id
    	};
    	
    	sendPostRequest("Acc/AddItem", account, function(entity){
    		renderTemplate(entitiesTemplate, entity, $entities);
    		$('li:last').find('.editEntity').trigger( "click" );
        	$('li:last').find('input.email').focus();
    	});
    })
    
    /* This function sends a request to the api in order to retrieve 
     * the current user's accounts and visualize them in the html with Mustache.js rendering */
    $('#list-all').click(function(){
    	sendGetRequest("Acc/FindExt?fieldName=userid&value=" + id, function (entities) {
            $('li').remove();
    		
    		$.each(entities, function(i, entity){
            	renderTemplate(entitiesTemplate, entity, $entities);
            })
            
            renderResponeMessage("#feedback", 
            		"All of your accounts are currently shown on display. ");
        });
    })
    
    /* The script below sends a search request for the currently selected filter
    	and renders the api result. */
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var filter = $('#select-attribute option:selected').attr('data');
    	var valueInput = $('#search-tool input').val();
    	
    	if(valueInput.length == 0){
    	    renderResponeMessage('#feedback-failure',
    	    		"Please enter a value in order to use the search tool.");
    	}
    	else{
    		var searchUrl = "Acc/GetByIdAnd" + filter + "?userId=" + id +
			"&" + filter + "=" + valueInput;
    		
    		sendGetRequest(searchUrl, function(accounts){
    			if (accounts.length == 0) {
    				
    				renderResponeMessage("#feedback-failure", 
    						"The accounts you have been looking for haven't been found. ")
				}
    			else {
    				$('li').remove();
    				
    				$.each(accounts, function(i, account){
    		        	renderTemplate(entitiesTemplate, account, $entities);
    		        })
    		        
    		        renderResponeMessage("#feedback", 
    		        		"The accounts you have looking for have been found. ")
    			}
    		});
    	}
    });

    /* The script below removes the current account container the remove event was 
     * triggered on. */
    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var self = this;
        var id = parseInt($li.find('span.identifier').html());

        sendDeleteRequest("Acc/Delete/" + id, function(Response){
            $li.fadeOut(300, function(){
                $(this).remove();
            });

            renderResponeMessage("#feedback", Response);
        });
    });

    /* This script enables account editing by manually replacing the non-editable span fields
     * with form inputs. */
    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.fname').val($li.find('span.fname').html());
        $li.find('input.lname').val($li.find('span.lname').html());
        $li.find('input.email').val($li.find('span.email').html());
        $li.find('input.phone').val($li.find('span.phone').html());
        $li.find('input.address').val($li.find('span.address').html());
        $li.find('input.sname').val($li.find('span.sname').html());
        $li.addClass('edit');
    });

    /* Disables account editing by removing the edit class so that the form fields change back to
     * non-editable spans. */
    $entities.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    });

    /* Creates an account entity by retrieving the form input fields and sending a post request, 
     * after which it manually replaces the old account's data with the updated information. */
    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        var account = {
            name: $li.find('input.name').val(),
            firstName: $li.find('input.fname').val(),
            lastName: $li.find('input.lname').val(),
            email: $li.find('input.email').val(),
            phone: $li.find('input.phone').val(),
            address: $li.find('input.address').val(),
            statusId: parseInt($li.find('span.statusId').html()),
            userId: parseInt($li.find('span.userId').html()),
            active: 1,
            description: $li.find('input.edit.form-control.url-image').val()
        }
        
        sendPutRequest("Acc/UpdateItem/" + id, account, function (Response) {
            $li.find('span.name').html(account.name);
            $li.find('span.fname').html(account.firstName);
            $li.find('span.lname').html(account.lastName);
            $li.find('span.email').html(account.email);
            $li.find('span.phone').html(account.phone);
            $li.find('span.address').html(account.address);
            $li.find('input.edit.form-control.url-image').val(account.description);
            $li.find('.img-fluid.img-content').attr('src', account.description);
            $li.removeClass('edit');

            renderResponeMessage("#feedback", Response);
        });
    });
});