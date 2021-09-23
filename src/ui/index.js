const express = require('express')
const http = require('http')
const path = require('path')

const multer  = require('multer') //use multer to upload blob data
const upload = multer()

const app = express()

const fs = require('fs');
const got = require('got')
const { Readable } = require('stream');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({ apikey: process.env.TTS_APIKEY }),
  serviceUrl: process.env.TTS_URL
});

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({ apikey: process.env.STT_APIKEY }),
  serviceUrl: process.env.STT_URL
});

const persistenceUrl =  process.env.PERSISTENCE_URL || 'http://localhost:5002'
const automationUrl = process.env.AUTOMATION_URL || 'http://localhost:5003'

// const params = {
//   // From file
//   audio: fs.createReadStream('./resources/speech.wav'),
//   contentType: 'audio/l16; rate=44100'
// };

// speechToText.recognize(params)
//   .then(response => {
//     console.log(JSON.stringify(response.result, null, 2));
//   })
//   .catch(err => {
//     console.log(err);
//   });

// const params = {
//     text: 'Hello from IBM Watson',
//     voice: 'en-US_AllisonVoice', // Optional voice
//     accept: 'audio/wav'
//   };
  
//   // Synthesize speech, correct the wav header, then save to disk
//   // (wav header requires a file length, but this is unknown until after the header is already generated and sent)
//   // note that `repairWavHeaderStream` will read the whole stream into memory in order to process it.
//   // the method returns a Promise that resolves with the repaired buffer
//   textToSpeech
//     .synthesize(params)
//     .then(response => {
//       const audio = response.result;
//       return textToSpeech.repairWavHeaderStream(audio);
//     })
//     .then(repairedFile => {
//       fs.writeFileSync('audio.wav', repairedFile);
//       console.log('audio.wav written with a corrected wav header');
//     })
//     .catch(err => {
//       console.log(err);
//     });
  
  
//   // or, using WebSockets
//   textToSpeech.synthesizeUsingWebSocket(params);
//   synthStream.pipe(fs.createWriteStream('./audio.ogg'));


