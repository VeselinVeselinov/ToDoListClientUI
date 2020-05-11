$(function (){
    const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');
    const id = parseInt($('#identifier').html());

    var $entities = $('#entities');
    var $types = $('#types-mb');
    var entitiesTemplate = $('#entity-template').html();
    var typesTemplate = $('#types-template').html();
    var addTemplate = $('#adding-template').html();
    var imgNoteTemplate = $('#img-note-template').html();
    var toDoListTemplate = $('#todolist-template').html();
    var taskTemplate = $('#note-tasks-template').html();
    
    function addEntity(entity){
        $entities.append(Mustache.render(entitiesTemplate, entity));
    };
    
    function renderNoteTypes(noteType){
    	$types.append(Mustache.render(typesTemplate, noteType));
    };
    
    function renderNote(noteTemplate, note){
    	$entities.append(Mustache.render(noteTemplate, note))
    }
    
    $('#modal-note-type').on('hidden.bs.modal', function (event) {
    	event.preventDefault();
    	$('#types-mb button').remove();
    	
    });
    
    $('#add-note-typed').click(function(){
    	$.ajax({
            type: "GET",
            contentType: "application/json",
            url: "https://localhost:44321/api/NoteType/ListAll",
            headers: {
                "AuthToken": token
            },
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (types) {
            	$.each(types, function(i, type){
                    renderNoteTypes(type);
                });
            },
            error: function(error) {

                alert(error.responseText);
                
            }
    	});
    });
    
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
                    	switch (entity.typeId) {
							case 1:
								renderNote(entitiesTemplate, entity);
							break;
							
							case 2:
								renderNote(imgNoteTemplate, entity);
							break;
							
							case 3:
								renderNote(toDoListTemplate, entity);
								
								$.ajax({
					                type: "GET",
					                contentType: "application/json",
					                url: "https://localhost:44321/api/NoteTask/FindExt?fieldName=noteid&value=" + entity.id,
					                headers: {
					                    "AuthToken": token
					                },
					                data: "",
					                dataType: 'json',
					                cache: false,
					                timeout: 600000,
					                success:function(tasks){
					                	
					                	var contentHolder = $entities.find('div.note-tasks-content[data-id="'+ entity.id + '"]');
					                	
					                	$.each(tasks, function(i, task){
					                		contentHolder.append(Mustache.render(taskTemplate, task));
					                		
					                		if (task.isChecked == true) {
												var taskContent = $('div.single-task[data-task=' + task.id + ']');
												taskContent.find('input.form-check-input.noedit').attr("checked", true);
											}
					                		
					                	});
					                },
					                error: function(){
					                	alert("Sorry to inform you, but the server is down! :c");
					                }
					        	});
							break;

							default:
							break;
						}
                    });
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
    
    $('#image-note-add').click(function(){
    	var accId = $('#identifierAcc').html();
    	var note = {
                name: "NewNote",
                text: "",
                categoryId: 6,
                typeId: 2,
                url: "https://cdn1.iconfinder.com/data/icons/diversity-avatars-volume-01-circles/64/matrix-morpheus-512.png",
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
            	$entities.append(Mustache.render(imgNoteTemplate, Response));
            	$('li:last').find('.editEntity').trigger( "click" );
            	$('li:last').find('textarea.content').focus();
            },
            error: function(error) {

                alert(error.responseText);
                
            }
    	});
    });
    
    $('#todolist-add').click(function(){
    	var accId = $('#identifierAcc').html();
    	
    	var note = {
                name: "NewNote",
                text: "",
                categoryId: 6,
                typeId: 3,
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
            	renderNote(toDoListTemplate, Response);
            	$('li:last').find('.editEntity').trigger( "click" );
            	$('li:last').find('select.cname').focus();
            },
            error: function(error) {

                alert(error.responseText);
                
            }
    	});
    });
    
    $types.delegate('.choose-ntype', 'click', function(event){
    	event.preventDefault();
    	
    	var $chosenType = $(this).closest('button');
    	var typeId = $chosenType.data('id');
    	
    	switch (typeId) {
			case 1:
				$('#add-acc').click();
				break;
				
			case 2:
				$('#image-note-add').click();
				break;
				
			case 3:
				$('#todolist-add').click();
				break;
				
			default:
				break;
		}
    	
    	$('button.close').click();
    });
    
    $entities.delegate('.addNoteTask', 'click', function(){
    	var $li = $(this).closest('li');
        var self = this;
        var noteId = parseInt($li.find('span.identifier').html());
        
        var noteTask = {
        	code: "TaskCli",
        	name: "taskClient",
        	description: "This was made by a client on a browser" + Date.now(),
        	noteId: noteId,
        	text: "NewTask",
        	isChecked: false
        	
        };
        
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://localhost:44321/api/NoteTask/AddItem",
            headers: {
                "AuthToken": token
            },
            data: JSON.stringify(noteTask),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (Response) {
            	var toDoListContent = $li.find('.note-tasks-content');
        		toDoListContent.append(Mustache.render(taskTemplate, Response));
        		$li.find('input.edit.text-task.form-control').focus();
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
                $li.fadeOut(550, function(){
                    $(this).remove();
                });

                $("#feedback").html(Response);
                $("#feedback").delay(120).fadeIn();
                $("#feedback").delay(3500).fadeOut();
            }
        });
    });
    
    $entities.delegate('.removeTask', 'click', function(){
        var $taskContainer = $(this).closest('div');
        var currentTaskId = parseInt($taskContainer.data('task'));

        $.ajax({
            type: 'DELETE',
            headers: {
                "AuthToken": token
            },
            url:"https://localhost:44321/api/NoteTask/Delete/" + currentTaskId,
            success: function(Response){
            	$taskContainer.fadeOut(500, function(){
                    $(this).remove();
                });

                $("#feedback").html(Response);
                $("#feedback").delay(30).fadeIn();
                $("#feedback").delay(3500).fadeOut();
            }
        });
    });

    $entities.delegate('.editEntity', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('select.cname').val($li.find('span.cname').html());
        $li.find('textarea.edit.content').val($li.find('textarea.noedit.content').val());
        $li.find('input.edit.url-image').val($li.find('label.edit.url-src').data('url'));
        
        var tasksSpan = $li.find('span.noedit.text-task');
        var tasksEdit = $li.find('input.edit.text-task');
        var checkBoxNoEdit = $li.find('input.form-check-input.noedit');
        var checkBoxEdit = $li.find('input.form-check-input.edit');
        
        for(var i = 0; i < tasksSpan.length; i++){
        	tasksEdit[i].value = tasksSpan[i].textContent;
        	checkBoxEdit[i].checked = checkBoxNoEdit[i].checked;
          };
          
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
        var url = $li.find('input.edit.url-image').val();

        var note = {
            name: $li.find('input.name').val(),
            text: $li.find('textarea.edit.content').val(),
            categoryId: parseInt($li.find('select.cname option:selected').val()),
            statusId: parseInt($li.find('span.statusId').html()),
            typeId: parseInt($li.find('span.typeId').html()),
            accountId: parseInt($li.find('span.accountId').html()),
            active: 1,
            url:""
        }
        
        if(note.typeId == 2){
        	note.url = url;
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
            $li.find('label.edit.url-src').data('url', note.url);
            $li.find('.img-fluid.img-content').attr('src', note.url);
            
            if (note.typeId == 3) {
            	var tasksSpan = $li.find('span.noedit.text-task');
                var tasksEdit = $li.find('input.edit.text-task');
                
                var checkBoxNoEdit = $li.find('input.form-check-input.noedit');
                var checkBoxEdit = $li.find('input.form-check-input.edit');
                
                for(var i = 0; i < tasksSpan.length; i++){
                	
                	if (tasksSpan[i].textContent != tasksEdit[i].value || checkBoxEdit[i].checked != checkBoxNoEdit[i].checked) {
                		
                		var currentId = tasksEdit[i].getAttribute('data-id');
						var taskUpdate = {
								text: tasksEdit[i].value,
								noteId: id,
								active: 1,
								isChecked: false
						};
						
						if(checkBoxEdit[i].checked == true){ taskUpdate.isChecked = true; }
							
						$.ajax({
					        type: "PUT",
					        contentType: "application/json",
					        url: "https://localhost:44321/api/NoteTask/UpdateItem/" + currentId,
					        headers: {
					            "AuthToken": token
					        },
					        data: JSON.stringify(taskUpdate),
					        dataType: 'json',
					        cache: false,
					        timeout: 600000,
					        success: function (Response) {
					        	$li.find('input.form-check-input.edit').each(function (i, checkBoxCurrent) 
				                		{ 
				                			if(checkBoxCurrent.checked == true){
				                				checkBoxNoEdit[i].checked = true;
				                			}  
				                			else { checkBoxNoEdit[i].checked = false; }
				                		});
					        },
					        error: function()
					        {
					        	alert("Service is down at this exact moment.");
					        }
						});
						
						tasksSpan[i].textContent = tasksEdit[i].value
					}
                  };
			}
            
            $li.removeClass('edit');
            $dropdown = $li.find('select.cname option');
            $dropdown.remove();

            $("#feedback").html(Response);
            $("#feedback").delay(120).fadeIn();
            $("#feedback").delay(3500).fadeOut();
        },
        error: function(error) {

            alert(error.responseText);
            
        }
        });
    });
});