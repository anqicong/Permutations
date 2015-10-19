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

		state.doClick = function(x, y){
			state.topCard.doClick(x, y);
		}

		state.getCurLineNum = function(){
			return state.topCard.curLineNum;
		};

		state.getLineFromTopCard = function(lineNum){
			return state.topCard.getLineByLineNum(lineNum);
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
			// create all the lines
			for (var i = 0; i < ex.data.content.code.length; i++) {
				card.linesList.push(Line(20, i * lineHeight, i));
			}
			// init all the lines
			for (var i = 0; i < card.linesList.length; i++){
				card.linesList[i].init();
			}
		};

		card.draw = function(){
			// draw card
			ex.graphics.ctx.fillStyle = "rgb(240, 240, 240)";
            ex.graphics.ctx.fillRect(card.x,card.y + tabHeight,
            	card.width,card.height);
            ex.graphics.ctx.fillRect(card.x+leftMargin,card.y,
            	tabWidth,tabHeight); 
            // draw lines
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

		card.doClick = function(x, y){
            for (var line = 0; line < card.linesList.length; line++){
            	card.linesList[line].doClick(x, y);
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
		line.text = "";
		line.highlightImage = undefined;

		line.init = function(){
			// get text
			line.text = line.getText();
			// create buttons
			switch (line.lineNum){
				case 1: 
					// make the button
					var baseReturnButtonX = 200;
					var baseReturnButtonY = 18;
					line.baseReturnButton = Button(baseReturnButtonX, baseReturnButtonY, 
													"return [ [  ] ]", 1, 
													function() {alert("this is a button")}, "xsmall");
					break;
				default:
					break;
			}
		};

		line.highlight = function(){
			var img = "img/codeColor.png";
			var highlightWidth = line.text.length * 9;
			line.highlightImage = ex.createImage(line.x, line.y, img, {
				width: highlightWidth,
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
			ex.graphics.ctx.fillStyle = "rgb(0, 0, 0)";
			ex.graphics.ctx.font = "15px Courier New";
			ex.graphics.ctx.fillText(line.text, line.x, line.y + lineHeight);
		};

		line.doLineAction = function(){
			switch (line.lineNum){
				case 1: // if
					// change the text
					line.text = "  if (len(a) == 0): ";
					state.topCard.getAndSetNextLine();
					// activate the base case return button
					line.baseReturnButton.activate();
					break;
				case 2:
					state.topCard.getAndSetNextLine();
					state.getLineFromTopCard(1).baseReturnButton.deactivate();
					break;
				default: 
					state.topCard.getAndSetNextLine();
					break;
			}
		};

		line.checkClick = function(x, y){
			if (x >= line.x && y >= line.y && y <= line.y + lineHeight) {
				return true;
			}
			return false;
		};

		line.doClick = function(x, y){
			if (line.checkClick(x, y) && line.clickIsLegal(x, y)) {
				line.doLineAction();
			}
		}

		line.clickIsLegal = function(x, y){
			switch (state.getCurLineNum()){
				case 0: // def line
					return state.getLineFromTopCard(1).checkClick(x, y);
					break;
				case 1: // if 
					if (state.topCard.depth < ex.data.content.list.length){ // if not the base case
						return state.getLineFromTopCard(2).checkClick(x, y);
					}
					break;
				case 2: // else
					return state.getLineFromTopCard(3).checkClick(x, y);
					break;
				case 3: // allPerms
					return state.getLineFromTopCard(4).checkClick(x, y);
					break;
				default:
					return false;
					break;
			}
		};

		return line;
	}

	function Button(x, y, text, lineNum, action, size){
		var button = {};
		button.x = x;
		button.y = y;
		button.text = text;
		button.lineNum = lineNum;
		button.action = action;
		button.size = size;

		button.myButton = undefined;

		button.activate = function(){
			//@TODO create options
			button.myButton = ex.createButton(button.x, button.y, text, 
													 {
													 	size:button.size,
													  	color: "lightBlue"
													 });
			button.myButton.on("click", button.action);
		};

		button.deactivate = function(){
			button.myButton.hide();
		}

		return button;
	}

	function mouseClicked(event){
		state.doClick(event.offsetX, event.offsetY);
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
