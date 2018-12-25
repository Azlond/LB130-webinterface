const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Bulb = require('tplink-lightbulb');
const config = require('./config.json');

const light = new Bulb(config.bulb);

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/*scan for new bulbs*/
app.get('/api/light/scan', (req, res) => {
    const scan = Bulb.scan()
        .on('light', (l) => {
            l.power(false)
                .then((status) => {
                    scan.stop();
                    res.status(200).send(status);
                });
        });
});
/*request & return current info*/
app.get('/api/light/info', (req, res) => {
    light.info()
        .then((info) => {
            res.status(200).send(info);
        })
        .catch(e => console.error(e));
});

/*turn power on/off*/
app.get('/api/light/power', (req, res) => {
    light.info()
        .then((info) => {
            const state = (info.light_state.on_off === 1);
            light.power(!state)
                .then(status => res.status(200).send(status))
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Oops, Something went wrong!');
                });
        });
});

/*set the light to the received mode*/
app.post('/api/light/mode', (req, res) => {
    const settings = req.body;
    settings.hue = parseInt(settings.hue, 10);
    settings.saturation = parseInt(settings.saturation, 10);
    settings.color_temp = parseInt(settings.color_temp, 10);
    settings.brightness = parseInt(settings.brightness, 10);
    const msg = {
        'smartlife.iot.smartbulb.lightingservice': {
            transition_light_state: {
                ignore_default: 1,
                on_off: 1,
                transition_period: 0,
                ...settings
            }
        }
    };
    light.send(msg)
        .then((s) => {
            res.status(200).send(s);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Oops, Something went wrong!');
        });
});

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'dist', 'light.html'));
});

app.get('/js/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'dist', req.originalUrl));
});

app.get('/css/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'dist', req.originalUrl));
});

app.get('/images/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'dist', req.originalUrl));
});

// Express route for any other unrecognised incoming requests
app.get('/api/*', (req, res) => {
    res.status(404).send('Unrecognised API call');
});
app.get('*', (req, res) => {
    res.status(404).send('Unrecognised path');
});
// Express route to handle errors
app.use((err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
});
app.listen(config.port);
console.log(`Server running at port ${config.port}.`);
