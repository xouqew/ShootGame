
function goLeft(){
  ellieRun.vx -= 5;
  ellieRun.vy = 0;
  ellieRun.scale.x = -1;
  ellieRun.animationSpeed = 0.1;
  ellieRun.play();
  ellieRun.position.set(Ellie.position.x,Ellie.position.y);
  ellieRun.x -= 5;

  app.stage.removeChild(Ellie);

}


function goRight(){
  ellieRun.vx += 5;
  ellieRun.vy = 0;
  ellieRun.scale.x = 1;
  ellieRun.animationSpeed = 0.1;
  ellieRun.play();
  ellieRun.position.set(Ellie.position.x,Ellie.position.y);
  ellieRun.x += 5;

  app.stage.removeChild(Ellie);

}


function aim(){}
function shoot(){}
// import * as tf from '@tensorflow/tfjs';

var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");


function guess(classId) {
    app.stage.addChild(ellieRun);
    console.log(classId);
    classId == 0 ? goLeft():goRight();

}
