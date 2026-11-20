#!/usr/bin/env bash
# Stores event API keys in Secret Manager and connects them to Cloud Run.
# Paste each key when asked (input is hidden). Press Enter to skip one you don't have yet.
set -euo pipefail
PROJECT=city-events-finder-515300
REGION=us-east1
SERVICE=city-events-finder
gcloud config set project $PROJECT --quiet

SA=$(gcloud run services describe $SERVICE --region $REGION --format='value(spec.template.spec.serviceAccountName)')
[ -z "$SA" ] && SA="$(gcloud projects describe $PROJECT --format='value(projectNumber)')-compute@developer.gserviceaccount.com"

MAPPINGS=()
add_secret () {
  local env_name=$1 secret_name=$2 label=$3 value
  read -r -s -p "Paste your $label (Enter to skip): " value; echo
  [ -z "$value" ] && { echo "  skipped $label"; return; }
  if gcloud secrets describe "$secret_name" >/dev/null 2>&1; then
    printf '%s' "$value" | gcloud secrets versions add "$secret_name" --data-file=- --quiet >/dev/null
  else
    printf '%s' "$value" | gcloud secrets create "$secret_name" --data-file=- --replication-policy=automatic --quiet >/dev/null
  fi
  gcloud secrets add-iam-policy-binding "$secret_name" --member="serviceAccount:$SA" \
    --role=roles/secretmanager.secretAccessor --quiet >/dev/null
  MAPPINGS+=("$env_name=$secret_name:latest")
  echo "  saved $label in Secret Manager as $secret_name"
}

add_secret TICKETMASTER_API_KEY ticketmaster-api-key "Ticketmaster Consumer Key"
add_secret SEATGEEK_CLIENT_ID   seatgeek-client-id   "SeatGeek Client ID"
add_secret PREDICTHQ_TOKEN      predicthq-token      "PredictHQ Access Token"
add_secret SERPAPI_KEY          serpapi-key          "SerpApi API Key"

if [ ${#MAPPINGS[@]} -eq 0 ]; then echo "No keys entered; nothing changed."; exit 0; fi

IFS=,; gcloud run services update $SERVICE --region $REGION --update-secrets="${MAPPINGS[*]}" --quiet; unset IFS
URL=$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')
echo "Live results:"; curl -s "$URL/api/events?city=Richmond" | head -c 600; echo
echo "SECRETS_DONE"
