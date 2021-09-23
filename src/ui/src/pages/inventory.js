import {
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  Button,
  Dropdown
} from 'carbon-components-react';
import {
  Delete16 as Delete,
  Save16 as Save,
  Download16 as Download,
  Edit16 as Edit
} from '@carbon/icons-react';
import React, {useState, useEffect} from 'react';
import { CreateCenterModel, CreateInventoryModel, CreateSlotModel } from '../components/modals';
import { useAuth } from '../useauth'
import ReactDOM from 'react-dom'
import { object } from 'prop-types';

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

export const InventoryTable = (props) => {
  let [slotModalOpen, setSlotModalOpen] = useState(false)
  let [centerModalOpen, setCenterModalOpen] = useState(false)
  let [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  let [slotID , setSlotID] = useState(null)
  let [rows, setRows] = useState([])
  let [headers, setHeaders] = useState([])
  let [slots, setSlots] = useState([])
  let [dates, setDates] = useState(["empty"])
  let [date, setDate] = useState("empty")
  let [formattedRes, setFormattedRes] = useState({})
  let [automationInProgess, setAutomationInProgress] = useState(false)
  let auth = useAuth()
  const openSlotModal = (slot) => {
    setSlotModalOpen(true)
  }
  const openCenterModal = (center) => {
    setCenterModalOpen(true)
  }
  const openInventoryModal = (inventory) => {
    setInventoryModalOpen(true)
  }
  const startAutomation = () => {
    fetch('/api/startautomation').then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      setAutomationInProgress(true)
    }).catch(() => {
      alert('Unable to start automation')
    })
  }
  const stopAutomation = () => {
    fetch('/api/stopautomation').then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      setAutomationInProgress(false)
    }).catch(() => {
      alert('Unable to stop automation')
    })
  }
  const updateSlot = (slot) => {
    let option = {
      method: 'PUT',
      headers: {
          "Content-Type": 'application/json'
      },
      body: JSON.stringify(slot),
      json: true
    }
    fetch('/api/updateslot', option).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      updateTableForSlots()
    }).catch(() => {
      alert('Unable to update')
    })
    setSlotID(null)
    setSlotModalOpen(false)
  }
  const updateCenter = (center) => {
    let option = {
      method: 'PUT',
      headers: {
          "Content-Type": 'application/json'
      },
      body: JSON.stringify(center),
      json: true
    }
    fetch('/api/updatecenter', option).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      updateTableForSlots()
    }).catch(() => {
      alert('Unable to update')
    })
    setCenterModalOpen(false)
  }
  const updateInventory = (inventory) => {
    let option = {
      method: 'PUT',
      headers: {
          "Content-Type": 'application/json'
      },
      body: JSON.stringify(inventory),
      json: true
    }
    fetch('/api/updateinventory', option).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      updateTableForSlots()
    }).catch(() => {
      alert('Unable to update')
    })
    setInventoryModalOpen(false)
  }
  const slotModalClose = () => {
    setSlotID(null)
    setSlotModalOpen(false)
  }
  const centerModalClose = () => {
    setCenterModalOpen(false)
  }
  const inventoryModalClose = () => {
    setInventoryModalOpen(false)
  }
  const editSlot1 = (slotId) => {
    console.log("slotId", slotId, slots, formattedRes)
    let slotToEdit = slots.find((slot) => {return slot._id ===  slotId})
    console.log("slotToEdit", slotToEdit)
  }
  const editSlot = (slotId) => {
    setSlotID(slotId)
    openSlotModal()
  }
  const updateTableForSlots = () => {
    fetch('/api/listformatedslots').then((res) => {
      if(!res.ok) {
        throw new Error("failed to get response")
      }
      return res.json()
    }).then((body) => {
  //  <Button
  //   renderIcon={Edit}
  //   kind="ghost"
  //   hasIconOnly
  //   onClick={() => action('onClick')}
  // />
  // status: <Link>Active</Link>
      Object.keys(body.rowsByDate).forEach((dat) => {
        if(dat!== "empty") {
          body.rowsByDate[dat].forEach((row) => {
            let keysToUpdate = Object.keys(row).filter((key) => {return key.endsWith("available")})
            keysToUpdate.forEach((key) => {
              let slotId = row[key+"slotid"]
              row[key] = <><span>{row[key]}</span> <span><Button renderIcon={Edit} iconDescription="Edit" kind="ghost" hasIconOnly onClick={() => {editSlot(slotId)}}></Button></span></>
            })
          })
        }
      })
      setFormattedRes(body)
      if(body.dates) {
        setDates(body.dates)
      }
      if(body.rowsByDate && body.rowsByDate[date]) {
        console.log("rows setting", body.rowsByDate[date])
        setRows(body.rowsByDate[date])
      }
      if(body.slots) {
        setSlots(body.slots)
      }
      if(body.headers) {
        setHeaders(body.headers)
      }
    }).catch((e) => {
      console.error(e)
      alert("error while fetching response")
    })
  }
  const onChangeDate = (dat) => {
    console.log("show", dat, formattedRes.rowsByDate[dat])
    setDate(dat)
    setRows(formattedRes.rowsByDate[dat])
  }
  useEffect(() => {
    updateTableForSlots()
  },[props])
  const batchActionClick = () => {}
  return (
    <div className="bx--grid">
        <div className="bx--row box">
          <div className="bx--col">
            <div className="bx--row">
            <div className="bx--col"><h3>Create Center/Slot/Vaccine</h3></div>
            </div>
            <div className="bx--row">
              <div className="bx--col">
              <Button onClick={openCenterModal}>Add center</Button>
              </div>
              <div className="bx--col"><Button onClick={openInventoryModal}>Create Vaccine</Button></div>
              <div className="bx--col"><Button onClick={openSlotModal}>Create Slot</Button></div>
            </div>
          </div>
        </div>
        <div className="bx--row box">
          <div className="bx--col">
            <div className="bx--row">
              <div className="bx--col"><h2>Schedule vaccination slot via automation and refresh</h2></div>
            </div>
            <div className="bx--row">
              <div className="bx--col"><Button onClick={startAutomation} disabled={automationInProgess}>Start Automation</Button></div>
              <div className="bx--col"><Button onClick={stopAutomation} disabled={!automationInProgess}>Stop Automation</Button></div>
              <div className="bx--col"><Button onClick={updateTableForSlots}>Refresh</Button></div>
            </div>
          </div>
        </div>
        <div className="bx--row box">
          <div className="bx--col"></div>
          <div className="bx--col">
            <Dropdown
              label={'Select Date'}
              titleText={'Date'}
              items={dates}
              onChange={(e) => onChangeDate(e.selectedItem)}
              selectedItem={date}
              initialSelectedItem={"empty"}
            />
          </div>
          <div className="bx--col"></div>
        </div>
        <DataTable rows={rows} headers={headers}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getToolbarProps,
            getBatchActionProps,
            onInputChange,
            selectedRows,
            getTableProps,
            getTableContainerProps,
          }) => (
            <TableContainer
              title="Slots Allocation Matrix"
              description="Stats for different center on specific date"
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent={true}
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
          <CreateCenterModel 
            open={centerModalOpen}
            center={undefined}
            onSubmit={updateCenter}
            user={auth.user}
            onClose={centerModalClose}
          ></CreateCenterModel>
           ,
           document.getElementById('app')
          )}
          {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
          <CreateInventoryModel 
            open={inventoryModalOpen}
            inventory={undefined}
            onSubmit={updateInventory}
            user={auth.user}
            onClose={inventoryModalClose}
          ></CreateInventoryModel>
           ,
           document.getElementById('app')
          )}
          {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
          <CreateSlotModel 
            open={slotModalOpen}
            slot={slotID ? slots.find((slot) => {return slotID === slot._id}): undefined}
            onSubmit={updateSlot}
            user={auth.user}
            onClose={slotModalClose}
          ></CreateSlotModel>
           ,
           document.getElementById('app')
          )}
    </div>
  );
};