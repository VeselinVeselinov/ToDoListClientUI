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
        url: "https://localhost:44321/api/AccountService/FindExt?fieldName=userid&value=" + id,
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
            active: 1
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