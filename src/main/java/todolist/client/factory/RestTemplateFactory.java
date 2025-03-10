package todolist.client.factory;

import javax.net.ssl.SSLContext;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RestTemplateFactory 
{
	@Value("${trust.store}")
	private Resource keyStore;
	
	@Value("${trust.store.password}")
	private String keyStorePass;
	
	public RestTemplate getRestTemplate() 
			throws Exception 
	{
        SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(keyStore.getURL(), keyStorePass.toCharArray())
                .build();
        
        SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(sslContext);
        HttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(socketFactory)
                .build();
        
        HttpComponentsClientHttpRequestFactory factory =
                new HttpComponentsClientHttpRequestFactory(httpClient);
        
        return new RestTemplate(factory);
    }

}
