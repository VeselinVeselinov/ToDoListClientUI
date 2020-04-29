package todolist.client.presentation.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthService {
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping("/register")
	public String register() {
		return "register";
	}
	
	@GetMapping("/menu/logout")
	public String logout(@RequestParam(name = "authToken")String authToken) {
		return "logoutRedirect";
	}
}
