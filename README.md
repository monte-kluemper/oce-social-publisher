# OCE Webhook Node.js

*OCE Webhook Node.js* is a demo of [Oracle Content and Experience webhook](https://docs.oracle.com/en/cloud/paas/content-cloud/developer/webhooks-push-notifications-content-lifecycle-and-content-publishing-events.html) integrations built on Node.js, Express and Heroku. From the product documentation:

> Use webhooks to receive push notifications about content lifecycle events and content publishing events. The Webhooks application let you automatically receive information from Oracle Content and Experience to send to external applications through REST APIs.

This application persistently stores those notification events in a Postgres database in _channel_ (content publishing webhook) and _repository_ (content workflow webhook) tables. It can be used as a skeleton for creating your own application that integrates with OCE, for example:

- You might want OCE content to show up in the Shared Content library in Oracle Eloqua or as a content variation in Oracle Maxymiser. Use the content publishing webhook and call the external API when content is published or unpublished to the associated channel. 

- You might want to comment on a Jira ticket or send a Slack notification when content is approved or published. Use the content lifecycle webhook and call the external API when content moves through the lifecycle.

### Quick Start

These intructions are based off the [Getting Started](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true) documention on Heroku Dev Center.

#### Clone the repository.

```console
$ git clone https://github.com/johnmoney/oce-webhook-nodejs.git
$ cd oce-webhook-nodejs
```

#### Install Heroku locally and login.

```console
$ heroku login
```

#### Deploy the app to Heroku.

The OCE webhook will call the URL generated from this step.

```console
$ heroku create your-app-name
$ git push heroku master
```

#### Provision a Postgres database.

```console
$ heroku addons:create heroku-postgresql:hobby-dev
```

#### Create the tables in Postgres.

```console
$ heroku pg:psql

=> CREATE TABLE channel_event (event_id VARCHAR(36) PRIMARY KEY, event_type VARCHAR(32) NOT NULL, channel_id VARCHAR(50) NOT NULL, user_id VARCHAR(255) NOT NULL, event_time timestamp DEFAULT current_timestamp, assets jsonb);

=> CREATE TABLE repository_event (event_id VARCHAR(36) PRIMARY KEY, event_type VARCHAR(32) NOT NULL, repository_id VARCHAR(50) NOT NULL, user_id VARCHAR(255) NOT NULL, event_time timestamp DEFAULT current_timestamp, channel_id jsonb, asset jsonb);
```

After the tables are created, exit the database prompt.

```console
=> \q
```


#### Setup the webhook in OCE.

In this example, we will store asset publish and unpublish events for a channel. From Admin > Integrations, select _Webhooks_ and click the Create button.

Select _Asset Publishing Webhook_ and fill in the following:

| Field | Value |
| --- | --- |
| **Name** | oce-webhook-nodejs channel |
| **Publishing Channel** | _select one for testing_ |
| **Events** | _select individual events and Channel Asset Published and Channel Asset Unpublished_ |
| **Payload** | Detailed |
| **Target URL** | https://your-app-name.herokuapp.com/channel |

Save the Webhook.

### Test the webhook by viewing the Heroku logs.

```console
$ heroku logs --source app --tail
```

In OCE, publish an asset to the channel previously selected. You should see the app log a successful event insert.

When you are done, exit the log.

```console
$ ^C
```

__That's it.__ You now have a persistent store of notification events for the channel. You can view the database within Heroku by creating a [dataclip](https://data.heroku.com/dataclips) or extend the application for your own purposes.
