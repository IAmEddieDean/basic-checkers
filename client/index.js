'use strict';
$(document).ready(init);

//global vars
var current = 'red'; //current active player, a later function resets this every turn
var $source; //source coords, captured from $(this) on var select
var enemy = 'red';
function init(){ //this function initializes the start of the game by calling other functions in the code
  initBoard();
  switchUser();
  $('#board').on('click', '.active', select); //this click handler allows the active player to select a piece on the board by clicking on it
  $('#board').on('click', '.empty', move);
  $('#board').on('click', '.active', isEnemy);    //this click handler allows the selected piece to be moved to an empty space
}
function move(){
  if(!$source){ //this checks if there is a current piece selected, if not, RETURN, repeat function
    return;
  }
  var $target = $(this); //sets the target destination
  var isKing = $source.is('.king'); //this checks for a specific attribute, in this case, a class.

  var src = {}; //object to store x-y coords for the starting piece
  var tgt = {}; //object to store x/y coords for destination square

  src.x = $source.data('x') * 1; //multiplying by 1 prevents the need for a parseInt or parseFloat method
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  var compass = {};
  compass.north = (current === 'black') ? -1 : 1; //this var sets a relative compass for each side of the board
  compass.east = (current === 'black') ? 1 : -1; //that way you can use one function for both sides and not have
  compass.west = compass.east * -1;              //to account for the inverse x,y coords
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)){ //this switch loop will send arguments to the function moveType, which will
    case 'move':                               //determine the type of move. Based on the result of function moveType, it
      console.log('move');                     //will call either the movePiece or jumpPiece functions
      movePiece($source, $target);
      switchUser();
      break;
    case 'jump':
      jumpPiece($source, $target);
      
      console.log('jump');
  }
}

/*function jump($source){
  
  var $target = $(this); //sets the target destination
  var isKing = $source.is('.king'); //this checks for a specific attribute, in this case, a class.

  var srcJ = {}; //object to store x-y coords for the starting piece
  var tgtJ = {}; //object to store x/y coords for destination square

  var compass = {};
  compass.north = (current === 'black') ? -1 : 1; //this var sets a relative compass for each side of the board
  compass.east = (current === 'black') ? 1 : -1; //that way you can use one function for both sides and not have
  compass.west = compass.east * -1;              //to account for the inverse x,y coords
  compass.south = compass.north * -1;
  
  jumpPiece($source, $target);
}*/
function jumpPiece($source, $target){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}

function movePiece($source, $target){ //this function moves the piece by swapping the classes of the source and the target
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');

  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);
}

function moveType(src, tgt, compass, isKing){ //this function will evaluate the type of move, (regular move, or a jump),
  if(isMove(src, tgt, compass, isKing)){      //based on the 4 arguments passed to it, and the result of the SWITCH
    return 'move';                            //loop in the MOVE function
  }

  if(isJump() && isEnemy()){
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing){  //this function actually determines if the tgt destination is a valid location
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y || (isKing && src.y + compass.south === tgt.y));
}      //above code compares the src coords with the coords of the target, you can only ever move 1 space away on both axes
       //it accounts for the 'King' class by adding an or ( || ) statement for king's ability to move south
function isJump(isEnemy, isMove){
  if((isEnemy) && (!isMove)){
    return true;
  }
}

function isEnemy(){ //this ternary will determine if the piece in front is
  enemy = (current === 'black') ? 'red' : 'black'; //an enemy piece
  $('.valid').removeClass('enemy');
  $('.' + current).addClass('enemy');
}
console.log(isEnemy());
function kingMe(){
  
}

function select(){  //this function selects the piece to be moved
  $source = $(this);
  $('.valid').removeClass('selected'); //this line clears a selection, if the player wants to select a different piece
  $source.addClass('selected');

}
function initBoard(){  //this function draws the board at when loading or refreshing the page and places the pieces in the proper place
  $('#board tr:lt(3) .valid').addClass('red player');
  $('#board tr:gt(4) .valid').addClass('black player');
  $('#board tr:lt(5):gt(2) .valid').addClass('empty');
}

function switchUser(){  //this function simply switches the users between turns. It is default on red to start in this example,
  current = (current === 'black') ? 'red' : 'black';  //merely because it needs a starting value and cannot be UNDEFINED
  $('.valid').removeClass('active selected');
  $('.' + current).addClass('active');
}
