import React, { useState, useEffect } from 'react';
import {
    TextInput,
    Button,
    Dropdown
  } from 'carbon-components-react';
import { useAuth } from '../useauth'
import { number } from 'prop-types';

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

export const RegisterInterest = (props) => {
  let [name, setName] = useState("")
  let [adhaar, setAdhaar] = useState("")
  let [number, setNumber] = useState("")
  let [center, setCenter] = useState(null)
  let [centerList, setCenterList] = useState([])
  let [inventoryList, setInventoryList] = useState([])
  let [inventory, setInventory ] = useState(null)
  let auth = useAuth()
  let registerInterest = () => {
    fetch('/api/registerinterest', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        adhaar: adhaar,
        center: center,
        inventory: inventory,
        number: number,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if(!res.ok) {
        throw new Error("failed")
      }
      alert("Successfully submited interest. You will be contacted for vaccine slot allocation soon")
      setName("")
      setAdhaar("")
      setNumber("")
    }).catch((e) => {
      console.error(e)
      alert("failed to submit response")
    })
  }
  const getCenterList = () => {
    fetch('/api/listofcenter').then((res) => {
      if(!res.ok) {
        throw new Error("Failed to retrieve")
      }
      return res.json()
    }).then((body) => {
      console.log(body)
      if (body) {
        setCenterList(body)
      }
    }).catch((e) => {
      console.error(e)
    })
  }
  const getInventoryList = () => {
    fetch('/api/listofinventory').then((res) => {
      if(!res.ok) {
        throw new Error("Failed to retrieve")
      }
      return res.json()
    }).then((body) => {
      console.log(body)
      if (body) {
        setInventoryList(body)
      }
    }).catch((e) => {
      console.error(e)
    })
    
  }
  useEffect(() => {
    getCenterList()
    getInventoryList()
  }, [props])
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row">
          <div className="bx--col"></div>
          <div className="bx--col">
            <div className="bx--row">
              <h2>Register your interest for Covid Vaccine by filling the below form</h2>
            </div>
            <div className="bx--row">
              <TextInput id={'name'} labelText={'Name'} onChange={(e)=>{setName(e.target.value)}} value={name} required/>
            </div>
            <div className="bx--row">
              <TextInput id={'adhaar'} labelText={'Adhaar Number'} onChange={(e)=>{setAdhaar(e.target.value)}} value={adhaar} required/>
            </div>
            <div className="bx--row">
              <Dropdown
                disabled={props.slot? true: false}
                label={'Select your center'}
                titleText={'Center'}
                items={centerList}
                itemToString={(item) => (item ? item.name : '')}
                onChange={(e) => setCenter(e.selectedItem)}
                selectedItem={center}
                required
              />
            </div>
            <div className="bx--row">
              <Dropdown
                label={'Select vaccine'}
                titleText={'Vaccine Preference'}
                disabled={props.slot? true: false}
                items={inventoryList}
                itemToString={(item) => (item ? item.displayName : '')}
                onChange={(e) => {setInventory(e.selectedItem)}}
                selectedItem={inventory}
              />
            </div>
            <div className="bx--row"><TextInput labelText={'Phone Number'} onChange={(e)=>{setNumber(e.target.value)}} value={number} required/></div>
            <div className="bx--row gaprow"></div>
            <div className="bx--row"><Button onClick={registerInterest}>Submit</Button></div>
          </div>
          <div className="bx--col"></div>
        </div>
    </div>
  );
};