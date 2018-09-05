//game.js
let Ellie, Ellie_run, state;



let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";

};


let Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle;

PIXI.utils.sayHello(type);


let app = new PIXI.Application({
    width: 1024,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1
  }

);

//Full screen
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.backgroundColor = 0x34495e;

//The spirits images  below has been sourced from
//https://stensven.itch.io/zombie
//and
//https://petey90.itch.io/ellie-sprite-sheet


document.body.appendChild(app.view), PIXI.loader.add("Ellie/Frames/Ellie frame_idle_0.png").add("Ellie/Frames/Ellie frame_idle_1.png").add("Ellie/Frames/Ellie frame_idle_2.png").add("Ellie/Frames/Ellie frame_idle_3.png").add("Ellie/Frames/Ellie frame_run_00.png").add("Ellie/Frames/Ellie frame_run_01.png").add("Ellie/Frames/Ellie frame_run_02.png").add("Ellie/Frames/Ellie frame_run_03.png").add("Ellie/Frames/Ellie frame_run_04.png").add("Ellie/Frames/Ellie frame_run_05.png").add("Ellie/Frames/Ellie frame_run_06.png").add("Ellie/Frames/Ellie frame_run_07.png").add("Ellie/Frames/Ellie frame_run_08.png").add("Ellie/Frames/Ellie frame_run_09.png").add("Ellie/Frames/Ellie frame_run_10.png").add("Ellie/Frames/Ellie frame_run_11.png").add("Ellie/Frames/Ellie frame_run_12.png").add("Ellie/Frames/Ellie frame_shoot_0.png").add("Ellie/Frames/Ellie frame_shoot_1.png").add("Ellie/Frames/Ellie frame_shoot_2.png").add("Ellie/Frames/Ellie frame_shoot_3.png").add("Ellie/Frames/Ellie frame_aim_0.png").add("Ellie/Frames/Ellie frame_aim_1.png").add("Ellie/Frames/Ellie frame_aim_2.png").add("Ellie/Frames/Ellie frame_aim_3.png").add("Ellie/Frames/Ellie frame_aim_4.png").add("Ellie/Frames/Ellie frame_aim_5.png").add("Ellie/Frames/Ellie frame_aim_6.png").add("Ellie/Frames/Ellie frame_aim_7.png").add("Ellie/Frames/Ellie frame_death_0.png").add("Ellie/Frames/Ellie frame_death_1.png").add("Ellie/Frames/Ellie frame_death_2.png").add("Ellie/Frames/Ellie frame_death_3.png").add("Ellie/Frames/Ellie frame_death_4.png").add("Ellie/Frames/Ellie frame_death_5.png").add("Ellie/Frames/Ellie frame_death_6.png").add("Ellie/Frames/Ellie frame_death_7.png").add("Ellie/Spritesheet/Zombie_SpriteSheet.png").on("progress", loadProgress).load(setup);


//Bullet
let bullet = new PIXI.Graphics();
bullet.beginFill(0xe74c3c);
bullet.lineStyle(4, 0xe74c3c, 1);
bullet.drawRect(0, 0, 32, 6);
bullet.endFill();


//Wall
// let wall = new PIXI.Graphics();
// wall.beginFill(0xe74c3c);
// wall.lineStyle(4, 0xe74c3c, 1);
// wall.drawCircle(0,12,128,50);
// wall.endFill();
// app.stage.addChild(wall);
// wall.position.set(1000,400);

//box
let box = new PIXI.Graphics();
box.beginFill(0xe74c3c);
box.lineStyle(4, 0xe74c3c, 1);
box.drawRect(0, 12, 128, 50);
box.endFill();

//name
let name_style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: "white",

});
let name = new PIXI.Text('', name_style);
app.stage.addChild(name);
name.position.set(570, 300);



//monitor loading progress
function loadProgress(loader, resource) {
  console.log("loading" + resource.url);

  console.log("progress" + loader.progress + "%");
}



