$(function (){
    const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');
    const id = parseInt($('#identifier').html());

    var $entities = $('#entities');
    var entitiesTemplate = $('#entity-template').html();
    var addTemplate = $('#adding-template').html();

    function addEntity(entity){
        $entities.append(Mustache.render(entitiesTemplate, entity));
    }
    
    function ciEquals(a, b) {
        return typeof a === 'string' && typeof b === 'string'
            ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
            : a === b;
    }
    
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var accId = $('#identifierAcc').html();
    	var filter = $('#select-attribute option:selected').attr('data');
    	var valueInput = $('#search-tool input').val();
    	
    	if(valueInput.length == 0){
    		$('#feedback-failure').html("Please enter a value in order to use the search tool.");
    	    $("#feedback-failure").delay(3).fadeIn();
    	    $("#feedback-failure").delay(4000).fadeOut();
    	}
    	else{ 
    		$.ajax({
                type: "GET",
                contentType: "application/json",
                url: "https://localhost:44321/api/Category/ListAll",
                headers: {
                    "AuthToken": token
                },
                data: "",
                dataType: 'json',
                cache: false,
                timeout: 600000,
                success: function (entities) {
                	switch (filter) 
                	{
						case "categoryName":
							var filtered = entities.filter(function (entity) {
	              			  return ciEquals(entity.name, valueInput);
	              			});
	              		
		              		if(filtered.length != 0){
		              			$("li").remove();
		                  		$.each(filtered, function(i, entity){
		                  			addEntity(entity);
		                          });
		                          
		                          $('#feedback').html("Elements with name: ("+ valueInput + ") have been found.");
		  	    	    	    $("#feedback").delay(45).fadeIn();
		  	    	    	    $("#feedback").delay(4500).fadeOut();
		              		}
		              		else{
		              			$('#feedback-failure').html("No elements with name: (" + valueInput + ") have been found.");
		          	        	$("#feedback-failure").delay(3).fadeIn();
		          	        	$("#feedback-failure").delay(6000).fadeOut();
		              		}
							break;
						case "desc":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.description, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with description: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with description: (" + valueInput + ") have been found.");
			          	        	$("#feedback-failure").delay(3).fadeIn();
			          	        	$("#feedback-failure").delay(6000).fadeOut();
			              		}
							break;
						default:
							break;
					}
                },
                error: function(error) {
        
                    alert("<p>Well, this is awkward. :/</p>");
                    
                }
            });
    	}
    });
    
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://localhost:44321/api/Category/ListAll",
        headers: {
            "AuthToken": token
        },
        data: "",
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (entities) {
        	$.each(entities, function(i, entity){
                addEntity(entity);
            })
        },
        error: function(error) {

            alert("<p>Well, this is awkward. :/</p>");
            
        }
    });
    
    $('#add-acc').click(function(){
    	var category = {
                name: "NewCategory",
                description: "",
                code: "clientMade"
            };
    	
    	$.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://localhost:44321/api/Category/AddItem",
            headers: {
                "AuthToken": token
            },
            data: JSON.stringify(category),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (Response) {
            	addEntity(Response);
            	$('li:last').find('.editEntity').trigger( "click" );
            	$('li:last').find('textarea.content').focus();
            },
            error: function(error) {

                alert(error.responseText);
                
            }
            });
    });

    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var self = this;
        var id = parseInt($li.find('span.identifier').html());

        $.ajax({
            type: 'DELETE',
            headers: {
                "AuthToken": token
            },
            url:"https://localhost:44321/api/Category/Delete/" + id,
            success: function(Response){
                $li.fadeOut(300, function(){
                    $(this).remove();
                });

                $("#feedback").html(Response);
                $("#feedback").delay(3).fadeIn();
                $("#feedback").delay(6000).fadeOut();
            }
        });
    });

    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('textarea.edit.content').val($li.find('textarea.noedit.content').val());
        $li.addClass('edit');
        
    });

    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
        $li.removeClass('edit');
    });

    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        var category = {
            name: $li.find('input.name').val(),
            description: $li.find('textarea.edit.content').val(),
            active: 1
        }

        $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "https://localhost:44321/api/Category/UpdateItem/" + id,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(category),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
            $li.find('span.name').html(category.name);
            $li.find('textarea.noedit.content').val(category.description);
            
            $li.removeClass('edit');

            $("#feedback").html(Response);
            $("#feedback").delay(3).fadeIn();
            $("#feedback").delay(6000).fadeOut();
        },
        error: function(error) {

            alert(error.responseText);
            
        }
        });
    });
});