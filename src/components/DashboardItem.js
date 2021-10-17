import React from "react";

export default function DashboardItem({data, openSelectedTask, index}) {
    return (
        <div onClick={() => openSelectedTask(index)} className='dashitem'>
            <div className='dash-title'>{data.title}</div>
            <div className='dash-type'>Type: {data.type}</div>
        </div>
    )
}
