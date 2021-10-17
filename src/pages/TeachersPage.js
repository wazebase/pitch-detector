import AudioReactRecorder from "audio-react-recorder";
import PitchDetector from "../components/PitchDetector";
import React from "react";
import NotesDisplay from "../components/NotesDisplay";

export default function TeachersPage(props) {
    const addTaskType = (value) => {
        props.taskInformation.type = value
    }

    const addTaskName = (value) => {
        props.taskInformation.name = value;
    }
    return (
        <div className="container">
            <NotesDisplay recordedNotesArray={props.recordedNotesArray}/>
            <AudioReactRecorder state={props.recordState} onStop={props.onStop}/>
            {props.showDetector ? (<PitchDetector volume={props.volume} recordedNotesArray={props.recordedNotesArray}
                                                  setRecordedNotesArray={props.setRecordedNotesArray}/>) : (<></>)}
            <div className='inputs'>
                <input placeholder='Task Name' onChange={(e) => addTaskName(e.target.value)}/>
                <input placeholder='Type' onChange={(e) => addTaskType(e.target.value)}/>
            </div>
            <div className='new-teacher-session'>
            <button className='session-button' onClick={() => props.startSession()}>Start session</button>
            <button className='session-button' onClick={() => props.endSession()}>End session</button>
            </div>
        </div>
    );

}
