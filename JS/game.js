let Ellie, Ellie_run, state;


let run_array = [];

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";

}


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
app.renderer.resize(1920, 512);
app.renderer.backgroundColor = 0x34495e;

//The spirits images  below has been sourced from
//https://stensven.itch.io/zombie
//and
//https://petey90.itch.io/ellie-sprite-sheet


document.body.appendChild(app.view), PIXI.loader.add("Ellie/Frames/Ellie frame_idle_0.png").add("Ellie/Frames/Ellie frame_idle_1.png").add("Ellie/Frames/Ellie frame_idle_2.png").add("Ellie/Frames/Ellie frame_idle_3.png").add("Ellie/Frames/Ellie frame_run_0.png").add("Ellie/Frames/Ellie frame_run_1.png").add("Ellie/Frames/Ellie frame_run_2.png").add("Ellie/Frames/Ellie frame_run_3.png").add("Ellie/Frames/Ellie frame_run_4.png").add("Ellie/Frames/Ellie frame_run_5.png").add("Ellie/Frames/Ellie frame_run_6.png").add("Ellie/Frames/Ellie frame_run_7.png").add("Ellie/Frames/Ellie frame_run_8.png").add("Ellie/Frames/Ellie frame_run_9.png").add("Ellie/Frames/Ellie frame_run_10.png").add("Ellie/Frames/Ellie frame_run_11.png").add("Ellie/Frames/Ellie frame_run_12.png").add("Ellie/Frames/Ellie frame_shoot_0.png").add("Ellie/Frames/Ellie frame_shoot_1.png").add("Ellie/Frames/Ellie frame_shoot_2.png").add("Ellie/Frames/Ellie frame_shoot_3.png").add("Ellie/Frames/Ellie frame_aim_0.png").add("Ellie/Frames/Ellie frame_aim_1.png").add("Ellie/Frames/Ellie frame_aim_2.png").add("Ellie/Frames/Ellie frame_aim_3.png").add("Ellie/Frames/Ellie frame_aim_4.png").add("Ellie/Frames/Ellie frame_aim_5.png").add("Ellie/Frames/Ellie frame_aim_6.png").add("Ellie/Frames/Ellie frame_aim_7.png").add("Ellie/Frames/Ellie frame_death_0.png").add("Ellie/Frames/Ellie frame_death_1.png").add("Ellie/Frames/Ellie frame_death_2.png").add("Ellie/Frames/Ellie frame_death_3.png").add("Ellie/Frames/Ellie frame_death_4.png").add("Ellie/Frames/Ellie frame_death_5.png").add("Ellie/Frames/Ellie frame_death_6.png").add("Ellie/Frames/Ellie frame_death_7.png").add("Ellie/Frames/zombie_stand_1.png").add("Ellie/Frames/zombie_stand_2.png").add("Ellie/Frames/zombie_stand_3.png").add("Ellie/Spritesheet/Zombie_SpriteSheet.png").on("progress", loadProgress).load(setup);


//Bullet
let bullet = new PIXI.Graphics();
bullet.beginFill(0xe74c3c);
bullet.lineStyle(4, 0xe74c3c, 1);
bullet.drawRect(0, 0, 32, 6);
bullet.endFill();



let wall = new PIXI.Graphics();
wall.beginFill(0xe74c3c);
wall.lineStyle(4, 0xe74c3c, 1);
wall.drawCircle(0,12,128,50);
wall.endFill();
app.stage.addChild(wall);
wall.position.set(2000,400);

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


    let zombie_array = [];
    for (let $e = 0; $e < 3; $e++) {
    zombie_array.push(Ellie_spirit + "zombie_stand_" + ($e + 1) + ".png");

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
  zombie_stand = new PIXI.extras.AnimatedSprite.fromImages(zombie_array);
  app.stage.addChild(Ellie);



  state = play;

  app.ticker.add(delta => gameLoop(delta));

  Ellie.animationSpeed = 0.1;
  Ellie.play();
  Ellie.position.set(500, 300);
  Ellie.vx = 0;
  Ellie.vy = 0;






  right.press = () => {

    Ellie_run.vx = 0;
    app.stage.addChild(Ellie);
    app.stage.removeChild(Ellie_run);
    Ellie_run.position;
  };


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

  };

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

  };

}

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

  app.stage.addChild(zombie_stand);

  zombie_stand.animationSpeed = 0.1;
  zombie_stand.position.set(1500, 300);
  zombie_stand.width = 250;
  zombie_stand.height = 200;

  zombie_stand.play();
  //zombie

  let zombie_texture = TextureCache["Ellie/Spritesheet/Zombie_SpriteSheet.png"];


  let rectangle = new Rectangle(64, 0, 64, 64);



  //collision detect
  // if (hitTestRectangle(Ellie_run, wall)) {
  //   console.log('123');
  //   Ellie_run.stop();
  // }



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
    }
    event.preventDefault();
  };

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;


}

// End code snippet
