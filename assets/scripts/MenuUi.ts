/**
 * MenuUI.ts
 * 
 * - PURPOSE: Manages the main menu screen functionality
 * - Displays the game title and high score
 * - Handles the play button click to start the game
 * - Retrieves and displays the saved high score from browser storage
 * 
 */

import { _decorator, Component, Button, Label, director, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuUI')
export class MenuUI extends Component {

    //Reference to the "PLAY" button that starts the game
    @property(Button)
    playButton: Button = null!;

    //Reference to the label that displays the high score
    @property(Label)
    highScoreLabel: Label = null!;

    //Used to initialize the menu: set up button listeners and load high score
    start() {
        // Register a click event listener on the play button
        this.playButton.node.on(Button.EventType.CLICK, this.onPlayClicked, this);

        // Load the high score from browser storage and display it
        this.updateHighScore();
    }


    //Retrieves the high score from browser's local storage and displays it
    updateHighScore() {

        let highScore = sys.localStorage.getItem('highScore');

        let highScoreNum = highScore ? parseInt(highScore) : 0;

        if (this.highScoreLabel) {
            this.highScoreLabel.string = `High Score: ${highScoreNum}`;
        }
    }

    //Called when the play button is clicked, Loads the gameplay scene to start the game
    onPlayClicked() {
        // Load the gameplay scene (make sure scene name matches exactly)
        director.loadScene("GamePlay");
    }
}
