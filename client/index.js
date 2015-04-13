'use strict';
var current = 'black';
var $source;
var enemy = 'enemy';

$(document).ready(init);

function init(){
  initBoard();
  switchUser();
  win();

  $('#board').on('click', '.active', select);
  $('#board').on('click', '.empty', drop);
}

function initBoard(){
  $('#board tr:lt(3) .valid').addClass('red player');
  $('#board tr:gt(4) .valid').addClass('black player');
  $('td.valid:not(.player)').addClass('empty');
}

function switchUser(){
  enemy = (current === 'red') ? 'black' : 'red';
  current = (current === 'red') ? 'black' : 'red';
  $('.valid').removeClass('active source').addClass('inactive');
  $('.' + current).addClass('active').removeClass('enemy');
}

function select(){
  $source = $(this);
  $('.valid').removeClass('source');
  $source.addClass('source');
}

//manipulate drop function
function drop(){
  if (!$source) {
    return;
  }

  var $target = $(this);
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;


  var compass = {};
  compass.north = (current === 'black') ? -1 : 1;
  compass.east = (current === 'black') ? 1 : 1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)){
    case 'move':
      switchUser();
      movePiece($source, $target);
      break;
    case 'jump':
      
      var targetClasses = $target.attr('class');
      var sourceClasses = $source.attr('class');

      movePiece($source, $target);
      $source.addClass('empty valid');
      $target.addClass('player');
      $source = $target;

      src.x = $source.data('x') * 1;
      src.y = $source.data('y') * 1;

      // code to check if double jump possible
      $('td').each(function(e){
        if ($(this).data('y') === src.y + (compass.north * 2) && ($(this).data('x') === src.x + (compass.east * 2) || $(this).data('x') === src.x + (compass.west * 2))){
          $target = $(this)[0];

          console.log($target);

          if ($($target).hasClass('empty')){

            // enemy = (current === 'black') ? 'red' : 'black';
            // $('.valid').removeClass('enemy');
            // $('.' + current).addClass('enemy');

            tgt.x = $($target).data('x');
            tgt.y = $($target).data('y');

            var checkX = ((src.x + tgt.x) / 2);
            var checkY = ((src.y + tgt.y) / 2);
            var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
            $middle = $middle[0];
            $middle.addClass('enemy');

            if ($($middle).hasClass('inactive player')){
              switchUser();
            }

          }
        }
      })

      switchUser();
  }
}

function moveType(src, tgt, compass, isKing){

  if (isJump(src, tgt, compass, isKing) && isEnemy(src, tgt, compass, isKing)){
    return 'jump';
  }

  if (isMove(src, tgt, compass, isKing)){
    return 'move';
  }
}

function movePiece($source, $target){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');


  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);

  // console.log("Target X-coordinates: " + $target.data('x'))
  // console.log("Target Y-coordinates: " + $target.data('y'));

  // add king classes
  $target.data('y') === 0 ? $target.addClass('king kingblack') : console.log();
  $target.data('y') === 7 ? $target.addClass('king kingred') : console.log();

}

function isMove(src, tgt, compass, isKing){
  // if tgt is left o right, north or south, is a king and  can go south
  var moveLateral = src.x + compass.east === tgt.x || src.x + compass.west === tgt.x;
  var moveRow = src.y + compass.north === tgt.y;
  var kingMove = isKing && src.y + compass.south === tgt.y;
  return (moveLateral) && (moveRow) || (moveLateral) && (kingMove);
}

function isJump(src, tgt, compass, isKing){

  var checkEast = compass.east * 2;
  var checkWest = compass.west * 2;
  var checkNorth = compass.north * 2;
  var compassSouth = compass.south * 2;

  var jumpLateral = src.x + checkEast === tgt.x || src.x + checkWest === tgt.x;
  var jumpRow = src.y + checkNorth === tgt.y;
  var kingJump = isKing && src.y + compassSouth === tgt.y;

  return (jumpLateral) && (jumpRow) || (jumpLateral) && (kingJump);
}

function isEnemy(src, tgt, compass, isKing){

  // enemy = (current === 'red') ? 'black' : 'red';
  // $('.valid').removeClass('enemy');
  // $('.' + current).addClass('enemy');

  var checkX = ((src.x + tgt.x) / 2);
  var checkY = ((src.y + tgt.y) / 2);
  var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
  console.log($middle[0]);
  $middle = $middle[0];


  if ($($middle).hasClass('player inactive')){
    $($middle).removeClass().addClass('valid empty');
    console.log("valid jump");
    return true;
  }
  return false;
}

function win(){
  if($('.black').length === 0){
    alert('Red Wins');
  }
  else if($('.red').length === 0){
    alert('Black Wins')
  }
}
