const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const PORT = 8080;

//const APP_ID = process.env.APP_ID;
//const APP_Certificate = process.env.APP_Certificate;

const APP_ID = '67cb00c63d4341ec8aba2d7de7283bbd';
const APP_Certificate = '9b101bd79f1a4b2a9aa9b277fae84381';


const app = express();

const nocache = (req, resp, next)=>{
    resp.header('Cache-Control', 'private, no-cache, no-store, must-recalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    //set response header
    resp.header('Access-Controll-Allow-Origin', '*');
    //get channel name
    const channelName = req.query.channelName;
    if(!channelName)
    {
        return resp.status(500).json({'error': 'channel is required'});
    }
    //get uid
    let uid = req.query.uid;
    if(!uid||uid=='')
    {
        uid = 0;
    }
    //get rold
    let role = RtcRole.SUBSCRIBER;
    if(!req.query.role == 'publisher')
    {
        role = RtcRole.PUBLISHER;
    }
    //get the expire time
    let expireTime = req.query.expireTime;
    if(!expireTime||expireTime=='')
    {
        expireTime = 3600;
    }
    else{
        expireTime = parseInt(expireTime, 10);
    }
    //calculate the priviledge expire time
    const currentTime = Math.floor(Date.now()/1000);
    const priviledgeExpireTime = currentTime + expireTime;
    //build token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_Certificate, channelName, uid, role, priviledgeExpireTime);
    //return the token

    return resp.json({'token': token});

}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`)
});