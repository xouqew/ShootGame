
/*global someFunction ellierun:true*/
/*eslint no-undef: "error"*/

function goLeft(){
  ellierun.vx -= 5;
  ellierun.vy = 0;
  ellierun.scale.x = -1;
  ellierun.animationSpeed = 0.1;
  ellierun.play();


  ellierun.position.set(Ellie.position.x,Ellie.position.y);
  ellierun.x -= 5;

  app.stage.removeChild(Ellie);
  app.stage.removeChild(ellieaim);
  app.stage.removeChild(ellieshoot);

}


function goRight(){
  ellierun.vx += 5;
  ellierun.vy = 0;
  ellierun.scale.x = 1;
  ellierun.animationSpeed = 0.1;
  ellierun.play();
  ellierun.position.set(Ellie.position.x,Ellie.position.y);
  ellierun.x += 5;
  zombie_stand.x -=1;

  app.stage.removeChild(Ellie);
  app.stage.removeChild(ellieaim);
  app.stage.removeChild(ellieshoot);

}

function shoot(){
  ellierun.vx = 5;
  ellierun.vy = 0;
  ellieshoot.animationSpeed = 0.1;
  ellieshoot.play();


  ellieshoot.position.set(ellierun.position.x,ellierun.position.y);

  app.stage.removeChild(Ellie);
  app.stage.removeChild(ellierun);
  app.stage.removeChild(ellieaim);
  app.stage.addChild(ellieshoot);
  app.stage.removeChild(zombie_stand);
  app.stage.addChild(zombie_die);
  zombie_die.play();
  ellieshoot.position.set(Ellie.position.x,Ellie.position.y);

}

function aim(){app.stage.addChild(ellieaim);
ellieaim.animationSpeed = 0.1;
ellieaim.position.set(Ellie.position.x,Ellie.position.y);
app.stage.removeChild(Ellie);
app.stage.removeChild(ellierun);
app.stage.removeChild(ellieshoot);
ellieaim.play();

}


// import * as tf from '@tensorflow/tfjs';

var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");


function guess(classId) {
  app.stage.addChild(zombie_stand);
  zombie_stand.play();

    app.stage.addChild(ellierun);
    console.log(classId);
    switch(classId){
      case 0:
        goLeft();
        break;
      case 1:
        goRight();
        break;
      case 2:
        aim();
        break;
      case 3:
        shoot();
        break;
    }
}
