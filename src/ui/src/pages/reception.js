import React, { useState } from 'react';

import {
  TextArea,
  Button,
} from 'carbon-components-react';

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

let audiochunk = []

export const Reception = () => {
  let [mediaRecorder, setMediaRecorder] = useState(null)
  let [convertedText, setConvertedText] = useState('')
  let [textToConvert, setTextToConvert] = useState('')
  let [recording, setRecording] = useState(false)
  let [audioUrl, setAudioUrl] = useState(null)

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
            return res.json()
        }).then((body) => {
            console.log(body)
            setConvertedText(body.results[0].alternatives[0].transcript)
            return body
        })
        console.log('File sent');
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

  let getAudio = () => {
    let option = {
      method: 'POST',
      body: JSON.stringify({
        text: textToConvert
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
        setAudioUrl(audioUrl3)
        return body
    })
  }
  

  return mediaRecorder ? (
    <div className="bx--grid bx--grid--full-width landing-page">
        <Button onClick={startRecording} disabled={recording}>Start Recording</Button>
        <Button onClick={stopRecording} disabled={!recording}>Stop Recording</Button>
        <div class="speech to test value">{convertedText}</div>
        <TextArea onChange={(e) => {setTextToConvert(e.target.value)}}></TextArea>
        <Button onClick={getAudio}>Get Audio</Button>
        <audio src={audioUrl} controls></audio>
    </div>
  ) : (
    <div className="bx--grid bx--grid--full-width landing-page">
        <Button onClick={getAccessToMedia} >Get Media Access</Button>
    </div>
  );
};