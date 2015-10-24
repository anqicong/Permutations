/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

// Bugs (in rough order of priority)
// - allPerms line needs to shorten when the text box is over it, and so does the highlight
// 		- relatedly, return allPerms line needs to go away 
//		- basically, card.refreshText isn't working (or isn't being called in the right place)
// - Clicking on the for subperms line over and over makes the card grow to the left and line 0 get bolder??
// - Bottoms of cards are too long, card 1 should be inside card 0 etc.
// - Adjust text to fit high resolution displays

// Todos
// - Represent the current subPerm
// - show allPerms
// - button that can pop up instruction on filling in texts

// Resolved
// - The actual list doesn't show up in the permutations(a) line (should look like permutations([x, y]))
// - Clicking on the if line on cards of depth 1 and 2 makes the return statement appear instead of disappear
// - Base case return button shows up a line too early for cards 1 and 2
// - On card of depth 2, line 0 code highlight isn't wide enough
// - Base case 0th line missing a colon
// - Code highlighting slightly off on different computers
// - can't get the text to update in line 5 after clicking done on the range button
// - IMPORTANT: why does the allPerms text box show instead of the range text box when uncommented? -- solved, just don't use textbox class again

var main = function(ex) {

    function permutations(list) {
        if (list.length == 0) {
            return [[]];
        }
        else {
            var allPerms = [];
        	var restPerms = permutations(list.slice(1, list.length));

        	for (var j = 0;j < restPerms.length;j++ ) {
            	var subPerm = restPerms[j];
            	for (var i = 0; i < subPerm.length +1; i++) {
                	var thisPerm = subPerm.slice(0, i);
                	thisPerm = thisPerm.concat(list[0]);
                	thisPerm = thisPerm.concat(subPerm.slice(i, subPerm.length));
                	allPerms.push(thisPerm);
            	}
        	}
        	return allPerms;
     	}
	}

	//Take in a 2d list
	function listToString(list) {
		var result = "[";
		for (var i = 0; i < list.length; i++) {
			result += "[";
			for (var j = 0; j < list[i].length; j++) {
				if (j == list.length - 1) {
					result += list[i][j].toString();
				}else {
					result += list[i][j].toString() + ", ";
				}
			}
			result += "]";
			if (i != list.length - 1) {
				result += ", ";
			}
		}
		result += "]";
		return result;
	}
	

	function range(start, stop, step){
		var a=[], b=start;
		while(b<stop){a.push(b);b+=step;}
		return a;
	};

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
			state.topCard = firstCard;
			firstCard.init();
			firstCard.setToDraw(true);
			state.cardsList.push(firstCard);
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

		//BETA_HELPER
		state.animateCollapseHelper = function() {
			var doAnimation = function() {
				state.topCard.height -= 10;
				ex.graphics.ctx.clearRect(0, 0, ex.width(), ex.height());
				state.draw();
			}
			window.setTimeout(doAnimation, 15);
			if (state.topCard.height <= 0) {
				state.topCard.height = 0;
				state.returnToPrev();
				state.draw();
				return;
			}else {
				window.setTimeout(state.animateCollapseHelper, 15);
			}
		}

		//BETA
		state.animateCollapse = function() {
			for (var i = 0; i < state.topCard.depth; i++) {
				state.cardsList[i].setToDraw(true);
			}
			if (state.getLineFromTopCard(1).baseReturnButton != undefined) {
				state.getLineFromTopCard(1).deactivateReturnButton();
			}
			state.animateCollapseHelper();
		}
		

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

		//Return to the previous card
		state.returnToPrev = function() {
			if (state.topCard.depth == ex.data.content.list.length) {
				state.topCard.prepareForReturn();
				state.topCard = state.cardsList[state.topCard.depth - 1];
				state.topCard.prepareForEnter();
			}else {
				state.topCard.prepareForEnter();
				state.topCard = state.cardsList[state.topCard.depth - 1];
				state.topCard.prepareForEnter();
			}
			
		}

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
	    card.originalTabWidth = 220;
	    card.tabWidth = 220;
	    card.tabHeight = 20;
	    card.lineHeight = 18;
	    card.x = card.depth*card.leftMargin;
		card.y = card.depth*card.topMargin;
		card.width = card.maxWidth - card.x;
		card.height = card.maxHeight - card.y;
		card.allPermsBoxWidth = 190	;
		card.allPermsBoxHeight = 100;
		card.allPermsBoxXMargin = 10;
		card.allPermsBoxX = card.x + card.width - card.allPermsBoxWidth;
		card.allPermsBoxY = card.y + 35*card.depth + 65;
		card.returnedFromRecursiveCall = false;
		card.returnedFromRangeTextBox = false;

		card.curSubPerm = 0;
		card.innerLoopI = 0;
		card.shouldReturnAllPerm = false;

		card.init = function(){
			// create all the lines
			for (var i = 0; i < ex.data.content.code.length; i++) {
				var depthOffsetX = card.depth*16;
				var depthOffsetY = card.depth*73;
				if (i == 0){ // extra offset for first line
					depthOffsetX += card.depth*155;
					if (card.depth == 2) depthOffsetX -= 150;
				}
				card.linesList.push(Line(20 + depthOffsetX, 
										 i * card.lineHeight + depthOffsetY, 
										 i, card.depth));
			}
			// init all the lines
			for (var i = 0; i < card.linesList.length; i++){
				card.linesList[i].init();
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
					var y = card.y + card.lineHeight*2 + 10;
					card.tabWidth = card.originalTabWidth - 30
					break;
				case 2:
				    var x = card.x + card.leftMargin*12 - 7;
				    var y = card.y + card.lineHeight*4 + 16;
				    card.tabWidth = card.originalTabWidth - 30;
			}
			ex.graphics.ctx.fillRect(x, y, card.tabWidth,card.tabHeight); 
		};

		card.draw = function(){
			if (card.toDraw){
				// get right color
				var rgb = 240 - 25 * card.depth;
				var rgbStr = rgb.toString();
				ex.graphics.ctx.fillStyle = "rgb(" + rgbStr + ", " + rgbStr + "," + rgbStr + ")";
				// draw card
				if (card.depth > 0){
					var adjustForDepth = (card.lineHeight+4)*2*card.depth;
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
						if (thisLine.lineNum == card.curLineNum && thisLine.highlightImage == undefined){
							thisLine.highlight();
						}
					}
					thisLine.draw();
				}
				// draw allPerms box
				if (card.curLineNum >= 3){
					ex.graphics.ctx.fillStyle = "rgb(91, 192, 222)";
					ex.graphics.ctx.fillRect(card.allPermsBoxX, card.allPermsBoxY, 
											 card.allPermsBoxWidth - card.allPermsBoxXMargin, card.allPermsBoxHeight);
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
				card.curLineNum += 1
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

		card.advanceInnerLoopI = function() {
			card.innerLoopI += 1;
		}

		card.advanceCurSubPerm = function() {
			card.curSubPerm += 1;
		}

		//Prepare to be reactivated from return
		card.prepareForEnter = function() {
			card.setToDraw(true);
			card.curLineNum = 4;
			card.returnedFromRecursiveCall = true;
		}

		//Prepare to be popped off the stack
		card.prepareForReturn = function() {
			card.setToDraw(false);
			card.linesList[1].deactivateReturnButton();
			card.linesList[5].rangeDoneButton.deactivate();
			card.linesList[6].allPermsDoneButton.deactivate();
			card.linesList[7].returnAllPermsButton.deactivate();
			card.unhighlightAll();
		}

		card.refreshText = function(){
			for (var i = 0; i < card.linesList.length; i++){
				card.linesList[i].getText();
			}
		}

		return card;
	}

	function Line(x, y, lineNum, depth){
		var line = {};
		line.x = x;
		line.y = y;
		line.lineNum = lineNum;
		line.depth = depth;
		line.text = "";

		line.highlightImage = undefined;
		line.highlighted = false;
		line.returnedFromRecursiveCall = false;

		line.showBaseReturnButton = false;
		line.showTextBox = false;
		line.showAllPermsTextBox = false;

		line.baseReturnButton = undefined;
		line.rangeTextBox = undefined;
		line.rangeDoneButton = undefined;
		line.allPermsTextBox = undefined;
		line.allPermsDoneButton = undefined;
		line.returnAllPermsButton = undefined;

		line.init = function(){
			// get text
			line.text = line.getText();
			// text box and corresponding buttons for range line
			line.rangeTextBox = TextBox(170, 168, "range (len (subPerm) + 1) e.g. [0, 1]", 1, 33);
			/*??
			line.rangeDoneButtonAction = function(){
				if (line.checkTextAnswer(line.rangeTextBox.getText())){ // correct
					state.getLineFromTopCard(6).doLineAction();
				} 
				else{ // incorrect
					ex.showFeedback("That's incorrect. Try again."); // @TODO probably need a better statement here...
				}
			};
			line.rangeDoneButton = Button(400, 170, "Done", 5, line.rangeDoneButtonAction, "xsmall", ['', 13]);
			*/
			// and for allPerms line (the textbox is created in lineAction)
			line.allPermsDoneButtonAction = function(){
				if (line.checkTextAnswer(line.allPermsTextBox.getText())) {
					if (state.topCard.innerLoopI >= ex.data.content.list.length - state.topCard.depth - 1) {
						var subPermNum = 0;
						if (state.topCard.depth == ex.data.content.list.length){
							subPermNum = 1;
						}else {
							for (var i = 1; i <= ex.data.content.list.length - state.topCard.depth; i++) {
								subPermNum *= i;
							}
						}
						if (state.topCard.curSubPerm >= subPermNum - 1) {
							state.topCard.shouldReturnAllPerm = true;
						}else {
							state.topCard.advanceCurSubPerm();
						}
					}else {
						state.topCard.advanceInnerLoopI();
					}
				}else {
					alert(line.allPermsTextBox.getText());
				}
				console.log("allPermsDoneButtonAction");
			}
			line.allPermsDoneButton = Button(485, 187, "Done", 6, line.allPermsDoneButtonAction, "xsmall", ['', 13]);
			// and a button for return allPerms
			line.returnAllPermsButtonAction = function(){
				if (state.topCard.shouldReturnAllPerm) {
					state.animateCollapse();
				}else {
					ex.showFeedback("allPerms should contain more elements before return")
				}
			}
			line.returnAllPermsButton = Button(74, 204, "return allPerms", 7, line.returnAllPermsButtonAction, "xsmall");
			// create buttons and text areas 
			switch (line.lineNum){
				case 1: 
					// make the button
					var baseReturnButtonX = line.x + 180;
					var baseReturnButtonY = line.y + 5;
					var baseReturnButtonMessage = "That's incorrect. We're in the recursive case right now.";
					var baseReturn = function() {
						if (state.topCard.depth == ex.data.content.list.length) {
							state.animateCollapse();
							//state.returnToPrev();
							//state.draw();
						}else {
							ex.showFeedback(baseReturnButtonMessage);
						}
						console.log("Depth & curLineNum from base return button:");
						console.log(state.topCard.depth);
						console.log(state.topCard.curLineNum);
					};
					line.baseReturnButton = Button(baseReturnButtonX, baseReturnButtonY, 
													"return [ [ ] ]", 1, 
													baseReturn, 
													"xsmall", undefined);
					break;
				case 5:
					line.rangeTextBox = TextBox(170, 168, "range (len (subPerm) + 1)", 1, 33);
					line.rangeDoneButtonAction = function(){
						if (line.checkTextAnswer(line.rangeTextBox.getText())){ // correct
							state.getLineFromTopCard(6).doLineAction();
							//state.topCard.getAndSetNextLine();
							//state.draw();
						} 
						else{ // incorrect
							ex.showFeedback("That's incorrect. Try again."); // @TODO probably need a better statement here...
						}
					};
					line.rangeDoneButton = Button(400, 170, "Done", 5, line.rangeDoneButtonAction, "xsmall", ['', 13]);
					break;
				case 6:
				/*case 6:
					line.allPermsTextBox = TextBox(190, 180, "[subPerm[:i] + [a[0]] + subPerm[i:]]", 1, 33);
					line.allPermsDoneButtonAction = function(){
						console.log("we're here!");
					}
					line.allPermsDoneButton = Button(400, 190, "Done", 6, line.rangeDoneButtonAction, "xsmall", ['', 13]);
					break;*/
				default:
					break;
			}
		};

		line.highlight = function(){
			var img = "img/codeColor.png";
			var highlightWidth = line.text.length * 9;
			// adjust for when the if statement is cut short by the base return button
			if (line.lineNum == 1 && line.text == ex.data.content.code[1]){
				highlightWidth = line.text.length * 5.5;
			}
			if (line.highlighted) {
				return;
			}
			var fill = 5;
			line.highlightImage = ex.createImage(line.x, line.y + fill, img, {
				width: highlightWidth,
				height: state.topCard.lineHeight
			});
			// activate or deactivate the base return button
			if (line.baseReturnButton != undefined && line.baseReturnButton.myButton != undefined) {
				line.deactivateReturnButton();
				if (line.lineNum == 1) {
					line.baseReturnButton.activate();
				}
			}
		};

		line.unhighlight = function(){
			if (line.highlightImage != undefined) {
				line.highlightImage.remove();
				line.highlightImage = undefined;
				line.highlighted = false;
			}
		};

		line.getText = function(){
			if (line.lineNum == 1 && line.showBaseReturnButton) {
				return "  if (len(a) == 0):";
			}
			else if (line.lineNum == 5 && line.showTextBox){
				var correct = range(0, ex.data.content.list.length - line.depth, 1);
				var correctStr = "[" + correct.join() + "]";
				return "      for i in " + correctStr + ":";
			}
			else if (line.lineNum == 4 && state.topCard != undefined && 
				     state.topCard.returnedFromRecursiveCall) {
				var newText = "    for subPerm in ";
				var list = permutations(ex.data.content.list.slice(state.topCard.depth + 1, ex.data.content.list.length));
				newText += listToString(permutations(list));
				return newText;
			}
			else if (line.lineNum == 0){
				var newText = "permutations([";
				for (var numIndex = line.depth; numIndex < ex.data.content.list.length; numIndex++){
					if (numIndex == ex.data.content.list.length - 1) {
						newText += ex.data.content.list[numIndex].toString();
					}else {
						newText += ex.data.content.list[numIndex].toString() + ", ";
					}
				}
				newText += "]):";
				return newText;
			}
			else if (state.topCard.curLineNum >= 6 && line.lineNum == 7){
				return "";
			}
			else if (state.topCard.curLineNum >= 6 && line.lineNum == 6){
				return "        allPerms += ";
			}
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
			ex.graphics.ctx.font = "15px Courier";
			ex.graphics.ctx.fillText(line.getText(), line.x, line.y + state.topCard.lineHeight);
			if (line.showBaseReturnButton && line.baseReturnButton.myButton == undefined) {
				line.baseReturnButton.activate();
			}
			else if (line.rangeTextBox != undefined && line.showTextBox && line.rangeTextBox.myTextBox == undefined){
				line.rangeTextBox.activate();
				line.rangeDoneButton.activate();
			}
		};

		line.doLineAction = function(){
			switch (line.lineNum){
				case 1: // if
					state.topCard.getAndSetNextLine();
					// activate the base case return button
					line.showBaseReturnButton = true;
					break;
				case 2: // else
					// deactivate the if statement's return button 
					state.getLineFromTopCard(1).deactivateReturnButton();
					// next line
					state.topCard.getAndSetNextLine();
					break;
				case 4: // for subPerm
					var depthToActivate = state.topCard.depth + 1;
					// deactivate and undraw the current top card, activate new card
					state.topCard.setToDraw(false);
					state.topCard.unhighlightAll();
					state.topCard = state.getCard(depthToActivate);
					state.topCard.setToDraw(true);
					break;
				case 5: // for i
					line.showTextBox = true;
					state.topCard.curLineNum = 5;
					break;
				case 6: // allPerms
					// deactivate previous button
					state.topCard.returnedFromRangeTextBox = true;
					state.getLineFromTopCard(5).rangeDoneButton.deactivate();
					state.getLineFromTopCard(5).rangeTextBox.deactivate();
					// change curLineNum to 6
					state.topCard.unhighlightAll();
					state.topCard.curLineNum = 6;
					state.getLineFromTopCard(6).highlight();
					// change text to previous text box's answer
					var correct = range(0, ex.data.content.list.length - line.depth, 1);
					var correctStr = "[" + correct.join() + "]";
					state.getLineFromTopCard(5).getText();
					// deactivate previous button
					state.getLineFromTopCard(5).rangeDoneButton.deactivate();
					state.getLineFromTopCard(5).rangeTextBox.deactivate();
					state.getLineFromTopCard(5).showRangeTextBox = false;
					// create another text area and button
					line.showAllPermsTextBox = true; 
					state.topCard.refreshText();
					line.allPermsTextBox = TextBox(215, 185, "[subPerm[:i] + [a[0]] + subPerm[i:]]", 1, 40);
					line.allPermsTextBox.activate();
					line.allPermsDoneButton.activate();
					// activate the return allPerms button as well
					line.returnAllPermsButton.activate();
					break;
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

		line.doClick = function(){
			if (line.checkClick(x, y) && line.clickIsLegal()) {
				line.doLineAction();
			}
		}

		line.clickIsLegal = function(){
			switch (state.getCurLineNum()){
				case 0: // def line
					return line.lineNum == 1;
					break;
				case 1: // if 
					if (state.topCard.depth < ex.data.content.list.length){ // if not the base case
						return line.lineNum == 2;
					}else {
						ex.showFeedback("That's incorrect. We are now in the base case. The list length is 0.");
					}
					break;
				case 2: // else
					return line.lineNum == 3;
					break;
				case 3: // allPerms
					return line.lineNum == 4;
					break;
				case 4: // for subperm
					return line.lineNum == 5;
					break;
				default:
					return false;
					break;
			}
		};

		line.checkTextAnswer = function(answer){
			if (line.lineNum == 5){ // for i in range
				var correct = range(0, ex.data.content.list.length - line.depth, 1);
				var correctStr = "[" + correct.join() + "]";
				var answer = answer.replace(/ /g, "").replace(/:/g, ""); // replace all space and : with empty str
				return answer == correctStr;
			}
			else if (line.lineNum == 6){ // allPerms += 
				var curSubPerm = (permutations(ex.data.content.list.slice(state.topCard.depth + 1,ex.data.content.list.length)))[state.topCard.curSubPerm];
				var curI = state.topCard.innerLoopI;
				curSubPerm.splice(curI, 0, ex.data.content.list[state.topCard.depth]);
				var correctStr = "[[" + curSubPerm.join() + "]]";
				var answer = answer.replace(/ /g, "").replace(/:/g, "");
				return answer == correctStr;
			}
			return false;
		};
		return line;
	}

	function Button(x, y, text, lineNum, action, size, keybinding){
		var button = {};
		button.x = x;
		button.y = y;
		button.text = text;
		button.lineNum = lineNum;
		button.action = action;
		button.size = size;
		button.keybinding = keybinding;

		button.myButton = undefined;

		button.activate = function(){
			//@TODO create options
			if (keybinding == undefined){
				button.myButton = ex.createButton(button.x, button.y, text, 
														 {
														 	size:button.size,
														  	color: "lightBlue",
														  	height:14,
														 });
			}
			else{
				button.myButton = ex.createButton(button.x, button.y, text, 
														 {
														 	size:button.size,
														  	color: "lightBlue",
														  	keybinding: keybinding,
														  	height:14,
														 });
			}
			button.myButton.on("click", button.action);
		};

		button.deactivate = function(){
			if (button.myButton != undefined) {
				button.myButton.remove();
				button.myButton = undefined;
			}
		}
			return button;
	}

	function TextBox(x, y, text, rows, cols){
		textBox = {};
		textBox.x = x;
		textBox.y = y;
		textBox.text = text;
		textBox.rows = rows;
		textBox.cols = cols;

		textBox.myTextBox = undefined;

		textBox.activate = function(){
			textBox.myTextBox = ex.createTextArea(textBox.x, textBox.y, textBox.text,
				{resize: false, size: "small", rows: textBox.rows, cols : textBox.cols});
		};

		textBox.deactivate = function(){
			if (textBox.myTextBox != undefined){
				textBox.myTextBox.remove();
				textBox.myTextBox = undefined;
			}
		};

		textBox.getText = function(){
			if (textBox.myTextBox != undefined){
				return textBox.myTextBox.text();
			}
		};

		return textBox;
	}

	function mouseClicked(event){
		//Check click legal before drawing
		var isLegal = false;
		for (var i = 0; i < state.topCard.linesList.length; i++) {
			var line = state.topCard.linesList[i];
			if (line.checkClick(event.offsetX, event.offsetY) && line.clickIsLegal()) {
				line.doClick();
				isLegal = true;
				break;
			}
		}
		if (!isLegal) {
			return;
		}
		console.log("Depth and curLineNum from mouseClicked");
		console.log(state.topCard.depth);
		console.log(state.topCard.curLineNum);
		state.draw();
	}
	ex.graphics.on("mousedown", mouseClicked);

	var state = State();
	state.init();
	state.draw();
};
