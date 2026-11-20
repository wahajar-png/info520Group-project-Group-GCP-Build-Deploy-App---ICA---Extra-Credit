#!/usr/bin/env bash
# Creates an external HTTP load balancer in front of the Cloud Run service.
set -euo pipefail
REGION=us-east1
SERVICE=city-events-finder
gcloud config set project city-events-finder-515300 --quiet

exists() { "$@" >/dev/null 2>&1; }

exists gcloud compute network-endpoint-groups describe $SERVICE-neg --region=$REGION || \
  gcloud compute network-endpoint-groups create $SERVICE-neg --region=$REGION \
    --network-endpoint-type=serverless --cloud-run-service=$SERVICE --quiet
echo "NEG ok"

exists gcloud compute backend-services describe $SERVICE-backend --global || {
  gcloud compute backend-services create $SERVICE-backend --global --load-balancing-scheme=EXTERNAL_MANAGED --quiet
  gcloud compute backend-services add-backend $SERVICE-backend --global \
    --network-endpoint-group=$SERVICE-neg --network-endpoint-group-region=$REGION --quiet
}
echo "Backend ok"

exists gcloud compute url-maps describe $SERVICE-lb --global || \
  gcloud compute url-maps create $SERVICE-lb --default-service=$SERVICE-backend --quiet
exists gcloud compute target-http-proxies describe $SERVICE-proxy --global || \
  gcloud compute target-http-proxies create $SERVICE-proxy --url-map=$SERVICE-lb --quiet
exists gcloud compute addresses describe $SERVICE-ip --global || \
  gcloud compute addresses create $SERVICE-ip --global --quiet
exists gcloud compute forwarding-rules describe $SERVICE-fr --global || \
  gcloud compute forwarding-rules create $SERVICE-fr --global --load-balancing-scheme=EXTERNAL_MANAGED \
    --address=$SERVICE-ip --target-http-proxy=$SERVICE-proxy --ports=80 --quiet
echo "Frontend ok"

IP=$(gcloud compute addresses describe $SERVICE-ip --global --format='value(address)')
echo "LB_IP=$IP"
echo "Waiting for the load balancer to come online (can take a few minutes)..."
for i in $(seq 1 30); do
  if curl -s -m 5 "http://$IP/api/events?city=Richmond" | grep -q '"events"'; then
    echo "LB_WORKING http://$IP"; exit 0
  fi
  sleep 20
done
echo "LB not answering yet - try http://$IP again in a few minutes"
