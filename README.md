# Marble-Maze Online Project
This project is the final Three.js project of the IT-HTL Ybbs. The game is obviously inspired by the physical marble-maze games. This take on the classical game was specifically made to be speedrun, so feel free to post your records.

## Bugs, suggestions and issues with the project
If you find any issues related to this project, don't be afraid to e-mail me or create a GitHub-Issue.

## Running the Project
To install the modules you need node.js. You can get it from the [Node.js Website](https://nodejs.org/en). Then you need to execute the `npm install` command.

### Running the project locally
To run the project use the command `npm run dev`.

### Building the project
Because of the resource manager the project has to be manually built. In order to build it you need to remove the resource manager references and statically add the textures in the Maze.js file. Then you can use `npm build`. Finally you need to add the contents of the asset folder to the dist folder.