function setup() {
  //idle
  let Ellie_spirit = "Ellie/Frames/",
    idle_array = [];
  for (let $e = 0; $e < 3; $e++) {
    idle_array.push(Ellie_spirit + "Ellie frame_idle_" + ($e + 1) + ".png");
  }

  //run
  let run_array = [];
  for (let $e = 0; $e < 12; $e++) {
    run_array.push(Ellie_spirit + "Ellie frame_run_" + ($e + 1) + ".png");
  }

  //shoot
  let shoot_array = [];
  for (let $e = 0; $e < 3; $e++) {
    shoot_array.push(Ellie_spirit + "Ellie frame_shoot_" + ($e + 1) + ".png");
  }

  //aim
  let aim_array = [];
  for (let $e = 0; $e < 6; $e++) {
    aim_array.push(Ellie_spirit + "Ellie frame_aim_" + ($e + 1) + ".png");
  }


  let die_array = [];
  for (let $e = 0; $e < 6; $e++) {
    die_array.push(Ellie_spirit + "Ellie frame_death_" + ($e + 1) + ".png");

  }

  //arrow key
  let left = keyboard(65),
    up = keyboard(38),
    right = keyboard(68),
    down = keyboard(40),
    space = keyboard(32),
    aim = keyboard(81);

  //left arrow


  // let Ellie = new PIXI.Sprite(PIXI.loader.resources["Ellie/Frames/Ellie frame_idle_0.png"].texture);
  Ellie = new PIXI.extras.AnimatedSprite.fromImages(idle_array);
  Ellie_run = new PIXI.extras.AnimatedSprite.fromImages(run_array);
  Ellie_shoot = new PIXI.extras.AnimatedSprite.fromImages(shoot_array);
  Ellie_aim = new PIXI.extras.AnimatedSprite.fromImages(aim_array);
  Ellie_die = new PIXI.extras.AnimatedSprite.fromImages(die_array);
  app.stage.addChild(Ellie);

  state = play;

  app.ticker.add(delta => gameLoop(delta));

  Ellie.animationSpeed = 0.1;
  Ellie.play();
  Ellie.position.set(500, 300);
  Ellie.vx = 0;
  Ellie.vy = 0;






  right.press = () => {

    if (!space.isDown) {
      Ellie_run.vx = 5;
      Ellie_run.vy = 0;

      Ellie_run.animationSpeed = 0.1;
      Ellie_run.play();
      app.stage.removeChild(Ellie);
      app.stage.addChild(Ellie_run);
      Ellie_run.position.set(500, 300);
      console.log('test');
    }

  }

  right.release = () => {
    if (!left.isDown && Ellie_run.vy === 0) {

      Ellie_run.vx = 0;
      app.stage.addChild(Ellie);
      app.stage.removeChild(Ellie_run);
      Ellie_run.position;
    }
  }

  //shoot control
  space.press = () => {

    if (!right.isDown) {
      Ellie_run.vx = 5;
      Ellie_run.vy = 0;
      Ellie_shoot.animationSpeed = 0.1;
      Ellie_shoot.play();
      app.stage.removeChild(Ellie);
      app.stage.removeChild(Ellie_aim);
      app.stage.addChild(Ellie_shoot);
      Ellie_shoot.position.set(500, 300);
      console.log('test');

    }

  }

  space.release = () => {
    if (!right.isDown && !aim.isDown) {
      Ellie_run.vx = 0;
      app.stage.addChild(Ellie);
      app.stage.removeChild(Ellie_shoot);
      Ellie_run.position;
    }
  };

  //aim
  aim.press = () => {
    if (!right.isDown) {
      app.stage.addChild(Ellie_aim);
      Ellie_aim.animationSpeed = 0.1;
      Ellie_aim.position.set(500, 300);
      app.stage.removeChild(Ellie);
      Ellie_aim.play();
    }

  };

  aim.release = () => {

    if (!space.isDown) {
      app.stage.removeChild(Ellie_aim);
      app.stage.addChild(Ellie);
    }

  }

};

function gameLoop(delta) {
  state(delta);
}



//The code snippet below has been sourced from
//https://github.com/kittykatattack/learningPixi
//The code snippet appears in its original form
//collsion test function
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
// End code snippet

function play(delta) {
  Ellie_run.x += Ellie_run.vx;
  Ellie_run.x += Ellie_run.vy;

  //zombie

  let zombie_texture = TextureCache["Ellie/Spritesheet/Zombie_SpriteSheet.png"];


  let rectangle = new Rectangle(64, 0, 64, 64);


  zombie_texture.frame = rectangle;


  let zombie = new Sprite(zombie_texture);


  zombie.height = 250;
  zombie.width = 200;


  zombie.position.set(1500, 300);


  app.stage.addChild(zombie);

  //collision detect
  if (hitTestRectangle(Ellie_run, zombie)) {
    console.log('123');
    app.stage.addChild(Ellie_die);
    Ellie_die.animationSpeed = 0.1;
    Ellie_die.play();
    Ellie_die.x = Ellie_run.x;
    Ellie_die.y = Ellie_run.y;
    Ellie_die.play();
    app.stage.removeChild(Ellie_run);

  }



}

//The code snippet below has been sourced from
//https://github.com/kittykatattack/learningPixi
//The code snippet appears in its original form

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    };
    event.preventDefault();
  };

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    };
    event.preventDefault();
  };

  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;


};

// End code snippet


// import * as tf from '@tensorflow/tfjs';

var can = document.getElementById("myCanvas");
var ctx = can.getContext("2d");

var rightPressed = false;
var leftPressed = false;



function guess(classId) {
  if (classId == 0) {
    Ellie.x -= 5;

  } else if (classId == 1) {
    Ellie.x += 5;

  }
}

