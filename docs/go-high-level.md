# Go High Level Integration Notes

## Authentication
- We use the **Go High Level REST API v1**.
- Authentication is performed with a **Personal Access Token (PAT)**, which GHL also refers to as an API Key. Store the token in `GHL_API_KEY`.

## Required Environment Variables
| Variable | Description |
| --- | --- |
| `GHL_ENDPOINT` | Fully qualified URL for the contacts endpoint (e.g. `https://rest.gohighlevel.com/v1/contacts/`). |
| `GHL_LOCATION_ID` | Workspace/Location ID that new contacts should be associated with. |
| `GHL_API_KEY` | Personal Access Token (API key) generated inside Go High Level. |

These variables are validated in both `/api/contact` and `/api/consultation` routes. Missing values result in a `500` response so misconfiguration is surfaced quickly.

## API Versioning
We remain on the v1 REST API because:
- The existing `/api/contact` implementation is already wired against v1 and shares the same payload structure.
- v1 supports the custom field and tag assignment features we need without additional migrations.
- Upgrading to v2 would require re-working field IDs and request bodies across multiple routes.

If the team decides to move to v2 later, we should update both API routes together and adjust payloads according to the v2 schema.

## Considering Zapier
Zapier could proxy form submissions, but keeping the direct API call provides:
- Lower latency and one less external dependency.
- Full control over error propagation so the UI can display upstream failures.
- Reduced ongoing costs versus a paid Zapier plan for moderate volume.

We can revisit Zapier if non-technical operators need to compose additional automations without engineering support, but for now the direct integration is simpler and more reliable.
