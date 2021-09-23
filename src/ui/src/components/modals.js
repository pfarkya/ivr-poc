import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {
  Modal, TextInput, Dropdown, DatePicker, DatePickerInput
} from 'carbon-components-react';


export const UpdateAgentModal = (props) => {
    let [username, setUsername] = useState(props.agent? props.agent.username: "")
    let [password, setPassword] = useState(props.agent? props.agent.password: "")
    let [name, setName] = useState(props.agent? props.agent.name: "")

    const handleSubmitDialog = () => {
        props.onSubmit({
            rev: props.agent? props.agent._rev : undefined,
            username: username,
            password: password,
            name: name,
            role: props.agent ? props.agent.role : 'agent'
        })
    }
    useEffect(() => {
        setUsername(props.agent? props.agent.username: "")
        setPassword(props.agent? props.agent.password: "")
        setName(props.agent? props.agent.name: "")
    }, [props])
    console.log(props.agent)
    console.log({username, name, password})
return (
     <Modal
        open={props.open}
        onRequestClose={props.onClose}
        onRequestSubmit={handleSubmitDialog}
        modalHeading={props.agent? 'Update Agent' : 'Create Agent'}
        primaryButtonText={props.agent? 'Update' : 'Create'}
        secondaryButtonText={'Close'}
        primaryButtonDisabled={false}
        size='xs'
    >
        <TextInput labelText={'Name'} onChange={(e)=>{console.log(e.target.value); setName(e.target.value)}} value={name} required/>
        <TextInput labelText={'Username'} onChange={(e)=>{console.log(e.target.value); setUsername(e.target.value)}} value={username} required disabled={props.agent? true: false}/>
        <TextInput type="password" labelText={'Password'} onChange={(e)=>{console.log(e); setPassword(e.target.value)}} value={password} required/>
    </Modal>
)
};

UpdateAgentModal.propTypes = {
    agent: PropTypes.object,
    onSubmit: PropTypes.func,
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func
}

export const CreateInventoryModel = (props) => {
    let [nameOfVaccine, setNameOfVaccine] = useState("")
    let [doseName, setDoseName] = useState("")

    const handleSubmitDialog = () => {
        props.onSubmit({
            rev: props.inventory? props.inventory._rev : undefined,
            id: props.inventory? props.inventory._id : undefined,
            nameOfVaccine: nameOfVaccine,
            doseName: doseName
        })
    }
    useEffect(() => {
        setNameOfVaccine(props.inventory? props.inventory.nameOfVaccine: "")
        setDoseName(props.inventory? props.inventory.doseName: "")
    }, [props])
return (
     <Modal
        open={props.open}
        onRequestClose={props.onClose}
        onRequestSubmit={handleSubmitDialog}
        modalHeading={props.inventory? 'Update Vaccine' : 'Create Vaccine'}
        primaryButtonText={props.inventory? 'Update' : 'Create'}
        secondaryButtonText={'Close'}
        primaryButtonDisabled={false}
        size='xs'
    >
        <TextInput labelText={'Name of Vaccine'} onChange={(e)=>{console.log(e.target.value); setNameOfVaccine(e.target.value)}} value={nameOfVaccine} required/>
        <TextInput labelText={'Dose Name'} onChange={(e)=>{console.log(e.target.value); setDoseName(e.target.value)}} value={doseName} required disabled={props.agent? true: false}/>
    </Modal>
)
};

CreateInventoryModel.propTypes = {
    inventory: PropTypes.object,
    onSubmit: PropTypes.func,
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func
}

