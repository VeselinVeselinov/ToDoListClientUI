function getAuthToken(){
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('authToken');
	
	return token;
}

function sendGetRequest(url, successCallback){
	
	var token = getAuthToken();
	
	$.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://localhost:44321/api/" + url,
        headers: {
            "AuthToken": token
        },
        data: "",
        async: false,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: successCallback,
        error: function(error) {
        	$('#feedback-failure').html(error.responseText);
        	$('#feedback-failure').delay(98).fadeIn();
        	$('#feedback-failure').delay(1968).fadeOut();
        }
        
    });
}

function sendPostRequest(url, entity, successCallback){
	
	var token = getAuthToken();
	
	$.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://localhost:44321/api/" + url,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(entity),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: successCallback,
        error: function(error) {
        	$('#feedback-failure').html(error.responseText);
        	$('#feedback-failure').delay(98).fadeIn();
        	$('#feedback-failure').delay(1968).fadeOut();
        }
        
    });
}

function sendPutRequest(url, entity, successCallback){
	
	var token = getAuthToken();
	
	$.ajax({
        type: "PUT",
        contentType: "application/json",
        url: "https://localhost:44321/api/" + url,
        headers: {
            "AuthToken": token
        },
        data: JSON.stringify(entity),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: successCallback,
        error: function(error) {
        	$('#feedback-failure').html(error.responseText);
        	$('#feedback-failure').delay(98).fadeIn();
        	$('#feedback-failure').delay(1968).fadeOut();
        }
        
    });
}

function sendDeleteRequest(url, successCallback){
	
	var token = getAuthToken();
	
	$.ajax({
        type: 'DELETE',
        headers: {
            "AuthToken": token
        },
        url:"https://localhost:44321/api/" + url,
        success: successCallback,
        error: function(error){
        	$('#feedback-failure').html(error.responseText);
        	$('#feedback-failure').delay(98).fadeIn();
        	$('#feedback-failure').delay(1968).fadeOut();
        }
        
    });
}