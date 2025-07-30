# Spotify Playlist Analyzer
A comprehensive application for analyzing your Spotify playlists, discovering music trends, and exploring your listening habits. Built with Spring Boot and React.

## Getting Started

### Clone the repository
Clone the repository:
```bash
git clone git@github.com:joaoafonso02/spotifyAnalyser.git
cd spotify-analyzer
```

### Backend Setup
Run the Spring Boot application
```bash
mvn spring-boot:run
```
The backend will start on http://127.0.0.1:8080

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the React application:
```bash
npm run dev
```
The frontend will start on http://localhost:3000

## Application Usage
1. Open your browser and navigate to http://localhost:3000
2. Log in with your Spotify account to access your playlists.
3. Authorize the application to read your playlists and analyze them.
4. Explore your playlists, view statistics, and discover new music trends.

### Project Structure
```
spotify-playlist-analyzer/
├── src/                           # Backend source code
│   └── main/
│       ├── java/...               # Java classes
│       └── resources/
│           ├── application.yml    # Application configuration
│           └── static/            # Compiled frontend (production)
├── frontend/                      # Frontend React application
│   ├── public/
│   ├── src/
│   └── package.json
├── pom.xml                        # Maven configuration
└── README.md                      # This file
```