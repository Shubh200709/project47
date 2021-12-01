var ship,shipImg,space,spaceImg;
var diamondImg,award,awardImg;
var burstImg,gameOver,gameOverImg;
var life,life2,life3,lifeImg,start,startImg,speed,speedImg;
var virusImg,laserImg,laserG;
var diamondG,virusG;

var live=3,score=0,mineral=0;

var gameState=0;
var burstS,alertS,shootS;
//var PLAY=0;
//var END;
//var INTRO=1;

var restart,restartImg;

function preload(){
shipImg=loadAnimation("image/plane.png");
spaceImg=loadImage("image/background.png");

diamondImg=loadImage("image/diamond.png");
awardImg=loadImage("image/award.png");

burstImg=loadAnimation("image/burstImg.png");
gameOverImg=loadImage("image/gameover.png");

lifeImg=loadImage("image/lifeline.png");
startImg=loadImage("image/startButton.png");
speedImg=loadImage("image/speed.png");

virusImg=loadImage("image/virus.png");
laserImg=loadImage("image/laser.png");

restartImg=loadImage("image/restart.png");

burstS=loadSound("sounds/burst.mp3");
//alertS=loadSound("sounds/siren.mp3");
shootS=loadSound("sounds/shoot.mp3");

}

function setup() {
  createCanvas(800,600);
  space=createSprite(400,0,1000,900);
  space.scale=2;
  space.addImage(spaceImg);
  space.visible=false;
  space.y=space.height/2;

  ship=createSprite(400,400,20,20);
  ship.addAnimation("shooting",shipImg);
  ship.addAnimation("destroyed",burstImg);
  ship.visible=false;

  life=createSprite(10,50,10,10);
  life.addImage(lifeImg);
  life.scale=0.1;
  life.visible=false;

  life2=createSprite(50,50,10,10);
  life2.addImage(lifeImg);
  life2.scale=0.1;
  life2.visible=false;

  life3=createSprite(90,50,10,10);
  life3.addImage(lifeImg);
  life3.scale=0.1;
  life3.visible=false;

  gameOver=createSprite(2*space.x-410,space.y-150);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  restart=createSprite(2*space.x-410,space.y-200);
  restart.addImage(restartImg);
  restart.scale=.039;
  restart.visible=false;

  start=createSprite(400,480,20,20);
  start.addImage(startImg);
  
  virusG=createGroup();
  diamondG=createGroup();
  laserG=createGroup();
  
}

function draw() {
  //background();
if(gameState===0){
background(0);

strokeWeight(1);
    stroke("0");
    fill("#00cec9");
    textSize(30);
    text("Welcome Players. Welcome to the year 2220.", width/7,height/4);

    //strokeWeight(2);
    //stroke("0");
    fill("yellow");
    textSize(20);
    text("Our world is in grave danger. Humans have consumed all the resources for dvelopment.",10,190);
    text("Now we humans are struggling because of it. But we still have one last hope left.",35,220);
    text("We can extract resources from space.",205,250);
    text("You can see your health on the top left corner.",155,280);
    text("Be careful of the space virus. If they touch you, your health will decrease.",55,310);
    text("Use Right and Left arrow keys to move the space ship.",125,340);
    text("press space key to shoot the virus.",210,370)
    text("Now the future lies in your hands.",215,400);

    fill("#00cec9");
    text("Good luck!!!",350,430);

    if(mousePressedOver(start)){
gameState=1;
start.visible=false;
    }
}

  if(gameState===1){
//spaceS.play();
    gameOver.visible=false;
    restart.visible=false;
    start.visible=false;

    life.visible=true;
    life2.visible=true;
    life3.visible=true;

    space.visible=true;
    ship.visible=true;

    ship.x=ship.x + random(1,-1);

    space.velocityY= (2 + score/80);
    score=score+Math.round(getFrameRate()/62);

    if(diamondG.isTouching(ship)){
mineral=mineral+1;
diamondG.destroyEach();
    }

    if(keyDown("Left_arrow")){
      ship.x=ship.x-4;
    }

    if(keyDown("right_arrow")){
      ship.x=ship.x+4;
    }

    if(space.y>500){
space.y=400;
space.x=400;
    }

    if(keyWentDown("space")){
createLaser();
shootS.play();
    }
    //creates virus on the canvas
    spawnVirus();

    //creates diamond on the canvas
    spawnDiamond();

    if(virusG.isTouching(ship)){
virusG.destroyEach();
live=live-1;
    }

    if(live<=2){
life3.visible=false;
    }

    if(live<=1){
      life2.visible=false;
      //alertS.play();
    }

    if(live<=0){
      life.visible=false;
      gameState=2;
      burstS.play();
    }

    if(laserG.isTouching(virusG)){
virusG.destroyEach();
laserG.destroyEach();
    }  

  }
  else if(gameState===2){
    gameOver.visible=true;
    restart.visible=true;

    //alertS.stop();

    ship.changeAnimation("destroyed",burstImg);
    ship.scale=0.4

    if(mousePressedOver(restart)){
reset();
    }

    space.velocityY=0;

    laserG.setVelocityYEach(0);
    virusG.setVelocityYEach(0);
    diamondG.setVelocityYEach(0);

    laserG.setLifetimeEach(-1);
    virusG.setLifetimeEach(-1);
    diamondG.setLifetimeEach(-1);
  }

drawSprites();
text("Score: "+score,2500,10);

  fill("gold");
  textSize(20);
  text("Mineral: "+mineral,500,70);

  fill("gold");
  textSize(20);
  text("Lives ",10,30);
console.log(space.velocityY);
}

function reset(){
 gameState=1;
  ship.changeAnimation("shooting",shipImg);
  ship.scale=1;
  ship.x=400;
  ship.y=400;
  
  life.visible=true;
  life2.visible=true;
  life3.visible=true;
 
  score=0;
  mineral=0;

  live=3;

  gameOver.visible=false;
  restart.visible=false;

  virusG.destroyEach();
  diamondG.destroyEach();
  laserG.destroyEach();
}

function spawnVirus(){
  if(frameCount % 100 === 0){
    var virus=createSprite(Math.round(random(10,1000)),0,20,20);
    virus.addImage(virusImg);
    virus.velocityY = (2 + 3*score/70);
    virus.lifetime=300;
    virus.scale=0.1;
    virusG.add(virus);
   }
}

function spawnDiamond(){
  if(frameCount % 150 === 0){
var diamond=createSprite(Math.round(random(10,1000)),0,20,20);
diamond.addImage(diamondImg);
diamond.velocityY = (2 + 2*score/70);
diamond.lifetime=300;
diamond.scale=.1;
diamondG.add(diamond);
  }
}

function createLaser(){
  var laser=createSprite(100,100,60,10);
  laser.addImage(laserImg);
  laser.scale=.1
  laser.x=ship.x;
  laser.y=ship.y-40;
  laser.velocityY=-4;
  laser.lifetime=200;
  laserG.add(laser);
  return laser;
}

function createLaser2(){
  var laser2=createSprite(100,100,60,10);
  laser2.addImage(laserImg);
  laser2.scale=.1
  laser2.x=ship.x+40;
  laser2.y=ship.y;
  laser2.velocityY=-4;
  laser2.lifetime=200;
  laserG.add(laser2);
  return laser2;
}