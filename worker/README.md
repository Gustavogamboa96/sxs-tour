# Tour Worker

The Worker serves tour data from `GET /tour`.

Campaign contact buttons open the visitor's email application using a `mailto:` link configured in `src/config/fallaBoconoConfig.js`. There is no contact page or email-sending endpoint, and visitors send the message themselves.

## Fundraising progress

The Google Sheet column whose header starts with `progreso` contains the total amount raised in USD. The website uses this value directly, without adding a baseline or a configured contribution amount. Until a valid total is available, progress displays zero.
