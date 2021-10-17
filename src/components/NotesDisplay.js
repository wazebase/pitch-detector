import React from "react";

export default function NotesDisplay({recordedNotesArray}) {

    return(
        <div className='notes-display'>
            <div className='teacher-note-div'><p style={{marginLeft: 10}}>Notes played: </p></div>
            {recordedNotesArray.map(note => <div className='teacher-note-div'><p className='note'>{note}</p></div>)}
        </div>
    )
}
