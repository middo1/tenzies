import './App.css';

import React from "react"
import Die from "./Die"
import Score from './Score';
import {nanoid} from "nanoid"
import Confetti from "react-confetti"


function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [highScore, setHighScore] = React.useState(0)
    const [isActive, setIsActive] = React.useState(true)
    const [isPaused, setIsPaused] = React.useState(false)
    const [newHighScore, setNewHighScore] = React.useState(false)

    const [time, setTime] = React.useState(0)
    
    
    React.useEffect(() => {
        if (localStorage.getItem("highScore")) {
            setHighScore(localStorage.getItem("highScore"))
        }
        console.log(localStorage.getItem("highScore"))
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setIsActive(false)
            handleHighscore()
        }
    }, [dice])
    
    React.useEffect(() => {
        let interval = null;
        if (localStorage.getItem("highScore")) {
            setHighScore(localStorage.getItem("highScore"))
        }
        if (isActive && isPaused === false) {
          interval = setInterval(() => {
            setTime((time) => time + 1);
          }, 1000);
        } else {
          clearInterval(interval);
        }
        return () => {
          clearInterval(interval);
        };
      }, [isActive, isPaused]);
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setTime(0)
            setIsActive(true)
            setDice(allNewDice())
            setNewHighScore(false)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function handleHighscore() {
        setNewHighScore(false)
        if (localStorage.getItem("highScore")) {
            setHighScore(localStorage.getItem("highScore"))
        }
        if (highScore === 0) {
            setHighScore(time)
            localStorage.setItem("highScore", time)
            setNewHighScore(true)
        } else {
            if(highScore > time) {
                setHighScore(time)
                localStorage.setItem("highScore", time)
                setNewHighScore(true)
            }
        }
    }

    function resetHighscore(){
        setHighScore(0)
        localStorage.removeItem("highScore")
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            <Score time={time} highScore={highScore} newHighScore={newHighScore} resetHighscore={resetHighscore}/>
            <hr />
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}

export default App;
