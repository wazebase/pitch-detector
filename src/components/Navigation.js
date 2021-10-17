import React from "react";

export default function Navigation({openDashboardPage, openStudentPage, openTeachersPage}) {


    return(<div>
        <nav>
            <li onClick={openDashboardPage}>Dashboard</li>
        </nav>
        </div>);
}