export const CreateCenterModel = (props) => {
    let [name, setName] = useState("")
    let [location, setLocation] = useState("")

    const handleSubmitDialog = () => {
        props.onSubmit({
            rev: props.center? props.center._rev : undefined,
            id: props.center? props.center._id : undefined,
            name: name,
            location: location
        })
    }
    useEffect(() => {
        setName(props.center? props.center.name: "")
        setLocation(props.center? props.center.location: "")
    }, [props])
return (
     <Modal
        open={props.open}
        onRequestClose={props.onClose}
        onRequestSubmit={handleSubmitDialog}
        modalHeading={props.center? 'Update Center': 'Add Center'}
        primaryButtonText={props.center? 'Update': 'Add'}
        secondaryButtonText={'Close'}
        primaryButtonDisabled={false}
        size='xs'
    >
        <TextInput labelText={'Name of Center'} onChange={(e)=>{console.log(e.target.value); setName(e.target.value)}} value={name} required/>
        <TextInput labelText={'Location'} onChange={(e)=>{console.log(e.target.value); setLocation(e.target.value)}} value={location} required disabled={props.agent? true: false}/>
    </Modal>
)
};

CreateCenterModel.propTypes = {
    center: PropTypes.object,
    onSubmit: PropTypes.func,
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func
}


export const CreateSlotModel = (props) => {
    let [date, setDate] = useState("")
    let [center, setCenter ] = useState(null)
    let [inventory, setInventory ] = useState(null)
    let [available, setAvailable] = useState(0)
    let [centerList, setCenterList] = useState([])
    let [inventoryList, setInventoryList] = useState([])

    const handleSubmitDialog = () => {
        props.onSubmit({
            rev: props.slot? props.slot._rev : undefined,
            id: props.slot? props.slot._id : undefined,
            date: date,
            center: center,
            inventory: inventory,
            available: available,
            schedule: props.slot? props.slot.schedule : 0,
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
        if (props.slot) {
          let refcenter
          body.forEach((item) => {
            if(props.slot.center._id === item._id) {
              refcenter = item
            }
          })
          setCenter(refcenter)
        }
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
        if (props.slot) {
          let refinventory
          body.forEach((item) => {
            if(props.slot.inventory._id === item._id) {
              refinventory = item
            }
          })
          setInventory(refinventory)
        }
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
        if (props.slot) console.log("setting date ", props.slot.date)
        setDate(props.slot? props.slot.date: "")
        setCenter(props.slot? props.slot.center: "")
        setInventory(props.slot? props.slot.inventory: "")
        setAvailable(props.slot? props.slot.available: 0)
    }, [props.open, props.user, props.slot])
return props.open ? (
     <Modal
        open={props.open}
        onRequestClose={props.onClose}
        onRequestSubmit={handleSubmitDialog}
        modalHeading={props.slot? 'Update Slot': 'Create Slot'}
        primaryButtonText={props.slot? 'Update': 'Create'}
        secondaryButtonText={'Close'}
        primaryButtonDisabled={false}
        size='xs'
    >
        <DatePicker 
          datePickerType="single"
          minDate={(new Date()).toLocaleDateString("en-UK")}
          dateFormat={'d/m/Y'}
          onChange={(e) => {console.log(e);setDate(e[0].toLocaleDateString("en-UK"))}}
          value={date}
        >
            <DatePickerInput
              placeholder="dd/mm/yyyy"
              labelText="Select Date"
              id="date-picker-single"
              disabled={props.slot? true: false}
            />
        </DatePicker>
        <Dropdown
          disabled={props.slot? true: false}
          label={'Select Center'}
          titleText={'Center'}
          items={centerList}
          itemToString={(item) => (item ? item.name : '')}
          onChange={(e) => setCenter(e.selectedItem)}
          selectedItem={center}
        />
        <Dropdown
          label={'Select Vaccine'}
          titleText={'Vaccine'}
          disabled={props.slot? true: false}
          items={inventoryList}
          itemToString={(item) => (item ? item.displayName : '')}
          onChange={(e) => {setInventory(e.selectedItem)}}
          selectedItem={inventory}
        />
        <TextInput type={'number'} labelText={'Number of Available Vaccine'} onChange={(e)=>{console.log(e.target.value); setAvailable(e.target.value)}} value={available} required/>
    </Modal>
) : null
};

CreateSlotModel.propTypes = {
    slot: PropTypes.object,
    onSubmit: PropTypes.func,
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func
}