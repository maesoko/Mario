enchant();

var game, stage, backgroundMap;

gsettings = {                 
  width:320
    ,height:320
    ,fps:30
};

direction = {
  left: -1
    ,right: 1
}

bearStatus = {
  wait: 0
    ,walk: 1
    ,jump: 2
};

bearSettings = {
  width: 32
    ,height: 32
    ,image: 'images/chara1.png'
    ,x: 160 - 16
    ,y: 320 - 16 - 32
    ,status: bearStatus.wait
    ,anim: [10,11,10,12]
    ,frame: 10
    ,speed: 3
    ,tileSizeX: 16
    ,tileSizeY: 33
};

padSettings = {
  x: 0
    ,y: 220
    ,images: ["apad.png"
    ,"font0.png"
    ,"icon0.png"
    ,"pad.png"]
};

var ePad = Class.create(Pad,{
  initialize:function(ps){
    Pad.call(this);
    this.x = ps.x;
    this.y = ps.y;
    stage.addChild(this);
  }
});

var Bear = Class.create(Sprite,{
  initialize:function(bs){
    Sprite.call(this);
    this.image = game.assets[bs.image];
    this.width = bs.width;
    this.height = bs.height;
    this.x = bs.x;
    this.y = bs.y;
    this.status = bs.status;
    this.anim = bs.anim;
    this.frame = bs.frame;
    this.speed = bs.speed;
    this.tileSizeX = bs.tileSizeX;
    this.tileSizeY = bs.tileSizeY;
    stage.addChild(this);
  }
             ,turnMove:function(direction){
               this.scaleX = direction;
               if(this.status != bearStatus.jump){
                 this.status = bearStatus.walk;
               }
             }
             ,turnUp:function(status){
               if(this.status != status){
                 this.status = bearStatus.wait;
               }
               this.status = status;
               this.age = 0;
             }
             ,jump:function(){
               if(this.status == bearStatus.jump){
                 if(this.age < 8){
                   this.y -= this.speed + 3;
                 } else {
                   this.status = bearStatus.wait;
                 }
               }

               if(backgroundMap.hitTest(
                     this.x + this.tileSizeX,this.y + this.tileSizeY)){
                       this.y += this.speed;
                     }
             }
             ,walk:function(){
               if(this.status == bearStatus.wait){
                 this.frame = this.anim[0];
               } else if(this.status == bearStatus.walk){
                 this.frame = this.anim[this.age % 4];
               } else if(this.status == bearStatus.jump){
                 this.frame = this.anim[1];
               }
             }
             ,onenterframe:function(){
               if(game.input.up){
                 this.turnUp(bearStatus.jump);
               }

               if(game.input.left){
                 this.turnMove(direction.left);
                 this.x -= this.speed;

                 if(backgroundMap.hitTest(
                       this.x, this.y)){
                         this.x += this.speed;
                       }
               }

               if(game.input.right){
                 this.turnMove(direction.right);
                 this.x += this.speed;

                 if(backgroundMap.hitTest(
                       this.x + this.tileSizeX, this.y)){
                         this.x -= this.speed;
                       }
               }

               if(!(game.input.left || game.input.right || game.input.up)){
                 this.status = bearStatus.wait;
               }

               if(this.status == bearStatus.jump){
                 this.jump();
               }

               if(backgroundMap.hitTest(
                     this.x + this.tileSizeX ,this.y + this.tileSizeY)){
                       this.y -= this.speed;
                     }

               this.y += this.speed;
               this.walk();
             }

});

var Background = Class.create(Map,{
  initialize:function(bgs){
    Map.call(this,bgs.width,bgs.height);
    this.image = game.assets[bgs.image];
    this.width = bgs.width;
    this.height = bgs.height;
    this.loadData(bgs.mapData);
    this.collisionData = bgs.colData;
    stage.addChild(this);
  }
});


bgSettings = {
  image: 'images/map1.png'
    ,width: 16
    ,height: 16
    ,mapData: [
    [80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,27,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,23,23,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,23,23,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,23,23,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,23,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,23,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,23,23,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,23,23,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,23,23,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80],
  [97,97,97,97,97,97,97,97,97,97,97,97,97,97,97,97,97,97,97,97]
    ]
    ,colData: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
};


window.onload = function(){

  game = new Core(gsettings.width,gsettings.height);
  game.fps = gsettings.fps;
  stage = game.rootScene;     
  game.preload(bearSettings.image,
      padSettings.images,
      bgSettings.image);
  game.onload=function(){
    backgroundMap = new Background(bgSettings); 
    new ePad(padSettings);
    new Bear(bearSettings);

  };
  game.start();

};
