/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	function State(){
		var state = {};
		state.cardsList = [];
		state.topCard = undefined;

		state.init = function(){

		};

		state.draw = function(){

		};

		return state;
	}

	function Card(depth){
		var card = {};
		card.depth = depth;
		card.curLineNum = 0;
		card.linesList = [];
		card.cardState = 0;

		card.init = function(){

		};

		card.draw = function(){

		};

		card.checkClick = function(x, y){

		};

		return card;
	}

	function Line(x, y, lineNum){
		var line = {};
		line.x = x;
		line.y = y;
		line.lineNum = lineNum;

		line.clicked = function(x, y){

		};

		line.highlight = function(){

		};

		line.unhighlight = function(){

		};

		line.draw = function(){

		};

		line.doLineAction = function(){

		};

		line.clickIsLegal = function(){

		};

		return line;
	}

	function Button(x, y, text, lineNum, action){
		var button = {};
		button.x = x;
		button.y = y;
		button.text = text;
		button.lineNum = lineNum;
		button.action = action;

		button.activate = function(){
			//@TODO create options
			var activatedButton = ex.createButton(button.x, button.y, text, 
													 {
													 	size:"small",
													  	keybinding:["", 39],
													  	color: "lightBlue"
													 });
			activatedButton.on("click", button.action);
		};

		return button;
	}

	function mouseClicked(event){

	}
	ex.graphics.on("mousedown", mouseClicked);

	var state = State();
	state.init();


}
