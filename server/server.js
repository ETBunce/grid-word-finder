const express = require("express");
const app = express();
const session = require('express-session');
const cors = require("cors");
const routes = require('./routes');
const bodyParser = require("body-parser");
const configDatabase = require("./database.js");
const dotenv = require("dotenv");
const MongoDBStore = require('connect-mongodb-session')(session);

const gameLogic = require('./game-logic');

// Config
const PORT = 4000;

// Middleware
dotenv.config();
configDatabase();

app.use(express.json({ extended: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());


//Session setup
const store = new MongoDBStore({
    uri: 'REDACTED/gridWordFinder',
    databaseName: 'grid-game-sessions',
});

store.on('error', function(error) {
    console.log('mongo session store error: ' + error);
});

app.use(session({
    secret: 'kitty cat',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 6 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

// Routes
app.use('/', routes);

// Listen
app.listen(PORT, () => { console.log("server is running on http://localhost:4000"); });