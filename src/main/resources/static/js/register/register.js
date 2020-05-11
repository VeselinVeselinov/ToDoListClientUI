$(document).ready(function () {

    $('#register').submit(function (event) {

        event.preventDefault();

		var password = $("#password").val();
		var confpass = $("#confpass").val();
		
		if(password != confpass){
			$("#feedback").html("Passwords you have entered do not match! ")
		}
        else sendRegisterRequest();

    });

});

function sendRegisterRequest() {

    var username = $("#username").val();
	var password = $("#password").val();
	var fname = $("#fname").val();
	var lname = $("#lname").val();
	var email = $("#email").val();
	var phone = $("#phone").val();
	var address = $("#address").val();

	var credentials = username + ":" + password;
	var account = {
        firstName: fname,
		lastName: lname,
		email: email,
		phone: phone,
        address: address,
        description: "https://cdn.iconscout.com/icon/free/png-512/avatar-375-456327.png"
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://localhost:44321/api/Auth/Register",
        headers: {
            "Registration": btoa(credentials)
        },
        data: JSON.stringify(account),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
			$("#feedback").html("<p>" + Response + "</p>")
            return window.location = "/login";

        },
        error: function(error) {

            $("#feedback").html("<p>" + error.responseText + "</p>")
            
        }
    });

}