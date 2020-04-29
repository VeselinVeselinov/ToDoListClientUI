package todolist.client.config.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import todolist.client.authentication.filter.CustomAuthFilter;
import todolist.client.authentication.provider.AuthTokenProvider;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter
{
	@Autowired
	private CustomAuthFilter authFilter;
	
	@Autowired
	private AuthTokenProvider authTokenProvider;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception 
	{
		http
			.csrf().disable()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
			.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
			.authenticationProvider(authTokenProvider)
			.authorizeRequests()
			.antMatchers("/login", "/register", "/logout" ,"/resources/**", "/static/**", "/css/**", "/fonts/**", "/img/**")
			.permitAll()
			.antMatchers("/accountadmin/index").hasRole("ADMIN")
			.antMatchers("/useradmin/index").hasRole("ADMIN")
			.anyRequest().authenticated()
		.and()
			.formLogin()
			.loginPage("/login")
		.and()
			.logout()
			.logoutSuccessUrl("/menu/logout");
		
	}
	
	@Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/resources/**", "/static/**", "/css/**", "/js/**", "/images/**",
                "/resources/static/**", "/css/**", "/js/**", "/img/**", "/fonts/**", "/images/**", "/scss/**",
                "/vendor/**", "/favicon.ico", "/auth/**", "/favicon.png", "/v2/api-docs", "/configuration/ui",
                "/configuration/security", "/swagger-ui.html", "/webjars/**", "/swagger-resources/**",
                "/swagger-ui.html", "/actuator", "/actuator/**", "/error**");
    }
}
