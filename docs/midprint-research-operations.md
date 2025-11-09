# MidPrint Research Operations Runbook

## Keyword research caching lifecycle
- Each keyword research request writes a summary document to `midprintResearch/{userId}/queries/{queryId}`.
- The Cloud Function now emits a `status/current` metadata document containing `state`, `startedAt`, `completedAt`, `lastUpdatedAt`, and `error` fields for polling and troubleshooting.
- Cached results include an `expiresAt` timestamp (12-hour TTL). The API will reuse data until `expiresAt`, then enqueue a new job and return a processing payload.
- Client polling honours `nextRecommendedPollMs` (default 15s) to avoid hammering Firestore when a job is running.

## Rate-limit and quota guardrails
- **Google Ads API**: avoid re-requesting within one minute for identical queries. Respect the developer token quota; the backend throttles sequential market chunks and logs failures with `state: error` in the status doc.
- **Firestore**: status documents split writes between the `status/current` metadata entry and individual market docs to keep write throughput predictable. Avoid manual bulk updates to query collections; prefer the runbooks below.
- **Secret Manager / OAuth**: failures retrieving user auth context mark the status record as `error`. Do not retry more than twice without verifying the user’s refresh token.

## Monitoring checklist
- Cloud Logging entries tagged with `keyword market research run completed/failed` provide run-level telemetry.
- The MidPrint dashboard includes new widgets for:
  - Research job success rate (completed vs. error states in the status subcollection).
  - Google Ads API quota consumption per user (derived from function logs).
- Set alerting thresholds for consecutive `state: error` runs per query ID and aggregate quota usage approaching 80% of allocation.

## Runbooks
### Clear a stuck research job
1. Locate the query document (`midprintResearch/{userId}/queries/{queryId}`) and open `status/current`.
2. If `state` is `running` or `queued` for longer than 30 minutes, set it to `error` with a note in `error` (retain timestamps) to unblock the UI.
3. Confirm no in-progress Cloud Function runs exist (Cloud Logging search for the query ID).
4. Trigger a manual refresh by hitting the internal API (`/api/midprint/research` with the original parameters) or enqueue via the Firestore-triggered scheduler.

### Regenerate cache after invalid data
1. Delete the `markets` subcollection docs for the affected query or add a flag `status: 'stale'` to specific markets.
2. Remove or adjust the `summary` and `expiresAt` fields on the query document.
3. Update the `status/current` document to `state: 'queued'` with a fresh `startedAt` timestamp (or delete the status doc entirely— the next run will recreate it).
4. Call the internal API; it will detect the missing cache and enqueue a new job.

### Respond to quota exhaustion
1. Check recent `error` values for quota-related messages (e.g., `RATE_EXCEEDED`).
2. Pause scheduler-driven refreshes for non-critical users by updating the `midprintResearchConfig/popularKeywords` document.
3. Notify stakeholders and, if needed, extend TTL by updating client configuration to avoid requeueing until quota resets.
4. Once quota resets, run a manual refresh and verify `state` transitions back to `success`.

## Operational tips
- Always review `lastRequestedAt` versus `expiresAt` to determine whether the cache genuinely needs regeneration before retrying.
- Use the structured logs to filter by `queryHash` when correlating Cloud Function activity with UI polling behaviour.
- Document any manual intervention in the query document (e.g., add `lastManuallyResetAt`) to maintain an audit trail.
