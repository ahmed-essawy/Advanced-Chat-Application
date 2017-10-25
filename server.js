var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cors = require('cors');

// Chat application components
var routes = require('./app/routes');
var session = require('./app/session');
var passport = require('./app/auth');
var ioServer = require('./app/socket')(app);
var IP = require('./app/ip');


app.set('PORT', process.env.PORT || 3000);

// View engine setup
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
    helpers: require('./app/helpers').helpers,
    defaultLayout: 'layout',
    partialsDir: [
        'views/partials/'
    ]
}));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Check IP
app.use(IP.requestIp);
app.use(IP.checkIP);

app.use('/', routes);

// Middleware to catch 404 errors
app.use(function (req, res, next) {
    res.status(404).end();
});

ioServer.listen(app.get('PORT'), function () {
    console.log('Server listening at port %d', ioServer.address().port);
});