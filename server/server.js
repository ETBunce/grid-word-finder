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
app.use(cors({ origin: "http://localhost:4000", credentials: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());


//Session setup
const store = new MongoDBStore({
    uri: 'mongodb+srv://jzdegrey:cs3750@sandbox.t6lzk2q.mongodb.net/gridWordFinder',
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
app.use('*', routes);


// Logic

//TESTING
// gameLogic.startNewGame(['Kevin', 'Bob']);

// setTimeout(() => {
//     console.log("World!");
//     gameLogic.submitWord('Kevin', 'BAZOOKA');
//     gameLogic.submitWord('Bob', 'HAMMER');
// }, 5000);


// Listen
app.listen(PORT, () => { console.log("server is running on http://localhost:4000"); });