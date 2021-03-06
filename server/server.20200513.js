const http = require('http');
const fs = require('fs')
const path = require('path');
const PushNotifications = require("node-pushnotifications");
const express = require('express');
const port = process.env.PORT || 3001;
//const host = process.env.IP || '127.0.0.1';
//const host = process.env.IP || '192.168.15.8';
const host = process.env.IP || '198.154.99.39';

const publicPath = path.resolve(__dirname, '../public');
const app = express();
const dir = path.dirname(require.main.filename);
const provider_govirtek = fs.readFileSync(`${dir}/keys/AuthKey_VJT2DTY4W8.p8`);
const provider_europiel = fs.readFileSync(`${dir}/keys/AuthKey_J7W7LHJW8W.p8`);
app.use(express.static(publicPath));
app.use(express.json());

app.post('/', function(request, response) {
    try{
        console.log('Request received');
        let type = request.body.type;
        let device = request.body.device;
        let environment = request.body.environment;

        if(type=='ios'){
            let payload = JSON.parse(request.body.payload);
            console.log(payload);
            if(request.body.emitter==='Directors' || request.body.emitter==='EuropielC'){
                console.log('iOS Directors');
                let respuesta = EnviarMensaje_ios(device, environment, payload, provider_europiel, "J7W7LHJW8W", "H44P3V5N49");
                if (respuesta.then) {
                    response.send({respuesta:"ok"});
                } else {
                    response.send("NO RESPONSE");
                }
            }else{
                console.log('iOS Clientes');
                let respuesta = EnviarMensaje_ios(device, environment, payload, provider_govirtek, "VJT2DTY4W8", "4LJRSRDSXG");
                if (respuesta.then) {
                    response.send({respuesta:"ok"});
                } else {
                    response.send("NO RESPONSE");
                }
            }
        }
        else if(type=='android'){
            let payload = JSON.parse(request.body.payload);
            let respuesta = EnviarMensaje_android(device, environment, payload);
            if (respuesta.then) {
                response.send({respuesta:"ok"});
            } else {
                response.send("NO RESPONSE");
            }
        }
        else if(type=='whatsapp'){
            let payload = request.body.payload;
            let emitter = request.body.emitter;
            let token = request.body.token;
            let respuesta = EnviarMensaje_whatsapp(device, emitter, payload, token);
            response.send({respuesta:respuesta.SmsSid});
        }
        else {
            response.send('Invalid type');
        }
    
    }catch(err){
        response.send(err);
    }
});


/********************************* */
/********************************* */
/********************************* */

async function EnviarMensaje_ios(device, environment, payload, provider, apnsKeyId, teamId) {
    try {
        let produccion = environment == "PROD" ? true : false;
        const client = {
            apn: {
                token: {
                    key: provider, // optionally: fs.readFileSync('./certs/key.p8')
                    keyId: apnsKeyId,
                    teamId: teamId,
                },
                production: produccion // true for APN production environment, false for APN sandbox environment,
            }
        };


        const push = new PushNotifications(client);
        const registrationIds = device;
        console.log('---------');
        console.log(registrationIds);
/*
        payload = {
            topic: 'com.govirtek.EuropielMobile',
            contentAvailable: true,
            priority: 'high',
            custom: {
                callCenterEnabled: false,
            },
            category: 'CALL_CENTER_UPDATE'
        };

*/

/*
payload = {
    title: 'Testo Rigo',
    topic: 'com.govirtek.EuropielMobile',
    //contentAvailable: true,
    priority: 'high',
    //custom: {
    //    callCenterEnabled: false,
    //},
    //category: 'CALL_CENTER_UPDATE'
};*/


        push.send(registrationIds, payload, (err, result) => {
            if (err) {
                console.log("ERROR!!!");
                console.log(err);
                return result;
            } else {
                console.log("SUCCESS!!!");
                console.log(result);
                console.log(result[0].message);
                return result;//console.log(result[0].message);
            }
        }).catch(function(error) {
            console.log('ERROR: ', error.message);
        });
        
    } catch (ex) {
        console.error(ex);
    }
}



