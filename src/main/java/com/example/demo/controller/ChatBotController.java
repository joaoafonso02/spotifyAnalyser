// package com.example.demo.controller;

// import org.springframework.web.bind.annotation.*;
// import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
// import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;

// import java.util.Map;
// import java.util.List;

// @RestController
// @RequestMapping("/api/chatbot")
// public class ChatBotController {

//    @PostMapping("/chat")
//     public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
//         String userMessage = request.get("message");
//         System.out.println("🎯 Chat endpoint hit with message: " + userMessage);
        
//         try {
//             // Shorter, more direct prompt
//             String prompt = "Music assistant: " + userMessage + "\nResponse:";
            
//             String ollamaResponse = callOllamaAPI(prompt);
            
//             return ResponseEntity.ok(Map.of(
//                 "response", ollamaResponse,
//                 "timestamp", System.currentTimeMillis(),
//                 "model", "ollama-phi3-mini"
//             ));
            
//         } catch (Exception e) {
//             System.err.println("❌ Controller error: " + e.getMessage());
//             return ResponseEntity.ok(Map.of(
//                 "response", "🤖 Sorry, I'm having trouble. Error: " + e.getMessage(),
//                 "timestamp", System.currentTimeMillis()
//             ));
//         }
//     }

//     // @PostMapping("/chat")
//     // public ResponseEntity<Map<String, Object>> chat(
//     //     @RequestBody Map<String, String> request,
//     //     @RegisteredOAuth2AuthorizedClient(value = "spotify", required = false) OAuth2AuthorizedClient authorizedClient
//     // ) {
//     //     String userMessage = request.get("message");
//     //     System.out.println("🎯 Chat endpoint hit with message: " + userMessage);
        
//     //     try {
//     //         // Get user's music context if available
//     //         String musicContext = "";
//     //         if (authorizedClient != null) {
//     //             musicContext = getUserMusicContext(authorizedClient);
//     //             System.out.println("🎵 Music context: " + musicContext);
//     //         } else {
//     //             System.out.println("🔐 No Spotify authentication");
//     //         }
            
//     //         // Build prompt for the LLM
//     //         String prompt = "You are a helpful music assistant chatbot. " +
//     //             (musicContext.isEmpty() ? "The user hasn't connected their Spotify account." : 
//     //              "Here's the user's music data: " + musicContext) +
//     //             "\n\nUser: " + userMessage + "\nAssistant:";
            
//     //         // Call local Ollama LLM
//     //         String ollamaResponse = callOllamaAPI(prompt);
            
//     //         return ResponseEntity.ok(Map.of(
//     //             "response", ollamaResponse,
//     //             "timestamp", System.currentTimeMillis(),
//     //             "model", "ollama-llama3.2"
//     //         ));
            
//     //     } catch (Exception e) {
//     //         System.err.println("❌ Controller error: " + e.getMessage());
//     //         e.printStackTrace();
//     //         return ResponseEntity.ok(Map.of(
//     //             "response", "🤖 Sorry, I'm having trouble. Error: " + e.getMessage(),
//     //             "timestamp", System.currentTimeMillis()
//     //         ));
//     //     }
//     // }

//     private String callOllamaAPI(String prompt) {
//         System.out.println("🔄 Calling Ollama API...");
        
//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             String url = "http://localhost:11434/api/generate";
            
//             Map<String, Object> request = Map.of(
//                 "model", "gemma2:2b",  
//                 "prompt", prompt,
//                 "stream", false,
//                 "options", Map.of("num_predict", 500)
//             );

//             // Map<String, Object> request = Map.of(
//             //     "model", "tinyllama:1.1b",  // Much smaller model
//             //     "prompt", prompt,
//             //     "stream", false,
//             //     "options", Map.of(
//             //         "num_predict", 500,      // Very short responses
//             //         "temperature", 0.7,     // More deterministic
//             //         "num_ctx", 2048         // Smaller context window
//             //     )
//             // );
                        
//             System.out.println("📤 Sending request to Ollama...");
//             ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
//             System.out.println("📥 Received response: " + response.getStatusCode());
            
//             Map<String, Object> responseBody = response.getBody();
            
//             if (responseBody != null && responseBody.containsKey("response")) {
//                 String ollamaResponse = (String) responseBody.get("response");
//                 System.out.println("✅ Ollama response received: '" + ollamaResponse + "'"); // Add this line
//                 System.out.println("📝 Response length: " + ollamaResponse.length()); // Add this line
//                 return ollamaResponse;
//             }
            
