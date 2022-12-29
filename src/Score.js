import React from 'react'

function Score(props){
    
    return (
        <div className="score-board">
            <div className="current-score">{props.time}s</div>
            {props.newHighScore && <div className="new-high-score">You've gotten a new highScore {props.highScore}s</div>}
            <div className="high-score" onDoubleClick={props.resetHighscore}>{props.highScore}s</div>
        </div>
    )
}

export default Score;