package todolist.client.authentication.provider;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import todolist.client.factory.RestTemplateFactory;
import todolist.client.model.result.ApiSessionResult;

@Component
public class AuthTokenProvider implements AuthenticationProvider{

	@Autowired
	private RestTemplateFactory restFactory;
	
	@Override
	public Authentication authenticate(Authentication authentication) 
			throws AuthenticationException 
	{
		if (authentication.getCredentials() != null) 
		{
			String authToken = authentication
					.getCredentials().toString();
			
			String url = "https://localhost:44321/api/ApiSession/GetByToken/" + authToken;
			String urlRoles = "https://localhost:44321/api/UsersUserGroups/GetAuthorities/";
			
			RestTemplate restTempl = null;
			try {
				restTempl = restFactory.getRestTemplate();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			HttpHeaders headers = new HttpHeaders();
	        headers.set("AuthToken", authToken);
	        HttpEntity<String> request = new HttpEntity<String>(headers);
			
			ResponseEntity<ApiSessionResult> response = restTempl.exchange(url, HttpMethod.GET, request, ApiSessionResult.class);
			
			authentication = null;
	        if (response.getStatusCodeValue() == 200) 
	        {
	        	ApiSessionResult apiSession = response.getBody();
	        	assert apiSession != null;
	        	
				
				  HttpEntity<String> authoritiesRequest = new HttpEntity<String>(headers);
				  ResponseEntity<String[]> authoritiesResponse = restTempl.exchange(urlRoles +
				  apiSession.getUserId(), HttpMethod.GET, authoritiesRequest, String[].class);
				  
				  String[] authorities = authoritiesResponse.getBody();
				  assert authorities != null;
				 
	        	
	        	String credentials = apiSession.getUserId() + "," + apiSession.getAuthToken();
	            authentication = new UsernamePasswordAuthenticationToken(apiSession.getUserId(), credentials, extractRoles(authorities));
	        }
	        
	        return authentication;
		}
		else return null;
	}
	
	private Collection<? extends GrantedAuthority> extractRoles(String[] authorities)
	{
		List<GrantedAuthority> roles = new ArrayList<>();
		if (authorities.length == 0) {
			roles.add(
					new SimpleGrantedAuthority("ROLE_USER"));
		}
		
		for (int i = 0; i < authorities.length; i++) {
			if (authorities[i].equalsIgnoreCase("Administrator")) {
				roles.add(
						new SimpleGrantedAuthority("ROLE_ADMIN"));
			}
			else roles.add(
					new SimpleGrantedAuthority("ROLE_" + authorities[i].toUpperCase()));
		}
		
		roles.forEach(role -> System.out.println(role));
        
        return roles;
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return true;
	}

}