const agentsUidDetail = {
    'admin': {
        username: 'admin',
        password: 'admin',
        role: 'admin'
    },
    'agent': {
        username: 'agent',
        password: 'agent',
        role: 'agent'
    }
}

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname, './dist')))
app.post('/api/login', async (req, res) => {
    console.log(req.body)
    try {
        const user = await got.get(persistenceUrl+'/api/retrieveAgent/'+ req.body.username).json();
        if(user) {
            if(req.body.password === user.password) {
                res.status(201).send(user)
            } else {
                res.status(401).send()
            }
        } else {
            res.status(404).send()
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
    
})
app.post('/api/createagent', async (req, res) => {
    try {
        console.log(req.body)
        const user = await got.post(persistenceUrl+'/api/createAgent', {
            json: req.body
        }).json();
        res.status(201).send({"message": "Agent successfully created"})
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})
app.get('/api/listagent', async (req, res) => {
    try {
        console.log(req.body)
        const agents = await got.get(persistenceUrl+'/api/retrieveAgent').json();
        res.status(201).send(agents.docs)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})
app.put('/api/updateagent', async (req, res) => {
    try {
        console.log(req.body)
        const agents = await got.put(persistenceUrl+'/api/updateAgent', {
            json: req.body
        }).json();
        res.status(201).send({"message": "Agent successfully created"})
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.get('/api/listofcenter', async (req, res) => {
    try {
        console.log(req.body)
        const agents = await got.get(persistenceUrl+'/api/retrieveCenter').json();
        console.log(agents)
        res.status(201).send(agents.docs)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})
app.put('/api/updatecenter', async (req, res) => {
    try {
        console.log(req.body)
        if(req.body.id) {
            const agents = await got.put(persistenceUrl+'/api/updateCenter', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        } else {
            const agents = await got.post(persistenceUrl+'/api/createCenter', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.get('/api/listofinventory', async (req, res) => {
    try {
        console.log(req.body)
        const agents = await got.get(persistenceUrl+'/api/retrieveInventory').json();
        console.log(agents)
        res.status(201).send(agents.docs)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})
app.put('/api/updateinventory', async (req, res) => {
    try {
        console.log(req.body)
        if(req.body.id) {
            const agents = await got.put(persistenceUrl+'/api/updateInventory', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        } else {
            const agents = await got.post(persistenceUrl+'/api/createInventory', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.get('/api/listofslot', async (req, res) => {
    try {
        console.log(req.body)
        const agents = await got.get(persistenceUrl+'/api/retrieveSlot').json();
        res.status(201).send(agents.docs)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})
app.put('/api/updateslot', async (req, res) => {
    try {
        console.log(req.body)
        if(req.body.id) {
            const agents = await got.put(persistenceUrl+'/api/updateSlot', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        } else {
            const agents = await got.post(persistenceUrl+'/api/createSlot', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        }
    } catch (e) {
        console.error(e)
        if (e.response) {
          console.error(e.response.statusCode)
          console.error(e.response.body)
        }
        res.status(500).send(e)
    }
})
app.post('/api/registerinterest', async (req, res) => {
    try {
        console.log(req.body)
        if(req.body.id) {
            const agents = await got.put(persistenceUrl+'/api/updateInterest', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        } else {
            const agents = await got.post(persistenceUrl+'/api/createInterest', {
                json: req.body
            }).json();
            res.status(201).send({"message": "Agent successfully created"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.get('/api/listformatedslots', async (req, res) => {
    let reply = {
        headers: [{
            key: 'centername',
            header: 'Center'
        }],
        rowsByDate: {
            "empty": []
        },
        dates: ["empty"],
        slots:[]
    }
    let stat = {}
    try {
        const centers = await got.get(persistenceUrl+'/api/retrieveCenter').json();
        const inventories = await got.get(persistenceUrl+'/api/retrieveInventory').json();
        inventories.docs.forEach((inventory) => {
            reply.headers.push({
                key: inventory._id + "stat",
                header: inventory.displayName + " Stat"
            })
            reply.headers.push({
                key: inventory._id + "schedule",
                header: inventory.displayName + " Schedule"
            })
            reply.headers.push({
                key: inventory._id + "available",
                header: inventory.displayName + " Available"
            })
        })
        for (let i=0; i < centers.docs.length; i++) {
            let center = centers.docs[i]
            reply.rowsByDate["empty"].push({
                'id': center._id,
                'center': center,
                'centername': center.name
            })
            stat[center._id] = {}

            for(let j=0; j < inventories.docs.length; j++) {
                let inventory = inventories.docs[j]
                const interest = await got.get(persistenceUrl+'/api/retrieveInterest', {searchParams: {
                    selector: JSON.stringify({
                        "center._id": center._id,
                        "inventory._id": inventory._id
                    })
                }}).json();
                console.log("interest", interest)
                const scheduleinterest = await got.get(persistenceUrl+'/api/retrieveInterest', {searchParams: {
                    selector: JSON.stringify({
                        "schedule.center._id": center._id,
                        "schedule.inventory._id": inventory._id
                    })
                }}).json();
                console.log("interest", scheduleinterest)
                reply.rowsByDate["empty"][i][inventory._id+"stat"] = scheduleinterest.docs.length + "(Total Schedule Commulative)/" + interest.docs.length + "(Total Interest)"
                reply.rowsByDate["empty"][i][inventory._id+"schedule"] =  0
                reply.rowsByDate["empty"][i][inventory._id+"available"] =  0
                reply.rowsByDate["empty"][i][inventory._id+"availableslotid"] = 0
                console.log("Updated reply")
                stat[center._id][inventory._id] = scheduleinterest.docs.length + "(Total Schedule Commulative)/" + interest.docs.length + "(Total Interest)"
            }
        }
        const createNewRow = (id) => {
            let template = reply.rowsByDate["empty"].find((item) => {return id === item.id})
            return Object.assign({}, template)
        }
        const slots = await got.get(persistenceUrl+'/api/retrieveSlot').json();
        reply.slots = slots.docs
        slots.docs.forEach((slot) => {
            let date = slot.date
            if(reply.rowsByDate[date]) {
                let center = reply.rowsByDate[date].find((doc) => { return slot.center._id === doc._id})
                if (center) {
                    center[slot.inventory._id+"stat"] = stat[slot.center._id][slot.inventory._id]
                    center[slot.inventory._id+"schedule"] = slot.schedule,
                    center[slot.inventory._id+"available"] = slot.available
                    center[slot.inventory._id+"availableslotid"] = slot._id
                } else {
                    reply.rowsByDate[date].push(Object.assign(createNewRow(slot.center._id), {
                        [slot.inventory._id+"stat"]: stat[slot.center._id][slot.inventory._id],
                        [slot.inventory._id+"schedule"]: slot.schedule,
                        [slot.inventory._id+"available"]: slot.available,
                        [slot.inventory._id+"availableslotid"]: slot._id
                    }))
                }
            } else {
              reply.rowsByDate[date] = [Object.assign(createNewRow(slot.center._id), {
                [slot.inventory._id+"stat"]: stat[slot.center._id][slot.inventory._id],
                [slot.inventory._id+"schedule"]: slot.schedule,
                [slot.inventory._id+"available"]: slot.available,
                [slot.inventory._id+"availableslotid"]: slot._id
            })]
            }
        })
        reply.dates = Object.keys(reply.rowsByDate)
        console.log("reply sent")
        res.status(200).send(reply)
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})


app.get('/api/listofdates', async (req, res) => {
    try {
        const slots = (await got.get(persistenceUrl+'/api/retrieveSlot').json()).docs;
        let reply = {}
        slots.forEach((slot) => {
            if(!reply[slot.date]) {
                reply[slot.date] = {}
            }
        })
        res.status(200).send(Object.keys(reply))
    } catch(e) {
        console.error(e.response.statusCode)
        console.error(e.response.body)
        res.status(500).send(e)
    }
})

app.get('/api/fetchreceptionlist', async (req, res) => {
    try {
        console.log("query", req.query)
        let selector = {
            "schedule.date": req.query.date,
            "schedule.center._id": req.query.centerId
        }
        const interests = await got.get(persistenceUrl+'/api/retrieveInterest', {searchParams: {
            selector: JSON.stringify(selector)
        }}).json();
        let queueRows = []
        interests.docs.forEach((interest) => {
            interest.id = interest._id
            if(interest.inQueue == "inqueue") {
                queueRows.push(interest)
            }
        })
        let reply = {
            scheduleRows: interests.docs,
            queueRows: queueRows,
            headers: [
                {
                    "key": "name",
                    "header": "Name"
                },
                {
                  "key": "adhaar",
                  "header": "Adhaar"
                },
                {
                  "key": "inQueue",
                  "header": "In Queue"
                }
            ]
        }
        res.status(200).send(reply)
    } catch(e) {
      console.error(e)
      res.status(500).send(e)
    }
})

app.put('/api/markedinqueuedone', async (req, res) => {
  try {

    if(req.body.interestId) {
      const interest = await got.get(persistenceUrl+'/api/retrieveInterest/'+ req.body.interestId).json();
      interest.inQueue = "done"
      interest.done = true
      interest.rev = interest._rev
      interest.id = interest._id
      const agents = await got.put(persistenceUrl+'/api/updateInterest', {
          json: interest
      }).json();
      res.status(201).send({"message": "Agent successfully created"})
    }
} catch (e) {
    console.error(e)
    res.status(500).send(e)
}
})

app.put('/api/markedinqueue', async (req, res) => {
  try {
      console.log(req.body)
      if(req.body.interestId) {
        const interest = await got.get(persistenceUrl+'/api/retrieveInterest/'+ req.body.interestId).json();
        console.log(interest)
        interest.inQueue = "inqueue"
        interest.rev = interest._rev
        interest.id = interest._id
        const agents = await got.put(persistenceUrl+'/api/updateInterest', {
            json: interest
        }).json();
        res.status(201).send({"message": "Agent successfully created"})
      } else {
          res.status(400).send({"message": "Missing param"})
      }
  } catch (e) {
      console.error(e)
      if(e.response && e.response.statusCode) {
        console.error(e.response.statusCode)
        console.error(e.response.body)
        res.status(e.response.statusCode).send(e.response.body)
      } else {
        res.status(500).send(e)
      }
      
      
  }
})

app.get('/api/startautomation', async(req, res) => {
  // automationUrl
  try {
    const automationStatus = await got.post(automationUrl+'/api/startautomation').json();
    res.status(200).send(automationStatus)
  } catch(e) {
    res.status(500).send()
  }
})

app.get('/api/stopautomation', async(req, res) => {
  try {
    const automationStatus = await got.post(automationUrl+'/api/stopautomation').json();
    res.status(200).send(automationStatus)
  } catch(e) {
    res.status(500).send()
  }
})

app.post('/api/stt', upload.single('file'), (req, res) => {
    console.log(req.file)
    // let uploadLocation = __dirname + '/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension

    // fs.writeFileSync(uploadLocation, req.file.buffer)
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);
    const params = {
    // From file
    audio: readableTrackStream,
    contentType: 'audio/webm'
    };

    speechToText.recognize(params)
    .then(response => {
        console.log(JSON.stringify(response.result, null, 2));
        res.status(200).send(response.result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).send()
    });
})

app.post('/api/tts', (req, res) => {
    console.log(req.body)
    const params = {
            text: req.body.text,
            voice: 'en-US_AllisonVoice', // Optional voice
            accept: 'audio/wav'
          };
          textToSpeech
            .synthesize(params)
            .then(response => {
            const audio = response.result;
            return textToSpeech.repairWavHeaderStream(audio);
            })
            .then(repairedFile => {
            // fs.writeFileSync('audio.wav', repairedFile);
            res.send({audio:repairedFile})
            console.log('audio.wav written with a corrected wav header');
            })
            .catch(err => {
                res.status(500).send()
            console.log(err);
            });
})

app.get('/api/failed', (req, res) => {
    res.status(500).send({message: "my name is prashant"})
})

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

// const audioBlob3 = new Blob([new Uint8Array(temp0.audio.data)],{type: 'audio/wav'});
//       const audioUrl3 = URL.createObjectURL(audioBlob3);
//       const audio3 = new Audio(audioUrl3);
//       audio3.play();

