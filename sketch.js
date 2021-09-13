const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;

var stones = [];

var zombie1,zombie2,zombie3,zombie4

var backgroundimg

var breakButton

var collided = false

var sadv 

function preload() {
  zombie1 = loadImage("assets/zombie1.png")
  zombie2 = loadImage("assets/zombie2.png")
  zombie3 = loadImage("assets/zombie3.png")
  zombie4 = loadImage("assets/zombie4.png")

  backgroundimg = loadImage("assets/background.png")

  sad = loadImage("assets/sad_zombie.png")

  wood = loadImage("assets/wood.png")

  stone = loadImage("assets/stone.png")

  axe = loadImage("assets/axe.png")
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20, "#302121", true);
  leftWall = new Base(150, height / 2 + 50, 600, 100, "#472222", true);
  rightWall = new Base(width - 150, height / 2 + 50, 600, 100, "#472222", true);

  bridge = new Bridge(15, { x: width / 2 - 400, y: height / 2 });
  jointPoint = new Base(width - 450, height / 2 + 10, 40, 20, "yellow", true);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  zombie = createSprite(width/2, height -110);
  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft",zombie3,zombie4,zombie3)  
  zombie.addImage("sad",sad)
  zombie.scale = 0.1;
  zombie.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mouseClicked(handleButtonPress)


  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-10, 140);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }
}

function draw() {
  background(51);
  Engine.update(engine);
  image(backgroundimg,0,0,width,height);

  ground.show();
  bridge.show();
  leftWall.show();
  rightWall.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
  }
}
if (zombie.position.x >= width - 300 && !collided) {
  zombie.velocityX = -10;
  zombie.changeAnimation("righttoleft");
}

if (zombie.position.x <= 300 && !collided) {
  zombie.velocityX = 10;
  zombie.changeAnimation("lefttoright");
}
  drawSprites();
}

function handleButtonPress() {
  jointLink.detach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}