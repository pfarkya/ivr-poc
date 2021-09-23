# IVR - Distribution line

## Problem Statement
Today, some vaccination centers are having too much crowd, and some of them are having no common reach, thus vaccines are wasted there. This is the same in case of other necessities like ration and other medical supplies like Remedevesir or Oxygen cans. In the wake of Corona third wave, how can better manage people's need without having the relying on the smartphone apps / digital medium.
 
## Background
 - Smart IVR solution
 - Our portal takes the contact details of interested party via different means (i.e. Through Portal by interested party and social worker of that area)
 - Make contact and provide them the slot with collecting the benefit - Date, time, location
 - Get responses from the interested party
 - Which will iterate through supply and demand and do best match for the supply of vaccine.
 - And have admin dashboard for remaining interested party so that demand will able to fullfill.
 - This idea is to solve the various problems of distribution and reception. The basic rule of this idea is centers/inventory(vaccine) -> interest -> supply(availability) -> schedule -> retake the interest
 - Technologies Dependencies / Used
     - Nodejs
     - React
     - Cloudant
     - Watson Speech to text
     - Watson Text to speech
     - Watson Natural Language Understanding
     - Watson Assistant
     - Twilio

 - Current Implementation
     - Admin
     - Reception
     - Automation for vaccine schedule for matches
     - Speech to text/ Text to speech
     - Add centers, Create vaccine, slot updates
     - IVR for schedule for vaccine
     - Interest Collection.

 - Roadmap for extention
     - Configurable
     - Multilingual Support
     - Customise automation flow 
     - Autopilot (IVR)
     - Adding plugable hooks for validation like Adhaar.
     - Heriarchical plugable nodes.
     - Update to admin dashboard to have charts and all.
     - Documentation to use the solution/ Use Cases / Demos.

## The Idea
 - The main idea is to have a process of distribution via IVR technology to reach out to those who don't have access to digital facilities.
 
## How it works?
  - Use cases
      - It can be used anywhere for proactive distribution of item within organisation, locality, community, country or any heriarchy like city, town, village 
  - Technology and architecture
  - Technologies Dependencies / Used
      - Nodejs
      - React
      - Cloudant
      - Watson Speech to text
      - Watson Text to speech
      - Watson Natural Language Understanding
      - Watson Assistant
      - Twilio
  - Architecture
      - It consist of various services 
      - UI
      - Speech to text & text to speech service
      - Persistence - 
      - Automation - Itererate match and ivr schedule
      - IVR Service - Contact to Twilio (Further use Watson Assistance and NLU for autopilot)
      ![Architecture](./docs/Architecture.svg)
  - Work Flows
      - Admin Flow - Configure Portal -> Create Agents -> Add Center -> Create Vaccine
      - Agent/Open Flow - Take interest
      - Admin Flow - Based on interest and supply of vaccine create slot and start automation
      - Automation - Schedule the slot with maximum slot book and retry
      - Reception Flow - On reception Queue management -> In queue -> Ask -> Done.
      ![DifferentPersonaAndFlow](./docs/DifferentPersonaAndFlow.svg)
  - Concepts
      - There is a group where an organisation needs to supply(distribute) the item whom it want to take `interest`
      - There are some authenticated users `agent` and `admin`
      - There is `admin` who can create `center`(Place where user can collect) , `inventory`(Item which is getting distributed) and `slot`(For collection item in center on date).
      - There is `automation` for `scheduling` slots.

## Creativity and innovation
  - How unique is the approach to solve a long-standing or previously intractable problem? 
  - This is a proactive solution
  - This is an interective via phone call solution
  - This is based on automation
  This solution instead working on the user to come to the app and do there stuff. It more proactive working towards the most interective/faster way to get results.

## Design and usability
  - How good are the design, user experience, and ease of use of the solution? How quickly can it be put to use?
  User Experience still needs to improve but have a good initial approach and desing and exprience what the feature we have in solution.

## How to build and run?
  - Infra requiements 
      - Nodejs
  - Build instructions
      - Go to `src/ui` directory in CMD/terminal
      - Run `npm run build`
  - How to run?
      - Before you begin [prereq](./docs/README.md#prerequisite)
      - set all the ENV as mentioned in [here](./docs/README.md#setup-env)
      - In all the services folder just do `npm start`
      - Remember ivrservice needs to be call by publically accessible host

## Source overview
  - How is the source code structured?  Please talk about the high-level directory structures.
  - src/ -- has source code
  - src/ui -- ui service code here and needs to build the UI
  - src/ivrservice - ivr service code goes here
  - src/automation - automation service code here
  - src/persistence - persistence service code here
  - docs/ -- has documentation

## How to submit?
  - Upload elevator pitch ppt and put it in docs/ folder.
  - Upload source code in src/ folder
  - Update README.md file and fill all the sub-headings
