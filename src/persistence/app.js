// DBs to be used
// agent/roleDB
// {
//     name:
//     username: ----> id
//     password:
//     role:
// }
// Vaccine/Center DB
// {
//     vaccineName:
//     doseNumber:
//     centers: [
//         {
//             nameOfCenteres:
//             slots: [{
//      date:
//      vaccineName:
//      doseNumber:
//      total:
//      scheduleCount: 
//    }]
//         }
//     ]
// }
// interestDB
// {
//     nameOfPerson:
//     phoneNumber:
//     doseNumber:
//     vaccineName:
//     adhaar:  -----> id
//     center:
//     agent:
//     schedule:
//     callCount:
//     callHistory:
//     callStatus:
// }

// createAgent / retrieveAgent / updateAgent / deleteAgent
// createVaccine / retrieveVaccines / updateVaccine / deleteVaccine
// createCenter / retrieveCenter / updateCenter / deleteCenter
// createSlot / retrieveSlots / updateSlot / deleteSlot
// createInterest / updateInterest
// retrieveSlotWithWhere
// retrieveInterestedWithWhere

const cloudant = require('@ibm-cloud/cloudant')
const express = require('express')
const http = require('http')
const path = require('path')
const querystring = require('querystring');
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_NUMBER;
// const twilio = require('twilio')
// const client = twilio(accountSid, authToken);
// const VoiceResponse = twilio.twiml.VoiceResponse;

const app = express()

const cloudentClient = cloudant.CloudantV1.newInstance({})

