const express = require("express")
const session = require('express-session');
const cors = require("cors");
const bodyParser = require("body-parser");
const configDatabase = require("./database.js")
const dotenv = require("dotenv");
const game = require('./game');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

// Config
const PORT = process.env.PORT || 5000

// Middleware
dotenv.config();
configDatabase();

app.use(express.json({ extended: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.text());


//Session setup
const store = new MongoDBStore({
    uri: 'mongodb+srv://etbunce:admin@cluster0.wfxwmek.mongodb.net/?retryWrites=true&w=majority',
    databaseName: 'connect-mongodb-session-store-grid-game',
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


// Logic

game.newGame();

// Listen
app.listen(PORT, () => { console.log("server is running on http://localhost:4000 (or 5000)"); });