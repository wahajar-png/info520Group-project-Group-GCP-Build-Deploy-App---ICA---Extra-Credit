# City Events Finder

## INFO 520 – Data Communications

### Project Overview

City Events Finder is a web application that helps users find upcoming events in a city. Users can enter a city name and view events such as concerts, sports games, festivals, and other local activities.

The goal is to collect event information from multiple data sources and display everything in one organized list.

## Frontend

The frontend was developed using:

- HTML – Creates the website structure.
- CSS – Controls the website design and layout.
- JavaScript – Handles the city search and displays event results.

### Frontend Features

- City search bar.
- Search button.
- Upcoming events section.
- Event names, dates, venues, and information links.
- Responsive design for desktop and mobile devices.

## Backend

The backend will handle the event searches and connect to three external data sources.

It will combine the event information, remove duplicates, and sort events by date.

The frontend will communicate with the backend using:

`/api/events?city=Richmond`

Expected response format: JSON containing an events list.

## Data Sources

The project will use three external data sources.

**Status:** To be confirmed by the backend developer.

## Running the Application Locally

1. Download or clone the GitHub repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server.
4. Enter a city into the search bar.
5. Search functionality will require the backend API to be running.

## Google Cloud Deployment

**Status:** Pending.

The application will be containerized using Docker and deployed through Google Cloud Run. The container image will be stored in Artifact Registry.

API keys will be stored securely using Google Cloud Secret Manager.

An external HTTP(S) load balancer will be configured to route traffic to the application.

## Team Collaboration

This is a two-person INFO 520 group project. Both team members will contribute to development, testing, troubleshooting, documentation, and the final presentation.

## Project Status

- [x] Frontend files created.
- [x] GitHub repository created.
- [x] Frontend files uploaded to GitHub.
- [ ] Backend development.
- [ ] External API integration.
- [ ] Frontend and backend connection.
- [ ] Docker and Google Cloud deployment.
- [ ] Load balancer configuration.
- [ ] Final testing and presentation.
