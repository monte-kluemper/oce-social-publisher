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
		if (!req.body.event.id || !req.body.event.name || !req.body.event.initiatedBy || !req.body.entity.id || !req.body.entity.items[0].length) {
			res.status(400).send({ status: 400, error: 'Request not properly formed' })
		}
		else {
			// iterate items to extract details
			var assets = [];
			req.body.entity.items[0].forEach(function(item){
				assets.push({
					id: item.id,
					type: item.type,
					name: item.name
				});
			});

			try {
				const client = await pool.connect()
				const result = await client.query('INSERT INTO channel_event (event_id, event_type, channel_id, user_id, assets) VALUES ($1, $2, $3, $4, $5)', [req.body.event.id, req.body.event.name, req.body.entity.id, req.body.event.initiatedBy, {assets}]);
				console.log('* Inserted new webhookChannel event')
				res.status(201).json({status: 201})
			} catch (err) {
				console.error('** webhookChannel insert error:\n' + err);
				res.status(400).send({ status: 400, error: 'Could not process request' })
			}
		}
	} catch (err) {
		console.error('* webhookChannel error:\n' + err);
		res.status(500).send({ status: 500, error: 'Existential server error' })
	}
}

// save webhook repository event to db 
const webhookRepository = async (req, res) => {
	try {
		// validate the payload schema
		if (!req.body.event.id || !req.body.event.name || !req.body.event.initiatedBy || !req.body.entity.repositoryId) {
			res.status(400).send({ status: 400, error: 'Request not properly formed' })
		}
		else {
			// extract channel
			var channels = req.body.event.channelIds ? req.body.event.channelIds : [];

			try {
				const client = await pool.connect()
				const result = await client.query('INSERT INTO repository_event (event_id, event_type, repository_id, user_id, channel_id, asset) VALUES ($1, $2, $3, $4, $5, $6)', 
				[req.body.event.id, req.body.event.name, req.body.entity.repositoryId, req.body.event.initiatedBy, {channels}, req.body.entity]);
				console.log('* Inserted new webhookRepository event')
				res.status(201).json({status: 201})
			} catch (err) {
				console.error('** webhookRepository insert error:\n' + err);
				res.status(400).send({ status: 400, error: 'Could not process request' })
			}
		}
	} catch (err) {
		console.error('* webhookRepository error:\n' + err);
		res.status(500).send({ status: 500, error: 'Existential server error' })
	}
}

app
  .post('/channel', webhookChannel)
  .post('/repository', webhookRepository)
  .get('*', function(req, res){
	res.status(404).send('Resource not found');
  })
  .listen(PORT, () => console.log(`OCE Webook Node.js listening on ${ PORT }`))