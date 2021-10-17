import React from "react";

export default function Result({accuracy}) {
    return (
        <div className='results-container'>
            <h2>You are finished! Good job!</h2>
            <p>Accuracy: {accuracy}%</p>
            {accuracy > 75 && <p>You are close to masters!</p>}
            {(accuracy < 75 && accuracy > 50) && <p>That's close enough</p>}
            {accuracy < 50 && <p>You've missed a few notes, better try again, buddy</p>}
        </div>
    )
}
