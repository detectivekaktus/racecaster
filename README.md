# racecaster

![Screenshot showing the Racecaster game scene where a car takes a curve to the right.](https://github.com/detectivekaktus/racecaster/blob/main/img/racecaster_preview.png)

Racecaster is a pseudo-3D racing game that utilizes simple math and algorithms to draw pixelated picture of infinite world that awaits the player to start exploring it by driving a car that always tries to go off road. Will you be able to keep it on the road and complete the level with the least time?

The project was created by a non web-developer person, so it may lack some smart workouts on some problems, but hey, it works!

## How to run
Pay **attention** that the project was written on Linux and so npm scripts use UNIX-like shell commands to build and setup the project, which aren't supported by the Windows operating system command line interpreters, so what you may want to do, in case you're running Windows, is either open the project in Git Bash or use WSL.

* `npm run build`. Builds the server and client parts of the application.
* `npm run run`. Runs built project.
* `npm run start`. Builds the server and the client parts of the application and runs the project.
* `npm run clean`. Deletes the output directory (`out`).

## How to play
On the level you're given a track which is made of 15 road pieces which have different lenght and different curvature angle. You have to stay on the road and reach the end of the level to start a new one or finish the game.

| Key | Action |
| --- | ------ |
| W | Go forward |
| A | Turn left |
| D | Turn right |

Feel free to add more controls by contrbuting to the project.

## Contributing
Please, be sure to read the [CONTRIBUTING.md](https://github.com/detectivekaktus/racecaster/blob/main/CONTRUBUTING.md) file before submitting any changes to the code base.

You can feel free to fork and modify this project separately.
