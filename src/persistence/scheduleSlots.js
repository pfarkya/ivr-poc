const Cloudant = require('@ibm-cloud/cloudant');
const service = Cloudant.CloudantV1.newInstance({ serviceName: 'CLOUDANT' });
const superagent = require ('superagent');

var slots =[
    {
        date: '2021-09-03T06:35:10.415Z',
        center: {
            name : "abc",
            location : "abc",
            agentAtCenter: "xyz"
        },
        inventory: {
            id: "covishield-1",
            nameOfVaccine : "covishield",
            doseName: 1
        },
        totalAvailable: 10,
        scheduledCount: 0


    }
]

var interests = [
    {
        adhar: "123456789012",
        name: "Srihari",
        center: "abc",
        inventory: "covishield-1",
        agent: "xyz",
        callHistory: 0,
        callCount: 0,
        callstatus : "noschedule",
        scheduleDetails: {
            scheduleAt: new Date(),
            scheduleCenter: "abc",
            inventory: "covishield-1"
        },
        centerQueueStatus: "slotCount"
    }
]

var matches =[
    {
        "phoneNumber": "123456789012",
        "messages": {
            "initial" : "Hey {interest.name}}, You have some appointment on {slot.date} at {slot.center} please confirm your appointment",
            "successMsg": "Your appointment scheduled",
            "failureMsg": undefined
        },
        "name": "{interest.name}",
        "date": new Date()
    }
]

function retrieveSlots(options, callback){
    service.postFind({
        db: 'slots',
        selector: {"status":{'$eq':"available"}},
        //fields: ['_id', 'type', 'name', 'email'],
        //sort: [sort],
        //limit: 3
    }).then(response => {
        console.log('*** Total number of slots available ' + response.result.docs.length);
        return callback(null, response.result.docs);
    }). catch(error => {
        return callback(error);
    })
}

function retrieveInterests(options, callback){
    const selector = {
        "center":{
            "$eq" : options.center
        },
        "inventory":{
            "$eq" : options.inventory
        },
        "$or":[
            {
                "callstatus": {
                    "$eq": "timeout"
                }
            },
            {
                "callstatus": {
                    "$eq": "noschedule"
                }
            }
        ]
    }

    service.postFind({
        db: 'interests',
        selector: selector,
        //fields: ['_id', 'type', 'name', 'email'],
        /*sort: [
            {callCount: 'asc'}
        ],*/
        //limit: options.limit
    }).then(response => {
        console.log("*** Total Interests matching selector "+ response.result.docs.length);
        callback(null, response.result.docs);
    }). catch(error => {
        console.log(error)
        callback(error);
    })
}

function scheduleSlots(callback){
    var slotPromises = []
    retrieveSlots({}, function(errSlots, slots){
        if(errSlots){
            console.log('error retreiving slots');
            console.log((errSlots))
            return callback(errSlots)
        }
        else{
            for(slot in slots) {
                var options = {};
                options.center = slots[slot].center.name;
                options.inventory = slots[slot].inventory.id;
                options.limit = slots[slot].available - slots[slot].scheduled;
                slotPromises.push(retreiveAndMatchSlots(slots[slot], options))
            }
            Promise.all(slotPromises). then(resp => {
                console.log('All slot promises resolved/rejected');
                callback(null, resp);
            }).catch((err) => {
                console.log('Error resolving all slot promises');
                callback(err)
            })
        }

    })
}

function retreiveAndMatchSlots(slot, options) {
    return new Promise((resolve, reject) => {
    retrieveInterests(options, function (errInterests, interests) {
        if (errInterests) {
            console.log('error retreiving interests');
            reject(errInterests);
        }
        else {
            var arrayMatches = [];
            for (interest in interests) {
                console.log('Creating IVR request for ' + interests[interest].name);
                arrayMatches.push(callIVRtoMatchInterest(interests[interest], slot));
            }
            console.log('Triggering all IVR requests for matching' + arrayMatches.length)
            Promise.all(arrayMatches)
                .then((matchResponseArray) => {
                    console.log(matchResponseArray);
                    resolve( matchResponseArray);
                }).catch((errors) => {
                console.log(errors)
                reject(errors)
            });
        }
    })
})
}

function callIVRtoMatchInterest(interest, slot){
    return new Promise((resolve, reject) => {
        var ivrRequest ={
            "phoneNumber": "123456789012",
            "messages": {
                "initial" : "Hey " + interest.name + " , You have some appointment on " + slot.date + " at " + slot.center.name + "please confirm your appointment",
                "successMsg": undefined,
                "failureMsg": undefined
            },
            "name": interest.name,
            "date": slot.date
        }
        console.log("IVR Request");
        console.log(ivrRequest);
        superagent
            .get('https://loopback-connector-provider-cloudantdb-akash.eu-gb.mybluemix.net/admin/version')
            //.send(ivrRequest) // sends a JSON post body
            //.set('X-API-Key', 'foobar')
            .set('accept', 'json')
            .end((err, res) => {
                if(err){
                    reject(err)
                }
                else {
                    console.log("### Got Response")
                    resolve("success");
                }
            });
    })


    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Resolving for '+interest.name);
            resolve(matches);
        }, 10, null, interest, slot);
    });
}

/*
scheduleSlots(function (err, resp) {
    console.log(resp);
})*/

scheduleSlots( function (err, resp) {
    console.log('Scheduling slots complete');
    console.log(resp)
})