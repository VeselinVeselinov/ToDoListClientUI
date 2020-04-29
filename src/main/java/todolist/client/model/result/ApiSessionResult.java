package todolist.client.model.result;

import lombok.Data;

@Data
public class ApiSessionResult 
{
	private long id;
	
	private String code;
	
	private String name;
	
	private String description;
	
	private long userId;

    private String authToken;
}
