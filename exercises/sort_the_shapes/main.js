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
		state.topCard = undefined;

		state.init = function(){
			generateContent();
			var firstCard = Card(0);
			firstCard.init();
			state.cardsList.push(firstCard);
			state.topCard = firstCard;
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
			for (var i = 0; i < ex.data.content.code.length; i++) {
				card.linesList.push(Line(20, i * lineHeight, i));
			}
		};

		card.draw = function(){
			// draw card
			ex.graphics.ctx.fillStyle = "rgb(222, 222, 222)";
            ex.graphics.ctx.fillRect(card.x,card.y + tabHeight,
            	card.width,card.height);
            ex.graphics.ctx.fillRect(card.x+leftMargin,card.y,
            	tabWidth,tabHeight); 
            // draw lines
            console.log(state.topCard.getLineByLineNum(state.topCard.curLineNum).getText());
            console.log(state.topCard.curLineNum);
			for (var i = 0; i < card.linesList.length; i++){
				var thisLine = card.linesList[i];
				// unhighlight every line just in case
				thisLine.unhighlight();
				// highlight the current line
				if (thisLine.lineNum == card.curLineNum){
					thisLine.highlight();
				}
				thisLine.draw();
			}
			
		};

		card.checkClick = function(x, y){
            for (var line = 0; line < card.linesList.length; line++){
            	card.linesList[line].checkClick(x, y, true);
            }
		};

		// increments curLineNum and then returns it
		card.getAndSetNextLine = function(){
			if (card.curLineNum < ex.data.content.code.length - 1){
				card.curLineNum += 1;
			}
			return card.curLineNum;
		};

		// given a line number, returns the line with that line number
		card.getLineByLineNum = function(lineNum){
			return card.linesList[lineNum];
		};

		return card;
	}

	function Line(x, y, lineNum){
		var line = {};
		line.x = x;
		line.y = y;
		line.lineNum = lineNum;
		line.highlightImage = undefined;

		line.highlight = function(){
			var img = "img/codeColor.png";
			line.highlightImage = ex.createImage(line.x, line.y, img, {
				width: ex.width() - line.x,
				height: lineHeight
			});
		};

		line.unhighlight = function(){
			if (line.highlightImage != undefined) {
				line.highlightImage.remove();
			}
		};

		line.getText = function(){
			return ex.data.content.code[line.lineNum];
		}

		line.draw = function(){
			var keywordColor = "rgb(249, 38, 114)";
			var numberColor = "rgb(61, 163, 239)";
			var text = line.getText();
			ex.graphics.ctx.fillStyle = "rgb(0, 0, 0)";
			ex.graphics.ctx.font = "15px Courier New";
			ex.graphics.ctx.fillText(text, line.x, line.y + lineHeight);
		};

		line.doLineAction = function(){
			state.topCard.getAndSetNextLine();
		};

		// doAction is a bool representing whether we want to check and do the action
		// or just check if it was clicked
		line.checkClick = function(x, y, doAction){
			if (x >= line.x && y >= line.y && y <= line.y + lineHeight && line.clickIsLegal(x, y)) {
				if (doAction) line.doLineAction();
				return true;
			}
			return false;
		};

		line.clickIsLegal = function(x, y){
			return true;
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
		state.topCard.checkClick(event.offsetX, event.offsetY, true);
		state.draw();
	}
	ex.graphics.on("mousedown", mouseClicked);

    //card constants
    var leftMargin = 15;
    var topMargin = 40;
    var maxHeight = ex.height()-topMargin;
    var maxWidth = ex.width()-leftMargin;
    var tabWidth = 190;
    var tabHeight = 20;
    var lineHeight = 15;

	var state = State();
	state.init();
	state.draw();

};
