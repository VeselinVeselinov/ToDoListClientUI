$(function (){
    const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');

    var $entities = $('#entities');
    var entitiesTemplate = $('#entity-template').html();
    var addTemplate = $('#adding-template').html();

    function addEntity(entity){
        $entities.append(Mustache.render(entitiesTemplate, entity));
    }
    
    $('#add-acc').click(function(){
    	var url = "/account/add?authToken=" + token;
        return window.location = url;
    });
    
    function ciEquals(a, b) {
        return typeof a === 'string' && typeof b === 'string'
            ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
            : a === b;
    }
    
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var filter = $('#select-attribute option:selected').attr('data');
    	var valueInput = $('#search-tool input').val();
    	
    	if(valueInput.length == 0){
    		$('#feedback-failure').html("Please enter a value in order to use the search tool.");
    	    $("#feedback-failure").delay(3).fadeIn();
    	    $("#feedback-failure").delay(6000).fadeOut();
    	}
    	else{
    		$.ajax({
                type: "GET",
                contentType: "application/json",
                url: "https://localhost:44321/api/AccountService/ListAll",
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
						case "name":
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
							
						case "firstname":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.firstName, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with first name: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with first name: (" + valueInput + ") have been found.");
			          	        	$("#feedback-failure").delay(3).fadeIn();
			          	        	$("#feedback-failure").delay(6000).fadeOut();
			              		}
							break;
							
						case "lastname":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.lastName, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with last name: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with last name: (" + valueInput + ") have been found.");
			          	        	$("#feedback-failure").delay(3).fadeIn();
			          	        	$("#feedback-failure").delay(6000).fadeOut();
			              		}
							break;
							
						case "email":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.email, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with email: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with email: (" + valueInput + ") have been found.");
			          	        	$("#feedback-failure").delay(3).fadeIn();
			          	        	$("#feedback-failure").delay(6000).fadeOut();
			              		}
							break;
							
						case "phone":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.phone, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with phone: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with phone: (" + valueInput + ") have been found.");
			          	        	$("#feedback-failure").delay(3).fadeIn();
			          	        	$("#feedback-failure").delay(6000).fadeOut();
			              		}
							break;	
							
						case "address":
							var filtered = entities.filter(function (entity) {
		              			  return ciEquals(entity.address, valueInput);
		              			});
		              		
			              		if(filtered.length != 0){
			              			$("li").remove();
			                  		$.each(filtered, function(i, entity){
			                  			addEntity(entity);
			                          });
			                          
			                          $('#feedback').html("Elements with address: ("+ valueInput + ") have been found.");
			  	    	    	    $("#feedback").delay(45).fadeIn();
			  	    	    	    $("#feedback").delay(4500).fadeOut();
			              		}
			              		else{
			              			$('#feedback-failure').html("No elements with address: (" + valueInput + ") have been found.");
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
        url: "https://localhost:44321/api/AccountService/ListAll",
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

    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var self = this;
        var id = parseInt($li.find('span.identifier').html());

        $.ajax({
            type: 'DELETE',
            headers: {
                "AuthToken": token
            },
            url:"https://localhost:44321/api/AccountService/Delete/" + id,
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
        $li.find('input.fname').val($li.find('span.fname').html());
        $li.find('input.lname').val($li.find('span.lname').html());
        $li.find('input.email').val($li.find('span.email').html());
        $li.find('input.phone').val($li.find('span.phone').html());
        $li.find('input.address').val($li.find('span.address').html());
        $li.find('input.sname').val($li.find('span.sname').html());
        $li.addClass('edit');
    });

    $entities.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    });

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
            description: $li.find('span.description').html()
        }

        $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "https://localhost:44321/api/AccountService/UpdateItem/" + id,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(account),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
            $li.find('span.name').html(account.name);
            $li.find('span.fname').html(account.firstName);
            $li.find('span.lname').html(account.lastName);
            $li.find('span.email').html(account.email);
            $li.find('span.phone').html(account.phone);
            $li.find('span.address').html(account.address);
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


