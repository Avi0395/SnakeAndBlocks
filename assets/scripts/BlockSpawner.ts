/**
 * BlockSpawner.ts
 * 
 * - PURPOSE:
 * - Spawns rows of Blocks and Pickups ahead of the snake as the game progresses.
 * - Ensures endless gameplay by generating patterns and removing old objects.
 */

import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { Block } from './Block';
import { Pickup } from './Pickup';

const { ccclass, property } = _decorator;

@ccclass('BlockSpawner')
export class BlockSpawner extends Component {

    //Prefab for spawning Block objects
    @property(Prefab)
    blockPrefab: Prefab = null!;

    //Prefab for spawning Pickup objects
    @property(Prefab)
    pickupPrefab: Prefab = null!;

    // Reference to the snake head
    @property(Node)
    snakeHead: Node = null!;

    //Distance ahead of snake to spawn new rows
    @property
    spawnDistance: number = 800;

    //Vertical spacing between rows
    @property
    rowSpacing: number = 200;

    //Total width of the game lane
    @property
    laneWidth: number = 300;

    
    private lastSpawnY: number = 400;      // Tracks Y position of last spawned row
    private activeBlocks: Node[] = [];     // List of active block objects
    private activePickups: Node[] = [];    // List of active pickup objects

    //Called once at the start of the game, Spawns some initial rows to fill the screen.
    start() {
        this.spawnMultipleRows(8);
    }

    //Spawns new rows ahead of the snake, Removes objects that are far behind the snake
    update(deltaTime: number) {
        if (this.snakeHead) {
            let snakeY = this.snakeHead.position.y;

            if (snakeY > this.lastSpawnY - this.spawnDistance) {
                this.spawnMultipleRows(3);
            }

            this.cleanupOldObjects(snakeY);
        }
    }

    //Spawns multiple rows of objects.
    spawnMultipleRows(count: number) {
        for (let i = 0; i < count; i++) {
            this.spawnRow();
        }
    }

    //Spawns a single row of objects, Uses a random pattern from generateRowPattern()
    spawnRow() {
        this.lastSpawnY += this.rowSpacing;
        let pattern = this.generateRowPattern();

        for (let i = 0; i < pattern.length; i++) {
            let xPos = this.getColumnPosition(i, pattern.length);

            if (pattern[i].type === 'block') {
                this.spawnBlock(xPos, this.lastSpawnY, pattern[i].value);
            } else if (pattern[i].type === 'pickup') {
                this.spawnPickup(xPos, this.lastSpawnY, pattern[i].value);
            }
        }
    }

    //Returns a randomly selected row pattern
    generateRowPattern(): { type: string, value: number }[] {
        let patterns = [
            [
                { type: 'block', value: 2 },
                { type: 'empty', value: 0 },
                { type: 'pickup', value: 2 },
                { type: 'block', value: 4 },
                { type: 'block', value: 3 }
            ],
            [
                { type: 'empty', value: 0 },
                { type: 'block', value: 10 },
                { type: 'pickup', value: 3 },
                { type: 'block', value: 4 },
                { type: 'empty', value: 0 }
            ],
            [
                { type: 'pickup', value: 1 },
                { type: 'block', value: 2 },
                { type: 'empty', value: 0 },
                { type: 'block', value: 15 },
                { type: 'pickup', value: 4 }
            ],
            [
                { type: 'block', value: 5 },
                { type: 'pickup', value: 2 },
                { type: 'empty', value: 0 },
                { type: 'pickup', value: 3 },
                { type: 'block', value: 12 }
            ],
            [
                { type: 'block', value: 9 },
                { type: 'pickup', value: 8 },
                { type: 'empty', value: 0 },
                { type: 'pickup', value: 7 },
                { type: 'block', value: 13 }
            ],
            [
                { type: 'block', value: 9 },
                { type: 'block', value: 8 },
                { type: 'block', value: 20 },
                { type: 'block', value: 7 },
                { type: 'block', value: 13 }
            ]
        ];

        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    //Calculates X position of a column based on its index
    getColumnPosition(columnIndex: number, totalColumns: number): number {
        let columnWidth = 100;
        let totalWidth = columnWidth * (totalColumns - 1);
        let startX = -totalWidth / 2;
        return startX + (columnIndex * columnWidth);
    }

    //Spawns a block at the given position with given value
    spawnBlock(x: number, y: number, value: number) {
        if (!this.blockPrefab) return;

        let block = instantiate(this.blockPrefab);
        block.parent = this.node.parent;
        block.setPosition(x, y, 0);

        let blockScript = block.getComponent(Block);
        if (blockScript) {
            blockScript.blockValue = value;
            blockScript.updateDisplay();
        }

        this.activeBlocks.push(block);
    }

    //Spawns a pickup at the given position with given value
    spawnPickup(x: number, y: number, value: number = 1) {
        if (!this.pickupPrefab) {
            console.error("Pickup prefab not assigned!");
            return;
        }

        let pickup = instantiate(this.pickupPrefab);
        pickup.parent = this.node.parent;
        pickup.setPosition(x, y, 0);

        let pickupScript = pickup.getComponent(Pickup);
        if (pickupScript) {
            pickupScript.pickupValue = value;
            pickupScript.updateDisplay();
        }

        this.activePickups.push(pickup);
    }

    //Removes blocks/pickups that are far behind the snake to save performance and memory.
    cleanupOldObjects(snakeY: number) {
        // Clean blocks
        for (let i = this.activeBlocks.length - 1; i >= 0; i--) {
            if (this.activeBlocks[i] && this.activeBlocks[i].position.y < snakeY - 500) {
                this.activeBlocks[i].destroy();
                this.activeBlocks.splice(i, 1);
            }
        }

        // Clean pickups
        for (let i = this.activePickups.length - 1; i >= 0; i--) {
            if (this.activePickups[i] && this.activePickups[i].position.y < snakeY - 500) {
                this.activePickups[i].destroy();
                this.activePickups.splice(i, 1);
            }
        }
    }
}
