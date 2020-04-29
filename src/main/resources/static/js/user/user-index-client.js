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
    
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://localhost:44321/api/User/FindExt?fieldName=id&value=" + id,
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
            url:"https://localhost:44321/api/User/Delete/" + id,
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
        $li.find('input.pass').val("********");
        $li.addClass('edit');
    });

    $entities.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    });

    $entities.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var id = parseInt($li.find('span.identifier').html());

        var user = {
            userName: $li.find('input.name').val(),
            password: $li.find('input.pass').val(),
            statusId: parseInt($li.find('span.statusId').html()),
            active: 1
        }

        $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "https://localhost:44321/api/User/UpdateItem/" + id,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(user),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
            $li.find('span.name').html(user.userName);
            $li.find('span.pass').html("********");
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