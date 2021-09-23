import React, { useState } from 'react';
import {
    TextInput,
    Button,
  } from 'carbon-components-react';
import { useAuth } from '../useauth'

const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};

export const CreateAgent = () => {
  let [username, setUsername] = useState("")
  let [password, setPassword] = useState("")
  let [name, setName] = useState("")
  let createAgent = () => {
    let option = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            role: 'agent',
            name: name
        }),
        json: true
    }
    return fetch('/api/createagent', option).then((res) => {
        return res.json()
    }).then((body) => {
        console.log(body)
        alert("Successfully created agent")
        return body
    }) 
  }
  return (
    <div className="bx--grid">
      <div className="bx--row">
        <div className="bx--col"></div>
        <div className="bx--col">
        <div className="bx--row"><h2>Create Agent</h2></div>
        <div className="bx--row"><TextInput labelText={'Name'} onChange={(e)=>{console.log(e.target.value); setName(e.target.value)}} required/></div>
        <div className="bx--row"><TextInput labelText={'Username'} onChange={(e)=>{console.log(e.target.value); setUsername(e.target.value)}} required/></div>
        <div className="bx--row"><TextInput type="password" labelText={'Password'} onChange={(e)=>{console.log(e); setPassword(e.target.value)}} required/></div>
        <div className="bx--row gaprow"></div>
        <div className="bx--row"><Button onClick={createAgent}>Create Agent</Button></div>
        </div>
        <div className="bx--col"></div>
      </div>
    </div>
  );
};