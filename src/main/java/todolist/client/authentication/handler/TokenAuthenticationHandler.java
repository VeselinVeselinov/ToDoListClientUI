package todolist.client.authentication.handler;

import javax.servlet.ServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


@Component
public class TokenAuthenticationHandler implements BaseAuthenticationHandler
{
	public Authentication authenticate(ServletRequest request)
	{
		UsernamePasswordAuthenticationToken auth = null;
		
		if (request.getParameter("authToken") != null)
		{
			String authToken = request.getParameter("authToken");
			auth = new UsernamePasswordAuthenticationToken("", authToken);
		}
		
		return auth;
	}
}
