$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://localhost:44321/api/Auth/LogOut",
        headers: {
            "AuthToken": token
        },
        data: "",
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {

            return window.location = "/login";

        },
        error: function(error) {

            $("#feedback").html("<p>Well, this is awkward. :/</p>")
            
        }
	});
});
