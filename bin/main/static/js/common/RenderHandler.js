function renderResponeMessage(messageContainer, message){
	$(messageContainer).html(message);
	$(messageContainer).delay(98).fadeIn();
	$(messageContainer).delay(1968).fadeOut();
}
    
function renderTemplate(template, element, container){
	container.append(Mustache.render(template, element));
}

function renderDropDownBox(resultList, selectedOption, container){
	$.each(resultList, function() {
        if(this.name == selectedOption)
        {
        	container.append($("<option selected/>").val(this.id).text(this.name));
        }
        else container.append($("<option />").val(this.id).text(this.name));
    });
}

