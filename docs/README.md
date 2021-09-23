# Setup

## PreRequisite

1. Nodejs 
2. STT(Watson Speech to text) IBM cloud sevice and get credential of it. [Click here](https://cloud.ibm.com/docs/speech-to-text?topic=speech-to-text-gettingStarted) for more detail.
3. TTS(Watson Text to Speech) IBM cloud service and get credential of it.[Click here](https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-gettingStarted) for more detail.
4. CloudantDB IBM cloud Service and get credential of it.
[Click here](https://cloud.ibm.com/docs/Cloudant?topic=Cloudant-getting-started-with-cloudant) for more detail.
5. Twilio account and phone number. 
[Click here](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them) for more detail.


## ngrok for local setup

For running locally you need public URL for ivrservice to run for which ngrok is the easiest way to use it. [Click here](https://ngrok.com/docs) for more detail.

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
