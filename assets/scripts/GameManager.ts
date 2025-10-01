/**
 * GameManager.ts
 * 
 * - PURPOSE:
 * - Manages the player's score during gameplay.
 * - Updates the score label in the UI whenever score changes.
 */

import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // Label that displays the player's score
    @property(Label)
    scoreLabel: Label = null!;

    //variable that stores the current score 
    private score: number = 0;

    //Called when the scene starts, Initializes UI with score = 0.
    start() {
        this.updateUI();
    }

    //Increases the score by given points.
    addScore(points: number) {
        this.score += points;
        this.updateUI();
    }

    //Updates the score label text in the UI.
    updateUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }

    //Returns the current score value.
    getScore(): number {
        return this.score;
    }
}

