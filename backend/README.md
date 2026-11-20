# Backend: Event Finder API (Node.js + Express)

Combines events from **PredictHQ**, **SerpApi (Google Events)**, **SeatGeek** and **Ticketmaster**, removes duplicates, sorts them by date, and returns them in the format the frontend expects.

## API

`GET /api/events?city=Richmond`

```json
{
  "events": [
    {
      "title": "Example Concert",
      "date": "2026-12-15T19:00:00",
      "venue": "Richmond Convention Center",
      "city": "Richmond",
      "url": "https://example.com/event"
    }
  ]
}
```

- Missing `city` → `400` with `{ "events": [], "error": "..." }`
- If one API fails, results from the others are still returned.
- Duplicates = same title + same day + same venue (case and punctuation ignored).
- `url` can be `""` (PredictHQ doesn't give ticket links).

`GET /healthz` → `{ "status": "ok" }` (for Cloud Run / load balancer health checks)

## Run locally

```bash
cd backend
npm install
npm run dev          # mock data, no API keys needed
npm test             # unit tests for de-duplication and sorting
```

Then open http://localhost:8080/api/events?city=Richmond

To serve the frontend from the same server (so `/api/events` works as a relative URL):

```bash
STATIC_DIR=.. npm run dev   # serves index.html, styles.css, app.js from the repo root
```

Then open http://localhost:8080 and search a city.

With real data:

```bash
export TICKETMASTER_API_KEY=...
export SEATGEEK_CLIENT_ID=...
export PREDICTHQ_TOKEN=...
export SERPAPI_KEY=...
npm start
```

Any API without a key is skipped. With no keys at all, the server uses mock data.

## Deploy to GCP

Set these once:

```bash
PROJECT_ID=your-project-id
REGION=us-east1
REPO=event-finder
SERVICE=event-finder-api
IMAGE=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE:latest

gcloud config set project $PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com cloudbuild.googleapis.com compute.googleapis.com
```

### 1. Artifact Registry + Docker image

```bash
gcloud artifacts repositories create $REPO --repository-format=docker --location=$REGION
# run from the repo root: the Dockerfile there bundles the backend and the frontend
gcloud builds submit . --tag $IMAGE
# or locally: docker build -t $IMAGE . && gcloud auth configure-docker $REGION-docker.pkg.dev && docker push $IMAGE
```

### 2. Secret Manager

```bash
printf '%s' "YOUR_TM_KEY"   | gcloud secrets create ticketmaster-api-key --data-file=-
printf '%s' "YOUR_SG_ID"    | gcloud secrets create seatgeek-client-id   --data-file=-
printf '%s' "YOUR_PHQ_TOKEN"| gcloud secrets create predicthq-token      --data-file=-

# Let Cloud Run's service account read them
SA=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')-compute@developer.gserviceaccount.com
for s in ticketmaster-api-key seatgeek-client-id predicthq-token; do
  gcloud secrets add-iam-policy-binding $s --member=serviceAccount:$SA --role=roles/secretmanager.secretAccessor
done
```

### 3. Cloud Run

```bash
gcloud run deploy $SERVICE --image $IMAGE --region $REGION --allow-unauthenticated \
  --set-secrets=TICKETMASTER_API_KEY=ticketmaster-api-key:latest,SEATGEEK_CLIENT_ID=seatgeek-client-id:latest,PREDICTHQ_TOKEN=predicthq-token:latest
```

Test: `curl "$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')/api/events?city=Richmond"`

### 4. External HTTPS load balancer (serverless NEG)

```bash
gcloud compute network-endpoint-groups create $SERVICE-neg --region=$REGION \
  --network-endpoint-type=serverless --cloud-run-service=$SERVICE
gcloud compute backend-services create $SERVICE-backend --global --load-balancing-scheme=EXTERNAL_MANAGED
gcloud compute backend-services add-backend $SERVICE-backend --global \
  --network-endpoint-group=$SERVICE-neg --network-endpoint-group-region=$REGION
gcloud compute url-maps create $SERVICE-lb --default-service=$SERVICE-backend
gcloud compute target-http-proxies create $SERVICE-proxy --url-map=$SERVICE-lb
gcloud compute addresses create $SERVICE-ip --global
gcloud compute forwarding-rules create $SERVICE-fr --global --load-balancing-scheme=EXTERNAL_MANAGED \
  --address=$SERVICE-ip --target-http-proxy=$SERVICE-proxy --ports=80
gcloud compute addresses describe $SERVICE-ip --global --format='value(address)'
```

For HTTPS, add a managed SSL certificate (needs a domain) and a `target-https-proxies` on port 443.

**Frontend hosting:** the root Dockerfile copies `index.html`, `styles.css` and `app.js` into the image, so one Cloud Run service serves both the site and `/api/events`.
