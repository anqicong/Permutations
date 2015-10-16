/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	function State(){
		var state = {};

		state.init = function(){

		};

		state.draw = function(){

		};

		return state;
	}

	function Card(depth){
		var card = {};
		card.depth = depth;

		card.init = function(){

		};

		card.draw = function(){

		};

		card.checkClick = function(x, y){

		};

		return card;
	}

	function Line(x, y, lineNum, action){
		var line = {};
		line.x = x;
		line.y = y;
		line.lineNum = lineNum;
		line.action = action;

		line.clicked = function(x, y){

		};

		line.highlight = function(){

		};

		line.unhighlight = function(){

		};

		line.draw = function(){

		};

		return line;
	}

	function mouseClicked(event){

	}
	ex.graphics.on("mousedown", mouseClicked);

	var state = State();
	state.init();


}
