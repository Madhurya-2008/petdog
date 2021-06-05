var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed;
var lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
bg=loadImage("bg.jpg")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  
  feedDog=createButton("Feed the Dog");
  feedDog.position(700,95);
  feedDog.mousePressed(feed_dog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(bg);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime=database.ref('FeedTime');
  feedTime.on("value",function(data){
  lastFed = data.val();
  })
    //write code to display text lastFed time here
  if(lastFed>=12){
    fill("white");
    textSize(15);
text("Last Fed:"+ lastFed %12+"PM",350,30);
  }else if(lastFed == 0){
    fill("white");
    textSize(15);
    text("Last Fed : 12 AM",350,30);
  }else{
    fill("white");
    textSize(15);
    text("Last Fed:"+ lastFed+"AM",350,30);
  }

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feed_dog(){
  dog.addImage(happyDog);

//write code here to update food stock and last fed time
var food_stock_val = foodObj.getFoodStock();

if(food_stock_val<=0){
  foodObj.updateFoodStock(food_stock_val*0);
}else{
  foodObj.updateFoodStock(food_stock_val-1);

}
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
})
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
