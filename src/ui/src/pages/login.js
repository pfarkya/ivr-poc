import React, { useState } from 'react';
import {
    TextInput,
    Button,
  } from 'carbon-components-react';
import { Redirect } from 'react-router-dom';
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

export const LoginPage = () => {
  let [username, setUsername] = useState("")
  let [password, setPassword] = useState("")
  let auth = useAuth()
  let login = () => {
    auth.signin(username,password)
  }
  return !auth.user ?
    ( <div className="bx--grid">
       <div class="bx--row">
         <div class="bx--col"></div>
         <div class="bx--col">
         <div class="bx--row"><h2>Login</h2></div>
          <div class="bx--row">
            <TextInput labelText={'Username'} onChange={(e)=>{setUsername(e.target.value)}} required/>
          </div>
          <div class="bx--row">
          <TextInput type="password" labelText={'Password'} onChange={(e)=>{setPassword(e.target.value)}} required/>
          </div>
          <div class="bx--row gaprow"></div>
          <div class="bx--row">
            <Button onClick={login}>Login</Button>
          </div>
         </div>
       <div class="bx--col"></div>
      </div>
    </div> ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: "/login" }
              }}
            />
          )
  ;
};