import React, {useRef, useEffect} from "react";
import AudioReactRecorder from "audio-react-recorder";
import PitchDetector from "../components/PitchDetector";
import TeacherNotes from "../components/TeacherNotes";
import NotesDisplay from "../components/NotesDisplay";
import Result from "../components/Result";

export default function StudentPage(props) {
    const audioRef = useRef();

    const playAudio = () => {
        audioRef.current.play();
    }

    return(<div className='container'>
        <audio src={props.task.audioUrl} ref={audioRef}/>
        <TeacherNotes teacherNotesArray={props.task.notesArray}/>
        <NotesDisplay recordedNotesArray={props.recordedNotesArray}/>
        {!props.showResult ? (<AudioReactRecorder state={props.recordState} onStop={props.onStop}/>) : (<></>)}
        {props.showDetector ? (<PitchDetector volume={props.volume} recordedNotesArray={props.recordedNotesArray}
                                              setRecordedNotesArray={props.setRecordedNotesArray}/>) : (<></>)}
        {props.showResult && <Result accuracy={props.accuracy}/>}
        <div className='new-teacher-session'>
        <button className='session-button' onClick={() => props.startSession()}>PLay</button>
            {!props.showDetector ? (<button className='session-button' onClick={() => playAudio()}>Listen</button>) :
                (<button className='session-button' onClick={() =>props.endSession()}>Finish</button>)}
        </div>
    </div>);
}
