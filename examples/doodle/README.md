# SDK script example: Ziggy Jumper Game

This is a fun Doodle Jump-style game featuring Ziggy, Akeneo's mascot! The game is implemented as a UI extension that appears on the Akeneo PIM dashboard.

## Prerequisites

Before you begin, you need an active connection to an Akeneo PIM sandbox.
To learn more about setting up your connection, please follow the instructions in the [official documentation](https://api.akeneo.com/getting-started/connect-the-pim-4x/step-1.html#you-said-connection).

## Get started

To begin, run the setup command:
```bash
make start
```
...and follow the interactive instructions in your terminal. This will install dependencies, configure your environment, and create the extension in your PIM for the first time.

### Manual setup commands

If you prefer to set up your environment manually or need more control over individual steps, you can use these commands:

**Copy environment configuration:**
```bash
make copy-env
```
This copies `.env.example` to `.env` so you can manually configure your environment variables.

**Install dependencies:**
```bash
make install
```
This installs all npm dependencies required for the project.

**Get API token:**
```bash
make get-token
```
This retrieves an API token from your Akeneo PIM instance.

**Create extension (development mode):**
```bash
make create-dev
```
This creates the extension in development mode in your PIM. This is what `make start` uses internally.

**Create extension (production mode):**
```bash
make create
```
This creates the extension in production mode in your PIM.

## Development

### Uploading changes

To upload your changes to Akeneo, use the following command. This will build the extension for development and push it to the PIM.
```bash
make update-dev
```

### Development server

To run the development server locally:
```bash
make dev
```
This starts a local development server where you can test the game.

### Development build

To build the extension for development without uploading:
```bash
make build-dev
```
This creates a development build with source maps and debugging tools enabled.

### Automatic updates (hot-reload)

To have your extension automatically update every time you save a code change, run the watch command:
```bash
make watch
```
This is highly recommended for an efficient development workflow.

## How to Play

Once the extension is installed on your PIM dashboard:

1. **Start the game** - The game starts automatically when you open the dashboard
2. **Move Ziggy** - Use the **Left/Right arrow keys** or **A/D keys** to move Ziggy horizontally
3. **Jump** - Ziggy automatically jumps when landing on platforms
4. **Climb higher** - Keep jumping from platform to platform to increase your score
5. **Avoid falling** - Don't let Ziggy fall off the bottom of the screen!

The longer you survive and the higher you climb, the better your score!

## Customization

### Game logic

All the game logic is located in `src/main.js`. The game is built using HTML5 Canvas and includes:

- **Physics engine** - Realistic jumping and gravity mechanics
- **Platform generation** - Randomly generated platforms for endless gameplay
- **Collision detection** - Precise platform collision for smooth gameplay
- **Score system** - Real-time score tracking

### Game assets

The Ziggy character sprite is located at `src/ziggy.png`. You can replace this with your own character sprite if desired.

### Extension configuration

The `extension_configuration.json` file defines how the game appears in Akeneo PIM:

| Key | Description |
| --- | --- |
| `position` | Set to `pim.dashboard` to display the game on the main dashboard |
| `name` | Unique identifier: `doodle_jump_game` |
| `file` | Output file: `dist/doodle_jump.js` |
| `configuration.default_label` | Display name: "Doodle Jump Game" |

## Build for production

Once you're happy with the game, build it for production:
```bash
make build
```
This will create an optimized production build in `dist/doodle_jump.js`.

To deploy this production version:
```bash
make update
```

## Technical Details

The game is built using:
- **HTML5 Canvas** - For rendering graphics
- **Vanilla JavaScript** - No game framework dependencies
- **Custom physics engine** - Built from scratch for the jumping mechanics
- **Poppins font** - Google Font for the UI text

## Understanding SES (Secure ECMAScript)

**Important**: Akeneo PIM uses SES (Secure ECMAScript) to run UI extensions in a secure sandbox environment. SES provides isolation and security by restricting access to potentially dangerous JavaScript features.

### What this means for the game:

- **Security First**: The game runs in a controlled environment that prevents access to sensitive browser APIs
- **Canvas rendering**: Fully supported for game graphics
- **Event listeners**: Keyboard input works seamlessly within the sandbox
- **Error Messages**: If you encounter SES-related errors, ensure your code doesn't rely on restricted features

## Credits

This game is inspired by the classic Doodle Jump game, reimagined with Ziggy, the Akeneo mascot, as the star! 🎮✨
