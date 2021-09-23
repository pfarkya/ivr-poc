import React, { useEffect, useState } from 'react';

import {
  TextArea,
  Button,
  Dropdown,
  DataTable,
  TableExpandRow,
  TableExpandedRow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableExpandHeader
} from 'carbon-components-react';

let audiochunk = []

export const Reception = (props) => {
  let [date, setDate] = useState("")
  let [dates, setDates] = useState([])
  let [center, setCenter] = useState("")
  let [centerList, setCenterList] =useState([])
  let [queueRows, setQueueRows] = useState([])
  let [headers, setHeaders] = useState([])
  let [scheduleRows, setScheduleRows ] = useState([])
  let [mediaRecorder, setMediaRecorder] = useState(null)
  let [recording, setRecording] = useState(false)

  let markedAsQueue = (interestId) => {
    let option = {
      method: 'PUT',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        interestId: interestId
      }),
      json:true
    }
    fetch('/api/markedinqueue', option).then((res) => {
        if(!res.ok) {
          throw new Error("failed with error")
        }
        return res.json()
    }).then((body) => {
        fetchReceptionList()
        return body
    }).catch((e) => {
      console.error(e)
    })
  }
  let markedAsDone = (interestId) => {
    let option = {
      method: 'PUT',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        interestId: interestId
      }),
      json:true
    }
    fetch('/api/markedinqueuedone', option).then((res) => {
        if(!res.ok) {
          throw new Error("failed with error")
        }
        return res.json()
    }).then((body) => {
        fetchReceptionList()
        return body
    }).catch((e) => {
      console.error(e)
    })
  }
  let getAccessToMedia = () => {

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorderI = new MediaRecorder(stream, {'mimeType':'audio/webm'});
      console.log(mediaRecorderI)
      mediaRecorderI.ondataavailable = function(e) {
        audiochunk.push(e.data);
      }
      mediaRecorderI.onstop = function(e) {
        const blob = new Blob(audiochunk, {'type':'audio/webm'});
        var data = new FormData();
        // var request = new XMLHttpRequest();
        data.append('file',blob,'audio.webm');
        audiochunk = []
        // request.open('post','/api/stt'); 
        // request.send(data);
        let option = {
          method: 'POST',
          body: data
        }
  
        fetch('/api/stt', option).then((res) => {
            if(!res.ok) {
              throw new Error("failed")
            }
            return res.json()
        }).then((body) => {
            console.log(body)
            let makeToQueque = scheduleRows.find((row)=> {return row.name.indexOf(body.results[0].alternatives[0].transcript) > -1})
            if(makeToQueque) {
              markedAsQueue(makeToQueque._id)
            }
            return body
        }).catch((e) => {
          console.error(e)
        })
      }
      setMediaRecorder(mediaRecorderI)
    }, () => {
        console.log("errored getting audio stream")
    })
  }
  let startRecording = () => {
    mediaRecorder.start();
    setRecording(true)
  }
  let stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false)
  }

  let getAudio = (text) => {
    let option = {
      method: 'POST',
      body: JSON.stringify({
        text: text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch('/api/tts', option).then((res) => {
        return res.json()
    }).then((body) => {
        console.log(body)
        const audioBlob3 = new Blob([new Uint8Array(body.audio.data)],{type: 'audio/wav'});
        const audioUrl3 = URL.createObjectURL(audioBlob3);
        let audioObj = new Audio(audioUrl3);
        audioObj.play()
        return body
    })
  }
  
  const fetchReceptionList = () => {
    var url = '/api/fetchreceptionlist?'
    var params = {
      date: date,
      centerId: center._id
    }
    url = url + (new URLSearchParams(params).toString());
    fetch(url).then((res) => {
      if(!res.ok) {
        throw new Error("Failed to retrieve")
      }
      return res.json()
    }).then((body) => {
      console.log(body)
      if (body) {
        setQueueRows(body.queueRows)
        setScheduleRows(body.scheduleRows)
        setHeaders(body.headers)
      }
    }).catch((e) => {
      console.error(e)
    })
  }
  const getCenters = () => {
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
  const getDates = () => {
    fetch('/api/listofdates').then((res) => {
      if(!res.ok) {
        throw new Error("Failed to retrieve")
      }
      return res.json()
    }).then((body) => {
      console.log(body)
      if (body) {
        setDates(body)
      }
    }).catch((e) => {
      console.error(e)
    })
  }
  const getText = (row) => {
    console.log(row, queueRows)
    let person = queueRows.find((queue) => queue.id === row.id)
    let text = "Hi " +person.name+ " your number has come please come to reception."
    return text
  }
  const askToCome = (row) => {
    let text = getText(row)
    getAudio(text)
  }

  const doneWithInterest = (row) => {
    markedAsDone(row.id)
  }

  useEffect(() => {
    getCenters()
    getDates()
  }, [props])
  return mediaRecorder ? (
    <div className="bx--grid">
        <div className="bx--row box">
          <div className="bx--col">
            <div className="bx--row">
              <div className="bx--col"><h2>Select center and date</h2></div>
            </div>
            <div className="bx--row">
              <div className="bx--col">
                <Dropdown
                  disabled={props.slot? true: false}
                  label={'Select Center'}
                  titleText={'Center'}
                  items={centerList}
                  itemToString={(item) => (item ? item.name : '')}
                  onChange={(e) => setCenter(e.selectedItem)}
                  selectedItem={center}
                />
              </div>
              <div className="bx--col">
                <Dropdown
                  label={'Select Date'}
                  titleText={'Date'}
                  disabled={props.slot? true: false}
                  items={dates}
                  onChange={(e) => {setDate(e.selectedItem)}}
                  selectedItem={date}
                />
              </div>
            </div>
            <div className="bx--row gaprow"></div>
            <div className="bx--row">
              <div className="bx--col"><Button onClick={fetchReceptionList}>Fetch List</Button></div>
            </div>
          </div>
        </div>
        <div className="bx--row box">
          <div className="bx--col">
            <div className="bx--row">
              <div className="bx--col"><h2>Device control</h2></div>
            </div>
            <div className="bx--row gaprow"></div>
            <div className="bx--row">
              <div className="bx--col"><Button onClick={startRecording} disabled={recording}>Start Recording</Button></div>
              <div className="bx--col"><Button onClick={stopRecording} disabled={!recording}>Stop Recording</Button></div>
            </div>
          </div>
        </div>
        <DataTable rows={queueRows} headers={headers}>
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
              title="In Queue Table"
              description="persons who already come to the center"
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
                      <TableCell key={i+"ask"} className="bx--table-column-menu">
                        <Button onClick={() => { askToCome(row)}}>
                          Ask
                        </Button>
                      </TableCell>
                      <TableCell key={i+"done"} className="bx--table-column-menu">
                        <Button onClick={() => { doneWithInterest(row)}}>
                          Done
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <DataTable rows={scheduleRows} headers={headers}>
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
              title="Scheduled person table"
              description="persons who are scheduled for this center"
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
                  <TableExpandHeader />
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        <TableCell key={i+"ask"} className="bx--table-column-menu">
                          <Button onClick={() => { markedAsQueue(row.id)}}>
                            Make to Queue
                          </Button>
                        </TableCell>
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}
                        className="demo-expanded-td">
                        <div>{JSON.stringify(scheduleRows.find((x) => {
                          return x.id === row.id
                        }))}</div>
                      </TableExpandedRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
    </div>
  ) : (
    <div className="bx--grid bx--grid--full-width landing-page">
        <Button onClick={getAccessToMedia} >Get Media Access</Button>
    </div>
  );
};