//             System.out.println("❌ No response field in responseBody: " + responseBody); // Add this line
//             return "No response from Ollama";
            
//         } catch (Exception e) {
//             System.err.println("❌ Ollama API error: " + e.getMessage());
//             e.printStackTrace();
//             return "Ollama connection failed: " + e.getMessage();
//         }
//     }
//     // private String getUserMusicContext(OAuth2AuthorizedClient authorizedClient) {
//     //     try {
//     //         String url = "https://api.spotify.com/v1/me/top/artists?limit=3";
//     //         RestTemplate restTemplate = new RestTemplate();
//     //         HttpHeaders headers = new HttpHeaders();
//     //         headers.set("Authorization", "Bearer " + authorizedClient.getAccessToken().getTokenValue());
//     //         HttpEntity<String> entity = new HttpEntity<>(headers);

//     //         ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
//     //         Map<String, Object> responseBody = response.getBody();
            
//     //         if (responseBody != null && responseBody.get("items") instanceof List) {
//     //             List<Map<String, Object>> artists = (List<Map<String, Object>>) responseBody.get("items");
//     //             StringBuilder context = new StringBuilder("User's top artists: ");
                
//     //             for (Map<String, Object> artist : artists) {
//     //                 context.append(artist.get("name")).append(", ");
//     //             }
                
//     //             return context.toString();
//     //         }
//     //     } catch (Exception e) {
//     //         System.err.println("Error getting music context: " + e.getMessage());
//     //     }
        
//     //     return "";
//     // }
// }

