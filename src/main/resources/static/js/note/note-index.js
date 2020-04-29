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
                url: "https://localhost:44321/api/Note/FindExt?fieldName=accountid&value=" + accId,
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
	              			  return entity.categoryName.toUpperCase() === valueInput.toUpperCase();
	              			});
	              		
		              		if(filtered.length != 0){
		              			$("li").remove();
		                  		$.each(filtered, function(i, entity){
		                  			addEntity(entity);
		                          });
		                          
		                          $('#feedback').html("Elements with category: ("+ valueInput + ") have been found.");
		  	    	    	    $("#feedback").delay(45).fadeIn();
		  	    	    	    $("#feedback").delay(4500).fadeOut();
		              		}
		              		else{
		              			$('#feedback-failure').html("No elements with category: (" + valueInput + ") have been found.");
		          	        	$("#feedback-failure").delay(3).fadeIn();
		          	        	$("#feedback-failure").delay(6000).fadeOut();
		              		}
							break;
						case "name":
							var filtered = entities.filter(function (entity) {
		              			  return entity.name.toUpperCase() === valueInput.toUpperCase();
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
        url: "https://localhost:44321/api/AccountService/FindExt?fieldName=userid&value=" + id,
        headers: {
            "AuthToken": token
        },
        data: "",
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (entities) {
        	$("#identifierAcc").html(entities[0].id);
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "https://localhost:44321/api/Note/FindExt?fieldName=accountid&value=" + entities[0].id,
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

        },
        error: function(error) {

            alert("<p>Well, this is awkward. :/</p>");
            
        }
    });
    
    $('#add-acc').click(function(){
    	var accId = $('#identifierAcc').html();
    	var note = {
                name: "NewNote",
                text: "",
                categoryId: 6,
                accountId: parseInt(accId)
            };
    	
    	$.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://localhost:44321/api/Note/AddItem",
            headers: {
                "AuthToken": token
            },
            data: JSON.stringify(note),
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
            url:"https://localhost:44321/api/Note/Delete/" + id,
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
        $li.find('select.cname').val($li.find('span.cname').html());
        $li.find('textarea.edit.content').val($li.find('textarea.noedit.content').val());
        $li.addClass('edit');
        
        var $categoryName = $li.find('span.cname').html();

        $dropdown = $li.find('select.cname');
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
                $.each(entities, function() {
                    if(this.name == $categoryName)
                    {
                    	$dropdown.append($("<option selected/>").val(this.id).text(this.name));
                    }
                    else $dropdown.append($("<option />").val(this.id).text(this.name));
                });
    
            },
            error: function(error) {
    
                alert("<p>Well, this is awkward. :/</p>");
                
            }
        });
        
    });

    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
        $li.removeClass('edit');
        $dropdown = $li.find('select.cname option');
        $dropdown.remove();
    });

    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        var note = {
            name: $li.find('input.name').val(),
            text: $li.find('textarea.edit.content').val(),
            categoryId: parseInt($li.find('select.cname option:selected').val()),
            statusId: parseInt($li.find('span.statusId').html()),
            typeId: parseInt($li.find('span.typeId').html()),
            accountId: parseInt($li.find('span.accountId').html()),
            active: 1
        }

        $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "https://localhost:44321/api/Note/UpdateItem/" + id,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(note),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
        	$li.find('span.cname').html($li.find('select.cname option:selected').text());
            $li.find('span.name').html(note.name);
            $li.find('textarea.noedit.content').val(note.text);
            
            $li.removeClass('edit');
            $dropdown = $li.find('select.cname option');
            $dropdown.remove();

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