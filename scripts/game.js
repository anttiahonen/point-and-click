$(document).ready(function() {

function area(id, objArray, exitArray, left, right){
	var that = this;
	this.id = id;
	this.gameObjects = objArray;
	this.leftTriangle = left;
	this.rightTriangle = right;
	this.image = new Image();
	this.image.src = "images/area" +id+ "/background.png";
	this.exits = exitArray;
	
	this.draw = function(){
		try{
			context.drawImage(that.image, 0, 0);
		} catch (e) {
		
		}
	}

	this.collision = function(new_p_center_x, new_p_center_y){
  		//Pelaajan törmäyspiste muodostuu kahdesta pisteestä:
		var scale = new_p_center_y/500;
  		var p1_x = new_p_center_x - (scale*game.player.width)*0.5;
 		var p_y = new_p_center_y + (scale*game.player.heigth)*0.5;
  		var p2_x = new_p_center_x + (scale*game.player.width)*0.5;
		
		var j = 0;
		var curr = null;
		for (j = 0; j < that.exits.length; j++){
			curr = that.exits[j];
			if ( pointInRectangle2D(p1_x, p_y, curr.centerX - curr.width/2, curr.centerY - curr.heigth/2, curr.centerX + curr.width/2, curr.centerY + curr.heigth/2 )
			|| pointInRectangle2D(p2_x, p_y, curr.centerX - curr.width/2, curr.centerY - curr.heigth/2, curr.centerX + curr.width/2, curr.centerY + curr.heigth/2) ){
				//$('#debug').html('player left X:' +p1_x+ 'player bottomY:'+ p_y+ 'exit MinX:'+curr.centerX + curr.minX +'exit MinY'+curr.MinY+'exit MaxX'++'')
				if (pointInRectangle2D(p1_x, p_y, curr.centerX + curr.minX, curr.centerY + curr.minY, curr.centerX + curr.maxX, curr.centerY + curr.maxY )
				|| pointInRectangle2D(p2_x, p_y, curr.centerX + curr.minX, curr.centerY + curr.minY, curr.centerX + curr.maxX, curr.centerY + curr.maxY )){
					game.area = game.areas[curr.destinationAreaId];
					game.player.centerX = curr.playerDestinationX;
					var newScale = (curr.playerBottomDestinationY-100)/500;
					game.player.centerY = curr.playerBottomDestinationY - 0.5*game.player.heigth*newScale;
					return true;
				}
				else {
					return false;
				}
				
			}
		}
		
		
  		//Test against two area triangles with point in triangle test
  		//using players two points
  		if ( that.leftTriangle && pointInTriangle2D(p1_x , p_y, 0, 100, 500, 100, 0, 400) )
  		{
    			return true;
  		}

  		if ( that.rightTriangle && pointInTriangle2D(p2_x , p_y, 1000, 100, 500, 100, 1000, 400) )
  		{
    			return true;
  		}
	
  		//Test against game objects bounding boxes with type static/interactive so that if players points are inside bounding boxes collision occurs
  		//If type is collectible then check if objects center is inside players boning box
  		
		var i = 0;
		for (i = 0; i < that.gameObjects.length; i++)
 		{
			if (that.gameObjects[i].type == "static"  || that.gameObjects[i].type == "interactive")
			{
				if ( pointInRectangle2D(p1_x, p_y, that.gameObjects[i].centerX-(that.gameObjects[i].width/2), that.gameObjects[i].centerY + that.gameObjects[i].bbMinY, that.gameObjects[i].centerX+(that.gameObjects[i].width/2), that.gameObjects[i].centerY + that.gameObjects[i].bbMaxY)
				|| pointInRectangle2D(p2_x, p_y, that.gameObjects[i].centerX-(that.gameObjects[i].width/2), that.gameObjects[i].centerY + that.gameObjects[i].bbMinY, that.gameObjects[i].centerX+(that.gameObjects[i].width/2), that.gameObjects[i].centerY + that.gameObjects[i].bbMaxY) )
				{
					return true; 
				}
				
			}
  		}

  		return false;		
 	}

}

function exit(x, y, width, heigth, destArea, playerX, playerBottomY, minX, minY, maxX, maxY){
	var that = this;
	this.centerX = x;
	this.centerY = y;
	this.width = width;
	this.heigth = heigth;
	this.destinationAreaId = destArea;
	this.playerDestinationX = playerX;
	this.playerBottomDestinationY = playerBottomY;
	// collisionbox bounderies
	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
	
}

function player(anims){

	var that = this;
	this.centerX = 500;
	this.centerY = 350;
	this.width = 100;
	this.heigth = 200;
	this.inventory = new Array();
	this.selectedObject = null;
	this.movingDown = false;
	this.movingUp = false;
	this.movingLeft = false;
	this.movingRight = false;
	this.animations = anims;
	this.currentAnimation = 3;
	this.image = new Image();
	this.image.src = "images/character/character.png";
	
	this.moveSpeed = 0;
	this.diagonalMove = 0;
	
	this.move = function(){
		var scale = that.centerY/500;
		if (that.centerY > 330){
			that.moveSpeed = 4;
			that.diagonalMove = 3;
		}
		else {
		that.moveSpeed = 2;
		that.diagonalMove = 2;
		}
		if (that.movingLeft && that.movingRight){
			//Stand by
			that.currentAnimation = 3;
		}
		else if (that.movingUp && !that.movingLeft && !that.movingRight){
			that.moveUp(that.moveSpeed);
			that.currentAnimation = 4;
		}
		else if (that.movingDown && !that.movingLeft && !that.movingRight){
			that.moveDown(that.moveSpeed);
			that.currentAnimation = 2;
		}
		else if (that.movingRight && !that.movingUp && !that.movingDown){
			that.moveRight(that.moveSpeed);
			that.currentAnimation = 1;
		}
		else if (that.movingLeft && !that.movingUp && !that.movingDown){
			that.moveLeft(that.moveSpeed);
			that.currentAnimation = 0;
		}
		else if (that.movingUp && that.movingRight){
			that.moveUp(that.diagonalMove);
			that.moveRight(that.diagonalMove);
			that.currentAnimation = 4;
		}
		else if (that.movingUp && that.movingLeft){
			that.moveUp(that.diagonalMove);
			that.moveLeft(that.diagonalMove);
			that.currentAnimation = 4;
		}
		else if (that.movingDown && that.movingRight){
			that.moveDown(that.diagonalMove);
			that.moveRight(that.diagonalMove);
			that.currentAnimation = 1;
		}
		else if (that.movingDown && that.movingLeft){
			that.moveDown(that.diagonalMove);
			that.moveLeft(that.diagonalMove);
			that.currentAnimation = 0;
		}
	}
	this.moveUp = function(speed){
		var newY = that.centerY - speed;
		if (!game.area.collision(that.centerX, newY)){
			that.centerY = newY;
		}	
	}
	this.moveDown = function(speed){
		var newY = that.centerY + speed;
		if (!game.area.collision(that.centerX, newY)){
			
			that.centerY = newY;
		}
	}
	this.moveLeft = function(speed){
		var newX = that.centerX - speed;
		if (!game.area.collision(newX, that.centerY)){
			that.centerX = newX;
		}
	}
	this.moveRight = function(speed){
		var newX = that.centerX + speed;
		if (!game.area.collision(newX, that.centerY)){
			
			that.centerX = newX;
		}
	}
	
	this.pickUp = function(item){
		that.inventory.push(item);
		$('#inventory').append('<img src="'+item.invImg+'" title="'+item.name+': '+item.description+'" class="inventory"/>');
		var i = 0;
		for (i = 0; i < that.inventory.length; i++){
			$('#inventory > img:eq('+i+')').css('left', i*59 + "px")
		} 
		soundManager.play('pickUp');
	}
	
	this.removeItem = function(item, combine){
		var i = 0;
		
		for (i = 0; i < that.inventory.length; i++){
			if (item.name == that.inventory[i].name)
			{
				that.inventory.splice(i,1);
				that.selectedObject = null;
				$('#inventory > img:eq('+i+')').remove();
				if (!combine){
					var j = 0
					for (j = 0; i < that.inventory.length; j++){
						$('#inventory > img:eq('+j+')').css('left', j*59 + "px")
					}	
				}
		 	}
		}	
	}
	
	this.combineItem = function(item1, item2){
		if (item1.combine(item2)){
			newItem = item1.resultItem;
			that.removeItem(item1, true);
			that.removeItem(item2, true);
			that.pickUp(newItem);
			soundManager.play('combine');
		}
	}
	
	this.updateAnimation = function(){
		if (that.currentAnimation != -1){
			that.animations[that.currentAnimation].update();
		}
	}
	
	this.draw = function(){
		try{
			var scale = (that.centerY)/500;
			if (that.currentAnimation == -1){
				
				/*context.save();
				context.scale(scale, scale);*/
				context.drawImage(that.image, that.centerX-0.5*scale*that.width, that.centerY-0.5*scale*that.heigth, scale*that.width, scale*that.heigth);
				//context.restore();
			}
			else{
			    context.drawImage(that.animations[that.currentAnimation].image, that.animations[that.currentAnimation].getXoffSet(), 0,
				that.animations[that.currentAnimation].frameWidth, that.animations[that.currentAnimation].imageHeigth, that.centerX-0.5*scale*that.width, that.centerY-0.5*scale*that.heigth,
				scale*that.animations[that.currentAnimation].frameWidth, scale*that.animations[that.currentAnimation].imageHeigth);
			}
		} catch (e) {
		}
	}		
}

function animation(imgSrc, iWidth, iHeigth, fWidth, loop){
	var that = this;
	this.image = new Image();
	this.image.src = imgSrc + ".png";
	this.imageWidth = iWidth;
	this.imageHeigth = iHeigth;
	this.frameWidth = fWidth;
	this.currentFrame = 0;
	this.duration = this.imageWidth / this.frameWidth;
	this.loop = loop;
	this.playedOnce = false;
	
	this.getXoffSet = function(){
		return that.currentFrame * that.frameWidth;
	}
	
	this.update = function(){
		that.currentFrame += 1;
		if (that.currentFrame >= that.duration){
			this.playedOnce = true;
			that.currentFrame = 0;
			if (loop){
				return false;
			}
			return true;
		}
	}
	
}

function gameObject(x,y,width,heigth, bbMinY, bbMaxY, type, graph, name, description, animations, lookable, cItem, rItem, interaction, graph2, funcParams, sound){
	var that = this;
	this.centerX = x;
	this.centerY = y;
	this.width = width;
	this.heigth = heigth;
	this.bbMinY = bbMinY;
	this.bbMaxY = bbMaxY;
	this.depth = canvasHeigth - this.centerY - this.bbMaxY;
	this.name = name;
	this.description = description;
	this.image = new Image();
	this.image.src = graph + ".png";
	this.secondSource = graph2;
	this.invImg = graph + "_inventory.png";
	this.type = type;
	this.animations = animations;
	this.currentAnimation = -1;
	this.lookable = lookable;
	this.combineItem = null;
	this.resultItem = null;
	this.interaction =  interaction; 
	this.funcParams = funcParams;
	this.sound = sound;
	
	this.playSound = function(){
		if (that.sound != null){
			soundManager.play(that.sound);
		}	
	}
	
	this.updateAnimation = function(){
		if (that.currentAnimation != -1){
			if (that.animations[that.currentAnimation].update()){
				that.currentAnimation = -1;
				this.image.src = graph2 + ".png";
			}
		}
	}
	
	this.changeGraph = function(){
		that.image.src = that.secondSource + ".png";
		that.type = "graphic";
	}
	
	this.setCombine = function(item, result){
		that.combineItem = item;
		that.resultItem = result;
	}
	
	this.combine = function(cItem){
		if (cItem.combineItem == that){
			return true;
		}
	}
	
	this.draw = function(){
		try{
			if (that.currentAnimation == -1){
				context.drawImage(that.image, that.centerX-0.5*that.width, that.centerY-0.5*that.heigth);
			}
			else{
			    context.drawImage(that.animations[that.currentAnimation].image, that.animations[that.currentAnimation].getXoffSet(), 0,
				that.animations[that.currentAnimation].frameWidth, that.animations[that.currentAnimation].imageHeigth, that.centerX-0.5*that.width, that.centerY-0.5*that.heigth,
				that.animations[that.currentAnimation].frameWidth, that.animations[that.currentAnimation].imageHeigth);
			}
		} catch (e) {
		}
	}
	

	
}


function game(canvas,width,heigth, areas, animations){
	this.canvas = canvas;
	this.width = width;
	this.heigth = heigth;
	this.areas = areas;
	this.area = this.areas[0];
	canvas.width = this.width;
	canvas.height = this.heigth;
	this.player = new player(animations);
}

function drawGame(){
	var scale = (game.player.centerY)/500;
	//Draw background here
	game.area.draw();
	//sort GameObjects based on depth
	game.area.gameObjects.sort(depthSort);
	//Depth is the distance from area bottom to objects bounding boxes bottom
	//The object with greatest depth comes first		
	var playerDrawn = false;
	var i = 0;
	for (i = 0; i < game.area.gameObjects.length; i++){
		
		if ( playerDrawn == false){
				if (game.area.gameObjects[i].depth < game.heigth - game.player.centerY - game.player.heigth/2 * scale ){
					playerDrawn = true;
					game.player.draw();
				}
		}
		game.area.gameObjects[i].draw();
	}
	
	if (playerDrawn == false){
		game.player.draw();
	}
	

}

function depthSort(a,b){
	return b.depth - a.depth;
}

function onKeyDown(evt){
	if (evt.keyCode == 100 || evt.keyCode == 68){
		game.player.movingRight = true;	
	}
	else if (evt.keyCode == 97 || evt.keyCode == 65){
		game.player.movingLeft = true;
	}
	else if (evt.keyCode == 119 || evt.keyCode == 87){
		game.player.movingUp = true;
	}
	else if (evt.keyCode == 115  || evt.keyCode == 83){
		game.player.movingDown = true;
	}
	
}


function onKeyUp(evt){
	if (evt.keyCode == 100 || evt.keyCode == 68){
		game.player.movingRight = false;	
	}
	else if (evt.keyCode == 97 || evt.keyCode == 65){
		game.player.movingLeft = false;
	}
	else if (evt.keyCode == 119 || evt.keyCode == 87){
		game.player.movingUp = false;
	}
	else if (evt.keyCode == 115  || evt.keyCode == 83){
		game.player.movingDown = false;

	}
	
	if (game.player.movingLeft == false && game.player.movingRight == false && game.player.movingUp == false && game.player.movingDown == false)
	{
		game.player.currentAnimation = 3;
	}
}


$('.inventory').live('click', function(){
	$('.selected').removeClass("selected noClass").addClass("inventory");
	var index = $('.inventory').index(this);
	if (!combineSelect){
		$(this).removeClass("inventory noClass").addClass("selected");
		game.player.selectedObject = game.player.inventory[index];
		combineSelect = true;
		return true;
	}
	else{
		if (game.player.selectedObject.combine(game.player.inventory[index])){
			game.player.combineItem(game.player.selectedObject, game.player.inventory[index]);
			game.player.selectedObject = null;
			combineSelect = false;
			return true;
		}
		else{
			$(this).removeClass("inventory noClass").addClass("selected");
			game.player.selectedObject = game.player.inventory[index];
		}
	}
	combineSelect = true;
});

$('.selected').live('click', function(){
	$(this).removeClass("selected noClass").addClass("inventory");
	game.player.selectedObject = null;
	combineSelect = false;
});

$('#zoomBox > img:eq(1)').click(function(){
	zoomOff();
})

function onMouseMove(evt) {
	if (evt.pageX > canvasMinX && evt.pageX < canvasWidth && evt.pageY > canvasMinY && evt.pageY < canvasHeigth) {
		var i = 0; 
		var check = false;
		for (i = 0; i < game.area.gameObjects.length; i++)
		{
			if (game.area.gameObjects[i].type == "interactive" || game.area.gameObjects[i].type == "collectible"){
				if ( pointInRectangle2D(evt.pageX-8, evt.pageY-8, game.area.gameObjects[i].centerX-(game.area.gameObjects[i].width/2), game.area.gameObjects[i].centerY - game.area.gameObjects[i].heigth/2,
				game.area.gameObjects[i].centerX+(game.area.gameObjects[i].width/2), game.area.gameObjects[i].centerY + game.area.gameObjects[i].heigth/2) )
				{
					$('canvas').css('cursor', 'pointer');
					check = true;
				}
			}
			
		}
		
		if (check == false)
			$('canvas').css('cursor', 'crosshair');
		
	}
}

function onMouseDown(evt){
	var i = 0; 
	for (i = 0; i < game.area.gameObjects.length; i++)
	{
		if (game.area.gameObjects[i].type == "interactive" || game.area.gameObjects[i].type == "collectible" )
		{
			if ( pointInRectangle2D(evt.pageX-8, evt.pageY-8, game.area.gameObjects[i].centerX-(game.area.gameObjects[i].width/2), game.area.gameObjects[i].centerY - game.area.gameObjects[i].heigth/2,
			game.area.gameObjects[i].centerX+(game.area.gameObjects[i].width/2), game.area.gameObjects[i].centerY + game.area.gameObjects[i].heigth/2) )
			{
				var distance = Math.sqrt( Math.pow( (game.player.centerX - game.area.gameObjects[i].centerX), 2) + Math.pow( (game.player.centerY - game.area.gameObjects[i].centerY), 2) );
				if (game.area.gameObjects[i].type == "interactive")
				{
					if (distance <  100.0)
					{
						if (game.area.gameObjects[i].interaction != null){
							game.area.gameObjects[i].interaction(game.area.gameObjects[i].funcParams, game.player.selectedObject, false, i);
							}

					}
					else {
						pickUp(null, null, true, i);
					}
				}
				else
				{

					if (distance <  100.0)
					{
						game.player.pickUp(game.area.gameObjects[i]);
						game.area.gameObjects.splice(i,1);
					}
					else {
						pickUp(null, null, true, i);
					}
				}
			}
		}
	}
}

function onMouseUp(evt){
}

function pointInTriangle2D(px, py, Ax, Ay, Bx, By, Cx, Cy)
{
	//Calculate vector V1 from A to B
	var V1_x = Bx - Ax;
	var V1_y = By - Ay;
	
	//Calculate vector V2 from A to C
	var V2_x = Cx - Ax;
	var V2_y = Cy - Ay;

	//Calculate cross product V1xV2
	var V1xV2 = V1_x*V2_y - V1_y*V2_x;

	//Calculate term a=((VxV2)-(V0xV2))/(V1xV2), V0 is (Ax,Ay) and V is (px, py)
	var a = ( (px*V2_y - py*V2_x) - (Ax*V2_y - Ay*V2_x) ) / V1xV2;
	//Calculate term b=((VxV1)-(V0xV1))/(V1xV2), V0 is (Ax,Ay) and V is (px, py)
	var b = -( (px*V1_y - py*V1_x) - (Ax*V1_y - Ay*V1_x) ) / V1xV2;

	//If a,b >= 0 and a+b <= 1 then point is within triangle (or on the edges)
	//If we want to exclude edges we would calculate a > 0.0 && b > 0.0 && a+b < 1.0
	if (a >= 0.0 && b >= 0.0 && a+b <= 1.0)
	{
		return true;
	}
	return false;
}

function pointInRectangle2D(px, py, minX, minY, maxX, maxY)
{
	//$('#debug').html('px:'+px+', py:'+py+', minX:'+minX+', minY:'+minY+', maxX:'+maxX+', maxY:'+maxY);
	if (px > minX && px < maxX && py > minY && py < maxY){
		return true;
	}
	return false;
}



var mainLoop = function(){
	counter += 1;
	drawGame();
	if (game.player.currentAnimation != 3){
		if (counter % 2 == 0){
			game.player.updateAnimation();
		}
	}
	else if (counter % 3 == 0)
	{
		game.player.updateAnimation();
	}
	if (counter % 3 == 0){
		var i = 0
		for(i = 0; i < game.area.gameObjects.length; i++){
			
			game.area.gameObjects[i].updateAnimation();
		}
	}
	if (game.area.id != 4){
		game.player.move();
		gLoop = setTimeout(mainLoop, 1000/25);
	}
	else {
		$('#inventory').slideUp();
		soundManager.stopAll();
		soundManager.play('endMusic');
	}	 
}

/* INTERACTION FUNCTION */

var zoom = function(imageName){
	$('#zoomBox > img:eq(0)').attr('src', imageName + ".png");
	$('#zoomBox').css('display', 'block');
	if ($('#zoomBox').css('-webkit-animation-name') != 'zoomIn'){
		$('#zoomBox').css('-webkit-animation-name', 'zoomIn');
		$('#zoomBox').css('-webkit-animation-duration', '200.0s');
		setTimeout(function() {
					$('#zoomBox').css('-webkit-animation-name', 'zoomOut');
					$('#zoomBox').css('-webkit-animation-duration', '2.0s');
		}, 200000);
		setTimeout(function() {
					$('#zoomBox').css('-webkit-animation-name', '');
					$('#zoomBox').css('-webkit-animation-duration', '');
		}, 202000);
	}
}

var zoomOff = function(){
	$('#zoomBox').css('-webkit-animation-name', 'zoomOut');
	$('#zoomBox').css('-webkit-animation-duration', '2.0s');
	setTimeout(function() {
		$('#zoomBox > img:eq(0)').attr('src', '');
		$('#zoomBox').css('display', 'none');
		$('#zoomBox').css('-webkit-animation-name', '');
		$('#zoomBox').css('-webkit-animation-duration', '');
	}, 2000);
	
}

var pickUp = function(array,usedItem, distance, i){	
	if (array != null){
		var correctItem = array[0];
		var pickUpItem = array[1];
		var correctMessage = array[2];
		var wrongMessage = array[3];
		var newExit = array[4];
		var parentObject = array[5];
	}
	if (usedItem == null && game.area.gameObjects[i].lookable){
		if (!distance){
			zoom(game.area.gameObjects[i].secondSource);
		}
		else {
			calculateCSS();
			$('#messages').html(distanceMessage);
		}
	}
	else{
		calculateCSS();
		if (distance){
			$('#messages').html(distanceMessage);
		}
		else if (usedItem == null && game.area.gameObjects[i].lookable == true){
			
		}
		else if (usedItem == correctItem){
			if (game.area.gameObjects[i].animations != null){
				if (game.area.gameObjects[i].animations[0].playedOnce){
					game.area.gameObjects[i].currentAnimation = -1;
				}
				else{
				game.area.gameObjects[i].currentAnimation = 0;
				}
			}
			$('#messages').html(correctMessage);
			if (pickUpItem != null){
				game.player.pickUp(pickUpItem);
				game.area.gameObjects[i].interaction = null;
				game.area.gameObjects[i].type = "static";
				game.area.gameObjects[i].playSound();
				if (game.area.gameObjects[i].secondSource != "" && game.area.gameObjects[i].secondSource != undefined && !game.area.gameObjects[i].lookable){
					game.area.gameObjects[i].changeGraph();
				}
			}
			else {
				if (usedItem != null){
					game.area.gameObjects[i].playSound();
					if (parentObject != undefined && parentObject.secondSource != "" && parentObject.secondSource != undefined){
						parentObject.changeGraph();
					}
					else if (game.area.gameObjects[i].secondSource != "" && game.area.gameObjects[i].secondSource != undefined && !game.area.gameObjects[i].lookable){
						game.area.gameObjects[i].changeGraph();
					}
					else {
						game.area.gameObjects.splice(i,1);
					}
					//game.player.removeItem(usedItem);
					if (newExit != null){
						game.area.exits.push(newExit);
						if (parentObject == null){
							game.area.image.src = "images/area" +game.area.id+ "/background2.png";
							game.area.gameObjects.push(frontWall1);
						}
					}				
				}

			}
		}
		else {
			$('#messages').html(wrongMessage);
		}
	}			
}

var moveAndPlacePick = function(array,usedItem, distance, i){
	game.area.gameObjects[i].centerX += 50;
	game.area.gameObjects[i].interaction = null;
	game.area.gameObjects[i].type = "static";
	setTimeout(function(){game.area.gameObjects.push(pick1)}, 50);	
}



var calculateCSS = function(){
	if ($('#messages').css('-webkit-animation-name') != 'buble_appear'){
		$('#messages').css('-webkit-animation-name', 'buble_appear');
		$('#messages').css('-webkit-animation-duration', '3.0s');
		setTimeout(function() {
			$('#messages').css('-webkit-animation-name', '');
			$('#messages').css('-webkit-animation-duration', '');
		}, 3000);
	}

	if (game.player.centerX > 1000 || game.player.centerX < 0){
		$('#messages').css('left', 380);
		$('#messages').css('top', 230);
	}
	else if (game.player.centerX > 600)
	{
		$('#messages').css('left', game.player.centerX-300);
		$('#messages').css('top', game.player.centerY-game.player.heigth*0.8);
	}
	else {
		$('#messages').css('left', game.player.centerX+game.player.width-10);
		$('#messages').css('top', game.player.centerY-game.player.heigth*0.8);
	}
	$('#messages').css('width', 340);

}



$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);
$(document).mousemove(onMouseMove);
$(document).mousedown(onMouseDown);
$(document).mouseup(onMouseUp);

if ($.browser.mozilla){
	soundManager.preferFlash = true;
}
else{
	soundManager.preferFlash = false;
}
soundManager.url = 'swf/';
soundManager.useFlashBlock = false;


soundManager.onready(function() {
	  soundManager.createSound({
		  id: 'pickUp',
		  url: 'sounds/click.mp3',
		  autoLoad: true,
		  volume: 200
	  });
	  soundManager.createSound({
		  id: 'musa',
		  url: 'sounds/musa.mp3',
		  autoLoad: true,
		  loops: 100,
		  volume: 60
	  });
	  soundManager.createSound({
		 id: 'break',
		 url: 'sounds/break.wav',
		 autoLoad: true,
		 volume: 100
	  });
	  soundManager.createSound({
		 id: 'combine',
		 url: 'sounds/combine.wav',
		 autoLoad: true,
		 volume: 100
	  });
	  soundManager.createSound({
		 id: 'door',
		 url: 'sounds/door_open.wav',
		 autoLoad: true,
		 volume: 100
	  });
	  soundManager.createSound({
		 id: 'hack',
		 url: 'sounds/hack.wav',
		 autoLoad: true,
		 volume: 100
	  });
	  soundManager.createSound({
		 id: 'toilet',
		 url: 'sounds/toilet_open.wav',
		 autoLoad: true,
		 volume: 100
	  });
	  soundManager.createSound({
		 id: 'endMusic',
		 url: 'sounds/end.mp3',
		 autoLoad: true,
		 volume: 80
	  });
});


var counter = 0;
var animationCounter = 0;
var canvas = $('#canvas')[0];
var context = canvas.getContext("2d");
var canvasWidth = 1000;
var canvasHeigth = 500;
var areas = new Array();

var canvasMinX = 0;
var canvasMinY = 0;

var playerAnimations = new Array();
var pAnimLeft = new animation("images/character/character_left", 1200, 200, 100, true);
var pAnimRight = new animation("images/character/character_right", 1200, 200, 100, true);
var pAnimDown = new animation("images/character/character_down", 1200, 200, 100, true);
var pAnimIdle = new animation("images/character/character_idle", 700, 200, 100, true);
var pAnimUp = new animation("images/character/character_up", 1200, 200, 100, true);
playerAnimations.push(pAnimLeft);
playerAnimations.push(pAnimRight);
playerAnimations.push(pAnimDown);
playerAnimations.push(pAnimIdle);
playerAnimations.push(pAnimUp);

var distanceMessage = "Can't reach that far!";

/* AREA1 stuff */
var area1Obj = new Array();
var backWall1 = new gameObject(500,300,1000,42, 0, 21, "static", "images/empty", "seina", "seina", null, false);
var leftWall1 = new gameObject(-50,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var rightWall1 = new gameObject(1050,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var toiletBox = new gameObject(775,300,55,120, -60, 60, "static", "images/empty", "toilet", "toilet", null, false);
var bed = new gameObject(250,300,293,126, -63, 63, "static", "images/area0/bed", "bed", "bed", null, false);
var pick1 = new gameObject(150,290,20,10, 10, 73, "collectible", "images/area0/pick1", "Metal pin", "A piece of metal", null, false);
var pick2 = new gameObject(760,250,70,120, -60, 60, "graphic", "images/area0/pick2", "Metal pin", "A piece of metal", null, false);
var pillow = new gameObject(150,283,50,20, 15, 80, "interactive", "images/area0/pillow", "pillow", "pillow", null, false, null, null, moveAndPlacePick);
var lockPick = new gameObject(760,250,70,120, -60, 60, "graphic", "images/area0/lockpick", "Lockpick", "Something might get opened with this..", null, false);

pick1.setCombine(pick2, lockPick);
pick2.setCombine(pick1, lockPick);

var toiletAnims = new Array();
var toiletAnim = new animation("images/area0/toilet_anim", 350, 117, 70, false)
toiletAnims.push(toiletAnim);

//var pickUp = function(correctItem,pickUpItem, correctMessage, wrongMessage,usedItem, distance){
var toiletParams = new Array();
toiletParams.push(null);
toiletParams.push(pick2);
toiletParams.push("You found something from the filthy toilet");
toiletParams.push("I don't want to stick that in there!");
var toilet = new gameObject(760,250,50,20, 10, 5, "interactive", "images/area0/toilet", "toilet", "toilet", toiletAnims, false, null, null, pickUp,"images/area0/toilet_open", toiletParams, 'toilet');




area1Obj.push(backWall1);
area1Obj.push(leftWall1);
area1Obj.push(rightWall1);
area1Obj.push(toiletBox);
area1Obj.push(toilet);
area1Obj.push(bed);
area1Obj.push(pillow);

var area1exits = new Array();
var area1exit = new exit(500, 700, 1000, 100, 1, 500, 210, -500, -10, 500, 10);
area1exits.push(area1exit);

var area1 = new area(0, area1Obj, area1exits, true, true);



/* AREA2 stuff */
var area2exits = new Array();
var area2exit = new exit(53, 327, 170, 23, 2, 920, 320, -30, -12, -10, 12);
var area2exit2 = new exit(500, 210, 150, 20, 0, 500, 530, -75, -12, 75, 12);
area2exits.push(area2exit2);

var area2Obj = new Array();
var backWall2 = new gameObject(500,140,1000,42, 0, 40, "static", "images/empty", "seina", "seina", null, false);
var leftWall2 = new gameObject(-50,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var rightWall2 = new gameObject(1050,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var cellWall1 = new gameObject(655,200,155,50, -25, 36, "static", "images/empty", "seina", "seina", null, false);
var cellWall2 = new gameObject(340,200,145,50, -25, 36, "static", "images/empty", "seina", "seina", null, false);
var bottomWall1 = new gameObject(500,600,1000,42, 0, 20, "static", "images/empty", "seina", "seina", null, false);
var cell = new gameObject(450,235,120,42, -2, 1, "static", "images/empty", "seina", "seina", null, false);
var axe = new gameObject(290,195,30,80, 0,32, "collectible", "images/area1/axe", "Axe", "Ment for hacking things", null, false);
bVaseParams = new Array();
bVaseParams.push(null);
bVaseParams.push(null);
bVaseParams.push("Oh what a beautiful vase");
bVaseParams.push("That doesn't work");
var bVase = new gameObject(880,305, 40, 80, 30,40, "interactive", "images/area1/vase", "Vase", "Vase", null, false, null, null, pickUp, "", bVaseParams);

var boardParams = new Array();
boardParams.push(axe);
boardParams.push(null);
boardParams.push("You hack your way out of here.");
boardParams.push("These boards won't move anywhere!");
boardParams.push(area2exit);
var boards = new gameObject(110,210,119,210, 0, 0, "interactive", "images/empty", "seina", "seina", null, false, null, null, pickUp, "", boardParams, 'hack');

var leftCell = new gameObject(500,250,1000,500, -15, -15, "graphic", "images/area1/bars", "seina", "seina", null, false); 
var frontWall1 = new gameObject(500,250,1000,500, 90, 91, "graphic", "images/area1/frontWall", "seina", "seina", null, false);
var door1 =	new gameObject(500,250,1000,500, -15, -15, "graphic", "images/area1/door1", "seina", "seina", null, false);
var table = new gameObject(500, 420, 300, 100, 20, 50, "static", "images/area1/table", "table", "table", null, false);

var doorParams = new Array();
doorParams.push(lockPick);
doorParams.push(null);
doorParams.push("Ah, the cell door opens.");
doorParams.push("The door won't budge at all with this effort!");
var door2 = new gameObject(540,180,62,108, 52, 55, "interactive", "images/area1/celldoor", "seina", "seina", null, false, null, null, pickUp, "", doorParams, 'door');

var door3 = new gameObject(500,250,1000,500, -15, -15, "graphic", "images/area1/door3", "seina", "seina", null, false);


/* push objects */
area2Obj.push(backWall2);
area2Obj.push(leftWall2);
area2Obj.push(rightWall2);
area2Obj.push(cellWall1);
area2Obj.push(cellWall2);
area2Obj.push(bottomWall1);
area2Obj.push(leftCell);
area2Obj.push(axe);
area2Obj.push(cell);
//area2Obj.push(frontWall1);
area2Obj.push(door1);
area2Obj.push(door2);
area2Obj.push(door3);
area2Obj.push(boards);
area2Obj.push(bVase);
area2Obj.push(table);


var area2 = new area(1, area2Obj, area2exits, true, true);




/* AREA3 stuff */
var area3Obj = new Array();

var tool = new gameObject(200,420,20,30, 0, 100, "collectible", "images/area3/tool", "Garden tool", "Used for digging ground", null, false);;
var keyHalf1 = new gameObject(760,250,70,120, -60, 60, "graphic", "images/area2/key1", "Golden piece", "Some strange golden object, looks like a half of something bigger", null, false);

var backWall3 = new gameObject(500,225,1000,40, 0, 20, "static", "images/empty", "seina", "seina", null, false);
var rightWall3 = new gameObject(1050,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var hedge = new gameObject(500,250,1000,500,230,250, "static", "images/area2/hedge", null, false);
var vaseParams = new Array();
vaseParams.push(axe);
vaseParams.push(null);
vaseParams.push("Now it is all broken up.");
vaseParams.push("This vase needs flowers badly.");
var vase = new gameObject(835,475,40,50,20,25, "interactive", "images/area3/vase2", "vaasi", "vaasi", null, false, null, null, pickUp, "images/area3/vase2_broken", vaseParams, 'break');
var vase2 = new gameObject(240,475,40,50,20,25, "interactive", "images/area3/vase2", "vaasi", "vaasi", null, false, null, null, pickUp, "images/area3/vase2_broken", vaseParams, 'break');

var wallParams = new Array();
wallParams.push(tool);
wallParams.push(keyHalf1);
wallParams.push("You get some strange object from the wall..");
wallParams.push("The tile doesn't move at all!");
var wallTile = new gameObject(650,190,40,30, 0, 0, "interactive", "images/empty", "seina", "seina", null, true, null, null, pickUp, "images/area2/wall_zoom", wallParams);

var houseWall = new gameObject(500,250,1000,500, 90, 91, "graphic", "images/area2/house_front", "seina", "seina", null, false);

area3Obj.push(houseWall);
area3Obj.push(backWall3);
area3Obj.push(rightWall3);
area3Obj.push(hedge);
area3Obj.push(wallTile);
area3Obj.push(vase);
area3Obj.push(vase2);

var area3exits = new Array();
var area3exit = new exit(950, 326, 200, 30, 1, 80, 320, -4, -30, 20, 30);
var area3exit2 = new exit(-50, 250, 100, 700, 3, 1000, 350, 0, -250, 10, 400);
area3exits.push(area3exit);
area3exits.push(area3exit2);

var area3 = new area(2, area3Obj, area3exits, false, true);



/* AREA4 stuff */
var area4Obj = new Array();

var hedge2 = new gameObject(500,250,1000,500,230,250, "static", "images/area3/hedge", null, false);
var backWall4 = new gameObject(500,225,1000,40, 0, 20, "static", "images/empty", "seina", "seina", null, false);
var leftWall3 = new gameObject(-50,250,100,500, -350, 350, "static", "images/empty", "seina", "seina", null, false);
var frontWall4 = new gameObject(500,250,1000,500,0,124, "graphic", "images/area3/frontwall", "seina", "seina", null, false);
var keyHalf2 = new gameObject(760,250,70,120, -60, 60, "graphic", "images/area3/key2", "Golden piece", "Some strange golden object, looks like a half of something bigger", null, false);
var key = new gameObject(760,250,70,120, -60, 60, "graphic", "images/area3/key", "Golden object", "Some strange golden star-shaped object", null, false);

keyHalf1.setCombine(keyHalf2, key);
keyHalf2.setCombine(keyHalf1, key);

var closedGate = new gameObject(500,250,1000,500,0,22, "graphic", "images/area3/gate_closed", "ovi", "ovi", null, false, null, null, null, "images/area3/gate_open");


var vase3 = new gameObject(275,475,40,50,20,25, "interactive", "images/area3/vase2", "vaasi", "vaasi", null, false, null, null, pickUp, "images/area3/vase2_broken", vaseParams, 'break');
var vase2Params = new Array();
vase2Params.push(axe);
vase2Params.push(keyHalf2);
vase2Params.push("You found some strange object from the vase..");
vase2Params.push("This vase needs flowers badly.");
var vase4 = new gameObject(870,475,40,50,20,25, "interactive", "images/area3/vase2", "vaasi", "vaasi", null, false, null, null, pickUp, "images/area3/vase2_broken", vase2Params, 'break');

area4Obj.push(hedge2);
area4Obj.push(backWall4);
//area4Obj.push(bottomWall3);
area4Obj.push(leftWall3);
area4Obj.push(tool);
area4Obj.push(frontWall4);
area4Obj.push(vase3);
area4Obj.push(vase4);
area4Obj.push(closedGate);


var area4exits = new Array();
var area4exit = new exit(1050, 250, 100, 700, 2, 0, 350, 0, -250, 10, 600);
var area4exit2 = new exit(-20,323, 500, 101, 4, -200, 300, -50, -50, 0, 50);
area4exits.push(area4exit);

var lockParams = new Array();
lockParams.push(key);
lockParams.push(null);
lockParams.push("Lets hope that freedom lies outside!");
lockParams.push("A massive lock, propably needs the right key.");
lockParams.push(area4exit2);
lockParams.push(closedGate);
var lock = new gameObject(127,255, 20, 20, 0, 0, "interactive", "images/empty", "lukko", "lukko", null, true, null, null, pickUp, "images/area3/lock_zoom", lockParams, 'door');
area4Obj.push(lock);

var area4 = new area(3, area4Obj, area4exits, true, false);

/* AREA5 stuff */

var area5Obj = new Array();
var area5exits = new Array();
var area5 = new area(4, area5Obj, area5exits, false, false);


// init game //
areas.push(area1);
areas.push(area2);
areas.push(area3);
areas.push(area4);
areas.push(area5);


var game = new game(canvas,canvasWidth,canvasHeigth, areas, playerAnimations);	
var combineSelect = false;

mainLoop();

});



