package todolist.client.presentation.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeService 
{
	@GetMapping("/index")
	public String home(@RequestParam(name = "authToken")String token) {
		return "index.html";
	}
}
