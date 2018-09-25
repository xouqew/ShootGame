//game.js

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
