


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
