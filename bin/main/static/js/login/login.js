$(document).ready(function () {

    $('#login').submit(function (event) {

        event.preventDefault();

        sendLoginRequest();

    });

});

function sendLoginRequest() {

    var username = $("#username").val();
    var password = $("#password").val();

    var credentials = username + ":" + password;

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://localhost:44321/api/Auth/LogIn",
        headers: {
            "Authorization": "Basic " + btoa(credentials)
        },
        data: "",
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {

            var url = "index?authToken=" + Response;
            return window.location = url;

        },
        error: function(error) {

            $("#feedback").html("<p>Wrong username or password! </p>");
            
        }
    });

}