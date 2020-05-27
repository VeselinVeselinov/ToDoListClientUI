$(function (){
	/* categories container */
    var $entities = $('#entities');
    
    /* templates */
    var entitiesTemplate = $('#entity-template').html();
    
    /* This script functions as a search engine - the client picks a filter, enters a value
     * and sends a get request to the server, after which if the sought after category/ies truly
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
    		var filterUrl = "Category/FindExt?fieldName=" + filter + "&value=" + valueInput; 
    		
    		sendGetRequest(filterUrl, function(categories){
    			
    			if (categories.length != 0) {
    				$("li").remove();
    				
    				$.each(categories, function(i, category){
    					renderTemplate(entitiesTemplate, category, $entities);
                	});
    				
    				renderResponeMessage('#feedback', 
    						"The category/ies you have been looking for have been found. ")
				}
    			else renderResponeMessage('#feedback-failure', 
    					"Unfortunately the category/ies haven't been found. :(")
    			
    		});
    	}
    });
    
    /* This function sends a list all request to the api and renders the response.
     * Basically this is the initial page seeding with categories. */
    sendGetRequest("Category/ListAll", function (categories) {
    	$.each(categories, function(i, category){
            renderTemplate(entitiesTemplate, category, $entities);
        })
    });
    
    /* This function creates a quick new category with default field values,
     * after which it gets visualized with Mustache.js and gets focused with jquery selector
     * so that it gets targeted instantly after it gets visualized. */
    $('#add-acc').click(function(){
    	
    	var category = {
                name: "NewCategory",
                description: "",
                code: "clientMade"
            };
    	
    	sendPostRequest("Category/AddItem", category, function (Response) {
    		
    		renderTemplate(entitiesTemplate, Response, $entities);
    		
        	$('li:last').find('.editEntity').trigger( "click" );
        	$('li:last').find('textarea.content').focus();
        });
    });
    
    /* This function sends a list all request and afterwards if it is successful
     * - renders the api response with Mustache.js 
     * and removes the other displayed till this moment category containers.*/
    $('#list-all').click(function(){
    	sendGetRequest("Category/ListAll", function (categories) {
    		$('li').remove();
    		
        	$.each(categories, function(i, category){
                renderTemplate(entitiesTemplate, category, $entities);
            })
            
            renderResponeMessage("#feedback", 
            		"All of the system's categories are currently shown to display. ")
        });
    })

    /* This script sends a delete request to the server for the current category container('li') 
     * that the remove event was triggered on. */
    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        sendDeleteRequest("Category/Delete/" + id, function(Response){
        	
            $li.fadeOut(300, function(){
                $(this).remove();
            });

            renderResponeMessage("#feedback", Response);
        });
    });

    /* This script makes the current category container('li') that the edit event was triggered upon
     * editable by manually replacing the non-editable html elements like span with form inputs
     * that the user can edit. */
    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('textarea.edit.content').val($li.find('textarea.noedit.content').val());
        
        $li.addClass('edit');
    });

    /* This function does the opposite of the edit - 
     * it basically replaces the editable input form fields with non-editable spans.
     * This is accomplished by removing the edit class from the current category container
     * the event was triggered on. */
    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
    	
        $li.removeClass('edit');
    });

    /* This function sends a put request to the server for the current category container 
     * and if the update goes successfully the updated category gets visualized manually
     * by replacing the old category info with the updated info.*/
    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        var category = {
            name: $li.find('input.name').val(),
            description: $li.find('textarea.edit.content').val(),
            active: 1
        };
        
        sendPutRequest("Category/UpdateItem/" + id, category, function (Response) {
            $li.find('span.name').html(category.name);
            $li.find('textarea.noedit.content').val(category.description);
            
            $li.removeClass('edit');
            
            renderResponeMessage("#feedback", Response);
        });
    });
});