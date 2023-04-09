const express = require("express")
const session = require('express-session');
const cors = require("cors");
const routes = require('./routes');
const bodyParser = require("body-parser");
const configDatabase = require("./database.js")
const dotenv = require("dotenv");
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
app.use('/', routes);


// Logic

//TEST:
const AppGame = require('./models/game');
// const newGame = {
//     players:[],
//     grid:'abcdefg',
//     finished: false
// }
// AppGame.create(newGame)
//     .then((game) => {
//         console.log('created a game');
//     })
//     .catch((err) => {
//         console.log('error creating game: ', err);
//     })

// AppGame.findOne()
//     .then((game) => {
//         console.log('got the game');
//         game.players.push({name:'bob',words:['hi','banana','apple'],score:4});
//         game.save();
//     })
//     .catch((err) => {
//         console.log('error finding one game');
//     })
//////

// Listen
app.listen(PORT, () => { console.log("server is running on http://localhost:4000 (or 5000)"); });