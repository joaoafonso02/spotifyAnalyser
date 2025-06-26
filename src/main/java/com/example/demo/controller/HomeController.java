package com.example.demo.controller;

import java.util.Map;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Cookie;
import java.io.IOException;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "<a href='/login'>Login with Spotify</a>";
    }

    @GetMapping("/ping")
    public String ping() {
        return "Backend is reachable!";
    }

    // @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    // @GetMapping("/secured")
    // public String secured(@AuthenticationPrincipal OAuth2User principal) {
    //     // return principal.getAttributes(); 
    //     return "" + "<h1>Welcome, " + principal.getAttribute("display_name") + "!</h1>" + "<p><a href='/playlists'>View Playlists</a></p>" + "<p><a href='/playlist-tracks'>View Playlist Tracks</a></p>"+ "<p><a href='/logout'>Logout</a></p>";
    // }

   @GetMapping("/secured")
    public ResponseEntity<Map<String, Object>> secured(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User is not authenticated"));
        }
        
        // Get attributes with null safety
        String displayName = principal.getAttribute("display_name");
        String id = principal.getAttribute("id");
        
        // Debug: Print all available attributes to see what's actually available
        System.out.println("All available attributes: " + principal.getAttributes());
        
        Map<String, Object> userInfo = Map.of(
            "name", displayName != null ? displayName : "Unknown",
            "id", id != null ? id : "Unknown"
        );
        
        return ResponseEntity.ok(userInfo);
    }

    // @GetMapping("/playlists")
    // public String getPlaylists(@RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient authorizedClient) {
    //     String accessToken = authorizedClient.getAccessToken().getTokenValue();
    //     String url = "https://api.spotify.com/v1/me/playlists";

    //     RestTemplate restTemplate = new RestTemplate();
    //     var headers = new org.springframework.http.HttpHeaders();
    //     headers.set("Authorization", "Bearer " + accessToken);
    //     var entity = new org.springframework.http.HttpEntity<>(headers);

    //     var response = restTemplate.exchange(
    //         url,
    //         org.springframework.http.HttpMethod.GET,
    //         entity,
    //         Map.class
    //     );

    //     var playlists = (java.util.List<Map<String, Object>>) ((Map<String, Object>) response.getBody()).get("items");

    //     StringBuilder html = new StringBuilder("<h2>Your Playlists</h2><ul>");
    //     for (Map<String, Object> playlist : playlists) {
    //         String name = (String) playlist.get("name");
    //         String id = (String) playlist.get("id");
    //         html.append("<li><a href='/playlist-tracks/")
    //             .append(id)
    //             .append("'>")
    //             .append(name)
    //             .append("</a></li>");
    //     }
    //     html.append("</ul><p><a href='/secured'>Back</a></p>");
    //     return html.toString();
    // }

    @GetMapping("/playlists")
    public List<Map<String, Object>> getPlaylistsJson(@RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient authorizedClient) {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();
        String url = "https://api.spotify.com/v1/me/playlists";

        RestTemplate restTemplate = new RestTemplate();
        var headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        var entity = new HttpEntity<>(headers);

        var response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.get("items") instanceof List) {
            return (List<Map<String, Object>>) responseBody.get("items");
        }
        return List.of(); // Return an empty list if "items" is null or not a list
    }


    @GetMapping("/playlist-tracks/{playlistId}")
    public ResponseEntity<List<Map<String, Object>>> getPlaylistTracks(
        @RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient authorizedClient,
        @PathVariable String playlistId
    ) {
        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

        RestTemplate restTemplate = new RestTemplate();
        var headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + authorizedClient.getAccessToken().getTokenValue());
        var entity = new org.springframework.http.HttpEntity<>(headers);

        var response = restTemplate.exchange(
            url,
            org.springframework.http.HttpMethod.GET,
            entity,
            Map.class
        );

        var items = (java.util.List<Map<String, Object>>) ((Map<String, Object>) response.getBody()).get("items");
        
        return ResponseEntity.ok(items);
    }


    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear all cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        
        
        return ResponseEntity.ok(Map.of("message", "You have been logged out successfully"));
    }
}
