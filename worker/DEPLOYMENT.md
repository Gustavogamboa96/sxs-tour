# Tour Dates Worker - Deployment Guide

## Overview

This worker fetches tour dates from a Google Sheet, validates the data, caches it for 10 minutes, and returns formatted JSON.

---

## 1. Google Sheet Setup

### Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it (e.g., "Tour Dates CMS")
3. Create these exact column headers in Row 1:
   - **A1:** `Fecha`
   - **B1:** `Lugar`
   - **C1:** `Link to tickets`
   - **D1:** `Banner`

### Column Format Requirements

| Column | Format | Example |
|--------|--------|---------|
| Fecha | dd/mm/yyyy | 05/04/2026 |
| Lugar | Text (city name) | Miami, FL |
| Link to tickets | Full URL | https://tickets.com/event |
| Banner | Image URL | https://cdn.example.com/banner.jpg |

### Make the Sheet Public

1. Click **Share** (top right)
2. Click **Change to anyone with the link**
3. Set access to **Viewer**
4. Click **Done**

### Get the SHEET_ID

The SHEET_ID is the long string in your Google Sheet URL:

```
https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit
```

For example, if your URL is:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

Your SHEET_ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

## 2. Worker Deployment

### Prerequisites

- [Node.js](https://nodejs.org) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed:
  ```bash
  npm install -g wrangler
  ```
- Cloudflare account with Workers enabled

### Deploy the Worker

```bash
# Navigate to worker directory
cd worker

# Login to Cloudflare (one-time)
wrangler login

# Set the SHEET_ID as a secret (replace with your actual ID)
wrangler secret put SHEET_ID
# When prompted, paste your Google Sheet ID

# Deploy the worker
wrangler deploy
```

After deployment, note your worker URL:
```
https://tour-dates-worker.<your-subdomain>.workers.dev
```

### Test the Worker

```bash
curl https://tour-dates-worker.<your-subdomain>.workers.dev/tour
```

Expected response:
```json
{
  "banner": "https://cdn.example.com/banner.jpg",
  "tourDates": [
    {
      "fecha": "05.04.2026",
      "lugar": "Miami, FL",
      "ticketLink": "https://tickets.com/event"
    }
  ]
}
```

---

## 3. Frontend Configuration

### Add Environment Variable

Create or update `.env` in your project root:

```env
VITE_TOUR_WORKER_URL=https://tour-dates-worker.<your-subdomain>.workers.dev
```

For production, add this in your Cloudflare Pages dashboard:
1. Go to **Pages** → Your project → **Settings** → **Environment variables**
2. Add `VITE_TOUR_WORKER_URL` with your worker URL

### Build and Deploy Frontend

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

---

## 4. Managing Tour Dates

Simply edit the Google Sheet to update tour dates:

1. **Add a date:** Add a new row with Fecha, Lugar, Link to tickets
2. **Remove a date:** Delete the row
3. **Update banner:** Change the Banner URL in any row (first non-empty value is used)

Changes will reflect within 10 minutes (cache duration).

---

## File Structure

```
worker/
├── src/
│   └── index.js      # Worker code
└── wrangler.toml     # Worker configuration

src/
└── hooks/
    └── useTourDates.js  # React hook for fetching
```

---

## Troubleshooting

### CORS Errors
The worker includes CORS headers. If issues persist, check that your Pages domain is correct.

### Empty Response
- Verify the Google Sheet is public
- Check column headers match exactly (case-sensitive)
- Ensure date format is dd/mm/yyyy
- Verify URLs are valid

### Cache Not Updating
Wait 10 minutes or deploy a new version of the worker to clear cache.
