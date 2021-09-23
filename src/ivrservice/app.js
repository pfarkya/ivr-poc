const express = require('express')
const http = require('http')
const path = require('path')
const querystring = require('querystring');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilio = require('twilio')
const client = twilio(accountSid, authToken);
const VoiceResponse = twilio.twiml.VoiceResponse;
const cloudant = require('@ibm-cloud/cloudant')
const cloudantClient = cloudant.CloudantV1.newInstance({});
const interestDB = 'interests';
const slotDB = 'slot';

const app = express()

const got = require('got')

function waitForMilisec(milisec) {
  return new Promise(resolve => {
      setTimeout(() => { resolve('') }, milisec);
  })
}

function getRandomStatus() {
  const status = ["schedule", "noschedule", "timeout"];
  const random = Math.floor(Math.random() * status.length);
  return status[random]
}

const persistenceUrl =  process.env.PERSISTENCE_URL || 'http://localhost:5002'

// const user = await got.post(persistenceUrl+'/api/createAgent', {
//   json: req.body
// }).json();

app.set('port', process.env.PORT || 5001)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post('/api/makeacallfake', async (req, res) => {
  try {
    console.log("making call status in progress")
    let user = await got.put(persistenceUrl+'/api/updateCallStatus', {
      json: {
        interestId: req.body.userId,
        callStatus: "inprogress"
      }
    }).json()
    // fetch the response to see update in callStatus from in progess to something else change until 2 min (loop every 10 second)
    for(let i=0; i<12; i++) {
      await waitForMilisec(10000)
    }
    let status = getRandomStatus()
    console.log("making call status in ", status)
    if(status === "timeout") {
      let user = await got.put(persistenceUrl+'/api/updateCallStatus', {
        json: {
          interestId: req.body.userId,
          callStatus: "timeout"
        }
      }).json()
    } else if(status === "noschedule") {
      let user = await got.put(persistenceUrl+'/api/updateCallStatus', {
        json: {
          interestId: req.body.userId,
          callStatus: "noschedule"
        }
      }).json()
    } else {
      let user = await got.put(persistenceUrl+'/api/updateSchedule', {
        json: {
          interestId: req.body.userId,
          slotId: req.body.slotId,
        }
      }).json()
    }
    res.status(200).send()
  } catch(e) {
    console.error(e)
    res.status(500).send(e)
  }
})
app.post('/api/makeacallreal', async (req, res) => {
    console.log(req.body)
    console.log(req.host)
    let stringquery = querystring.stringify({
      userId: req.body.userId,
      slotId: req.body.slotId,
      successMsg: req.body.messages.successMsg,
      failureMsg: req.body.messages.failureMsg
    })
    let response = new VoiceResponse()
    let gather = response.gather({
      input: 'dtmf',
      numDigits: '1',
      timeout: '10',
      action: "https://" + req.host + "/api/reportresponse?" + stringquery
    })
    gather.say(req.body.messages.initial)
    console.log(response.toString())
    client.calls
      .create({
        twiml: response.toString(),
        to: req.body.phoneNumber,
        from: twilioNumber
       })
      .then(async (call) => { 
        console.log(call.sid)
        // update DB with InProgress Call
        try {
          console.log("making call status in progress", req.body)
          let user = await got.put(persistenceUrl+'/api/updateCallStatus', {
            json: {
              interestId: req.body.userId,
              callStatus: "inprogress"
            }
          }).json()
          // fetch the response to see update in callStatus from in progess to something else change until 2 min (loop every 10 second)
          let timeout = true
          for(let i=0; i<12; i++) {
            await waitForMilisec(10000)
            try {
              console.log("Looking for status change", req.body)
              let user1 = await got.get(persistenceUrl+'/api/retrieveInterest/'+ req.body.userId).json()
              if(user1.callStatus !== "inprogress") {
                timeout = false
                break;
              }
            } catch(e) {
              console.error(e)
              if(e.response) {
                console.error(e.response.statusCode)
                console.error(e.response.body)
              }
            }
          }
          if(timeout) {
            console.log("make it timeout", req.body)
            let user2 = await got.put(persistenceUrl+'/api/updateCallStatus', {
              json: {
                interestId: req.body.userId,
                callStatus: "timeout"
              }
            }).json()
          }
          res.status(200).send()
        } catch(e) {
          console.log(e)
          res.status(500).send()
        }
      }).catch((e) => {
        console.log(e)
        res.status(500).send()
      });
})

app.post('/api/reportresponse', async (req,res) => {
    console.log(req.query)
    console.log(req.body)
    let positiveresponse = req.body.Digits && req.body.Digits === "1" ? true: false 
    let response = new VoiceResponse()
    if(positiveresponse) {
      response.say(req.query.successMsg)
      response.hangup()
      // update DB with schedule Call
      try {
        let user = await got.put(persistenceUrl+'/api/updateSchedule', {
          json: {
            interestId: req.query.userId,
            slotId: req.query.slotId,
          }
        }).json()
      } catch(e) {
        console.error(e)
        if(e.response) {
          console.error(e.response.statusCode)
          console.error(e.response.body)
        }
      }
    } else {
      response.say(req.query.failureMsg)
      response.hangup()
      // update DB with not schedule Call
      try {
        let user = await got.put(persistenceUrl+'/api/updateCallStatus', {
          json: {
            interestId: req.query.userId,
            callStatus: "noschedule"
          }
        }).json()
      } catch(e) {
        console.error(e)
        if(e.response) {
          console.error(e.response.statusCode)
          console.error(e.response.body)
        }
      }
    }
    res.type('text/xml').status(200).send(response.toString())
})

app.put('/api/submitresponse', async (req, res) => {
 // update to DB
    let interestresponse = await cloudantClient.getDocument({
        db: interestDB,
        docId: req.interestId
    })
    let slotresponse = await cloudantClient.postFind({db: slotDB, selector: {center: interestresponse.center}})
    if(slotresponse.totalAvailable > slotresponse.scheduledCount){
            await cloudantClient.putDocument({
                db: interestDB,
                docId: req.interestId,
                rev: req.body.rev,
                schedule: slotresponse,
                callCount: slotresponse.callCount+1
            })
            await cloudantClient.putDocument({
            db: slotDB,
            docId: slotresponse._id,
            rev: slotresponse.rev,
            scheduledCount: slotresponse.scheduledCount+1
        })
        }
    res.status(200).send("Slot alloted successfully")
})




http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})