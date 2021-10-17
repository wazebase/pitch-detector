import React from "react";

export default function TeacherNotes({teacherNotesArray}) {
    return(
        <div className='notes-display'>
            <div className='teacher-note-div'><p style={{marginLeft: 10}}>Teacher notes: </p></div>
            {teacherNotesArray.map(note => <div className='teacher-note-div'><p className='note'>{note}</p></div>)}
        </div>
    )
}
