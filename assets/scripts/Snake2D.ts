/**
 * Snake2D.ts
 * 
 * - PURPOSE:
 * - Controls the Snake movement, speed, collisions, and interactions
 *   with blocks and pickups. Also handles game-over logic and input.
 */

import { _decorator, Component, Node, input, Input, EventTouch, Vec3, UITransform } from 'cc';
import { Block } from './Block';
import { SnakeTail } from './SnakeTail';
import { Pickup } from './Pickup';
import { GameManager } from './GameManager';
import { GameOverUI } from './GameOverUI';

const { ccclass, property } = _decorator;

@ccclass('Snake2D')
export class Snake2D extends Component {

    //Forward movement speed of the snake
    @property
    moveSpeed: number = 300;

    // Horizontal movement speed
    @property
    horizontalSpeed: number = 8;

    //For testing: reference to a Block node
    @property(Node)
    testBlock: Node = null!;

    //For testing: reference to a Pickup node
    @property(Node)
    testPickup: Node = null!;

    // Maximum movement speed
    @property
    maxMoveSpeed: number = 600;

    // How quickly speed increases per second
    @property
    speedIncreaseRate: number = 2;

    private initialMoveSpeed: number = 300;   // backup of starting speed
    private targetX: number = 0;              // where snake wants to move horizontally
    private uiTransform: UITransform = null!;
    private snakeTail: SnakeTail = null!;     // reference to SnakeTail script
    private gameManager: GameManager = null!; // reference to GameManager script
    private isGameOver: boolean = false;      // flag to stop game loop
    private gameOverUI: GameOverUI = null!;   // reference to GameOverUI panel

    //Sets up references, speed, and input listeners
    start() {
        this.uiTransform = this.getComponent(UITransform)!;
        this.snakeTail = this.getComponent(SnakeTail)!;
        this.gameManager = this.node.parent?.parent?.getComponent(GameManager)!;
        this.initialMoveSpeed = this.moveSpeed;

        // Try to find GameOverUI on Canvas
        let canvas = this.node.parent?.parent;
        if (canvas) {
            let gameOverPanel = canvas.getChildByName("GameOverPanel");
            if (gameOverPanel) {
                this.gameOverUI = gameOverPanel.getComponent(GameOverUI);
            }
        }

        // Register touch events
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    //Called every frame, Updates snake speed, movement, and collisions
    update(deltaTime: number) {
        if (!this.isGameOver) {
            if (this.moveSpeed < this.maxMoveSpeed) {
                this.moveSpeed += this.speedIncreaseRate * deltaTime;
            }

            let newY = this.node.position.y + (this.moveSpeed * deltaTime);
            let currentX = this.node.position.x;
            let newX = this.lerp(currentX, this.targetX, this.horizontalSpeed * deltaTime);

            newX = Math.max(-250, Math.min(250, newX));

            this.node.setPosition(newX, newY, this.node.position.z);

            this.simpleCollisionCheck();
            this.checkPickupCollision();
        }
    }

    //Checks collision with all Block nodes.
    simpleCollisionCheck() {
        let gameContent = this.node.parent;
        if (gameContent) {
            let allSiblings = gameContent.children;

            for (let i = allSiblings.length - 1; i >= 0; i--) {
                let sibling = allSiblings[i];

                if (sibling.active && sibling.getComponent(Block)) {
                    let blockScript = sibling.getComponent(Block);
                    let dx = this.node.position.x - sibling.position.x;
                    let dy = this.node.position.y - sibling.position.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 65) {
                        let blockValue = blockScript.blockValue;

                        if (this.gameManager) {
                            this.gameManager.addScore(blockValue);
                        }

                        // Reduce snake length, check if still alive
                        let stillAlive = this.snakeTail.reduceLength(blockValue);

                        if (!stillAlive) {
                            this.isGameOver = true;
                            this.moveSpeed = 0;

                            // Show Game Over panel
                            if (this.gameOverUI && this.gameManager) {
                                let currentScore = this.gameManager.getScore();
                                this.gameOverUI.show(currentScore);
                            }
                        }

                        // Disable block after collision
                        sibling.active = false;
                        break;
                    }
                }
            }
        }
    }

    //Checks collision with all Pickup nodes
    checkPickupCollision() {
        let gameContent = this.node.parent;
        if (gameContent) {
            let allSiblings = gameContent.children;

            for (let i = allSiblings.length - 1; i >= 0; i--) {
                let sibling = allSiblings[i];

                let pickupScript = sibling.getComponent(Pickup);
                if (sibling.active && pickupScript) {
                    let dx = this.node.position.x - sibling.position.x;
                    let dy = this.node.position.y - sibling.position.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 60) {
                        this.snakeTail.addLength(pickupScript.pickupValue);
                        sibling.active = false;
                        break;
                    }
                }
            }
        }
    }

    //Called when player first touches the screen
    onTouchStart(event: EventTouch) {
        if (!this.isGameOver) {
            this.updateTargetX(event);
        }
    }

    //Called while player drags finger on screen
    onTouchMove(event: EventTouch) {
        if (!this.isGameOver) {
            this.updateTargetX(event);
        }
    }

    //Converts screen touch position → target X position in game.
    updateTargetX(event: EventTouch) {
        let screenPos = event.getLocation();
        let centerX = 360;
        this.targetX = (screenPos.x - centerX) * 0.5;
    }

    //Utility: Smoothly interpolates between two values
    lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    //Called when object is destroyed. Cleans up input listeners
    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
}
