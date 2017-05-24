// Importing Node modules and initializing Express
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const logger = require('winston');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const router = require('./router');
const Mongoose = require('mongoose');
const socketEvents = require('./socketEvents');
const config = require('./config/main');
const PORT = process.env.PORT || config.PORT;
const DBURI = process.env.database || config.database;
// Database Setup
//mongoose.connect(config.database);
Mongoose.connect(DBURI);
Mongoose.connection.on('error', err => {
    if (err) throw err;
});
Mongoose.Promise = global.Promise;
// Start the server
let server;

if (process.env.NODE_ENV !== config.test_env) {
    server = app.listen(PORT);
    console.info(`Magichappens at ${PORT}.`);
} else
  server = app.listen(config.test_port);


const io = require('socket.io').listen(server);

socketEvents(io);

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up middleware for all Express requests
app.use(compression()); // Increase performance using GZIP
app.use(helmet());    // Handles some kind of attacks
app.use(cors());  // For requests from another domen
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(cookieParser()); // Allow to send coockies
logger.log('info'); // Log requests to API using winston

// Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
