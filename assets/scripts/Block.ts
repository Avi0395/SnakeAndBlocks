/**
 * Block.ts
 *
 *  - Purpose:
 *  - Represents a block in the game.
 *  - Each block has a value shown on its label.
 *  - The snake collides with the block if it comes close enough.
 *  - Provides methods to display value, detect collisions, and handle hits.
*/

import { _decorator, Component, Label, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {

    @property
    blockValue: number = 5;

    @property(Label)
    valueLabel: Label = null!;

    //Runs once when the block is first created
    start() {
        this.updateDisplay();
    }

    // Updates the label text to show the block's current value
    updateDisplay() {
        if (this.valueLabel) {
            this.valueLabel.string = this.blockValue.toString();
        }
    }

    // Checks if the snake has collided with this block by measuring the distance between snake and block positions
    checkCollision(snakePosition: Vec3): boolean {
        let blockPos = this.node.position;
        let distance = Vec3.distance(blockPos, snakePosition);

        // If snake is within a certain radius → collision detected
        return distance < 60;
    }
}
