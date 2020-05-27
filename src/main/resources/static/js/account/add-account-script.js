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
	var fname = $("#fname").val();
	var lname = $("#lname").val();
	var email = $("#email").val();
	var phone = $("#phone").val();
	var address = $("#address").val();
	var profilePic = $("#description").val();
	
	checkIfEmpty(address);
	checkIfEmpty(phone);

	var account = {
		code: "ADMNCREATED",
		name: username,
        firstName: fname,
		lastName: lname,
		email: email,
		phone: phone,
        address: address,
        description: profilePic 
    };
	
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://localhost:44321/api/Acc/AddItem",
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(account),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (Response) {
        	
        	var url = "/accountadmin/index?authToken=" + token;
            return window.location = url;

        },
        error: function(error) {

            $("#feedback").html("<p>" + error.responseText + "</p>")
            
        }
    });

}

function checkIfEmpty(element){
	if (element == null) {
		element = "-";
	}
}