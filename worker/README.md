# Tour Worker

The Worker serves tour data from `GET /tour`.

Campaign contact buttons open the visitor's email application using a `mailto:` link configured in `src/config/fallaBoconoConfig.js`. There is no contact page or email-sending endpoint, and visitors send the message themselves.

## Fundraising progress

The Google Sheet column whose header starts with `progreso` must contain only new net contributions received and reconciled, excluding the US$2,779 baseline already executed through other sources. The website adds that baseline to the live amount so it is counted once.
