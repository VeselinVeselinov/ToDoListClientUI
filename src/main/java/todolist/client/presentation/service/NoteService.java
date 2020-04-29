package todolist.client.presentation.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class NoteService {
	
	@GetMapping("/note/index")
	public String noteIndex(@RequestParam(name = "authToken")String token) {
		return "notes-index";
	}
	
	@GetMapping("/category/index")
	public String categoryIndex(@RequestParam(name = "authToken")String token) {
		return "categories-index";
	}
}
