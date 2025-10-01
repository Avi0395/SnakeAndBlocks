# Snake vs Block - Mobile Game

A 2D endless runner game built with Cocos Creator where players control a snake that collects pickups and destroys blocks.

## Game Overview

Navigate your snake through an endless vertical lane, collecting pickup balls to grow longer while avoiding or destroying numbered blocks. The game ends when your snake's length reaches zero.

---

## Technical Specifications

### Cocos Creator Version
- **Engine**: Cocos Creator v3.8.7
- **Language**: TypeScript
- **Target Platform**: Web Mobile (HTML5)

### System Requirements
- **Development**: Windows/Mac/Linux with Cocos Creator 3.8.5+
- **Runtime**: Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Mobile**: iOS Safari 12+, Android Chrome 70+

---

## Setup Instructions

### 1.Prerequisites

**Required:**
- Cocos Creator 3.8.5 or higher
  - Download from: https://www.cocos.com/en/creator/download
  - Includes TypeScript compiler and all build tools

**Optional (Recommended):**
- Visual Studio Code (for better code editing experience)
  - Download from: https://code.visualstudio.com/
  - Cocos Creator can open scripts in VS Code automaticallyy

### 2. Opening the Project
1. Launch Cocos Creator
2. Click "Open Project"
3. Navigate to the project folder and select it
4. Wait for assets to load (may take 1-2 minutes)

### 3. Running in Editor
1. Select the "Menu" scene from Assets/scenes/
2. Click the Play button (▶) at the top toolbar
3. Game will open in a preview window

### 4. Testing on Different Resolutions
1. In preview window, use the device dropdown
2. Select target device (iPhone, Android, etc.)
3. Test gameplay at different screen sizes

---

## Running the Game (Demo)

### Option 1: Local Testing with Live Server

1. Open the project folder in VS Code
2. Navigate to `build/web-mobile/` folder
3. Right-click on `index.html`
4. Select "Open with Live Server"
5. Game will open in your default browser

**Note**: Direct file opening (double-clicking index.html) won't work due to browser security restrictions. Always use a local server.

### Option 2: Play Online

**Live Demo**: [https://avi0395.github.io/SnakesAndBlocks-Web_Mobile/]

Play directly in your browser on any device (mobile or desktop).

---

## Project Architecture

### File Structure
```
SnakeVSBlock_AvinashPatil/
├── assets/
│   ├── scenes/
│   │   ├── Menu.scene              # Main menu screen
│   │   └── GamePlay.scene          # Core gameplay
│   ├── scripts/
│   │   ├── MenuUI.ts               # Menu controller
│   │   ├── GameManager.ts          # Score/state manager
│   │   ├── Snake2D.ts              # Snake movement & collision
│   │   ├── SnakeTail.ts            # Trailing balls system
│   │   ├── Block.ts                # Block behavior
│   │   ├── Pickup.ts               # Pickup behavior
│   │   ├── BlockSpawner.ts         # Procedural generation
│   │   ├── CanvasFollow.ts         # Camera following
│   │   └── GameOverUI.ts           # Game over screen
│   └── prefabs/
│       ├── SnakeBall.prefab        # Snake segment
│       ├── BlockPrefab.prefab      # Block with number
│       └── PickupBall.prefab       # Collectible pickup
└── README.md
```

### Core Systems

**1. Snake System**
- `Snake2D.ts`: Touch controls, movement, collision detection
- `SnakeTail.ts`: Trailing ball management, length tracking

**2. Object Spawning**
- `BlockSpawner.ts`: Procedural row generation with random patterns
- Spawns blocks and pickups.

**3. Game Flow**
- `MenuUI.ts`: Start game, display high score
- `GameManager.ts`: Score tracking, UI updates
- `GameOverUI.ts`: Display results, save high score, restart

**4. Camera System**
- `CanvasFollow.ts`: Smooth vertical scrolling to follow snake

### Game Logic Flow
```
Menu Scene
    ↓ (Play Button)
GamePlay Scene
    ↓ (Snake length = 0)
Game Over Panel
    ↓ (Play Again)
GamePlay Scene (restart)
```

### Key Mechanics

**Collision System:**
- Snake head checks distance to all blocks/pickups each frame
- Collision radius: 60-65 pixels
- Instant response on collision detection

**Scoring:**
- Points = Sum of destroyed block values
- Block with value 5 destroyed = +5 score
- High score saved in browser localStorage

**Difficulty Progression:**
- Snake speed increases over time (300 → 600 units/sec)
- Random block patterns provide variable challenge
- No explicit level system - continuous gameplay

---

## Performance Notes

### Implemented Optimizations
1. **Efficient Collision Detection**
   - Simple distance-based collision (no physics engine)
   - Checks only active objects near snake

2. **Minimal Draw Calls**
   - Simple sprite-based rendering
   - No complex animations or particle systems

3. **Browser Storage**
   - High score persists using localStorage
   - Minimal data footprint

### Performance Targets

- **Frame Rate**: 60 FPS on mobile devices
- **Load Time**: < 3 seconds on 4G connection
- **Memory**: < 100MB RAM usage
- **Build Size**: ~5-10MB web build

---

## Known Issues

### Current Bugs
1. **Camera View**: Long snakes extend beyond visible area
   - *Impact*: Can't see full snake when very long
   - *Workaround*: Camera ortho height can be increased

2. **Touch Control Sensitivity**: May vary on different devices
   - *Impact*: Controls feel different on tablets vs phones
   - *Status*: Acceptable, device-dependent

### Limitations

1. **No Sound**: Audio system not implemented
2. **Single Difficulty**: No easy/medium/hard modes
3. **No Powerups**: No temporary abilities or bonuses

---

## Asset Credits

### Built-in Assets
- All sprites use Cocos Creator default sprite (solid colors)
- No external image assets required
- Font: Cocos Creator default system font

### Third-Party Libraries
- **Cocos Creator Engine**: v3.8.7 (Licensed under Cocos Creator EULA)
- No additional third-party libraries used

### Original Code
- All game scripts written specifically for this project
- No code copied from external sources

---

## Future Enhancements

**Potential Improvements:**
- Sound effects and background music
- Particle effects on block destruction
- Power-ups (shield, magnet, speed boost)
- Multiple difficulty levels
- Leaderboard system
- Social sharing integration
- More visual polish (gradients, glows, animations)

---

## Development Notes

### Design Decisions

**Why 2D instead of 3D?**
- Better performance on mobile browsers
- Simpler asset creation
- Faster development cycle

**Why distance-based collision?**
- More predictable than physics engine
- Lower computational cost
- Sufficient for this game type

**Why localStorage for high score?**
- No backend required
- Instant persistence
- Privacy-friendly (local only)

### Testing Checklist
- [ ] Menu loads correctly
- [ ] Play button starts game
- [ ] Snake responds to touch
- [ ] Blocks destroy on collision
- [ ] Pickups increase snake length
- [ ] Score updates in real-time
- [ ] Game over shows at length 0
- [ ] High score saves and displays
- [ ] Play again button restarts game

---

## Support & Contact

**Developer**: Avinash Patil  
**Project**: Snake vs Block Game Assignment  
**Engine**: Cocos Creator 3.8.7  
**Date**: 2025

For issues or questions about the assignment submission, refer to the original assignment documentation.

---

## License

This project is created as an assignment submission for QuriousBit Games.  
All code is original work unless otherwise credited above.