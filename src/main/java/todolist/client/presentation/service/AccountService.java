package todolist.client.presentation.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AccountService 
{
	@GetMapping("/account/index")
	public String index(@RequestParam(name = "authToken")String token)
	{
		return "accindex";
	}
	
	@GetMapping("/accountadmin/index")
	public String index2(@RequestParam(name = "authToken")String token)
	{
		return "index-test";
	}
	
	@GetMapping("/account/add")
	public String add(@RequestParam(name = "authToken")String token)
	{
		return "acc-add";
	}
	
}
