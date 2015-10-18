/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	/**********************************************************************
	 * Server functions
	**********************************************************************/

	//generateContent is a server function that randomly generates 2 
	//starting numbers and the corresponding print statement
	function generateContent() {
		var random1 = Math.round(Math.random()*100);
		var random2 = Math.round(Math.random()*100);
		ex.data.content.list = [random1, random2];
	}

	function State(){
		var state = {};
		state.cardsList = [];

		state.init = function(){
			generateContent();
			var firstCard = Card(0);
			for (var i = 0; i < ex.data.content.code.length; i++) {
				var lineHeight = 15;
				firstCard.linesList.push(Line(20, (i + 1) * lineHeight, i));
			}
			state.cardsList.push(firstCard);
		};

		state.draw = function(){
			for (var i = 0; i < state.cardsList.length; i++) {
				state.cardsList[i].draw();
			}
		};

		return state;
	}

	function Card(depth){
		var card = {};
		card.depth = depth;
		card.curLine = undefined;
		card.curLineNum = 0;
		card.linesList = [];
		card.cardState = 0;
		card.x = card.depth*leftMargin;
		card.y = card.depth*topMargin;
		card.width = maxWidth - card.x;
		card.height = maxHeight - card.y;

		card.init = function(){
		};

		card.draw = function(){
			for (var i = 0;i < card.linesList.length;i++){
				var thisLine = card.linesList[i];
				if (thisLine.lineNum == card.curLineNum){
					thisLine.highlight();
				}
				thisLine.draw();
			}
			ex.graphics.ctx.fillStyle = "lightBlue";
            ex.graphics.ctx.fillRect(card.x,card.y + tabHeight,
            	card.width,card.height);
            ex.graphics.ctx.fillRect(card.x+leftMargin,card.y,
            	tabWidth,tabHeight); 

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
			var keywordColor = "#A50668";
			var numberColor = "#4494BC";
			var text = ex.data.content.code[line.lineNum];
			ex.graphics.ctx.fillStyle = "#000000";
			ex.graphics.ctx.font = "15px Courier New";
			ex.graphics.ctx.fillText(text, line.x, line.y);
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
    //card constants
    var leftMargin;
    var topMargin;
    var maxHeight;
    var maxWidth;
    var tabWidth;
    var tabHeight;

	var state = State();
	state.init();
	state.draw();

}
