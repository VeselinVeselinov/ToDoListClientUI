/* This javascript file handles the way the note page sends requests to the web api
 * and the way the response from the api is visualized on the page. It heavily relies 
 * on the "static/js/common/RequestHandler.js" file 
 * from where the sendRequest functions come from.
 * It utilizes jquery to manipulate the dom tree so that different html elements can be 
 * easily accessed. Ajax is used for request sending and Mustache.js for template rendering
 * so that the api response could be properly presented to the client.*/


$(function (){
	
	/* This function handles how the search request result list will be displayed. */
	function renderSearchResponse(resultList){
		if (resultList.length == 0) {
			renderResponeMessage('#feedback-failure', 
			"The note/s you have been looking for haven't been found.");
			
		} else {
			$("li").remove();
			
			renderResponeMessage('#feedback', 
			"The note/s you have been looking for have been found.");
			
			$.each(resultList, function(i, result){
				renderDifferentNoteTypes(result);
	    	 });
		}
	}
	
	/*currently logged user's id*/
    const id = parseInt($('#identifier').html());
    const initalRenderSeedUrl = "AccountService/FindExt?fieldName=userid&value=" + id;
    
    /*containers*/
    var $entities = $('#entities');
    var $types = $('#types-mb');
    
    /*templates*/
    var entitiesTemplate = $('#entity-template').html();
    var typesTemplate = $('#types-template').html();
    var addTemplate = $('#adding-template').html();
    var imgNoteTemplate = $('#img-note-template').html();
    var toDoListTemplate = $('#todolist-template').html();
    var taskTemplate = $('#note-tasks-template').html();
    
    /* The script below heavily relies on the renderTemplate function
        and it's used to handle the rendering of the different note types. */
    function renderDifferentNoteTypes(note){
    	switch (note.typeId) {
			case 1:
				renderTemplate(entitiesTemplate, note, $entities);
				break;
		
			case 2:
				renderTemplate(imgNoteTemplate, note, $entities);
				break;
		
			case 3:
				renderTemplate(toDoListTemplate, note, $entities);
				var taskUrl = "NoteTask/FindExt?fieldName=noteid&value=" + note.id;
				
				sendGetRequest(taskUrl, function(tasks){
                	var contentHolder = $entities.find('div.note-tasks-content[data-id="'+ note.id + '"]');
                	
                	$.each(tasks, function(i, task){
                		renderTemplate(taskTemplate, task, contentHolder);
                		
                		if (task.isChecked == true) {
							var taskContent = $('div.single-task[data-task=' + task.id + ']');
							taskContent.find('input.form-check-input.noedit').attr("checked", true);
						}
                	});
                });

			default:
				break;
    	}
    }
    
    /* The script below renders the account's notes when the page loads. */
    sendGetRequest(initalRenderSeedUrl, function (entities) {
    	$("#identifierAcc").html(entities[0].id);
    	var noteUrl = "Note/FindExt?fieldName=accountid&value=" + entities[0].id;
    	
    	sendGetRequest(noteUrl, function(notes){
    		$.each(notes, function(i, note){
    			renderDifferentNoteTypes(note);
        	 });
    	});
    });
    
    /* The script below renders the note type buttons 
        in the dialog window when the modal opens. */
    $('#add-note-typed').click(function(){
    	sendGetRequest("NoteType/ListAll", function(types){
    		$.each(types, function(i, type){
    			renderTemplate(typesTemplate, type, $types);
        	 });
    	});
	});
    
    /* The script below disposes the note type buttons after the modal closes. */
    $('#modal-note-type').on('hidden.bs.modal', function (event) {
    	event.preventDefault();
    	$('#types-mb button').remove();
    });
    
    /* The script below sends a search request for the currently selected filter
    	and renders the api result. */
    $('#search-submit').click(function(event){
    	event.preventDefault();
    	
    	var accId = $('#identifierAcc').html();
    	var filter = $('#select-attribute option:selected').attr('data');
    	var valueInput = $('#search-tool input').val();
    	
    	if(valueInput.length == 0){
    	    renderResponeMessage('#feedback-failure',
    	    		"Please enter a value in order to use the search tool.");
    	}
    	else{
    		switch (filter) {
			case "text":
				var textSearchUrl = "Note/GetByIdAndContent?accountId=" + accId +
					"&content=" + valueInput;
				
				sendGetRequest(textSearchUrl, renderSearchResponse);
				break;
				
			case "name":
				var nameSearchUrl = "Note/GetByIdAndName?accountId=" + accId +
					"&name=" + valueInput;
				
				sendGetRequest(nameSearchUrl, renderSearchResponse);
				break;
				
			case "categoryName":
				var categorySearchUrl = "Note/GetByIdAndCategory?accountId=" + accId +
					"&categoryName=" + valueInput;
				
				sendGetRequest(categorySearchUrl, renderSearchResponse);
				break;
				
			case "typeName":
				var typeSearchUrl = "Note/GetByIdAndType?accountId=" + accId +
					"&typeName=" + valueInput;
				
				sendGetRequest(typeSearchUrl, renderSearchResponse);
				break;

			default:
				break;
			}
    	}
    });
    
    /* The script below removes the currently shown notes and renders all of
		 the current account's notes. */
    $('#list-all').click(function(){
    	$('li').remove();
    	renderResponeMessage('#feedback', 
			"All of your notes are shown at this very exact moment. :)");
    	
    	var currentAccId = $('#identifierAcc').html();
    	var noteUrl = "Note/FindExt?fieldName=accountid&value=" + currentAccId;
    	
    	sendGetRequest(noteUrl, function(notes){
    		$.each(notes, function(i, note){
    			renderDifferentNoteTypes(note);
        	 });
    	});
    })
    
    /* The script below adds a quick text note with default field values. */
    $('#add-acc').click(function(){
    	var accId = $('#identifierAcc').html();
    	var note = {
                name: "NewNote",
                text: "",
                categoryId: 6,
                accountId: parseInt(accId)
            };
    	
    	sendPostRequest("Note/AddItem", note, function(Response){
    		renderDifferentNoteTypes(Response);
    		$('li:last').find('.editEntity').trigger( "click" );
        	$('li:last').find('textarea.content').focus();
    	});
    });
    
    /* The script below adds an image note with default field values. */
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
    	
    	sendPostRequest("Note/AddItem", note, function(Response){
    		renderDifferentNoteTypes(Response);
    		$('li:last').find('.editEntity').trigger( "click" );
        	$('li:last').find('textarea.content').focus();
    	});
    });
    
    /* The script below adds a to do list with no to do tasks
        and default field values. */
    $('#todolist-add').click(function(){
    	var accId = $('#identifierAcc').html();
    	
    	var note = {
                name: "NewNote",
                text: "",
                categoryId: 6,
                typeId: 3,
                accountId: parseInt(accId)
            };
    	
    	sendPostRequest("Note/AddItem", note, function(Response){
    		renderDifferentNoteTypes(Response);
    		$('li:last').find('.addNoteTask').trigger( "click" );
    		$('li:last').find('.editEntity').trigger( "click" );
        	$('li:last').find('select.cname').focus();
    	});
    });
    
    /* The script below handles which note to create. */
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
    
    /* The script below adds a note task to the current note container 
     	that the event was triggered on.*/
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
        
        sendPostRequest("NoteTask/AddItem", noteTask, function(Response){
    		var toDoListContent = $li.find('.note-tasks-content');
    		renderTemplate(taskTemplate, Response, toDoListContent);
    		$li.find('input.edit.text-task.form-control').focus();
    	});
    });

    /* The script below removes the current note container 
     	that the event was triggered on.*/ 
    $entities.delegate('.remove', 'click', function(){
        var $li = $(this).closest('li');
        var self = this;
        var id = parseInt($li.find('span.identifier').html());
		var noteDeleteUrl = "Note/Delete/" + id;
        
        sendDeleteRequest(noteDeleteUrl, function(Response){
        	$li.fadeOut(550, function(){
                $(this).remove();
            });
        	
        	renderResponeMessage("#feedback", Response)
        });
    });
    
    /* The script below removes the current note task container 
 		that the event was triggered on.*/
    $entities.delegate('.removeTask', 'click', function(){
        var $taskContainer = $(this).closest('div');
        var currentTaskId = parseInt($taskContainer.data('task'));
        var noteTaskDeleteUrl = "NoteTask/Delete/" + currentTaskId;
        
        sendDeleteRequest(noteTaskDeleteUrl, function(Response){
        	$taskContainer.fadeOut(500, function(){
                $(this).remove();
            });
        	
        	renderResponeMessage("#feedback", Response)
        });
    });

    /* The script below replaces the elements of the div from 
      	non-editable spans to form inputs. */
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
        
        sendGetRequest("Category/ListAll", function(categories){
    		$.each(categories, function() {
                if(this.name == $categoryName)
                {
                	$dropdown.append($("<option selected/>").val(this.id).text(this.name));
                }
                else $dropdown.append($("<option />").val(this.id).text(this.name));
            });
    	});
    });

    /* The script below basically hides the edit elements 
      	by removing the edit class from the li. */
    $entities.delegate('.cancelEdit', 'click', function(){
    	var $li = $(this).closest('li');
        $li.removeClass('edit');
        $dropdown = $li.find('select.cname option');
        $dropdown.remove();
    });

    /* The script below sends a put request with the values from the form
      	inputs for the current note container that the event was triggered on.
      	After that it manually replaces the html elements with the saved data. */
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

        sendPutRequest("Note/UpdateItem/" + id, note, function (Response) {
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
						
						sendPutRequest("NoteTask/UpdateItem/" + currentId, taskUpdate, function (Response) {
				        	$li.find('input.form-check-input.edit').each(function (i, checkBoxCurrent) 
			                		{ 
				        				if(checkBoxCurrent.checked == true){
			                				checkBoxNoEdit[i].checked = true;
			                			}  
			                			else { checkBoxNoEdit[i].checked = false; }
			                		});
				        });
						
						tasksSpan[i].textContent = tasksEdit[i].value;
					}
                };
			}
            
            $li.removeClass('edit');
            $dropdown = $li.find('select.cname option');
            $dropdown.remove();

            renderResponeMessage("#feedback", Response);
        });
    });
});