# Setup

## PreRequisite

1. Nodejs
2. STT IBM cloud sevice and get credential of it
3. TTS IBM cloud service and get credential of it
4. CloudantDB IBM cloud Service and get credential of it
5. Twilio account and phone number

## ngrok for local setup

For running locally you need public URL for ivrservice to run for which ngrok is the easiest way to use it.

## Setup ENV

```
# STT/TTS ENV
export STT_APIKEY=<>
export STT_URL=<>
export TTS_APIKEY=<>
export TTS_URL=<>

# Twilio ENV
export TWILIO_ACCOUNT_SID=<>
export TWILIO_AUTH_TOKEN=<>
export TWILIO_NUMBER=<>

# Cloudant ENV
export CLOUDANT_URL=<>
export CLOUDANT_USERNAME=<>
export CLOUDANT_PASSWORD=<>
export CLOUDANT_AUTH_TYPE=BASIC

# Service Route
export AUTOMATION_URL=<>
export PERSISTENT_URL=<>
export IVRSERVICE_URL=<This Should be always public URL for locally ngrok URL>
export SPEECHANDTEXT_URL=<>
export UI_URL=<>
```


## Run it locally

In each of the five folder do in terminals setting up above ENV
1. `npm install`
2. `npm start`

and start using `localhost:3000`
By default admin username and password is `admin`

### Architecture
![Architecture](./Architecture.svg)

### Flows
![DifferentPersonaAndFlow](./DifferentPersonaAndFlow.svg)



### Problem Statement

Govt struggling to provide vaccine to every citizen of india. Where Cowin portal is not helpful all the time as we know 50% population don't know how to use CoWin Portal and even the person know how to use they are also getting struggling to book a slot. 
So by the preview of this most of the local authority not giving slots in cowin portal and just announcing slot availability via local communication media.
Which further makes a long queue at the centers.


### Silent Features of Solution
1. Proactive IVR call Schedule
2. Configurable <Not Yet Implemented>
3. NLU (Autopilot) <Not Yet Implemented>
4. Multiligual(Regional Laguague) <Not Yet Implemented>
5. Automation
6. Stats on dashboard
7. Plugable to Heriachical. <Not Yet Implemented>
8. Reception Non Tochability via Speech.
9. Reception Queue creation.
10. Proactive IVR call Interest Updates <Not Yet Implemented>


### Stats
1. 90% of the family in India has Mobile/telephone
2. Making a call is 80% more responsive than the Text information.


### Benifits 
1. Reduce the cost of Interest Taking.
2. Reach to Unreached People.
3. Reduce the Queue.
4. Better Managibility of Queue.
5. Better Distribution of Recources.