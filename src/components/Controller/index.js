import React, { Component } from 'react';
import rightArrow from './assets/icons/right-arrow.png';
import leftArrow from './assets/icons/left-arrow.png';

export default class Controller extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
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
        );
    }
}