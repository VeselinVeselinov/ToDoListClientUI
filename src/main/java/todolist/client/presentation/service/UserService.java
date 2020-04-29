package todolist.client.presentation.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserService {
	
	@GetMapping("/useradmin/index")
	public String indexUserAdmin(@RequestParam(name = "authToken")String token) {
		return "user-index-admin";
	}
	
	@GetMapping("/user/index")
	public String indexUserClient(@RequestParam(name = "authToken")String token) {
		return "user-index-client";
	}
	
	@GetMapping("/user/add")
	public String addUser(@RequestParam(name = "authToken")String token) {
		return "user-add";
	}

}
