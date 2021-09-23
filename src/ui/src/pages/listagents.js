import React, {useState} from 'react';
import { UpdateAgentModal } from '../components/modals';
import ReactDOM from 'react-dom'
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
  Button
} from 'carbon-components-react';
import {
  Delete16 as Delete,
  Save16 as Save,
  Download16 as Download,
} from '@carbon/icons-react';
import { useAuth } from '../useauth'

export const ListAgents = () => {
  let [ listOfAgent, setListOfAgent ] = useState([])
  let [ isFirstTimeLoad, setIsFirstTimeLoad ] = useState(true)
  let [ modalOpen, setModalOpen ] = useState(false)
  let [ agentToUpdate , setAgentToUpdate] = useState(null)
  let auth = useAuth()
  const updateList = () => {
    fetch('/api/listagent').then((res) => {
      return res.json()
    }).then((body) => {
      console.log(body)
      setListOfAgent(body.map((each) => { each.id = each._id; return each}))
    })
  } 
  const updateAgent = (agent) => {
    console.log(agent)
    let option = {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(agent),
        json: true
    }
    fetch('/api/updateagent', option).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }).then((body) => {
      console.log(body)
      updateList()
      alert("successfully updated")
    }).catch((e) => {
      alert("failed to update")
    })
    setModalOpen(false)
    setAgentToUpdate(null)
  }
  const deleteAgent = (row) => {
    if (row) {
      let option = {
          method: 'DELETE',
          headers: {
              "Content-Type": 'application/json'
          },
          json: true
      }
      fetch('/api/deleteagent/'+row.id, option).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
      }).then((body) => {
        console.log(body)
        updateList()
        alert("successfully updated")
      }).catch((e) => {
        alert("failed to update")
      })
    }
  }
  const closeModal = () => {
    setModalOpen(false)
    setAgentToUpdate(null)
  }
  const openModal = (agent) => {
    console.log(agent)
    if (agent) {
      let getAgents = listOfAgent.filter((each) => {
        return agent.id === each.id
      })
      console.log(getAgents[0])
      setAgentToUpdate(getAgents[0])
    }
    setModalOpen(true)
  }
  if(isFirstTimeLoad) {
    updateList()
    setIsFirstTimeLoad(false)
  }
  const batchActionClick = (selectedRows) => {}
  
  const headers = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'username',
      header: 'Username',
    },
    {
      key: 'password',
      header: 'Password',
    },
    {
      key: 'role',
      header: 'Role',
    },
  ];
  return (
    <div className="bx--grid">
        <DataTable rows={listOfAgent} headers={headers}>
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
              title="Agents"
              description="List of all agents and admin"
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent={true}
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />
                  <Button
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onClick={() => {openModal()}}
                    size="small"
                    kind="primary">
                    Create Agent
                  </Button>
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
                      <TableCell className="bx--table-column-menu">
                        <Button onClick={() => { openModal(row)}}>
                          Update Agent
                        </Button>
                      </TableCell>
                      <TableCell className="bx--table-column-menu">
                        <Button onClick={() => { deleteAgent(row)}}>
                          Delete Agent
                        </Button>
                      </TableCell>
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
          <UpdateAgentModal 
            open={modalOpen}
            agent={agentToUpdate}
            onSubmit={updateAgent}
            user={auth.user}
            onClose={closeModal}
          ></UpdateAgentModal>
           ,
           document.getElementById('app')
          )}
        
    </div>
  );
};