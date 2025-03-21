package todolist.client.presentation.service;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorHandlingService implements ErrorController{

	@RequestMapping("/error")
    public String handleError() {
        return "login";
    }
	
	@Override
	public String getErrorPath() {
		return "/error";
	}

}
