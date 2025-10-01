/**
 * Pickup.ts
 * 
 * - PURPOSE:
 * - Represents a collectible pickup(balls) in the game.
 * - Displays value on label and checks collision with snake.
 */
import { _decorator, Component, Label, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {

    // How many balls this pickup adds to snake tail
    @property
    pickupValue: number = 1;

    // Speed of rotation (degrees per second)
    @property
    rotateSpeed: number = 90;

    // Bobbing animation settings
    private startY: number = 0;
    private bobSpeed: number = 2;
    private bobHeight: number = 10;

    //Called once when node is initialized, Stores the starting Y position for bobbing
    start() {
        this.startY = this.node.position.y;
    }

    //Called every frame, Handles:Rotating the pickup, Bobbing up and down animation
    update(deltaTime: number) {
        // Rotate pickup around Z axis
        let currentRotation = this.node.eulerAngles;
        this.node.setRotationFromEuler(
            currentRotation.x,
            currentRotation.y,
            currentRotation.z + this.rotateSpeed * deltaTime
        );

        // Bobbing animation (sin wave motion)
        let bobOffset = Math.sin(Date.now() * 0.005 * this.bobSpeed) * this.bobHeight;
        let newY = this.startY + bobOffset;

        // Update position with bobbing effect
        this.node.setPosition(this.node.position.x, newY, this.node.position.z);
    }

    //Updates the label text on pickup
    updateDisplay() {
        let label = this.node.getChildByName("Label");
        if (label) {
            let labelComponent = label.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = `+${this.pickupValue}`;
            }
        }
    }

    // Checks collision with snake head
    checkCollision(snakePosition: Vec3): boolean {
        let pickupPos = this.node.position;

        let dx = pickupPos.x - snakePosition.x;
        let dy = pickupPos.y - snakePosition.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        return distance < 40; //collision radius
    }

    //Called when pickup is collected
    onPickedUp() {
        this.node.active = false;
    }

    //Returns pickup value
    getValue(): number {
        return this.pickupValue;
    }
}
