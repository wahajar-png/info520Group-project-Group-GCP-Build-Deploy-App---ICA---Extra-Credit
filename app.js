
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const eventsList = document.getElementById("events-list");
const statusMessage = document.getElementById("status-message");

searchForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city.";
        return;
    }

    eventsList.innerHTML = "";
    statusMessage.textContent = "Searching for events...";

    const searchButton = searchForm.querySelector("button");
    searchButton.disabled = true;

    try {
        const response = await fetch(
            `/api/events?city=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve events.");
        }

        const data = await response.json();

        const events = Array.isArray(data) ? data : data.events;

        if (!Array.isArray(events)) {
            throw new Error("The server returned an invalid response.");
        }

        events.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        displayEvents(events);

    } catch (error) {
        statusMessage.textContent =
            "Could not load events. Please try again later.";

        console.error(error);

    } finally {
        searchButton.disabled = false;
    }
});

function displayEvents(events) {
    eventsList.innerHTML = "";

    if (events.length === 0) {
        statusMessage.textContent =
            "No upcoming events were found for this city.";
        return;
    }

    statusMessage.textContent =
        `Found ${events.length} upcoming events.`;

    events.forEach(function(event) {
        const card = document.createElement("div");
        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = event.title || "Untitled Event";

        const date = document.createElement("p");
        date.textContent = "Date: " + formatDate(event.date);

        const venue = document.createElement("p");
        venue.textContent = "Venue: " + (event.venue || "Not available");

        const city = document.createElement("p");
        city.textContent = "City: " + (event.city || "Not available");

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(venue);
        card.appendChild(city);

        if (event.url) {
            try {
                const eventUrl = new URL(event.url);

                if (eventUrl.protocol === "https:" ||
                    eventUrl.protocol === "http:") {

                    const link = document.createElement("a");
                    link.href = eventUrl.href;
                    link.textContent = "More Information";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    card.appendChild(link);
                }
            } catch (error) {
                console.log("Invalid event link.");
            }
        }

        eventsList.appendChild(card);
    });
}

function formatDate(date) {
    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        return "Date not available";
    }

    return eventDate.toLocaleDateString();
}
