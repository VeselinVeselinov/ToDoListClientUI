$(function (){
	/* containers */
    var $entities = $('#entities');
    
    /* templates */
    var entitiesTemplate = $('#entity-template').html();
    
    /* This script simply redirects the administrator to an account creation form. */
    $('#add-acc').click(function(){
    	var token = getAuthToken();
    	
    	var url = "/account/add?authToken=" + token;
        return window.location = url;
    });
    
    /* This script simply sends a list all request to api and renders the response
     *  with Mustache.js */
    $('#list-all').click(function(){
    	sendGetRequest("Acc/ListAll", function (accounts) {
    		$("li").remove();
    		
            $.each(accounts, function(i, account){
            	renderTemplate(entitiesTemplate, account, $entities);
            })
            
            renderResponeMessage('#feedback',
            	"All of the system's accounts are currently on display. ");
        });
    });
    
    /* This script functions as a search engine - the client picks a filter, enters a value
     * and sends a get request to the server, after which if the sought after account/s truly
     * exist - will be displayed via Mustache.js rendering. */
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var filter = $('#select-attribute option:selected').attr('data');
    	var valueInput = $('#search-tool input').val();
    	
    	if(valueInput.length == 0){
    		
    		renderResponeMessage('#feedback-failure', 
    				"Please enter a value in order to use the search tool.");
    	}
    	else{
    		var filterUrl = "Acc/FindExt?fieldName=" + filter + "&value=" + valueInput; 
    		
    		sendGetRequest(filterUrl, function(accounts){
    			
    			if (accounts.length != 0) {
    				$("li").remove();
    				
    				$.each(accounts, function(i, account){
    					renderTemplate(entitiesTemplate, account, $entities);
                	});
    				
    				renderResponeMessage('#feedback', 
    						"The account/s you have been looking for have been found. ")
				}
    			else renderResponeMessage('#feedback-failure', 
    					"Unfortunately the account/s haven't been found. :(")
    			
    		});
    	}
    });
    
    /* The script below sends an account list all request 
     * and renders the api response with Mustache.js  */
    sendGetRequest("Acc/ListAll", function (accounts) {
        $.each(accounts, function(i, account){
        	renderTemplate(entitiesTemplate, account, $entities);
        })
    });

    /* The script below sends a delete request for the account which's container
     * the delete event was triggered on. It also manually removes the account container
     * from the html with a simple jquery fadeout animation. */
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

    /* The script below replaces the non-editable elements with form inputs 
     * when the edit button is triggered. It creates a SPA effect, but is rather simpler. */
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
        
        var currentUser = $li.find('span.user').html();
        $dropdownUser = $li.find('select.user');
        
        sendGetRequest("User/ListAll", function(users){
    		$.each(users, function() {
                if(this.userName == currentUser)
                {
                	$dropdownUser.append($("<option selected/>").val(this.id).text(this.userName));
                }
                else $dropdownUser.append($("<option />").val(this.id).text(this.userName));
            });
    	});
        
        var currentStatus = $li.find('span.staName').html();
        $dropdownStatus = $li.find('select.staName');
        
        sendGetRequest("AccountStatus/ListAll", function(statuses){
    		$.each(statuses, function() {
                if(this.name == currentStatus)
                {
                	$dropdownStatus.append($("<option selected/>").val(this.id).text(this.name));
                }
                else $dropdownStatus.append($("<option />").val(this.id).text(this.name));
            });
    	});
    });

    /* The script below makes the current account non-ediatable and it disposes
     * the status and user dropdowns by removing their select options. */
    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
        $(this).closest('li').removeClass('edit');
        
        $dropdownUser = $li.find('select.user option');
        $dropdownUser.remove();
        $dropdownStatus = $li.find('select.staName option');
        $dropdownStatus.remove();
    });

    /* The script below retrieves the input data from the form and sends an update request
     * and if the request meets the requirements of the server - renders the response
     * in html elements. */
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
            statusId: parseInt($li.find('select.staName option:selected').val()),
            userId: parseInt($li.find('select.user option:selected').val()),
            active: 1,
            description: $li.find('input.edit.url-image').val()
        }
        
        var updateUrl = "Acc/UpdateItem/" + id;
        sendPutRequest(updateUrl, account, function (Response) {
            $li.find('span.name').html(account.name);
            $li.find('span.user').html($li.find('select.user option:selected').text());
            $li.find('span.fname').html(account.firstName);
            $li.find('span.lname').html(account.lastName);
            $li.find('span.email').html(account.email);
            $li.find('span.phone').html(account.phone);
            $li.find('span.address').html(account.address);
            $li.find('.img-fluid.img-content').attr('src', account.description);
            $li.find('span.staName').html($li.find('select.staName option:selected').text());
            $li.removeClass('edit');

            renderResponeMessage("#feedback", Response);
            
            $dropdownUser = $li.find('select.user option');
            $dropdownUser.remove();
            $dropdownStatus = $li.find('select.staName option');
            $dropdownStatus.remove();
        });
    });
});