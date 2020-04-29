$(document).ready(function () {

    $('#register').submit(function (event) {

        event.preventDefault();
        sendRegisterRequest();

    });

});

function sendRegisterRequest() {
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');
	
    var username = $("#username").val();
	var pass = $("#pass").val();
	var confpass = $('#confpass').val();

	var user = {
		userName: username,
        password: pass
    };
	
	if(pass != confpass){
		$("#feedback").html("<p>Passwords do not match! </p>")
	}
	else $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://localhost:44321/api/User/AddItem",
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(user),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
        	
        	var url = "/useradmin/index?authToken=" + token;
            return window.location = url;

        },
        error: function(error) {

            $("#feedback").html("<p>" + error.responseText + "</p>")
            
        }
    });

}