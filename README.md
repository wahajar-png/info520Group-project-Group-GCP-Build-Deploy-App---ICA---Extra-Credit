# City Events Finder

## INFO 520 – Data Communications

### Project Overview

City Events Finder is a web application that helps users find upcoming events in a city. Users can enter a city name and view events such as concerts, sports games, festivals, and other local activities.

The application uses a Node.js backend to handle event searches, process event information, remove duplicates, and sort events by date. It also supports mock event data when external API keys are not configured.

## Frontend

The frontend was developed using:

- HTML – Creates the website structure.
- CSS – Controls the design and layout.
- JavaScript – Handles city searches and displays event results.

### Frontend Features

- City search bar.
- Search button.
- Upcoming events section.
- Event names, dates, and venues.
- Links to event information.
- Responsive design for desktop and mobile devices.

## Backend

The backend was developed using Node.js and Express.

It handles event searches and processes information from different data sources.

### Backend Features

- Accepts city searches through an API endpoint.
- Supports multiple event data providers.
- Removes duplicate events.
- Sorts events by date.
- Returns event information in JSON format.
- Uses mock data when external API keys are not configured.

The frontend communicates with the backend using:

`GET /api/events?city=Richmond`

The backend also includes a health check endpoint in its source code:

`GET /healthz`

## Data Sources

The backend includes integrations for:

- Ticketmaster
- SeatGeek
- PredictHQ
- SerpApi Google Events

The application also supports mock event data for testing and demonstration.

Currently, external API keys are not configured. The deployed application uses the mock data fallback to provide event results.

## Local Testing

The application can be tested locally using Node.js.

1. Download or clone the GitHub repository.
2. Open the project folder in Visual Studio Code.
3. Open Terminal in the project folder.
4. Navigate to the backend folder:

`cd backend`

5. Install dependencies:

`npm install`

6. Run backend tests:

`npm test`

7. Start the application with the frontend connected:

`STATIC_DIR=.. npm run dev`

8. Open `http://localhost:8080` in a browser.

## Docker and Google Cloud Deployment

The application was containerized using Docker and deployed to Google Cloud.

The deployment uses:

- Docker for containerization.
- Google Cloud Build to build the Docker image.
- Google Artifact Registry to store the container image.
- Google Cloud Run to host the application.

### Deployment Details

- Google Cloud Project: `city-events-finder-515300`
- Region: `us-east1`
- Cloud Run Service: `city-events-finder`
- Container Registry: `city-events-repo`
- Deployed Image: `city-events-finder:v2`

### Live Application

[City Events Finder – Google Cloud Run](https://city-events-finder-pdfaliiqoa-ue.a.run.app)

The deployed application has been tested successfully. The homepage loads, users can search for events, and the backend returns event information.

## Team Collaboration

This is a two-person INFO 520 group project. Both team members contribute to development, testing, troubleshooting, documentation, and the final presentation.

## Project Status

- [x] Frontend development.
- [x] GitHub repository created.
- [x] Backend development.
- [x] Backend unit tests passed.
- [x] Local frontend and backend connection.
- [x] Docker configuration added.
- [x] Google Cloud Build completed.
- [x] Artifact Registry configured.
- [x] Google Cloud Run deployment completed.
- [x] Public website tested successfully.
- [x] Backend API tested successfully.
- [x] Event search tested successfully.
- [ ] External API keys configured (optional).
- [ ] Load balancer configuration (optional).
- [ ] Final project presentation.

https://city-events-finder-pdfaliiqoa-ue.a.run.app
