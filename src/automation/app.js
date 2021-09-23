const express = require('express')
const http = require('http')
const path = require('path')
const got = require('got')

const app = express()

const persistenceUrl =  process.env.PERSISTENCE_URL || 'http://localhost:5002'
const ivrserviceUrl = process.env.IVRSERVICE_URL || 'http://localhost:5001'
const isReal = true


let automationStatus = {
    running: false
}

function waitforme(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

function generateRequestBody(item, slot) {
    return  {
        userId: item._id,
        slotId: slot._id,
        phoneNumber: item.number,
        messages: {
            initial: `Hey ${item.name}, there is a slot avaialable at ${slot.center.name} on ${slot.date} for ${slot.inventory.displayName}, Are you willing to schedule? Press 1 for schedule this slot or press any other key for not willing to schedule`,
            successMsg: `Your have been scheduled for ${slot.inventory.displayName} at ${slot.center.name} on ${slot.date}`,
            failureMsg: "You are not opted for the schedule"
        }
    }
}

function callBatch(interests, startIndex, endIndex/*notinclusive*/, slot) {
    let batch = interests.slice(startIndex, endIndex)
    return new Promise((resolve, reject) => {
        let promises = []
        batch.forEach((item) => {
            let url = ivrserviceUrl+ (isReal ? '/api/makeacallreal': '/api/makeacallfake')
            promises.push(got.post(url,{
                json: generateRequestBody(item, slot)
            }).json())
        })
        Promise.all(promises)
            .then((responseArray) => {
                console.log(responseArray);
                resolve( responseArray);
            }).catch((errors) => {
            console.log(errors)
            resolve(errors)
        });
    })
}

let runAutomation =  async () => {
    while(automationStatus.running) {
        await waitforme(5000)
        // fetch slots
        try {
            await waitforme(2000)
            console.log("retrieving slots")
            const slots = (await got.get(persistenceUrl+'/api/retrieveSlot').json()).docs;
            console.log("retrieving slots length", slots.length)
            for(let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
                console.log("retrieving slot")
                await waitforme(2000)
                const slot = await got.get(persistenceUrl+'/api/retrieveSlot/'+slots[slotIndex]._id).json();
                let retryCount = 0 
                let retryLimit = 3
                console.log("retrieving slot schedule and available", slot.schedule, slot.available)
                slot.schedule = slot.schedule ? slot.schedule : 0
                if( slot.schedule < slot.available  && retryCount < retryLimit) {
                    console.log("retrieving interest")
                    const interests = (await got.get(persistenceUrl+'/api/retrieveInterest', {searchParams: {
                        selector: JSON.stringify({
                            "center._id": slot.center._id,
                            "inventory._id": slot.inventory._id,
                            "$or": [
                                {"callStatus": {
                                "$exists": false
                            }},{
                              "$nor": [
                                { "callStatus": "inprogress" },
                                { "callStatus": "schedule" },
                               ]
                            }
                            ]
                        }),
                        limit: slot.available - slot.schedule
                    }}).json()).docs;
                    // createBatch
                    if( interests.length > (slot.available - slot.schedule)) {
                        console.error("something wrong in query limit is not working")
                    }
                    let batchCount = 1
                    let numberOfBatches = parseInt(interests.length/batchCount)
                    for(let batchIndex = 0; batchIndex< numberOfBatches; batchIndex++) {
                        console.log("calling batch")
                        await callBatch(interests, batchIndex*batchCount, batchIndex*batchCount + batchCount, slot)
                    }
                    if (interests.length%batchCount !== 0) {
                        console.log("calling last batch")
                        await callBatch(interests, numberOfBatches*batchCount, interests.length, slot)
                    }
                    retryCount++ 
                }
            }
        } catch(e) {
            console.error(e)
            if(e.response) {
                console.error(e.response.statusCode)
                console.error(e.response.body)
            }
        }
        
        // fetch matching interest with limit and constrain
        // try to complete this slot 3 retry
    }
}
app.set('port', process.env.PORT || 5003)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post('/api/startautomation', (req, res) => { 
    if(automationStatus.running) {
        res.status(200).send({"message": "automation already running", running: automationStatus.running})
    } else {
        automationStatus.running = true
        runAutomation()
        res.status(200).send({"message": "automation start successfully", running: automationStatus.running})
    }
})
app.post('/api/stopautomation', (req, res) => {
    if(!automationStatus.running) {
        res.status(200).send({"message": "automation already stopped", running: automationStatus.running})
    } else {
        automationStatus.running = false

        res.status(200).send({"message": "automation stop successfully", running: automationStatus.running})
    }
})

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})