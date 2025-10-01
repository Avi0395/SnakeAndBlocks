/**
 * CanvasFollow.ts
 * 
 *  - Purpose:
 *  - Keeps the game’s canvas (GameContent) moving 
 *    so that it follows the snake’s vertical movement.
 *  - Creates a "camera-follow" effect by shifting the background based on 
 *    the snake’s Y-position.
 *  - Ensures the snake always appears centered while the game world scrolls.
 */

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CanvasFollow')
export class CanvasFollow extends Component {

    // The snake that this canvas should follow
    @property(Node)
    target: Node = null!;

    // Stores the snake’s starting Y position for reference
    private initialSnakeY: number = 0;

    // Save the initial Y position of the snake when the game starts
    start() {
        if (this.target) {
            this.initialSnakeY = this.target.position.y;
        }
    }

    update(deltaTime: number) {
        if (this.target) {
            // Calculate how far the snake has moved vertically from start
            let snakeMovement = this.target.position.y - this.initialSnakeY;

            // Move this node in the opposite direction to create a "camera follows snake" effect
            this.node.setPosition(0, -snakeMovement);
        }
    }
}
