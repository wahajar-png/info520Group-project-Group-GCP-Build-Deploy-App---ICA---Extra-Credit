# City Events Finder

## INFO 520 – Data Communications

### Project Overview

City Events Finder is a web application that helps users find upcoming events in a city. Users can enter a city name and view events such as concerts, sports games, festivals, and other local activities.

The application collects event information from multiple sources, combines the results, removes duplicates, and sorts events by date.

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

It handles event searches and combines information from multiple data sources.

### Backend Features

- Accepts city searches through an API endpoint.
- Collects event information from different sources.
- Removes duplicate events.
- Sorts events by date.
- Returns event information in JSON format.
- Uses mock data when external API keys are not configured.

The frontend communicates with the backend using:

`GET /api/events?city=Richmond`

The backend also includes a health check endpoint:

`GET /healthz`

## Data Sources

The backend includes integrations for:

- Ticketmaster
- SeatGeek
- PredictHQ
- SerpApi Google Events

The application also supports mock event data for local testing.

External API integrations and API key configuration still need to be verified.

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

The application includes a Dockerfile for containerizing the frontend and backend.

The planned deployment process uses:

- Docker for containerization.
- Google Artifact Registry for storing the container image.
- Google Cloud Run for hosting the application.
- Google Secret Manager for securely storing API keys.
- An external HTTP(S) load balancer for routing traffic.

Deployment scripts are included in the repository.

Google Cloud deployment and load balancer configuration are still pending.

## Team Collaboration

This is a two-person INFO 520 group project. Both team members contribute to development, testing, troubleshooting, documentation, and the final presentation.

## Project Status

- [x] Frontend development.
- [x] GitHub repository created.
- [x] Backend development.
- [x] Backend unit tests passed.
- [x] Local frontend and backend connection.
- [x] Docker configuration added.
- [ ] External API keys configured and integrations verified.
- [ ] Google Cloud deployment.
- [ ] Artifact Registry configuration.
- [ ] Secret Manager configuration.
- [ ] Load balancer configuration.
- [ ] Final cloud testing and presentation.
