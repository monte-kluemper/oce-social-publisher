const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const { Pool } = require('pg')

const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction,
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())


// save webhook channel event to db
const webhookChannel = async (req, res) => {
	try {
		// validate the payload schema
    console.log("WebhookChannel:"+req.body);
		if (false) {
			res.status(400).send({ status: 400, error: 'Request not properly formed' })
		} else {

			try {
        console.log("WebhookChannel:try:"+req.body);
				res.status(201).json({status: 201})
			} catch (err) {
				console.error('ERROR: WebhookChannel 400 error:\n' + err);
				res.status(400).send({ status: 400, error: 'Could not process request' })
			}
		}
	} catch (err) {
    console.error('ERROR: WebhookChannel 500 error:\n' + err);
		res.status(500).send({ status: 500, error: 'Existential server error' })
	}
}

// save webhook repository event to db
const webhookRepository = async (req, res) => {
	try {
		// validate the payload schema
    console.log("WebhookRepository:"+req.body);
		if (false) {
			res.status(400).send({ status: 400, error: 'Request not properly formed' })
		} else {

			// extract channel
			var channels = !req.body.event.channelIds ? [] : req.body.event.channelIds;
      console.log("WebhookRepository:channels:"+channels);

      try {
        console.log("WebhookRepository:try:"+req.body);
				res.status(201).json({status: 201})
			} catch (err) {
				console.error('ERROR: WebhookRepository 400 error:\n' + err);
				res.status(400).send({ status: 400, error: 'Could not process request' })
			}
		}
	} catch (err) {
		console.error('* WebhookRepository error:\n' + err);
		res.status(500).send({ status: 500, error: 'Existential server error' })
	}
}

app
  .post('/channel', webhookChannel)
  .post('/repository', webhookRepository)
  .get('*', function(req, res) {
	   res.status(404).send('Resource not found');
  })
  .listen(PORT, () => console.log(`OCE Webook Node.js listening on ${ PORT }`))
