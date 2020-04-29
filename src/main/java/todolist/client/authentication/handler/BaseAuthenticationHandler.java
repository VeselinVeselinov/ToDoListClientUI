package todolist.client.authentication.handler;

import javax.servlet.ServletRequest;

import org.springframework.security.core.Authentication;

public interface BaseAuthenticationHandler 
{
	Authentication authenticate(ServletRequest request);
}