package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
        @RequestBody Map<String, String> request,
        HttpServletRequest httpRequest
    ) {
        String userMessage = request.get("message");
        System.out.println("🎯 Chat endpoint hit with message: " + userMessage);
        
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "response", "🤖 Gemini API key not configured.",
                "timestamp", System.currentTimeMillis(),
                "model", "error"
            ));
        }
        
        try {
            // Check if user wants Spotify data
            boolean needsSpotifyAuth = requiresSpotifyData(userMessage);
            String spotifyData = "";
            
            if (needsSpotifyAuth) {
                spotifyData = getSpotifyDataFromExistingEndpoints(userMessage, httpRequest);
                
                if (spotifyData.startsWith("AUTH_REQUIRED")) {
                    return ResponseEntity.ok(Map.of(
                        "response", "🔐 To access your Spotify data, please log in first at: http://localhost:3000/",
                        "timestamp", System.currentTimeMillis(),
                        "model", "auth-required"
                    ));
                }
            }
            
            // Build enhanced prompt with Spotify data
            String prompt = buildPrompt(userMessage, spotifyData);
            String geminiResponse = callGeminiAPI(prompt);
            
            return ResponseEntity.ok(Map.of(
                "response", geminiResponse,
                "timestamp", System.currentTimeMillis(),
                "model", "gemini-with-spotify",
                "hasSpotifyData", !spotifyData.isEmpty()
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Controller error: " + e.getMessage());
            return ResponseEntity.ok(Map.of(
                "response", "🤖 Sorry, I'm having trouble: " + e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }

    private boolean requiresSpotifyData(String message) {
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("my top") || 
            lowerMessage.contains("my spotify") ||
            lowerMessage.contains("my artists") ||
            lowerMessage.contains("my tracks") ||
            lowerMessage.contains("my playlists") ||
            lowerMessage.contains("my playlist") ||
            lowerMessage.contains("my music") ||
            lowerMessage.contains("analyze my") ||
            lowerMessage.contains("playlist") ||
            lowerMessage.contains("playlists") ||
            lowerMessage.contains("recent playlist") ||
            lowerMessage.contains("latest playlist") ||
            lowerMessage.contains("go to my spotify");
    }

    private String getSpotifyDataFromExistingEndpoints(String message, HttpServletRequest httpRequest) {
        String lowerMessage = message.toLowerCase();
        StringBuilder data = new StringBuilder();
        
        // Extract the number requested by the user
        int requestedCount = extractRequestedCount(message);
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            String baseUrl = "http://127.0.0.1:8080";
            
            // Get ALL cookies from the request (including JSESSIONID)
            String cookieHeader = httpRequest.getHeader("Cookie");
            System.out.println("🍪 Cookie header: " + cookieHeader);
            
            // Get session ID from cookies if available
            String sessionId = extractSessionId(httpRequest);
            System.out.println("🔑 Session ID: " + sessionId);
            
            if ((cookieHeader == null || cookieHeader.trim().isEmpty()) && sessionId == null) {
                System.out.println("❌ No authentication found in request");
                return "AUTH_REQUIRED";
            }
            
            // Top Artists
            if (lowerMessage.contains("top") && (lowerMessage.contains("artists") || lowerMessage.contains("artist"))) {
                String timeRange = extractTimeRange(message);
                String endpoint = baseUrl + "/analytics/top-artists?time_range=" + timeRange;
                
                try {
                    org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                    
                    // Add all possible authentication headers
                    if (cookieHeader != null && !cookieHeader.trim().isEmpty()) {
                        headers.set("Cookie", cookieHeader);
                    }
                    
                    // Try to build cookie header from session
                    if (sessionId != null) {
                        String sessionCookie = "JSESSIONID=" + sessionId;
                        if (cookieHeader != null) {
                            headers.set("Cookie", cookieHeader + "; " + sessionCookie);
                        } else {
                            headers.set("Cookie", sessionCookie);
                        }
                    }
                    
                    headers.set("User-Agent", "ChatBot-Internal-Call");
                    
                    org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                    
                    System.out.println("🔗 Calling endpoint: " + endpoint);
                    System.out.println("🔗 With headers: " + headers.toSingleValueMap());
                    
                    ResponseEntity<List> response = restTemplate.exchange(endpoint, org.springframework.http.HttpMethod.GET, entity, List.class);
                    
                    System.out.println("📊 Response status: " + response.getStatusCode());
                    
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        List<Map<String, Object>> artists = response.getBody();
                        
                        System.out.println("🎵 Processing " + artists.size() + " artists from Spotify, showing top " + requestedCount);
                        
                        data.append("USER'S TOP ").append(requestedCount).append(" ARTISTS (").append(timeRange.replace("_", " ")).append("):\n");
                        
                        for (int i = 0; i < Math.min(requestedCount, artists.size()); i++) {
                            Map<String, Object> artist = artists.get(i);
                            String artistName = (String) artist.get("name");
                            
                            data.append((i + 1)).append(". **").append(artistName).append("**");
                            
                            // Add popularity score
                            if (artist.get("popularity") != null) {
                                data.append(" (Popularity: ").append(artist.get("popularity")).append("/100)");
                            }
                            
                            // Add genres
                            if (artist.get("genres") instanceof List) {
                                List<String> genres = (List<String>) artist.get("genres");
                                if (!genres.isEmpty()) {
                                    data.append(" - Genres: ").append(String.join(", ", genres.subList(0, Math.min(3, genres.size()))));
                                }
                            }
                            
                            // Add follower count
                            if (artist.get("followers") instanceof Map) {
                                Map<String, Object> followers = (Map<String, Object>) artist.get("followers");
                                if (followers.get("total") != null) {
                                    int followerCount = (Integer) followers.get("total");
                                    data.append(" - Followers: ").append(String.format("%,d", followerCount));
                                }
                            }
                            
                            data.append("\n");
                        }
                        
                        data.append("\n");
                        System.out.println("📝 Generated artist data for " + Math.min(requestedCount, artists.size()) + " artists");
                        
                    } else {
                        System.out.println("❌ Non-successful response: " + response.getStatusCode());
                        return "AUTH_REQUIRED";
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error calling top artists endpoint: " + e.getMessage());
                    e.printStackTrace();
                    return "AUTH_REQUIRED";
                }
            }
            
            // Top Tracks
            if (lowerMessage.contains("top") && (lowerMessage.contains("tracks") || lowerMessage.contains("songs"))) {
                String timeRange = extractTimeRange(message);
                String endpoint = baseUrl + "/analytics/top-tracks?time_range=" + timeRange;
                
                try {
                    org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                    
                    if (cookieHeader != null && !cookieHeader.trim().isEmpty()) {
                        headers.set("Cookie", cookieHeader);
                    }
                    
                    if (sessionId != null) {
                        String sessionCookie = "JSESSIONID=" + sessionId;
                        if (cookieHeader != null) {
                            headers.set("Cookie", cookieHeader + "; " + sessionCookie);
                        } else {
                            headers.set("Cookie", sessionCookie);
                        }
                    }
                    
                    headers.set("User-Agent", "ChatBot-Internal-Call");
                    
                    org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                    
                    ResponseEntity<List> response = restTemplate.exchange(endpoint, org.springframework.http.HttpMethod.GET, entity, List.class);
                    
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        List<Map<String, Object>> tracks = response.getBody();
                        
                        System.out.println("🎵 Processing " + tracks.size() + " tracks from Spotify, showing top " + requestedCount);
                        
                        data.append("USER'S TOP ").append(requestedCount).append(" TRACKS (").append(timeRange.replace("_", " ")).append("):\n");
                        
                        for (int i = 0; i < Math.min(requestedCount, tracks.size()); i++) {
                            Map<String, Object> track = tracks.get(i);
                            String trackName = (String) track.get("name");
                            
                            // Get artist names
                            List<Map<String, Object>> artists = (List<Map<String, Object>>) track.get("artists");
                            String artistNames = artists.stream()
                                .map(a -> (String) a.get("name"))
                                .reduce((a, b) -> a + ", " + b)
                                .orElse("Unknown Artist");
                            
                            data.append((i + 1)).append(". **").append(trackName).append("** by ").append(artistNames);
                            
                            // Add popularity
                            if (track.get("popularity") != null) {
                                data.append(" (Popularity: ").append(track.get("popularity")).append("/100)");
                            }
                            
                            data.append("\n");
                        }
                                                
                        data.append("\n");
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error calling top tracks endpoint: " + e.getMessage());
                }
            }

            // Playlists 
            if (lowerMessage.contains("playlist") || lowerMessage.contains("playlists")) {
                String endpoint = baseUrl + "/playlists";
                
                try {
                    org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                    
                    if (cookieHeader != null && !cookieHeader.trim().isEmpty()) {
                        headers.set("Cookie", cookieHeader);
                    }
                    
                    if (sessionId != null) {
                        String sessionCookie = "JSESSIONID=" + sessionId;
                        if (cookieHeader != null) {
                            headers.set("Cookie", cookieHeader + "; " + sessionCookie);
                        } else {
                            headers.set("Cookie", sessionCookie);
                        }
                    }
                    
                    headers.set("User-Agent", "ChatBot-Internal-Call");
                    
                    org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                    
                    System.out.println("🔗 Calling playlist endpoint: " + endpoint);
                    
                    // Changed from Map to List since your endpoint returns List directly
                    ResponseEntity<List> response = restTemplate.exchange(endpoint, org.springframework.http.HttpMethod.GET, entity, List.class);
                    
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        List<Map<String, Object>> playlists = response.getBody();
                        
                        if (playlists != null && !playlists.isEmpty()) {
                            // Extract requested count for playlists
                            int playlistCount = requestedCount;
                            if (lowerMessage.contains("recent") || lowerMessage.contains("latest")) {
                                playlistCount = Math.min(requestedCount, 10); // Limit recent playlists
                            } else if (lowerMessage.contains("all")) {
                                playlistCount = playlists.size(); // Show all
                            } else {
                                playlistCount = Math.min(requestedCount, playlists.size());
                            }
                            
                            System.out.println("🎵 Processing " + playlists.size() + " playlists from Spotify, showing " + playlistCount);
                            
                            if (lowerMessage.contains("recent") || lowerMessage.contains("latest")) {
                                data.append("USER'S ").append(playlistCount).append(" MOST RECENT PLAYLISTS:\n");
                            } else {
                                data.append("USER'S PLAYLISTS (showing ").append(playlistCount).append("):\n");
                            }
                            
                            for (int i = 0; i < Math.min(playlistCount, playlists.size()); i++) {
                                Map<String, Object> playlist = playlists.get(i);
                                String playlistName = (String) playlist.get("name");
                                String description = (String) playlist.get("description");
                                
                                data.append((i + 1)).append(". **").append(playlistName).append("**");
                                
                                // Add track count
                                if (playlist.get("tracks") instanceof Map) {
                                    Map<String, Object> tracks = (Map<String, Object>) playlist.get("tracks");
                                    if (tracks.get("total") != null) {
                                        int trackCount = (Integer) tracks.get("total");
                                        data.append(" (").append(trackCount).append(" tracks)");
                                    }
                                }
                                
                                // Add description if available and not too long
                                if (description != null && !description.trim().isEmpty() && description.length() < 100) {
                                    data.append(" - ").append(description);
                                }
                                
                                // Add public/private status
                                if (playlist.get("public") != null) {
                                    boolean isPublic = (Boolean) playlist.get("public");
                                    data.append(" [").append(isPublic ? "Public" : "Private").append("]");
                                }
                                
                                data.append("\n");
                            }
                            
                            data.append("\n");
                            System.out.println("📝 Generated playlist data for " + Math.min(playlistCount, playlists.size()) + " playlists");
                            
                        } else {
                            data.append("No playlists found.\n");
                        }
                    } else {
                        System.out.println("❌ Non-successful playlist response: " + response.getStatusCode());
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error calling playlists endpoint: " + e.getMessage());
                    e.printStackTrace();
                }
            }
                        
        } catch (Exception e) {
            System.err.println("❌ Error in getSpotifyDataFromExistingEndpoints: " + e.getMessage());
            e.printStackTrace();
            return "AUTH_REQUIRED";
        }
        
        String result = data.toString();
        System.out.println("🎯 Final Spotify data length: " + result.length());
        
        if (result.trim().isEmpty()) {
            System.out.println("⚠️ No Spotify data was extracted!");
            return "No matching Spotify data found for your request.";
        }
        
        return result;
    }

    // Add this new method to extract the requested count
    private int extractRequestedCount(String message) {
        String lowerMessage = message.toLowerCase();
        
        // Look for numbers in the message
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("top\\s+(\\d+)");
        java.util.regex.Matcher matcher = pattern.matcher(lowerMessage);
        
        if (matcher.find()) {
            try {
                int count = Integer.parseInt(matcher.group(1));
                // Limit to reasonable bounds (max 50 since that's what Spotify returns)
                return Math.min(count, 50);
            } catch (NumberFormatException e) {
                System.err.println("Error parsing number: " + e.getMessage());
            }
        }
        
        // Default to 10 if no number found
        return 10;
    }

    private String extractSessionId(HttpServletRequest request) {
        // Try to get session ID from request
        try {
            if (request.getSession(false) != null) {
                return request.getSession(false).getId();
            }
        } catch (Exception e) {
            System.err.println("Error getting session: " + e.getMessage());
        }
        return null;
    }

    private String extractTimeRange(String message) {
        String lowerMessage = message.toLowerCase();
        if (lowerMessage.contains("last month") || lowerMessage.contains("month")) {
            return "short_term";
        } else if (lowerMessage.contains("last 6 months") || lowerMessage.contains("6 months")) {
            return "medium_term";
        } else if (lowerMessage.contains("all time") || lowerMessage.contains("ever")) {
            return "long_term";
        }
        return "medium_term";
    }

    private String buildPrompt(String userMessage, String spotifyData) {
        if (spotifyData.isEmpty() || spotifyData.startsWith("AUTH_REQUIRED") || spotifyData.startsWith("No matching")) {
            return "You are an expert music assistant. Provide helpful music recommendations and information. " +
                "User asks: " + userMessage;
        } else {
            // Check if user wants a list vs analysis
            String lowerMessage = userMessage.toLowerCase();
            boolean wantsList = lowerMessage.contains("give me") || 
                            lowerMessage.contains("show me") || 
                            lowerMessage.contains("list") ||
                            lowerMessage.contains("what are");
            
            if (wantsList) {
                return "You are a music assistant. The user wants to see their actual Spotify data. " +
                    "Present the data clearly and directly as requested. DO NOT analyze or summarize - just show the list.\n\n" +
                    "USER'S ACTUAL SPOTIFY DATA:\n" + spotifyData + "\n\n" +
                    "USER REQUEST: " + userMessage + "\n\n" +
                    "INSTRUCTIONS: Show the list exactly as provided in the data. " +
                    "Add a brief friendly intro, then present each item clearly numbered. " +
                    "You can add a short summary at the end if helpful, but focus on showing the actual list.";
            } else {
                return "You are an expert music assistant with access to the user's actual Spotify listening data. " +
                    "Analyze their music taste and provide insights based on the data.\n\n" +
                    "USER'S ACTUAL SPOTIFY DATA:\n" + spotifyData + "\n\n" +
                    "USER QUESTION: " + userMessage + "\n\n" +
                    "INSTRUCTIONS: Provide detailed analysis based on their actual Spotify data. " +
                    "Include specific patterns, genres, and insights you notice.";
            }
        }
    }

    private String callGeminiAPI(String prompt) {
        System.out.println("🔄 Calling Gemini API...");
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 1500,
                    "topP", 0.8,
                    "topK", 40
                )
            );
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                    
                    if (content != null && content.containsKey("parts")) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        
                        if (parts != null && !parts.isEmpty()) {
                            String geminiResponse = (String) parts.get(0).get("text");
                            System.out.println("✅ Gemini response received");
                            return geminiResponse;
                        }
                    }
                }
            }
            
            return "Sorry, I couldn't generate a response right now.";
            
        } catch (Exception e) {
            System.err.println("❌ Gemini API error: " + e.getMessage());
            return "🤖 Sorry, I'm having trouble connecting to the AI service.";
        }
    }
}