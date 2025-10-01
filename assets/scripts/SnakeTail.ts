/**
 * SnakeTail.ts
 * 
 * - PURPOSE:
 * - Manages the snake’s tail (balls that follow the head)
 * - Handles growing/shrinking the tail
 * - Keeps tail balls spaced properly using position history
 * 
 * This script is attached to the Snake Head node.
 */
import { _decorator, Component, Node, Vec3, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SnakeTail')
export class SnakeTail extends Component {

    // Prefab for each tail ball
    @property(Prefab)
    ballPrefab: Prefab = null!;

    // Starting length of the snake
    @property
    maxLength: number = 5;

    // Distance between each ball in the tail
    @property
    spacing: number = 3;

    // How quickly tail balls adjust to follow the leader
    @property
    followSpeed: number = 8;

    private tailBalls: Node[] = [];   // List of tail ball nodes
    private positions: Vec3[] = [];   // Stores snake head position history

    //Called once at the start of the game, Creates the initial snake tail,
    //Fills the position history with head's starting position
    start() {
        this.createTail();

        this.positions = [];
        for (let i = 0; i < 50; i++) {
            this.positions.push(new Vec3(this.node.position));
        }
    }

    // Called every frame, Updates position history, Moves tail balls to follow head smoothly
    update(deltaTime: number) {
        this.updatePositionHistory();
        this.updateTailPositions();
    }

    //Creates the initial tail balls behind the snake head
    createTail() {
        this.clearTail(); // Remove any old tail

        for (let i = 0; i < this.maxLength; i++) {
            if (this.ballPrefab) {
                let ball = instantiate(this.ballPrefab);
                ball.parent = this.node.parent;
                ball.setPosition(this.node.position.x, this.node.position.y - (i + 1) * this.spacing, 0);
                this.tailBalls.push(ball);
            }
        }
    }

    //Updates the stored positions of the snake head
    updatePositionHistory() {
        this.positions.unshift(new Vec3(this.node.position));

        if (this.positions.length > this.maxLength * 3) {
            this.positions.length = this.maxLength * 3;
        }
    }

    //Updates the position of each tail ball
    updateTailPositions() {
        for (let i = 0; i < this.tailBalls.length; i++) {
            let leaderPos: Vec3 = (i === 0) ? this.node.position : this.tailBalls[i - 1].position;
            let currentPos = this.tailBalls[i].position;

            let direction = new Vec3();
            Vec3.subtract(direction, leaderPos, currentPos);

            let distance = direction.length();

            if (distance > this.spacing) {
                direction.normalize();
                let newPos = new Vec3();
                Vec3.scaleAndAdd(newPos, currentPos, direction, (distance - this.spacing) * this.followSpeed * 0.016);
                this.tailBalls[i].setPosition(newPos);
            }
        }
    }

    //Increases snake length by given amount
    addLength(amount: number) {
        let oldLength = this.maxLength;
        this.maxLength += amount;

        for (let i = oldLength; i < this.maxLength; i++) {
            if (this.ballPrefab) {
                let ball = instantiate(this.ballPrefab);
                ball.parent = this.node.parent;
                ball.setPosition(this.node.position);
                this.tailBalls.push(ball);
            }
        }
    }

    //Reduces snake length by given amount
    reduceLength(amount: number): boolean {
        this.maxLength -= amount;

        if (this.maxLength < 0) {
            this.maxLength = 0;
            this.clearTail();
            return false; // Game over
        }

        while (this.tailBalls.length > this.maxLength) {
            let ball = this.tailBalls.pop();
            if (ball && ball.isValid) {
                ball.destroy();
            }
        }

        return true; // Snake still alive
    }

    //Destroys all tail balls
    clearTail() {
        for (let ball of this.tailBalls) {
            if (ball && ball.isValid) {
                ball.destroy();
            }
        }
        this.tailBalls = [];
    }

    //Returns the current snake length
    getLength(): number {
        return this.maxLength;
    }
}
