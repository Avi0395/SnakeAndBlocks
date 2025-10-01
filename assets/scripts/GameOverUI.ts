/**
 * GameOverUI.ts
 * 
 *  - Purpose:
 *  - Controls the "Game Over" screen UI.
 *  - Shows the player's final score and high score.
 *  - Updates and saves the high score using local storage.
 *  - Provides a "Play Again" button to restart the game.
 */

import { _decorator, Component, Button, Label, director, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {

    // Button that restarts the game when clicked
    @property(Button)
    playAgainButton: Button = null!;

    // Label to display the player's final score
    @property(Label)
    finalScoreLabel: Label = null!;

    // Label to display the highest score
    @property(Label)
    highScoreLabel: Label = null!;


    //Register click event for the Play Again button
    start() {
        if (this.playAgainButton) {
            this.playAgainButton.node.on(
                Button.EventType.CLICK,
                this.onPlayAgainClicked,
                this
            );
        }
    }

    // Restart the current scene
    private onPlayAgainClicked() {
        director.loadScene(director.getScene().name);
    }


    show(currentScore: number) {
        // Get saved high score from local storage
        let highScore = sys.localStorage.getItem('highScore');
        let highScoreNum = highScore ? parseInt(highScore) : 0;

        // If the player beat the high score, update it in storage
        if (currentScore > highScoreNum) {
            highScoreNum = currentScore;
            sys.localStorage.setItem('highScore', highScoreNum.toString());
        }

        // Update labels on UI
        if (this.finalScoreLabel) {
            this.finalScoreLabel.string = `Score: ${currentScore}`;
        }
        if (this.highScoreLabel) {
            this.highScoreLabel.string = `High Score: ${highScoreNum}`;
        }

        // Show the Game Over screen
        this.node.active = true;
    }

    // Hide the Game Over screen
    hide() {
        this.node.active = false;
    }
}
