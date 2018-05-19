import React, { Component } from 'react';
import './App.css';   
import eatAudio from './Beep8.wav';
const eat = new Audio(eatAudio);
console.log(eat)
class App extends Component {
  constructor(){
    super();
    this.state = {
      directions: "right",
      boards: {
        width: 26,
        height: 30
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
      isDead: false
    }    
  }

  componentDidMount(){
    this.initBoard()
    .then(() => {
      console.log("finish init board");
      this.initSnake()
      .then(() => {        
        console.log("finish init snake");
        setInterval(() => {
          this.initFood(() => {
            this.game()
          })          
        } , 100)
      })
    })
  }
  changeDirection(event){
    let keyCode = event.keyCode; 
    let stackMove = this.state.stackMove;
    // console.log(keyCode)   
    switch(keyCode){
      case 80:
        if(this.state.isPause){
          this.setState({
            isPause: false
          })
        }
        else{
          this.setState({
            isPause: true
          })
        }
        break;
      case 37: //left
        if(this.state.directions !== "right" && this.state.directions !== "left"){
          stackMove.unshift("left");
          this.setState({
            directions: "left",
            stackMove: stackMove
          })
        }
        break;
      case 38: //up
        if(this.state.directions !== "down" && this.state.directions !== "up"){
          this.setState({
            directions: "up",
            stackMove: stackMove
          })
          stackMove.unshift("up");
        }
        break;
      case 39: //right
        if(this.state.directions !== "left" && this.state.directions !== "right"){
          this.setState({
            directions: "right",
            stackMove: stackMove
          })
          stackMove.unshift("right");
        }
        break;
      case 40: //down
        if(this.state.directions !== "up" && this.state.directions !== "down"){
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
      this.changeDirection(event);
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
    if(!this.state.isPause){
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
          this.setState({
            compliment: `<div class="compliment__good">Boleh <br> juga lu.</div>`
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
          if(boards[body.y][body.x] === `<div class="board__cell snake__body"></div>`){
            console.log("mati");
            isDead = true
            this.setState({
              isPause: true,
              isDead: true,
              compliment: `<div class="compliment__bad">Bego lu!!!</div>`
            })
          }
          boards[body.y][body.x] = `<div class="board__cell snake__body head"></div>`; // redraw head
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
      // let foodX = Math.round(Math.random() * this.state.boards.width);
      // let foodY = Math.round(Math.random() * this.state.boards.height);
      // if(foodX === this.state.boards.width){
      //   foodX -= 1;
      // }
      // else if(foodY === this.state.boards.height){
      //   foodY -= 1;
      // }            
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
      let headY = 1;
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
          <div className="app__notification-wrapper">
            <div className="notification__score-wrapper">
              <span>Score: </span>
              <span>{this.state.score}</span>
            </div>
            <div className="notification__compliment-wrapper" dangerouslySetInnerHTML={{__html: this.state.compliment}}>              
            </div>
          </div>          
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
