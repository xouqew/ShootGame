
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

}


function goRight(){
  ellierun.vx += 5;
  ellierun.vy = 0;
  ellierun.scale.x = 1;
  ellierun.animationSpeed = 0.1;
  ellierun.play();
  ellierun.position.set(Ellie.position.x,Ellie.position.y);
  ellierun.x += 5;

  app.stage.removeChild(Ellie);

}

function shoot(){
  ellierun.vx = 5;
  ellierun.vy = 0;
  ellieshoot.animationSpeed = 0.1;
  ellieshoot.play();
  app.stage.removeChild(Ellie);
  app.stage.removeChild(ellieaim);
  app.stage.addChild(ellieshoot);
  ellieshoot.position.set(Ellie.position.x,Ellie.position.y);

}

function aim(){app.stage.addChild(ellieaim);
ellieaim.animationSpeed = 0.1;
ellieaim.position.set(Ellie.position.x,Ellie.position.y);
app.stage.removeChild(Ellie);
ellieaim.play();}


// import * as tf from '@tensorflow/tfjs';

var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");


function guess(classId) {
    app.stage.addChild(ellierun);
    console.log(classId);
    classId === 0 ? aim():goRight();

}
