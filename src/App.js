import React, { Component } from 'react';
import './App.css';   
import eatAudio from './assets/sounds/Beep8.wav';
import bolehJugaLu from './assets/sounds/boleh-juga-lu.wav';
import begoLu from './assets/sounds/bego-lu.wav';
import moveSound from './assets/sounds/move.wav';

const eat = new Audio(eatAudio);
const goodCompliment = new Audio(bolehJugaLu);
const badComploment = new Audio(begoLu);
const move = new Audio(moveSound);

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
    if(!this.state.isPause && !this.state.isDead){
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
      switch(directions){
        case "right":         
          if(headX + 1 < this.state.boards.width){
            bodies.unshift({
              x: headX + 1,
              y: headY
            })
          }
          else{
            bodies.unshift({
              x: 0,
              y: headY
            })
          }          
          break;
        case "down": 
          if(headY + 1 < this.state.boards.height){
            bodies.unshift({
              x: headX,
              y: headY + 1
            })
          }
          else{
            bodies.unshift({
              x: headX,
              y: 0
            })
          }          
          break;
        case "left": 
          if(headX> 0){
            bodies.unshift({
              x: headX - 1,
              y: headY
            })
          }
          else{
            bodies.unshift({
              x: this.state.boards.width - 1,
              y: headY
            })
          }          
          break;
        case "up":
          if(headY > 0){
            bodies.unshift({
              x: headX,
              y: headY - 1
            })
          }
          else{
            bodies.unshift({
              x: headX,
              y: this.state.boards.height - 1
            })
          }          
          break;      
        default:
          console.log("nothing")            
      }     

      bodies.forEach((body, index) => {
        if(index === 0){          
          if(boards[body.y][body.x] === `<div class="board__cell snake__body"></div>` || boards[body.y][body.x] === `<div class="board__cell obstacle"></div>`){
            console.log("mati");
            isDead = true
            this.setState({
              isPause: true,
              isDead: true,
              compliment: `<div class="compliment__bad"><p>Bego</p><p>lu!!!</p></div>`
            })
            badComploment.play()
            .then(() => {
              
            })
            .catch(err => console.log(err))
          }
          else{
            boards[body.y][body.x] = `<div class="board__cell snake__body head"></div>`; // redraw head
          }          
        }
        else if(index === bodies.length - 1){
          boards[body.y][body.x] = `<div class="board__cell snake__body tail"></div>`; // redraw tail
        }
        else{
          boards[body.y][body.x] = `<div class="board__cell snake__body"></div>`; // redraw body
        }
      })
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
          </div>
          {/* <div className="app__notification-wrapper">
            <div className="notification__score-wrapper">
              <span>Score: </span>
              <span>{this.state.score}</span>
            </div>
            <div className="notification__compliment-wrapper" dangerouslySetInnerHTML={{__html: this.state.compliment}}>              
            </div>
          </div>           */}
        </div>
        <section className="app__controller-wrapper">
          <div className="controller__direction-wrapper">

          </div>
        </section>
      </div>
    );
  }
}

export default App;
