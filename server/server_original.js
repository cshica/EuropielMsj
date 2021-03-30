const http = require('http');
const fs = require('fs')
const path = require('path');
//const { APNS } = require("apns2");
//const { Notification } = require("apns2");
const PushNotifications = require("node-pushnotifications");
const express = require('express');
const port = process.env.PORT || 3001;
//const host = process.env.IP || '192.168.15.8';
const host = process.env.IP || '198.154.99.39';

const publicPath = path.resolve(__dirname, '../public');
const app = express();
const dir = path.dirname(require.main.filename);
const provider = fs.readFileSync(`${dir}/keys/AuthKey_VJT2DTY4W8.p8`);
app.use(express.static(publicPath));
app.use(express.json());

app.post('/', function(request, response) {
    let device = request.body.deviceId;
    let environment = request.body.environment;
    let payload = JSON.parse(request.body.payload);
    let respuesta = EnviarMensaje(device, environment, payload);
    console.log(respuesta);
    if (respuesta.then) {
        response.send({ estatus: "ok" });
    } else {
        response.send(respuesta);
    }
    //response.send(respuesta);

    //response.send(respuesta); // echo the result back
});

async function EnviarMensaje(device, environment, payload) {
    try {
        let produccion = environment == "PROD" ? true : false;
        const client = {
            apn: {
                token: {
                    key: provider, // optionally: fs.readFileSync('./certs/key.p8')
                    keyId: 'VJT2DTY4W8',
                    teamId: '4LJRSRDSXG',
                },
                production: produccion // true for APN production environment, false for APN sandbox environment,
            }
        };


        const push = new PushNotifications(client);
        const registrationIds = device;
        return push.send(registrationIds, payload, (err, result) => {
            if (err) {
                //console.log("ERROR!!!");
                console.log(err);
            } else {
                //console.log("SUCCESS!!!");
                //console.log(result);
                //console.log(result[0].message);
            }
        }).catch(function(error) {
            console.log('ERROR: ', error.message);
        });

    } catch (ex) {
        console.error(ex);
    }
}

app.listen(port);