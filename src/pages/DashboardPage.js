import React, {useEffect} from "react";
import DashboardItem from "../components/DashboardItem";

export default function DashboardPage({setTaskIndex, recordStore, setRecordedNotesArray, openStudentPage, openTeachersPage}) {

    const openSelectedTask = (i) => {
        setRecordedNotesArray([]);
        setTaskIndex(i);
        openStudentPage();
    }

    const handleTeacher = () => {
        setRecordedNotesArray([]);
        openTeachersPage();
    }
    return(<div className='dash container'>
        <h2 style={{alignSelf: 'center', justifySelf: 'center'}}>Exercises</h2>
        <div className='items-container'>
        {recordStore.map((data, i) => <DashboardItem openSelectedTask={openSelectedTask} index={i} data={data}/>)}
        </div>
        <button className='new-teacher-session' onClick={handleTeacher}>Start new teacher session</button>
    </div>);
}
