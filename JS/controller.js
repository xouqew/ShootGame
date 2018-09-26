
function goLeft(){
  Ellie_run.vx -= 5;
  Ellie_run.vy = 0;
  Ellie_run.scale.x = -1;
  Ellie_run.animationSpeed = 0.1;
  Ellie_run.play();
  Ellie_run.position.set(Ellie.position.x,Ellie.position.y);
  Ellie_run.x -= 5;

  app.stage.removeChild(Ellie);

}


function goRight(){
  Ellie_run.vx += 5;
  Ellie_run.vy = 0;
  Ellie_run.scale.x = 1;
  Ellie_run.animationSpeed = 0.1;
  Ellie_run.play();
  Ellie_run.position.set(Ellie.position.x,Ellie.position.y);
  Ellie_run.x += 5;

  app.stage.removeChild(Ellie);

}


function aim(){}
function shoot(){}
// import * as tf from '@tensorflow/tfjs';

var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");


function guess(classId) {
    app.stage.addChild(Ellie_run);
    console.log(classId);
    classId == 0 ? goLeft():goRight();

}
