import React, { Component } from 'react';
import './App.css';   
import eatAudio from './assets/sounds/Beep8.wav';
import bolehJugaLu from './assets/sounds/boleh-juga-lu.wav';
import begoLu from './assets/sounds/bego-lu.wav';
import moveSound from './assets/sounds/move.wav';
import rightArrow from './assets/icons/right-arrow.png';
import leftArrow from './assets/icons/left-arrow.png';
import githubIco from './assets/icons/github.png';
import reactIco from './assets/icons/reactjs.png';

const eat = new Audio(eatAudio);
const goodCompliment = new Audio(bolehJugaLu);
const badCompliment = new Audio(begoLu);
const move = new Audio(moveSound);

move.volume = 0.2;
goodCompliment.volume = 0.2;
badCompliment.volume = 0.2;
move.volume = 0.2;

badCompliment.onended = function(){
  badCompliment.pause();
}

goodCompliment.addEventListener('ended', function(){
  goodCompliment.pause();
});

move.addEventListener('ended', function(){
  move.pause();
});

eat.addEventListener('ended', function(){
  eat.pause();
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      directions: "right",
      boards: {
        width: 21,
        height: 20
      },
      score: 0,
      compliment: "",
      appBoards: [],
      snakeBody: [],
      isPause: false,
      stackMove: ["right"],
      needFood: true,
      foodPos: {
        x: 0,
        y: 0
      },
      isDead: false,
      obstacles: [
        [
          {
            x: 1,
            y: 2
          },
          {
            x: 1,
            y: 1
          },
          {
            x: 2,
            y: 1
          },
          {
            x: 3,
            y: 1
          }
        ],
        [
          {
            x: 17,
            y: 1
          },
          {
            x: 18,
            y: 1
          },
          {
            x: 19,
            y: 1
          },
          {
            x: 19,
            y: 2
          }
        ],
        [
          {
            x: 1,
            y: 17
          },
          {
            x: 1,
            y: 18
          },
          {
            x: 2,
            y: 18
          },
          {
            x: 3,
            y: 18
          }
        ],
        [
          {
            x: 19,
            y: 17
          },
          {
            x: 19,
            y: 18
          },
          {
            x: 18,
            y: 18
          },
          {
            x: 17,
            y: 18
          }
        ],
        [
          {
            x: 9,
            y: 11
          },
          {
            x: 10,
            y: 11
          },
          {
            x: 11,
            y: 11
          },
          {
            x: 12,
            y: 11
          }
        ],
        [
          {
            x: 9,
            y: 7
          },
          {
            x: 10,
            y: 7
          },
          {
            x: 11,
            y: 7
          },
          {
            x: 12,
            y: 7
          }
        ]
      ]
    }    
    this.moveDown = this.moveDown.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.resumeGame = this.resumeGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  componentDidMount(){
    this.initBoard()
    .then(() => {
      console.log("finish init board");
      this.initSnake()
      .then(() => {        
        console.log("finish init snake");
        this.initObstacles(() => {
          setInterval(() => {
            this.initFood(() => {
              this.game()
            })          
          } , 150)
        });        
      })
    })
  }

  pauseGame(){
    move.play()
    .then()
    .catch(err => console.log(err))
    this.setState({
      isPause: true
    })        
  }

  resumeGame(){
    move.play()
    .then()
    .catch(err => console.log(err))
    this.setState({
      isPause: false
    })        
  }

  restartGame(){
    let boards = this.state.appBoards;
    let foodPos = this.state.foodPos;
    let snakeBody = this.state.snakeBody;

    boards[foodPos.y][foodPos.x] = `<div class="board__cell empty-cell" x="${foodPos.x}" y="${foodPos.y}"></div>`;
    snakeBody.forEach(body => {
      boards[body.y][body.x] = `<div class="board__cell empty-cell" x="${body.x}" y="${body.y}"></div>`;
    })

    move.play()
    .then()
    .catch(err => console.log(err))
    this.setState({      
      appBoards: boards,
      isDead: false,
      isPause: false,
      needFood: true,
      directions: "right",
      score: 0,
      compliment: ""
    },() => {
      this.setState({
        snakeBody: [
          {
            x: 3,
            y: 9
          },
          {
            x: 2,
            y: 9
          },
          {
            x: 1,
            y: 9
          }
        ]
      })
    }
    )
  }

  moveDown(){
    let stackMove = this.state.stackMove;
    if(this.state.directions !== "up" && this.state.directions !== "down"){
      move.play()
      .then()
      .catch(err => console.log(err))
      this.setState({
        directions: "down",
        stackMove: stackMove
      })
      stackMove.unshift("down");
    }    
  }  

  moveLeft(){
    let stackMove = this.state.stackMove;
    if(this.state.directions !== "right" && this.state.directions !== "left"){
      move.play()
      .then()
      .catch(err => console.log(err))
      stackMove.unshift("left");
      this.setState({
        directions: "left",
        stackMove: stackMove
      })
    } 
  }
  
  moveUp(){
    let stackMove = this.state.stackMove;
    if(this.state.directions !== "down" && this.state.directions !== "up"){
      move.play()
      .then()
      .catch(err => console.log(err))
      this.setState({
        directions: "up",
        stackMove: stackMove
      })
      stackMove.unshift("up");
    }
  }

  moveRight(){
    let stackMove = this.state.stackMove;
    if(this.state.directions !== "left" && this.state.directions !== "right"){
      move.play()
      .then()
      .catch(err => console.log(err))
      this.setState({
        directions: "right",
        stackMove: stackMove
      })
      stackMove.unshift("right");
    }    
  }

  initObstacles(callback){
    let obstacles = this.state.obstacles;
    let boards = this.state.appBoards;
    obstacles.forEach((obstacle, index) => {
      obstacle.forEach(obsIndex => {
        boards[obsIndex.y][obsIndex.x] = `<div class="board__cell obstacle"></div>`
      })
    })
    this.setState({
      appBoards: boards
    }, callback())
  }

  keyPressed(event){
    let keyCode = event.keyCode; 
    let stackMove = this.state.stackMove;
    // console.log(keyCode)   
    switch(keyCode){
      case 32: //pause key 'spacebar'
        this.setState({
          isPause: true
        })        
        break;
      case 71: //resume key 'g'
        this.setState({
          isPause: false
        })
        break;
      case 82: // restart game
        console.log("restarting");
        break;
      case 37: //left
        if(this.state.directions !== "right" && this.state.directions !== "left"){
          move.play()
          .then()
          .catch(err => console.log(err))
          stackMove.unshift("left");
          this.setState({
            directions: "left",
            stackMove: stackMove
          })
        }
        break;
      case 38: //up
        if(this.state.directions !== "down" && this.state.directions !== "up"){
          move.play()
          .then()
          .catch(err => console.log(err))
          this.setState({
            directions: "up",
            stackMove: stackMove
          })
          stackMove.unshift("up");
        }
        break;
      case 39: //right
        if(this.state.directions !== "left" && this.state.directions !== "right"){
          move.play()
          .then()
          .catch(err => console.log(err))
          this.setState({
            directions: "right",
            stackMove: stackMove
          })
          stackMove.unshift("right");
        }
        break;
      case 40: //down
        if(this.state.directions !== "up" && this.state.directions !== "down"){
          move.play()
          .then()
          .catch(err => console.log(err))
          this.setState({
            directions: "down",
            stackMove: stackMove
          })
          stackMove.unshift("down");
        }
        break;
      default:      
    }    
  }
  game(){
    // move the snake        
    document.addEventListener('keydown', event => {
      this.keyPressed(event);
    })
    let stackMove = this.state.stackMove;
    let directions = this.state.directions;    
    if(stackMove.length !== 0){
      directions = stackMove.pop();
    }
    let boards = this.state.appBoards;
    let bodies = this.state.snakeBody;
    let headX = bodies[0].x;
    let headY = bodies[0].y;    
    let isDead = this.state.isDead;    
    if(!this.state.isPause && !isDead){
      let tail = bodies.pop();
      // console.log(headY, headX)
      if(headX === this.state.foodPos.x && headY === this.state.foodPos.y){        
        // console.log("termakan")                
        eat.play()
        .then((res) =>{
          console.log(res)          
        })
        .catch(err => {
          console.log(err)
        });
        if((this.state.score + 1) % 10 === 0){ 
          goodCompliment.play()
          .then(() =>{

          })
          .catch(err => {
            console.log(err)
          })         
          this.setState({
            compliment: `<div class="compliment__good"><p>Boleh</p><p>juga</p><p>lu.</p></div>`
          })
        }
        this.setState({
          needFood: true,
          score: this.state.score + 1
        })
        bodies.push(tail);
      }     
      let newHead; 
      switch(directions){
        case "right":         
          if(headX + 1 < this.state.boards.width){
            newHead = {
              x: headX + 1,
              y: headY
            };
          }
          else{
            newHead = {
              x: 0,
              y: headY
            };
          }          
          break;
        case "down": 
          if(headY + 1 < this.state.boards.height){
            newHead = {
              x: headX,
              y: headY + 1
            };
          }
          else{
            newHead = {
              x: headX,
              y: 0
            };
          }          
          break;
        case "left": 
          if(headX> 0){
            newHead = {
              x: headX - 1,
              y: headY
            };
          }
          else{
            newHead = {
              x: this.state.boards.width - 1,
              y: headY
            };
          }          
          break;
        case "up":
          if(headY > 0){
            newHead = {
              x: headX,
              y: headY - 1
            };
          }
          else{
            newHead = {
              x: headX,
              y: this.state.boards.height - 1
            };
          }          
          break;      
        default:
          console.log("nothing")            
      }      
      if(boards[newHead.y][newHead.x] === `<div class="board__cell snake__body"></div>` || boards[newHead.y][newHead.x] === `<div class="board__cell obstacle"></div>`){ //new head causing dead
        console.log("mati");
        isDead = true
        this.setState({
          isPause: true,
          isDead: true,
          compliment: `<div class="compliment__bad"><p>Bego</p><p>lu!!!</p></div>`
        })
        bodies.push(tail)
        console.log(tail)
        badCompliment.play()
        .then(() => {
          
        })
        .catch(err => console.log(err))
      }
      else{
        bodies.unshift(newHead);
        bodies.forEach((body, index) => {
          if(index === 0){
            boards[body.y][body.x] = `<div class="board__cell snake__body head"></div>`; // redraw head
          }
          else if(index === bodies.length - 1){
            boards[body.y][body.x] = `<div class="board__cell snake__body tail"></div>`; // redraw tail
          }
          else{
            boards[body.y][body.x] = `<div class="board__cell snake__body"></div>`; // redraw body
          }
        })
      }
      
      // boards[bodies[0].y][bodies[0].x] = `<div class="board__cell snake__body head"></div>`; // redraw head      
      if(!isDead){
        boards[tail.y][tail.x] = `<div class="board__cell empty-cell" x="${tail.x}" y="${tail.y}"></div>`;            
      }      
      this.setState({
        snakeBody: bodies,
        appBoards: boards,
        stackMove: stackMove
      })
    }
  }

  initFood(callback){
    if(this.state.needFood){
      console.log("generate food")
      let boards = this.state.appBoards;      
      let emptyCells = document.getElementsByClassName("empty-cell");
      let foodIndex = Math.round(Math.random() * emptyCells.length);
      let foodX = parseInt(emptyCells[foodIndex].getAttribute("x"), 10);
      let foodY = parseInt(emptyCells[foodIndex].getAttribute("y"), 10);
      console.log(foodX, foodY)
      boards[foodY][foodX] = `<div class="board__cell board__food"></div>`;
      this.setState({
        appBoards: boards,
        needFood: false,
        foodPos: {
          x: foodX,
          y: foodY
        }
      }, callback())
    }
    else callback()
  }

  initSnake(){
    return new Promise((resolve, reject) => {
      let headX = 3;
      let headY = 9;
      let length = this.state.score + 3;
      let boards = this.state.appBoards;
      let snakeBody = [];
      for(let i = 0; i < length; i++){
        boards[headY][headX - i] = `<div class="board__cell snake__body"></div>`;
        snakeBody.push({
          x: headX - i,
          y: headY
        })
      }
      this.setState({
        appBoards: boards,
        snakeBody: snakeBody
      }, resolve())
    })
  }

  initBoard(){    
    return new Promise((resolve, reject) => {
      let boards = [];
      for(let height = 0; height < this.state.boards.height; height++){
        let row = [];
        for(let width = 0; width < this.state.boards.width; width++){
          row.push(`<div class="board__cell empty-cell" x="${width}" y="${height}"></div>`);
        }
        boards.push(row);        
      }
      this.setState({
        appBoards: boards
      }, resolve())
    })
  }

  render() {
    let stringRow = [];
    this.state.appBoards.forEach((board, index) => {          
      stringRow.push(board.join(""));
    })
    return (
      <div className={`app__wrapper ${this.state.isDead ? "dead-game" : ""}`}>        
        <section className="title__wrapper">
          <h1 className="app__title">GIMBOT</h1>
        </section>
        <div className="app__screen-wrapper">          
          <div className="board__wrapper" dangerouslySetInnerHTML={{__html: stringRow.join("")}}></div>           
          <div className="sidebar-notification__wrapper">
            <div className="notification__score-wrapper">
              <p>SCORE</p>
              <p>{this.state.score}</p>
            </div>
            <div className="notification__compliment-wrapper" dangerouslySetInnerHTML={{__html: this.state.compliment}}></div>
            <div className="notification__credit">
              <p className="craft">Crafted By</p>
              <p className="craft-author"><a href="https://twitter.com/Budisuryadarma" target="_blank">imdbsd</a></p>
            </div>
          </div>          
        </div>
        <section className="app__controller-wrapper">
          <div className="controller__direction-wrapper">
            <div className="controller__vertical">
              <div className="vertical__1" onClick={this.moveUp}>
                <img src={leftArrow} alt="up arrow"/>
              </div>
              <div className="vertical__2" onClick={this.moveDown}>
                <img src={rightArrow} alt="down arrow"/>
              </div>
            </div>
            <div className="controller__horizontal">
            <div className="horizontal__1" onClick={this.moveLeft}>
                <img src={leftArrow} alt="left arrow"/>
              </div>
              <div className="horizontal__2" onClick={this.moveRight}>
                <img src={rightArrow} alt="right arrow"/>
              </div>
            </div>            
          </div>
          <div className="controller__state-wrapper">
            <div className="controller__btn restart" onClick={this.restartGame}>
              <span className="controller-btn__wording">RESTART</span>
            </div>
            <div className="controller__btn resume" onClick={this.resumeGame}>
              <span className="controller-btn__wording">RESUME</span>
            </div>
            <div className="controller__btn pause" onClick={this.pauseGame}>
              <span className="controller-btn__wording">PAUSE</span>
            </div>
          </div>
        </section>
        <p className="contribute-promo"> 
        <img src={githubIco} alt="github icon"/>
        <a href="https://github.com/imdbsd/gimbot-snake" target="_blank">gimbot-snake</a>
        <img src={reactIco} alt="react js icon"/>
        <a href="https://reactjs.org/" target="_blank">reactjs</a>
        </p>      
      </div>
    );
  }
}

export default App;
