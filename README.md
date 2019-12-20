# OCE Webhook Node.js

*OCE Webhook Node.js* is a demo of [Oracle Content and Experience webhook](https://docs.oracle.com/en/cloud/paas/content-cloud/developer/webhooks-push-notifications-content-lifecycle-and-content-publishing-events.html) integrations built on Node.js, Express and Heroku. From the product documentation:

> Use webhooks to receive push notifications about content lifecycle events and content publishing events. The Webhooks application let you automatically receive information from Oracle Content and Experience to send to external applications through REST APIs.

This application processes those notification events in several ways.

### Persistent storage of events

Store asset events in a Postgresql database and retrieve events via API endpoint.
 
