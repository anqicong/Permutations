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
			// make first card, set it to draw mode, make it the top card
			var firstCard = Card(0);
			firstCard.init();
			firstCard.setToDraw(true);
			state.cardsList.push(firstCard);
			state.topCard = firstCard;
			// generate and init the rest of the cards
			for (var depth = 1; depth < ex.data.content.list.length + 1; depth++){
				var newCard = Card(depth);
				newCard.init();
				state.cardsList.push(newCard);
			}
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

		state.getCard = function(depth){
			return state.cardsList[depth];
		};

		return state;
	}

	function Card(depth){
		var card = {};
		card.depth = depth;
		card.curLine = undefined;
		card.curLineNum = 0;
		card.linesList = [];
		card.toDraw = false;

		//card constants
	    card.leftMargin = 15;
	    card.topMargin = 30;
	    card.maxHeight = ex.height()-card.topMargin;
	    card.maxWidth = ex.width()-card.leftMargin;
	    card.tabWidth = 220;
	    card.tabHeight = 20;
	    card.lineHeight = 15;
	    card.x = card.depth*card.leftMargin;
		card.y = card.depth*card.topMargin;
		card.width = card.maxWidth - card.x;
		card.height = card.maxHeight - card.y;

		card.init = function(){
			// create all the lines
			for (var i = 0; i < ex.data.content.code.length; i++) {
				var depthOffsetX = card.depth*15;
				var depthOffsetY = card.depth*60;
				if (i == 0){ // extra offset for first line
					depthOffsetX += card.depth*155;
					if (card.depth == 2) depthOffsetX -= 140;
				}
				console.log(20 + depthOffsetX);
				card.linesList.push(Line(20 + depthOffsetX, 
										 i * card.lineHeight + depthOffsetY, i));
			}
			// init all the lines
			for (var i = 0; i < card.linesList.length; i++){
				card.linesList[i].init();
				// create the text for the first line
				if (i == 0){
					var newText = "permutations([";
					for (var numIndex = card.depth; numIndex < ex.data.content.list.length; numIndex++){
						newText += ex.data.content.list[numIndex].toString() + ", ";
					}
					newText = newText.slice(0, newText.length - 2); // get rid of trailing comma
					console.log(newText);
					newText += "]):";
                    if (card.depth == ex.data.content.list.length) newText = "permutations([])";
					card.linesList[i].setText(newText);
				}
			}
		};

		// card.toDraw is a bool representing whether or not that card should be drawn
		card.setToDraw = function(value){
			card.toDraw = value;
		}

		card.drawTab = function(){
			switch (card.depth){
				case 0:
					var x = card.x+card.leftMargin;
					var y = card.y;
					break;
				case 1:
					var x = card.x + card.leftMargin*11 + 4;
					var y = card.y + card.lineHeight*2;
					card.tabWidth -= 30;
					break;
				case 2:
				    var x = card.x + card.leftMargin*12 - 7;
				    var y = card.y + card.lineHeight*4;
				    card.tabWidth -= 50;

			}
			ex.graphics.ctx.fillRect(x, y, card.tabWidth,card.tabHeight); 
		};

		card.draw = function(){
			if (card.toDraw){
				// get right color
				var rgb = 240 - 25*card.depth;
				var rgbStr = rgb.toString();
				ex.graphics.ctx.fillStyle = "rgb(" + rgbStr + ", " + rgbStr + "," + rgbStr + ")";
				// draw card
				if (card.depth > 0){
					var adjustForDepth = card.lineHeight*2*card.depth;
				}
				else{
					var adjustForDepth = 0;
				}
	            ex.graphics.ctx.fillRect(card.x ,card.y + card.tabHeight + adjustForDepth,
	            	card.width, card.height);
	            // draw tab
	            card.drawTab();
	            // draw lines
				for (var i = 0; i < card.linesList.length; i++){
					var thisLine = card.linesList[i];
					// unhighlight every line just in case
					thisLine.unhighlight();
					// if we're on the top card, highlight
					if (state.topCard.depth == card.depth){
						// highlight the current line
						if (thisLine.lineNum == card.curLineNum){
							thisLine.highlight();
						}
					}
					thisLine.draw();
				}
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

		card.unhighlightAll = function() {
			for (var i = 0; i < card.linesList.length; i++) {
				var curLine = card.linesList[i];
				curLine.unhighlight();
			}
		}

		return card;
	}

	function Line(x, y, lineNum){
		var line = {};
		line.x = x;
		line.y = y;
		line.lineNum = lineNum;
		line.text = "";
		line.highlightImage = undefined;
		line.showBaseReturnButton = false;

		line.init = function(){
			// get text
			line.text = line.getText();
			// create buttons
			switch (line.lineNum){
				case 1: 
					// make the button
					var baseReturnButtonX = 200;
					var baseReturnButtonY = line.y;
					var baseReturnButtonMessage = "That's incorrect. We're in the recursive case right now.";
					line.baseReturnButton = Button(baseReturnButtonX, baseReturnButtonY, 
													"return [ [ ] ]", 1, 
													function() {ex.showFeedback(baseReturnButtonMessage)}, 
													"xsmall");
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
				height: state.topCard.lineHeight
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

		line.setText = function(newText){
			line.text = newText;
		}

		line.revertText = function(){
			line.text = ex.data.content.code[line.lineNum];
		}

		line.draw = function(){
			var keywordColor = "rgb(249, 38, 114)";
			var numberColor = "rgb(61, 163, 239)";
			ex.graphics.ctx.fillStyle = "rgb(0, 0, 0)";
			ex.graphics.ctx.font = "15px Courier New";
			ex.graphics.ctx.fillText(line.text, line.x, line.y + state.topCard.lineHeight);
			if (line.showBaseReturnButton && line.baseReturnButton != undefined) {
				line.baseReturnButton.activate();
			}
		};

		line.doLineAction = function(){
			switch (line.lineNum){
				case 1: // if
					// change the text
					line.text = "  if (len(a) == 0): ";
					state.topCard.getAndSetNextLine();
					// activate the base case return button
					line.showBaseReturnButton = true;
					break;
				case 2:
					// deactivate the if statement's return button and rever the text
					state.getLineFromTopCard(1).deactivateReturnButton();
					state.getLineFromTopCard(1).revertText();
					// next line
					state.topCard.getAndSetNextLine();
					break;
				case 4:
					var depthToActivate = state.topCard.depth + 1;
					// deactivate and undraw the current top card, activate new card
					state.topCard.setToDraw(false);
					state.topCard.unhighlightAll();
					state.topCard = state.getCard(depthToActivate);
					state.topCard.setToDraw(true);
					state.getLineFromTopCard(1).showBaseReturnButton = true;
				default: 
					state.topCard.getAndSetNextLine();
					break;
			}
		};

		line.deactivateReturnButton = function() {
			if (line.baseReturnButton != undefined) {
				line.baseReturnButton.deactivate();
			}
			line.showBaseReturnButton = false;
		}

		line.checkClick = function(x, y){
			if (x >= line.x && y >= line.y && y <= line.y + state.topCard.lineHeight) {
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
													  	color: "grey",
													  	height:14,
													 });
			button.myButton.on("click", button.action);
		};

		button.deactivate = function(){
			if (button.myButton != undefined) button.myButton.remove();
		}

		return button;
	}

	function mouseClicked(event){
		state.doClick(event.offsetX, event.offsetY);
		state.draw();
	}
	ex.graphics.on("mousedown", mouseClicked);

	var state = State();
	state.init();
	state.draw();

};
