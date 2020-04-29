$(function(){
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');
	const id = parseInt($('#identifier').html());
	
	var $entities = $('#entities');
    var entitiesTemplate = $('#entity-template').html();
    var addTemplate = $('#adding-template').html();

    function addEntity(entity){
        $entities.append(Mustache.render(entitiesTemplate, entity));
    }
		
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
            	alert(entities[0].id);
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
});