const cleanUpDBs = async () => {
  try {
    const result = await cloudentClient.deleteDatabase({ db: 'agent' })
    if (result.result.ok) {
      console.log(`"agent" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.deleteDatabase({ db: 'inventory' })
    if (result.result.ok) {
      console.log(`"inventory" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.deleteDatabase({ db: 'center' })
    if (result.result.ok) {
      console.log(`"center" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.deleteDatabase({ db: 'slot' })
    if (result.result.ok) {
      console.log(`"slot" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.deleteDatabase({ db: 'interest' })
    if (result.result.ok) {
      console.log(`"interest" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
}

const setUpDBs = async () => {
  try {
    const result = await cloudentClient.putDatabase({ db: 'agent' })
    if (result.result.ok) {
      console.log(`"agent" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.putDatabase({ db: 'inventory' })
    if (result.result.ok) {
      console.log(`"inventory" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.putDatabase({ db: 'center' })
    if (result.result.ok) {
      console.log(`"center" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.putDatabase({ db: 'slot' })
    if (result.result.ok) {
      console.log(`"slot" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
  try {
    const result = await cloudentClient.putDatabase({ db: 'interest' })
    if (result.result.ok) {
      console.log(`"interest" database created.`);
    }
  } catch (e) {
    console.log("errored", e)
  }
}

const setUpAdmin = async () => {
  try {
    let response = await cloudentClient.postDocument({
      db: 'agent',
      document: {
        _id: "admin",
        username: "admin",
        password: "admin",
        role: "admin",
        name: "admin"
      }
    })
  } catch (e) {
    console.error(e)
  }
}

const setUp = async () => {
  await setUpDBs()
  await setUpAdmin()
}
setUp()
app.set('port', process.env.PORT || 5002)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/recreateDBs', async (req, res) => {
  try {
    await cleanUpDBs()
    await setUp()
    res.status(200).send({"message": "successfully recreate DBs"})
  } catch(e) {
    res.status(500).send({"message": "failed to recreate DBs"})
  }
} )
// Agent related API Calls
app.post('/api/createAgent', async (req, res) => {
  if (req.body.name && req.body.username && req.body.password && req.body.role) {
    try {
      let response = await cloudentClient.postDocument({
        db: 'agent',
        document: {
          _id: req.body.username,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
          name: req.body.name
        }
      })
      res.status(200).send(response.result)
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})
app.get('/api/retrieveAgent', async (req, res) => {
  const param = {
    db: 'agent'
  }
  try {
    if (req.query.selector) {
      let selector = JSON.parse(req.query.selector)
      param.selector = selector
    }
    if (req.query.fields) {
      let fields = JSON.parse(req.query.fields)
      param.fields = fields
    }
    if (req.query.sort) {
      let sort = JSON.parse(req.query.sort)
      param.sort = sort
    }
    if (req.query.limit) param.limit = parseInt(req.query.limit)
    if(!param.selector) {
      param.selector = {
        "_id" : {
          "$gt": 0
        }
      }
    }
    response = await cloudentClient.postFind(param)
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/api/retrieveAgent/:id', async (req, res) => {
  try {
    let response = await cloudentClient.getDocument({
      db: 'agent',
      docId: req.params.id
    })
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.put('/api/updateAgent', async (req, res) => {
  if (req.body.name && req.body.username && req.body.password && req.body.role) {
    try {
      let response = await cloudentClient.putDocument({
        db: 'agent',
        docId: req.body.username,
        rev: req.body.rev,
        document: {
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
          name: req.body.name
        }
      })
      res.status(200).send(response.result)
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }

})

app.delete('/api/deleteAgent/:id', async (req, res) => {
  try {
    let response = await cloudentClient.deleteDocument({
      db: 'agent',
      docId: req.params.id
    })
    res.status(200).send(response)
  } catch (e) {
    res.status(500).send(e)
  }

})


// Inventory Related API Calls
app.post('/api/createInventory', async (req, res) => {
  if (req.body.nameOfVaccine && req.body.doseName) {
    try {
      let find = await cloudentClient.postFind({db: 'inventory', selector: {nameOfVaccine: req.body.nameOfVaccine, doseName: req.body.doseName}})
      if (find.result.docs.length) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let response = await cloudentClient.postDocument({
          db: 'inventory',
          document: {
            nameOfVaccine: req.body.nameOfVaccine,
            doseName: req.body.doseName,
            displayName: req.body.nameOfVaccine +" "+ req.body.doseName
          }
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})
app.get('/api/retrieveInventory', async (req, res) => {
  const param = {
    db: 'inventory'
  }
  try {
    if (req.query.selector) {
      let selector = JSON.parse(req.query.selector)
      param.selector = selector
    }
    if (req.query.fields) {
      let fields = JSON.parse(req.query.fields)
      param.fields = fields
    }
    if (req.query.sort) {
      let sort = JSON.parse(req.query.sort)
      param.sort = sort
    }
    if (req.query.limit) param.limit = parseInt(req.query.limit)
    if(!param.selector) {
      param.selector = {
        "_id" : {
          "$gt": 0
        }
      }
    }
    response = await cloudentClient.postFind(param)
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/api/retrieveInventory/:id', async (req, res) => {
  try {
    let response = await cloudentClient.getDocument({
      db: 'inventory',
      docId: req.params.id
    })
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.put('/api/updateInventory', async (req, res) => {
  if (req.body.nameOfVaccine && req.body.doseName && req.body.id) {
    try {
      let find = await cloudentClient.postFind({db: 'inventory', selector: {nameOfVaccine: req.body.nameOfVaccine, doseName: req.body.doseName}})
      if (find.result.docs.length && req.body.id !== find.result.docs[0]._id) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let response = await cloudentClient.putDocument({
          db: 'inventory',
          docId: req.body.id,
          rev: req.body.rev,
          document: {
            nameOfVaccine: req.body.nameOfVaccine,
            doseName: req.body.doseName,
            displayName: req.body.nameOfVaccine +" "+ req.body.doseName
          }
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})

app.delete('/api/deleteInventory/:id', async (req, res) => {
  try {
    let response = await cloudentClient.deleteDocument({
      db: 'inventory',
      docId: req.params.id
    })
    res.status(200).send(response)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Center Related API Calls
app.post('/api/createCenter', async (req, res) => {
  if (req.body.name && req.body.location) {
    try {
      let find = await cloudentClient.postFind({db: 'center', selector: {name: req.body.name, location: req.body.location}})
      if (find.result.docs.length) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let response = await cloudentClient.postDocument({
          db: 'center',
          document: {
            name: req.body.name,
            location: req.body.location,
            displayName: req.body.name +"-"+ req.body.location
          }
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})
app.get('/api/retrieveCenter', async (req, res) => {
  const param = {
    db: 'center'
  }
  try {
    if (req.query.selector) {
      let selector = JSON.parse(req.query.selector)
      param.selector = selector
    }
    if (req.query.fields) {
      let fields = JSON.parse(req.query.fields)
      param.fields = fields
    }
    if (req.query.sort) {
      let sort = JSON.parse(req.query.sort)
      param.sort = sort
    }
    if (req.query.limit) param.limit = parseInt(req.query.limit)
    if(!param.selector) {
      param.selector = {
        "_id" : {
          "$gt": 0
        }
      }
    }
    response = await cloudentClient.postFind(param)
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/api/retrieveCenter/:id', async (req, res) => {
  try {
    let response = await cloudentClient.getDocument({
      db: 'center',
      docId: req.params.id
    })
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.put('/api/updateCenter', async(req, res) => {
  if (req.body.name && req.body.location && req.body.id) {
    try {
      let find = await cloudentClient.postFind({db: 'center', selector: {name: req.body.name, location: req.body.location}})
      if (find.result.docs.length && req.body.id !== find.result.docs[0]._id) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let response = await cloudentClient.putDocument({
          db: 'center',
          docId: req.body.id,
          rev: req.body.rev,
          document: {
            name: req.body.name,
            location: req.body.location,
            displayName: req.body.name +"-"+ req.body.location
          }
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})

app.delete('/api/deleteCenter/:id', async (req, res) => {
  try {
    let response = await cloudentClient.deleteDocument({
      db: 'center',
      docId: req.params.id
    })
    res.status(200).send(response)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.post('/api/createSlot', async (req, res) => {
  if (req.body.date && req.body.center && req.body.inventory && req.body.available) {
    try {
      let find = await cloudentClient.postFind({db: 'slot', selector: {date: req.body.date, center: req.body.center, inventory: req.body.inventory}})
      if (find.result.docs.length) {
        res.status(500).send({
          "message": "already exist"
        })
      }
      let response = await cloudentClient.postDocument({
        db: 'slot',
        document: {
          date: req.body.date,
          center: req.body.center,
          inventory: req.body.inventory,
          available: req.body.available
        }
      })
      res.status(200).send(response.result)
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})
app.get('/api/retrieveSlot', async(req, res) => {
  const param = {
    db: 'slot'
  }
  try {
    if (req.query.selector) {
      let selector = JSON.parse(req.query.selector)
      param.selector = selector
    }
    if (req.query.fields) {
      let fields = JSON.parse(req.query.fields)
      param.fields = fields
    }
    if (req.query.sort) {
      let sort = JSON.parse(req.query.sort)
      param.sort = sort
    }
    if (req.query.limit) param.limit = parseInt(req.query.limit)
    if(!param.selector) {
      param.selector = {
        "_id" : {
          "$gt": 0
        }
      }
    }
    response = await cloudentClient.postFind(param)
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/api/retrieveSlot/:id', async(req, res) => {
  try {
    let response = await cloudentClient.getDocument({
      db: 'slot',
      docId: req.params.id
    })
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.put('/api/updateSlot', async (req, res) => {
  if (req.body.date && req.body.center && req.body.inventory && req.body.available && req.body.id) {
    try {
      let find = await cloudentClient.postFind({db: 'slot', selector: {date: req.body.date, center: req.body.center, inventory: req.body.inventory}})
      if (find.result.docs.length && req.body.id !== find.result.docs[0]._id) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let response = await cloudentClient.putDocument({
          db: 'slot',
          docId: req.body.id,
          rev: req.body.rev,
          document: {
            date: req.body.date,
            center: req.body.center,
            inventory: req.body.inventory,
            available: req.body.available,
            schedule: req.body.schedule
          }
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})

app.delete('/api/deleteSlot/:id', async (req, res) => {
  try {
    let response = await cloudentClient.deleteDocument({
      db: 'slot',
      docId: req.params.id
    })
    res.status(200).send(response)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.post('/api/createInterest', async (req, res) => {
  if (req.body.adhaar && req.body.name && req.body.center && req.body.inventory && req.body.number) {
    try {
      let response = await cloudentClient.postDocument({
        db: 'interest',
        document: {
          _id: req.body.adhaar,
          adhaar: req.body.adhaar,
          name: req.body.name,
          center: req.body.center,
          inventory: req.body.inventory,
          number: req.body.number
        }
      })
      res.status(200).send(response.result)
    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})

app.get('/api/retrieveInterest/:id', async (req, res) => {
  try {
    let response = await cloudentClient.getDocument({
      db: 'interest',
      docId: req.params.id
    })
    res.status(200).send(response.result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/api/retrieveInterest', async (req, res) => {
  const param = {
    db: 'interest'
  }
  try {
    if (req.query.selector) {
      let selector = JSON.parse(req.query.selector)
      param.selector = selector
    }
    if (req.query.fields) {
      let fields = JSON.parse(req.query.fields)
      param.fields = fields
    }
    if (req.query.sort) {
      let sort = JSON.parse(req.query.sort)
      param.sort = sort
    }
    if (req.query.limit) param.limit = parseInt(req.query.limit)
    if(!param.selector) {
      param.selector = {
        "_id" : {
          "$gt": 0
        }
      }
    }
    console.log(param)
    response = await cloudentClient.postFind(param)
    res.status(200).send(response.result)
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

app.put('/api/updateInterest', async (req, res) => {
  if (req.body.adhaar) {
    try {
      let find = await cloudentClient.postFind({db: 'interest', selector: {_id: req.body.adhaar}})
      console.log(req.body.id)
      console.log(find.result.docs)
      if (find.result.docs.length && req.body.id !== find.result.docs[0]._id) {
        res.status(500).send({
          "message": "already exist"
        })
      } else {
        let doc = {
          adhaar: req.body.adhaar,
          name: req.body.name,
          center: req.body.center,
          inventory: req.body.inventory,
          number: req.body.number
        }
        let updatedDoc = Object.assign({}, req.body, doc)
        let response = await cloudentClient.putDocument({
          db: 'interest',
          docId: req.body.adhaar,
          rev: req.body.rev,
          document: updatedDoc
        })
        res.status(200).send(response.result)
      }
    } catch (e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send({
      "message": "missing fields"
    })
  }
})

app.delete('/api/deleteInterest/:id', async (req, res) => {
  try {
    let response = await cloudentClient.deleteDocument({
      db: 'interest',
      docId: req.params.id,
      rev: req.body.rev,
    })
    res.status(200).send(response)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Input Body {interestId:"", slotId:""}
app.put('/api/updateSchedule', async (req, res) => {
  try {
    let interestDoc =(await cloudentClient.getDocument({
      db: 'interest',
      docId: req.body.interestId
    })).result
    console.log(interestDoc)
    let slotDoc = (await cloudentClient.getDocument({
      db: 'slot',
      docId: req.body.slotId
    })).result
    console.log(slotDoc)
    interestDoc.schedule = slotDoc
    interestDoc.callCount = interestDoc.callCount ? interestDoc.callCount + 1 : 1
    interestDoc.callStatus = "schedule"
    let response = await cloudentClient.putDocument({
      db: 'interest',
      docId: req.body.interestId,
      rev: interestDoc._rev,
      document: interestDoc
    })
    slotDoc.schedule = slotDoc.schedule? slotDoc.schedule+1 : 1
    let slotPutResponse = await cloudentClient.putDocument({
      db: 'slot',
      docId: req.body.slotId,
      rev: slotDoc._rev,
      document: slotDoc
    })
    res.status(200).send({"message": "successfully updated the schedule"})
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

app.put('/api/updateCallStatus', async (req, res) => {
  try {
    let interestDoc =(await cloudentClient.getDocument({
      db: 'interest',
      docId: req.body.interestId
    })).result
    console.log(interestDoc)
    if(interestDoc.callStatus !== "schedule") {
      interestDoc.callStatus = req.body.callStatus
      interestDoc.callCount = interestDoc.callCount ? interestDoc.callCount + 1 : 1
      let response = await cloudentClient.putDocument({
        db: 'interest',
        docId: req.body.interestId,
        rev: interestDoc._rev,
        document: interestDoc
      })
    }
    res.status(200).send({"message": "successfully updated the schedule"})
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})







http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})