//game.js end


//The code snippet below has been sourced from the
//https://github.com/tensorflow/tfjs-examples/tree/master/webcam-transfer-learning/ui.js &
//webcam.js & index.js & controll_dataset.js
//I also follwed this tutorial to learn how to use the Code
//https://js.tensorflow.org/tutorials/webcam-transfer-learning.html
//I intergrated them with PIXI.js game scene and use it to control game character
//The detail change of the code will be mentioned in the comment below in format : Code Change X

class Webcam {
  constructor(webcamElement) {
    this.webcamElement = webcamElement;
  }


  capture() {
    return tf.tidy(() => {
      const webcamImage = tf.fromPixels(this.webcamElement);
      const croppedImage = this.cropImage(webcamImage);
      const batchedImage = croppedImage.expandDims(0);
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }

  cropImage(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
  }

  adjustVideoSize(width, height) {
    const aspectRatio = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else if (width < height) {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  async setup() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true
          },
          stream => {
            this.webcamElement.srcObject = stream;
            this.webcamElement.addEventListener('loadeddata', async () => {
              this.adjustVideoSize(
                this.webcamElement.videoWidth,
                this.webcamElement.videoHeight);
              resolve();
            }, false);
          },
          error => {
            reject();
          });
      } else {
        reject();
      }
    });
  }
}

class ControllerDataset {
  constructor(numClasses) {
    this.numClasses = numClasses;
  }


  addExample(example, label) {
    const y = tf.tidy(() => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses));

    if (this.xs == null) {
      this.xs = tf.keep(example);
      this.ys = tf.keep(y);
    } else {
      const oldX = this.xs;
      this.xs = tf.keep(oldX.concat(example, 0));

      const oldY = this.ys;
      this.ys = tf.keep(oldY.concat(y, 0));

      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
  }
}
// Code change 1: In here I set up the different controller for the game character action
const CONTROLS = ['left', 'right'];
//change 1 end


// Code change 2: In here I write a Independent class to run the predict(guess) function
function uipredictClass(classId) {
  guess(classId);
  document.body.setAttribute('data-active', CONTROLS[classId]);
}
//change 2 end

let addExampleHandler;

function setExampleHandler(handler) {
  addExampleHandler = handler;
}

let mouseDown = false;
const totals = [0, 0, 0];

const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');


const thumbDisplayed = {};

async function handler(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');

  while (mouseDown) {
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerHTML = totals[label]++;
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}


leftButton.addEventListener('mousedown', () => handler(0));
leftButton.addEventListener('mouseup', () => mouseDown = false);

rightButton.addEventListener('mousedown', () => handler(1));
rightButton.addEventListener('mouseup', () => mouseDown = false);


function drawThumb(img, label) {
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    draw(img, thumbCanvas);
  }
}

function draw(image, canva) {
  const [width, height] = [224, 224];
  const ctx = canva.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}


const NUM_CLASSES = 3;


const webcam = new Webcam(document.getElementById('webcam'));

const controllerDataset = new ControllerDataset(NUM_CLASSES);

let mobilenet;
let model;

async function loadMobilenet() {
  const mobilenet = await tf.loadModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output
  });
}

setExampleHandler(label => {
  tf.tidy(() => {
    const img = webcam.capture();
    controllerDataset.addExample(mobilenet.predict(img), label);

    drawThumb(img, label);
  });
});


async function train() {
  if (controllerDataset.xs == null) {
    throw new Error('Add examples');
  }

  model = tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: [7, 7, 256]
      }),
      tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });


  // Code Change 3, In here I set the optimizer to a static number for reduce loss
  const optimizer = tf.train.adam(0.0001);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  });

  //Change 3 end
  const batchSize = Math.floor(controllerDataset.xs.shape[0] * 0.4);

  if (!(batchSize > 0)) {
    throw new Error('Batch size is 0');
  }

  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: 20,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        console.log(logs.loss.toFixed(5));
        await tf.nextFrame();
      }
    }
  });
}

let isPredicting = false;

async function predict() {
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      const img = webcam.capture();
      const activation = mobilenet.predict(img);
      const predictions = model.predict(activation);
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();

    uipredictClass(classId);

    await tf.nextFrame();
    console.log(classId);
  }
}


document.getElementById('train').addEventListener('click', async () => {
  await tf.nextFrame();
  await tf.nextFrame();
  isPredicting = false;
  train();
});

document.getElementById('predict').addEventListener('click', () => {

  isPredicting = true;
  predict();
});

async function init() {
  try {
    await webcam.setup();
  } catch (e) {
    // error code
  }
  mobilenet = await loadMobilenet();

  tf.tidy(() => mobilenet.predict(webcam.capture()));

}
init();
//Code Snippet end
