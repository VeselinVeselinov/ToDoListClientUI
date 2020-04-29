package todolist.client.authentication.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import todolist.client.authentication.handler.BaseAuthenticationHandler;

@Component
public class CustomAuthFilter extends OncePerRequestFilter
{
	@Autowired
	private List<BaseAuthenticationHandler> authHandlers;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException 
	{
		Authentication auth = SecurityContextHolder
				.getContext()
				.getAuthentication();
		
		for (BaseAuthenticationHandler handler : authHandlers) {
			if (auth == null)
			{
				auth = handler.authenticate(request);
			}
		}
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		
		filterChain.doFilter(request, response);
	}

}