/********************************* */
/********************************* */
/********************************* */


async function EnviarMensaje_android(device, environment, payload) {
    try {
        console.log("--DEVICE--");
        console.log(device);

       
/*
        const data = JSON.stringify({
            registration_ids: ['f7aAGSWVHn0:APA91bH1FsE9ZCPlze0KT8FItu1xfd4LArvcvqAoFverPgQxT6l1G2Mo_j_zfRGnl_a_jlBFxI0Z7UxFyLJ2AqIijpg7q-1wXXrZXwXMvqger2x7ESI7_5hyzBEKMltpwUhoC9KDNiYv'],
            data:{
                message:"Mensaje de prueba"
            }
        });
        
        const options = {
            hostname: 'fcm.googleapis.com',
            port: 80,
            path: '/fcm/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA4ZP1Vjw:APA91bFnNezw3ibTtER5xTjt5MxCbb5CsUTZUNDCcAf_lDnUXIOnPuyd_6DrUECcdXP7yjeXRX-gCLuI7MoJs7NZGgSlJUvrasFlpKKavLKyjiyDLZSlJmD59OdgAWKggPrEITGApPXn',
                'Sender': 'id=890197617648',
                'Content-Length': data.length
            }
        };
        
        const https = require('https');
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', (d) => {
              process.stdout.write(d)
            })
          })
          
          req.on('error', (error) => {
            console.error(error)
          })
          
          req.write(data)
          req.end()
*/


        const https = require('https')
/*
        const data = JSON.stringify({
            registration_ids: ['f7aAGSWVHn0:APA91bH1FsE9ZCPlze0KT8FItu1xfd4LArvcvqAoFverPgQxT6l1G2Mo_j_zfRGnl_a_jlBFxI0Z7UxFyLJ2AqIijpg7q-1wXXrZXwXMvqger2x7ESI7_5hyzBEKMltpwUhoC9KDNiYv'],
            data:{
                message:"Mensaje de prueba 2"
            }
        });

        const data = JSON.stringify({
            registration_ids: ['f7aAGSWVHn0:APA91bH1FsE9ZCPlze0KT8FItu1xfd4LArvcvqAoFverPgQxT6l1G2Mo_j_zfRGnl_a_jlBFxI0Z7UxFyLJ2AqIijpg7q-1wXXrZXwXMvqger2x7ESI7_5hyzBEKMltpwUhoC9KDNiYv'],
            data:{
                message:"Mensaje de prueba 2"
            }
        });
*/
        const data = JSON.stringify(payload);

        const options = {
            hostname: 'fcm.googleapis.com',
            port: 443,
            path: '/fcm/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA4ZP1Vjw:APA91bFnNezw3ibTtER5xTjt5MxCbb5CsUTZUNDCcAf_lDnUXIOnPuyd_6DrUECcdXP7yjeXRX-gCLuI7MoJs7NZGgSlJUvrasFlpKKavLKyjiyDLZSlJmD59OdgAWKggPrEITGApPXn',
                'Sender': 'id=890197617648',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(data)
        req.end()
        
    } catch (ex) {
        console.error(ex);
    }
}




/********************************* */
/********************************* */
/********************************* */


function EnviarMensaje_whatsapp(to, emitter, message, token) {
    try {
        console.log("--to--");
        console.log(to);

        var resultado = '';

        
       const data = JSON.stringify({
            msg: message,
            to: to,
            token: token,
            emitter: emitter
        });
        
        console.log(data);
       var request = require('sync-request');
       var res = request('POST', 'https://bronze-cattle-7375.twil.io/wa-gateway', {
            headers: {
                'Content-type': 'application/json',
            },
            body: data,
       });
       resultado = JSON.parse(res.getBody('utf8'));
       console.log(resultado);

       return resultado;

    } catch (ex) {
        console.error(ex);
    }
}




/********************************* */
/********************************* */
/********************************* */

app.listen(port);
console.log('Server Started on port: ' + port);