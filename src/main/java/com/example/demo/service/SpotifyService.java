package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class SpotifyService {
    
    public List<Map<String, Object>> getTopArtists(OAuth2AuthorizedClient authorizedClient, String timeRange) {
        try {
            String url = "https://api.spotify.com/v1/me/top/artists?limit=20&time_range=" + timeRange;
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authorizedClient.getAccessToken().getTokenValue());
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.get("items") instanceof List) {
                return (List<Map<String, Object>>) responseBody.get("items");
            }
        } catch (Exception e) {
            System.err.println("Error fetching top artists: " + e.getMessage());
        }
        
        return new ArrayList<>();
    }
}