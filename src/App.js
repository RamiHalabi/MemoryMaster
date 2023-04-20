import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const title = "Memory Master";
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctSequence, setCorrectSequence] = useState([]);
  const [userGuesses, setUserGuesses] = useState([]);
  const [generatedColors, setGeneratedColors] = useState([]);
  const [level, setLevel] = useState(1);
  const [animation, setAnimation] = useState(false);
	
	
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(
    parseInt(localStorage.getItem('highestScore')) || 0
  );
	
	
  const colorPallette = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "white",
    "pink",
  ];
  const desc = [
    <div>A sequence of colors will be shown on your screen one at a time.</div>,
    <div>Your job is to correctly input the sequence of colors shown.</div>,
    <div>Each round will have an additional color to remember.</div>,
  ];

  const StartGame = () => {
    setPlaying(true);
    setTimeout(() => {
      const mainSquare = document.getElementById("main-square");
      mainSquare.style.backgroundColor = "#7ac74f";
      InitializeGame();
    }, 0);
  };

  const ShowStats = () => {
    console.log("start");
  };

  const RandomColor = () => {
    let isUnique = false;
    let randomColor =
      generatedColors[Math.floor(Math.random() * generatedColors.length)];

    // make sure random color does not match last color in correctSequence
    while (!isUnique) {
      randomColor =
        generatedColors[Math.floor(Math.random() * generatedColors.length)];
      isUnique = randomColor !== correctSequence[correctSequence.length - 1];
    }
    return randomColor;
  };

  const InitializeGame = () => {
    // create squares to start game
    for (let i = 0; i < colorPallette.length; i++) {
      const squares = document.getElementsByClassName("square-" + (i + 1)); // select divs on webpage

      // select colors and style until all squares are done
      for (let j = 0; j < squares.length; j++) {
        // select random color from colorPallette
        let background = Math.floor(Math.random() * colorPallette.length);
        while (generatedColors.includes(colorPallette[background])) {
          background = Math.floor(Math.random() * colorPallette.length);
        }

        // add randomized color to generatedColors
        generatedColors.push(colorPallette[background]);

        // style squares
        squares[j].style.backgroundColor = colorPallette[background];
        squares[j].style.width = "100px";
        squares[j].style.height = "100px";
        squares[j].style.margin = "10px";
        squares[j].style.borderRadius = "5px";
        squares[j].style.border = "2px solid black";
      }
    }
  };

  // user clicks start
  const RunGame = () => {
    // add initial color to begin animation
    if (correctSequence.length === 0) {
      setCorrectSequence([...correctSequence, RandomColor()]);
    }
  };

  // user clicks a color, add color to userGuesses
  const userGuess = (color) => {
    const guess = color.target.style.backgroundColor;
    if (!animation && userGuesses.length < correctSequence.length) {
      setUserGuesses([...userGuesses, guess]);
    }
  };

  const MapGuesses = () => {
    const colorDivs = userGuesses.map((color) => (
      <div
        classname="mini-square"
        style={{
          backgroundColor: color,
          width: "50px",
          height: "50px",
          margin: "1px 2px",
          borderRadius: "4px",
          border: "2px solid black",
        }}
      />
    ));
    return colorDivs;
  };

  // user makes it to next level, reset guesses and add new color
  const NextLevel = () => {
    setLevel(level + 1);
    setCorrectSequence([...correctSequence, RandomColor()]);
    setUserGuesses([]);
  };

  // game over, reset variables
  const ResetGame = () => {
    setCorrectSequence([]);
    setUserGuesses([]);
    setGeneratedColors([]);
    setGameOver(false);
    setPlaying(false);
    setLevel(1);
  };

  // actions that happen when user makes a guess
  useEffect(() => {
    console.log("correct:" + correctSequence);
    console.log("guesses:" + userGuesses);


    const mainSquare = document.getElementById("main-square");
    let tempSequence = correctSequence.slice(0, userGuesses.length);
    if (userGuesses.length > 0) {
      if (!(JSON.stringify(tempSequence) === JSON.stringify(userGuesses))) {
        // user clicks wrong color
        setGameOver(true);
      } else {
        if (JSON.stringify(correctSequence) === JSON.stringify(userGuesses)) {
          // user has guessed all answers correctly
          mainSquare.style.backgroundColor = "none";
          mainSquare.style.border = "none";
          mainSquare.style.fontSize = "2em";
          mainSquare.innerHTML = "NEXT LEVEL";
          setTimeout(() => {
            mainSquare.style.border = "5px solid black";
		  
		  
		  
	     setLevel(level + 1);
          setCorrectSequence([...correctSequence, RandomColor()]);
          setUserGuesses([]);
          setScore(level + 1);
		  
		  
		  
		  
            //NextLevel();
          }, 1000);
        }
      }
    }
  }, [userGuesses]);

  // actions that happen when correctSequence is updated (next level)
  useEffect(() => {
    const mainSquare = document.getElementById("main-square");
    const squares = document.querySelector(".square-container");
    if (mainSquare) {
      mainSquare.innerHTML = "";
      squares.style.opacity = "0.25";
      // loop background color over correctSequence
      for (let i = 0; i <= correctSequence.length; i++) {
        setAnimation(true);
        setTimeout(() => {
          mainSquare.style.backgroundColor = correctSequence[i];
        }, i * 1000); // Change the color every 1 second
      }

      // Set the final background color after the sequence is completed
      setTimeout(() => {
        squares.style.opacity = "1";
        setAnimation(false);
        mainSquare.style.backgroundColor = "#282b28";
        mainSquare.style.fontSize = "1.5em";
        mainSquare.innerHTML = "Input Sequence";
      }, (correctSequence.length + 0.25) * 1000);
    }
  }, [correctSequence]);






  useEffect(() => {
  if (score > highestScore) {
    setHighestScore(score);
    localStorage.setItem('highestScore', score);
  }
}, [score]);







  return (
    <div className="App">
      <div className="App-Container">
        {!playing ? (
          <>
            {" "}
            <div>
              <div className="title">{title}</div>
              <div className="game-description">{desc}</div>
            </div>
            <div className="buttons">
              <button className="PlayButton" onClick={StartGame}>
                Play Game
              </button>
              <button className="StatsButton" onClick={ShowStats}>
                Player Stats.
              </button>
            </div>
          </>
        ) : !gameOver ? (
          <>
            {" "}
            <div className="level">Level {level}</div>
            <div className="square" id="main-square" onClick={RunGame}>
              START
            </div>
            <div className="guess-container">{MapGuesses()}</div>
            <div className="square-container">
              <div
                className="square-1"
                onClick={(e) => {
                  userGuess(e);
                }}
              />
              <div
                className="square-2"
                onClick={(e) => {
                  userGuess(e);
                }}
              />
              <div
                className="square-3"
                onClick={(e) => {
                  userGuess(e);
                }}
              />
              <div
                className="square-4"
                onClick={(e) => {
                  userGuess(e);
                }}
              />
              <div
                className="square-5"
                onClick={(e) => {
                  userGuess(e);
                }}
              />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="gameOver-container">
              <div className="gameOver">GAME OVER</div>
              <div className="gameStats">You made it to level {level}!</div>
              <button className="StatsButton" onClick={ResetGame}>
                Home Page
              </button>
            </div>
          </>
        )}
      </div>



	 <div className="scoreboard">
        Score: {score} | Highest Score: {highestScore}



    </div>
  </div>
  );
}

export default App;
