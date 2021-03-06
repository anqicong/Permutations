/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	ex.data.meta = {
		"author": "Luyao Hou",
        "email": "lhou@andrew.cmu.edu",
        "title": "Permutations",
        "description": "Permutations",
        "id": "lhou",
        "language": "",
        "difficulty": "medium",
        "mainFile": "main.js",
        "instrFile": "instr.html",
        "constructorName": "main",
        "menuDisplayName": "Permutations",
        "mode": "practice",
        "requires": {
        }
	};

	ex.data.content = {
		"list": [1, 2],
        "printStatement": "print permutations([1, 2])",
        "code": ["def permutations(a):", 
                 "  if (len(a) == 0): return [[]]",
                 "  else:",
                 "    allPerms = []",
                 "    for subPerm in permutations(a[1:]):",
                 "      for i in range(len(subPerm) + 1):",
                 "        allPerms += [subPerm[:i] + [a[0]] + subPerm[i:]]",
                 "    return allPerms"],
        "lines": 11,
        "language": "python"
	};


    function permutations(list) {
        if (list.length === 0) {
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

	function trim_spaces(str) {
		result = "";
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i) != ' ') {
				result += str.charAt(i);
			}
		}
		return result;
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

	function listToString1D(list){
		return "[" + list.join(", ") + "]";
	}
	

	function range(start, stop, step){
		var a=[], b=start;
		while(b<stop){a.push(b);b+=step;}
		return a;
	}

	function resetTask(isReset) {
		taskReset = isReset;
		taskNew = !isReset;
		ex.data.content.score = 1.0;
		for (var i = 0; i < state.cardsList.length; i++) {
			state.cardsList[i].unhighlightAll();
			state.cardsList[i].linesList[1].deactivateReturnButton();
			state.cardsList[i].linesList[5].deactivateRangeTextBox();
			state.cardsList[i].linesList[5].deactivateRangeDoneButton();
			state.cardsList[i].linesList[6].deactivateAllPermsDoneButton();
			state.cardsList[i].linesList[6].deactivateAllPermsTextBox();
			state.cardsList[i].linesList[6].deactivateReturnAllPermsButton();
		}
		state.cardsList = [];
		state.init();
		state.draw();
	}


	//generateContent is a server function that randomly generates 2 
	//starting numbers and the corresponding print statement
	function generateContent() {
		if (taskReset) {
			return;
		}
		var random1 = Math.round(Math.random() * 20);
		var random2 = Math.round(Math.random() * 20);
		while (random2 == random1) {
			random2 = Math.round(Math.random() * 20);
		}
		var random3 = Math.round(Math.random() * 20);
		while (random3 == random2 || random3 == random1) {
			random3 = Math.round(Math.random() * 20);
		}
		ex.data.content.list = [random1, random2, random3];
	}

	//Grade function
	function grade(content, state) {
		return content.score;
	}

	function State(){
		var state = {};
		state.cardsList = [];
		state.topCard = undefined;
		state.taskFinished = false;

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
			if (!taskReset && !taskNew) {
				state.retrieveState();
			}else {
				state.saveCurState();
				taskReset = false;
			}
		};

		state.retrieveState = function() {
			if (ex.data.instance.state.loaded == undefined) {
				return;
			}
			else{
				var storedState = ex.data.instance.state;
				console.log(storedState);
				console.log(storedState.curLineNum);
				console.log(state.topCard.curLineNum);
				ex.data.content.list = storedState.list;
				state.topCard = state.cardsList[storedState.topCardDepth];
				state.topCard.curLineNum = storedState.curLineNum;
				ex.data.content.score = storedState.score;
				state.topCard.allPermsString = storedState.allPermsStr;
				state.topCard.curSubPerm = storedState.loopIndex;
				state.topCard.innerLoopI = storedState.innerLoopIndex;
				//Restore current line numbers
				for (var i = 0; i < state.topCard.depth; i++) {
					state.cardsList[i].curLineNum = 4;
				}
				if (storedState.curLineNum >= 5) {
					state.topCard.circlei = true;
					state.topCard.circleInner = true;
				}
				if (storedState.curLineNum == 1) {
					state.topCard.linesList[1].showBaseReturnButton = true;
				}
				if (storedState.curLineNum == 5) {
					var line = state.topCard.linesList[5];
					var rangeTextBoxY = state.topCard.lineHeight * 5 + state.topCard.lineHeight * 4 * line.depth + button_margin;
					state.topCard.linesList[5].rangeTextBox = TextBox(160, rangeTextBoxY, "range (len (subPerm) + 1)", 1, 35);
					state.topCard.returnedFromRecursiveCall = true;
					state.topCard.linesList[5].showTextBox = true;
					state.topCard.linesList[5].rangeTextBox.activate();
					state.topCard.linesList[5].rangeDoneButton.activate();
					var card = state.topCard;
					if (card.depth == 0) {
						card.linesList[6].allPermsDoneButton = Button(485, 103, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
					}
					if (card.depth == 2) {
						card.linesList[6].allPermsDoneButton = Button(485, 230, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
					}
				}else if (storedState.curLineNum == 6) {
					var line = state.topCard.linesList[6];
					var card = state.topCard;
					state.topCard.returnedFromRecursiveCall = true;
					state.topCard.linesList[5].rangeEntered = true;
					var allPermTextBoxX = 218 + 4 * line.depth;
					var allPermTextBoxY = state.topCard.lineHeight * 6 + state.topCard.lineHeight * 4 * line.depth + button_margin;
					line.allPermsTextBox = TextBox(allPermTextBoxX, allPermTextBoxY, "[subPerm[:i] + [a[0]] + subPerm[i:]]", 1, 40);
					line.allPermsTextBox.activate();
					if (card.depth == 0) {
						card.linesList[6].allPermsDoneButton = Button(485, 103, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
					}
					if (card.depth == 2) {
						card.linesList[6].allPermsDoneButton = Button(485, 230, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
					}
					line.allPermsDoneButton.activate();
					// activate the return allPerms button as well
					line.returnAllPermsButton.activate();
				}else if (storedState.curLineNum == 7) {
					state.topCard.returnedFromRecursiveCall = true;
					state.topCard.linesList[5].rangeEntered = true;
					state.topCard.linesList[6].returnAllPermsButton.activate();
					state.topCard.shouldReturnAllPerm = true;
				}
			}
		}

		state.drawScore = function() {
			var score_width = 120;
			var score_height = 18;
			ex.graphics.ctx.clearRect(ex.width() - score_width, 0, score_width, score_height);
			ex.graphics.ctx.fillStyle = "#000000";
			ex.graphics.ctx.fillText("Score: " + grade(ex.data.content, ex.data).toFixed(2).toString(), ex.width() - score_width, score_height);
		}

		state.draw = function(){
			ex.graphics.ctx.clearRect(0, 0, ex.width(), ex.height());
			for (var i = 0; i <= state.topCard.depth; i++) {
				state.cardsList[i].draw();
			}
			for (var i = 0;i<state.topCard.allPermsString.length;i++){
				ex.graphics.ctx.fillStyle = "yellow";
			 	var len = state.topCard.allPermsString[i].length;
				ex.graphics.ctx.fillText(state.topCard.allPermsString[i].substring(1,len-1),
				state.topCard.allPermsBoxX+10,state.topCard.allPermsBoxY+30+20*i);
			}
			state.drawScore();
		};

		state.animateCollapseHelper = function() {
			var doAnimation = function() {
				state.topCard.height -= 10;
				ex.graphics.ctx.clearRect(0, 0, ex.width(), ex.height());
				state.draw();
			}
			window.setTimeout(doAnimation, 15);
			if (state.topCard.height <= 0) {
				state.topCard.setToDraw(false);
				state.topCard.height = 0;
				state.topCard.circlei = false;
				state.returnToPrev();
				state.draw();
				ex.graphics.on("mousedown", mouseClicked);
				return;
			}else {
				window.setTimeout(state.animateCollapseHelper, 15);
			}
		}

		state.animateCollapse = function() {
			if (state.topCard.depth == ex.data.content.list.length) {
				for (var i = 0; i < state.topCard.depth; i++) {
				state.cardsList[i].setToDraw(true);
				}
			}
			if (state.getLineFromTopCard(1).baseReturnButton != undefined) {
				state.getLineFromTopCard(1).deactivateReturnButton();
			}
			//Temporarily disable mouse clicks
			ex.graphics.off("mousedown", mouseClicked);
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
			state.topCard.prepareForReturn();
			state.topCard = state.cardsList[state.topCard.depth - 1];
			state.topCard.prepareForEnter();	
		}

		state.subTractScore = function(delta) {
			ex.data.content.score -= delta;
			if (ex.data.content.score < 0) {
				ex.data.content.score = 0;
			}
			state.saveCurState();
		}

		state.advanceState = function() {
			switch (state.topCard.curLineNum) {
				case 0:
				state.getLineFromTopCard(1).doLineAction();
				state.draw();
				break;
				case 1:
				if (state.topCard.depth < ex.data.content.list.length) {
					state.getLineFromTopCard(2).doLineAction();
				}else {
					state.getLineFromTopCard(1).baseReturnButton.action();
				}
				state.draw();
				break;
				case 2:
				state.getLineFromTopCard(3).doLineAction();
				state.draw();
				break;
				case 3:
				state.getLineFromTopCard(4).doLineAction();
				state.draw();
				break;
				case 5:
				var answer = listToString1D(range(0, ex.data.content.list.length - state.topCard.depth, 1));
				state.getLineFromTopCard(5).rangeTextBox.setText(answer);
				break;
				case 6:
				var curSubPerm = (permutations(ex.data.content.list.slice(state.topCard.depth + 1,ex.data.content.list.length)))[state.topCard.curSubPerm];
				var curI = state.topCard.innerLoopI;
				curSubPerm.splice(curI, 0, ex.data.content.list[state.topCard.depth]);
				var correctStr = "[[" + curSubPerm.join() + "]]";
				state.getLineFromTopCard(6).allPermsTextBox.setText(correctStr);
				default:
				break;
			}
		}

		//Save current state
		state.saveCurState = function() {
			var curState = {
				"list": ex.data.content.list,
				"topCardDepth": state.topCard.depth,
				"curLineNum": state.topCard.curLineNum,
				"score": ex.data.content.score,
				"loopIndex": state.topCard.curSubPerm,
				"innerLoopIndex": state.topCard.innerLoopI,
				"allPermsStr": state.topCard.allPermsString,
				"loaded": true
			};
			ex.saveState(curState);
		}	

		return state;
	}

	function Card(depth){
		var card = {};
		card.depth = depth;
		card.curLine = undefined;
		card.curLineNum = 0;
		card.linesList = [];
		card.toDraw = true;

		//card constants
	    card.leftMargin = 15;
	    card.topMargin = 27;
	    card.maxHeight = ex.height()-card.topMargin;
	    card.maxWidth = ex.width()-card.leftMargin;
	    card.originalTabWidth = 220;
	    card.tabWidth = 220;
	    card.tabHeight = 22;
	    card.lineHeight = 16;
	    card.x = card.depth*card.leftMargin;
		card.y = card.depth*card.topMargin;
		if (card.depth == 1) card.y += 5;
		if (card.depth == 3) card.y -= 5;
		card.width = card.maxWidth - card.x;
		card.height = card.maxHeight - card.y;
		card.allPermsBoxWidth = 100	;
		card.allPermsBoxHeight = 200 - card.depth*20;
		card.allPermsBoxXMargin = 10;
		card.allPermsBoxX = card.x + card.width - card.allPermsBoxWidth;
		card.allPermsBoxY = card.y + 35*card.depth + 65;
     
		card.allPermsBoxList = [];
		card.allPermsString = [];

		card.returnedFromRecursiveCall = false;
		card.returnedFromRangeTextBox = false;

		card.curSubPerm = 0;
		card.innerLoopI = 0;
		card.shouldReturnAllPerm = false;
        
        card.circlei = false;
        card.circleInner = false;
		var rgbStr = (240 - 25 * card.depth).toString();
        card.fill = "rgb(" + rgbStr + ", " + rgbStr + "," + rgbStr + ")";


		card.init = function(){
			// create all the lines
			for (var i = 0; i < ex.data.content.code.length; i++) {
				var depthOffsetX = card.depth*16;
				var depthOffsetY = card.depth*65;
				if (i == 0){ // extra offset for first line
					depthOffsetX += card.depth*151;
					if (card.depth >= 2) {
						depthOffsetX -= (card.depth - 1) * 150;
					}

				}
				if (card.depth != 0) depthOffsetY -= 1;
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
					var x = card.x+card.leftMargin + 5;
					var y = card.y;
					card.tabWidth = card.originalTabWidth + 20;
					break;
				case 1:
					var x = card.x + card.leftMargin*11;
					var y = card.y + card.lineHeight*2;
					card.tabWidth = card.originalTabWidth - 25;
					break;
				case 2:
				    var x = card.x + card.leftMargin*12 - 20;
				    var y = card.y + card.lineHeight*4 + 10;
				    card.tabWidth = card.originalTabWidth - 25;
				    break;
				case 3:
					var x = card.x + card.leftMargin * 14 - 45;
					var y = card.y + card.lineHeight * 6 + 20;
					card.tabWidth = card.originalTabWidth - 25;
			}
			ex.graphics.ctx.fillRect(x, y, card.tabWidth,card.tabHeight+5); 
		};

		card.drawAllPermsBox = function() {
			ex.graphics.ctx.fillStyle = "rgb(91, 192, 222)";
			ex.graphics.ctx.fillRect(card.allPermsBoxX, card.allPermsBoxY, 
									 card.allPermsBoxWidth - card.allPermsBoxXMargin, card.allPermsBoxHeight);
			// draw allPerms text
			ex.graphics.ctx.fillStyle = "rgb(255, 255, 255)";
			ex.graphics.ctx.font = "13px Courier";
			ex.graphics.ctx.fillText("allPerms=[", card.allPermsBoxX + 5, card.allPermsBoxY + 15);
			ex.graphics.ctx.fillText("]", card.allPermsBoxX + card.allPermsBoxWidth - 20, card.allPermsBoxY + card.allPermsBoxHeight - 10);
			// draw lists within allPerms
			var startY = card.allPermsBoxY + 15;
			for (var i = 0; i < card.allPermsBoxList.length; i++){
				ex.graphics.ctx.fillText(listToString1D(card.allPermsBoxList[i]), card.allPermsBoxX + 10, startY + i*card.lineHeight);
			}	
		}

		card.draw = function(){
			if (card.toDraw){
				// get right color
				ex.graphics.ctx.fillStyle = card.fill;
				// draw card
				if (card.depth > 0){
					var adjustForDepth = (card.lineHeight+4)*2*card.depth-(4-card.depth)*3;
				}
				else{
					var adjustForDepth = 0;
				}
	            ex.graphics.ctx.fillRect(card.x ,card.y + card.tabHeight + adjustForDepth,
	            	card.width, card.height);
	            // draw tab
	            card.drawTab();
	            // draw allPerms box
				if (card.curLineNum >= 3){
					card.drawAllPermsBox();
				}
	            // draw lines
				for (var i = 0; i < card.linesList.length; i++){
					var thisLine = card.linesList[i];
					// unhighlight every line just in case
					thisLine.unhighlight();
					// if we're on the top card, highlight
					if (state.topCard.depth == card.depth){
						// highlight the current line
						if (thisLine.lineNum == card.curLineNum && thisLine.highlightImage == undefined && thisLine.lineNum != 7){
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
			card.linesList[5].rangeDoneButton.deactivate();
			card.linesList[7].returnAllPermsButton.deactivate();
			var rangeTextBoxX = 150 + 13 * card.depth;
			var rangeTextBoxY = state.topCard.lineHeight * 5 + state.topCard.lineHeight * 4 * card.depth + button_margin;
			card.linesList[5].rangeTextBox = TextBox(rangeTextBoxX, rangeTextBoxY, "range (len (subPerm) + 1)", 1, 33);
			
			if (card.depth == 0) {
				card.linesList[6].allPermsDoneButton = Button(485, 103, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
			}
			if (card.depth == 2) {
				card.linesList[6].allPermsDoneButton = Button(485, 230, "Done", 6, card.linesList[6].allPermsDoneButtonAction, "xsmall", ['', 13]);
			}
		}

		//Prepare to be popped off the stack
		card.prepareForReturn = function() {
			card.setToDraw(false);
			card.linesList[1].deactivateReturnButton();
			card.linesList[5].rangeDoneButton.deactivate();
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
		line.highlightWidth = undefined;
		line.returnedFromRecursiveCall = false;

		line.showBaseReturnButton = false;
		line.showTextBox = false;
		line.rangeEntered = false;
		line.showAllPermsTextBox = false;

		line.baseReturnButton = undefined;
		line.rangeTextBox = undefined;
		line.rangeDoneButton = undefined;
		line.allPermsTextBox = undefined;
		line.allPermsDoneButton = undefined;
		line.returnAllPermsButton = undefined;

		line.curIndexForAllPerms = 0;

		line.init = function(){
			// get text
			line.text = line.getText();
			line.highlightWidth = line.text.length * 9;
			// text box and corresponding buttons for range line
			//line.rangeTextBox = TextBox(170, 168, "range (len (subPerm) + 1) e.g. [0, 1]", 1, 33);
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
					state.topCard.allPermsString.push(trim_spaces(line.allPermsTextBox.getText()));
					
					//var i = state.topCard.allPermsString.length-1;
					//ex.graphics.ctx.fillStyle = "yellow";
					///var len = state.topCard.allPermsString[i].length;
					//ex.graphics.ctx.fillText(state.topCard.allPermsString[i].substring(1,len-1),
					//	state.topCard.allPermsBoxX+10,state.topCard.allPermsBoxY+30+20*i);
					if (state.topCard.innerLoopI >= ex.data.content.list.length - state.topCard.depth - 1) {
						//Calculate the total number of current subPerms
						var subPermNum = 1;
						if (state.topCard.depth < ex.data.content.list.length) {
							for (var i = 1; i < ex.data.content.list.length - state.topCard.depth; i++) {
								subPermNum *= i;
							}
						}
						if (state.topCard.curSubPerm >= subPermNum - 1) {
							state.topCard.shouldReturnAllPerm = true;
							line.deactivateAllPermsTextBox();
							line.deactivateRangeTextBox();
							line.deactivateAllPermsDoneButton();
							state.topCard.getAndSetNextLine();
							state.topCard.curLineNum = 7;
							state.draw();
							state.topCard.linesList[7].unhighlight();
						}else {
							state.topCard.innerLoopI = 0;
							state.topCard.advanceCurSubPerm();
						}
					}else {
						state.topCard.advanceInnerLoopI();
					}
					// draw text in allPerms box
					var i = state.topCard.allPermsString.length-1
				    ex.graphics.ctx.fillStyle = "yellow";
			   		var len = state.topCard.allPermsString[i].length;
					ex.graphics.ctx.fillText(state.topCard.allPermsString[i].substring(1,len-1),
					state.topCard.allPermsBoxX+10,state.topCard.allPermsBoxY+30+20*i);
					// uncircle things
					for (var i = 0;i<state.topCard.curSubPerm;i++){
				        state.topCard.linesList[4].uncircle(i);
			        }
			        state.topCard.linesList[4].circle(state.topCard.curSubPerm);
			        if (state.topCard.circleInner){
				        for (var i = 0;i < ex.data.content.list.length - line.depth;i++){ // hax...
	                		
				    		state.topCard.linesList[5].uncircle(i);
						}
			    		state.topCard.linesList[5].circle(state.topCard.innerLoopI);
					}

					if (line.allPermsTextBox != undefined) {
						line.allPermsTextBox.setText("");
					}
				}else {
					var ans = line.allPermsTextBox.getText();
					if (trim_spaces(ans) == "") {
						message = "Please enter a value, like [[2, 3]]";
						ex.alert(message, {color: "yellow", transition: "alert-long"})

						line.allPermsTextBox.setText("")
					}else {
						if (mode == "quiz-immediate" || mode == "quiz-delay") {
							state.subTractScore(0.02);
							state.drawScore();
							var message = "That's incorrect.";
						}
						else if (ans.substring(0, 2) != "[[" || ans.substring(ans.length - 2, ans.length) != "]]") {
							var message = "Be sure to have the right type of lists. Here's the correct answer."
						}
						else{
							var message = "You should insert a[0] at the current index. Here's the correct answer.";
						}		
						state.advanceState();

						ex.alert(message, {color: "yellow", transition: "alert-long"});

					}
				}
				state.saveCurState();
			}
			var allPermDoneButtonY = state.topCard.lineHeight * 6 + state.topCard.lineHeight * 4 + line.depth + button_margin;
			line.allPermsDoneButton = Button(485, allPermDoneButtonY, "Done", 6, line.allPermsDoneButtonAction, "xsmall", ['', 13]);
			// and a button for return allPerms
			line.returnAllPermsButtonAction = function(){
				if (state.topCard.shouldReturnAllPerm) {
					line.returnAllPermsButton.deactivate();
					state.topCard.unhighlightAll();
					if (state.topCard.depth == 0) {
						state.taskFinished = true;
						state.getLineFromTopCard(7).deactivateReturnAllPermsButton();
						state.draw();
						state.topCard.unhighlightAll();
						ex.graphics.off("mousedown", mouseClicked);
						ex.alert("Congratulations! You have finished the task. Please click Submit.", {color: "blue", stay: true});
						ex.chromeElements.submitButton.enable();
					}else {
						state.animateCollapse();
					}
				}else {
					ex.alert("allPerms should contain more elements before returning.", {color: "yellow", transition: "alert-long"})
					if (mode == "quiz-immediate" || mode == "quiz-delay") {
						state.subTractScore(0.02);
						state.drawScore();
					}
				}
				state.saveCurState();
			}
			var returnAllPermsButtonY = state.topCard.lineHeight * 7 + state.topCard.lineHeight * 4 * line.depth + button_margin;
			line.returnAllPermsButton = Button(74, returnAllPermsButtonY, "return allPerms", 7, line.returnAllPermsButtonAction, "xsmall");
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
							if (mode == "quiz-immediate" || mode == "quiz-delay") {
								state.subTractScore(0.02);
								//baseReturnButtonMessage += " (score -0.1)";
								state.advanceState();
							}
							ex.alert(baseReturnButtonMessage, {color: "yellow", transition: "alert-long"});
						}
						state.saveCurState();
					};
					line.baseReturnButton = Button(baseReturnButtonX, baseReturnButtonY, 
													"return [ [ ] ]", 1, 
													baseReturn, 
													"xsmall", undefined);
					break;
				case 5:
				    var rangeTextBoxY = state.topCard.lineHeight * 5 + state.topCard.lineHeight * 4 * line.depth + button_margin;
					line.rangeTextBox = TextBox(160, rangeTextBoxY, "range (len (subPerm) + 1)", 1, 35);
					line.rangeDoneButtonAction = function(){
						if (line.checkTextAnswer(line.rangeTextBox.getText())){ // correct
							state.topCard.getAndSetNextLine();
							state.getLineFromTopCard(5).rangeEntered = true;
							state.topCard.circleInner = true;
							state.draw();
							state.getLineFromTopCard(6).doLineAction();
						} 
						else{ // incorrect
							if (trim_spaces(line.rangeTextBox.getText()) == "") {
								message = "Please enter a value, like [0, 1]";
								ex.alert(message, {color: "yellow", transition: "alert-long"})

								line.rangeTextBox.setText("")
							}else {
								var message = "That's incorrect. Range is endpoint exclusive"
								if (mode == "quiz-immediate" || mode == "quiz-delay") {
									state.subTractScore(0.02);
									state.drawScore();
									message = "That's incorrect."
								}
								ex.alert("That is incorrect. Here's the correct answer.", {color: "yellow", transition: "alert-long"});
								state.advanceState();
							}
						}
						state.saveCurState();
					};
					var rangeDoneButtonY = state.topCard.lineHeight * 5 + state.topCard.lineHeight * 4 * line.depth + button_margin;
					line.rangeDoneButton = Button(400, rangeDoneButtonY, "Done", 5, line.rangeDoneButtonAction, "xsmall", ['', 13]);
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
			// adjust for when the if statement is cut short by the base return button
			if (line.lineNum == 1 && line.text == ex.data.content.code[1]){
				line.highlightWidth = line.text.length * 5.5;
			}
			if (line.highlightWidth+line.x > state.topCard.allPermsBoxX){
				line.highlightWidth = state.topCard.allPermsBoxX - line.x;
			}
			/*
			if (line.highlighted) {
				return;
			}
			*/
			var fill = 5;
			ex.graphics.ctx.fillStyle = "rgba(255, 250, 153, 120)"
			ex.graphics.ctx.fillRect(line.x, line.y + fill, line.highlightWidth, state.topCard.lineHeight)
			/*
			line.highlightImage = ex.createImage(line.x, line.y + fill, img, {
				width: line.highlightWidth,
				height: state.topCard.lineHeight
			});
            */
			line.highlighted = true;
			// activate or deactivate the base return button
			/*
			if (line.baseReturnButton != undefined && line.baseReturnButton.myButton != undefined) {
				line.deactivateReturnButton();
				if (line.lineNum == 1) {
					line.baseReturnButton.activate();
				}
			}*/
		};

		line.unhighlight = function(){
			if (line.highlightImage != undefined) {
				line.highlightImage.remove();
				line.highlightImage = undefined;
				line.highlighted = false;
			}
		};

		line.circle = function(index){
			var retinaIssue = 6;
            if (line.lineNum == 4){
            	var list = permutations(ex.data.content.list.slice(state.topCard.depth + 1, ex.data.content.list.length));
				var newText = listToString(list.slice(0,index));
            	var offset = 148 + newText.length*10;
            	var width = listToString(list[index]).length*9;            	
            	ex.graphics.ctx.strokeStyle = "red";
            	if (state.topCard.depth == 0) width -= 15;
            	if (index == 1) offset += 10;
            	ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,width+retinaIssue,state.topCard.lineHeight-2);
            }
            if (line.lineNum == 5){
            	var offset = 140 + index*35;
            	ex.graphics.ctx.strokeStyle = "red";
            	ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,17+retinaIssue,state.topCard.lineHeight-2);
            }
		}

		line.uncircle = function(index){
		    var retinaIssue = 6;
            if (line.lineNum == 4){
            	var list = permutations(ex.data.content.list.slice(state.topCard.depth + 1, ex.data.content.list.length));
				var newText = listToString(list.slice(0,index));
            	var offset = 148 + newText.length*10;
            	var width = listToString(list[index]).length*9;
            	ex.graphics.ctx.strokeStyle = state.topCard.fill;
            	if (state.topCard.depth == 0) width -= 15;
            	if (index == 1) offset += 10;
            	for (var i = 0; i < 3; i++) {
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,width+retinaIssue,state.topCard.lineHeight-2);
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,width+retinaIssue,state.topCard.lineHeight-2);
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,width+retinaIssue,state.topCard.lineHeight-2);
            	}
            }
            if (line.lineNum == 5){
            	var offset = 140 + index*35;
            	ex.graphics.ctx.strokeStyle = state.topCard.fill;
            	for (var i = 0; i < 3; i++) {
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,17+retinaIssue,state.topCard.lineHeight-2);
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,17+retinaIssue,state.topCard.lineHeight-2);
            		ex.graphics.ctx.strokeRect(line.x+offset-retinaIssue,line.y+5,17+retinaIssue,state.topCard.lineHeight-2);
            	}
            }
		}

		line.getText = function(){
			if (line.lineNum == 1 && line.showBaseReturnButton) {
				return "  if (len(a) == 0):";
			}
			else if (line.lineNum == 5 && line.rangeEntered){
				var correct = range(0, ex.data.content.list.length - line.depth, 1);
				var correctStr = "[ " + correct.join(" , ") + " ]";
				return "      for i in " + correctStr + ":";
			}
			else if (line.lineNum == 5 && line.showTextBox) {
				return "      for i in "
			}
			else if (line.lineNum == 4 && state.topCard != undefined && 
				     state.topCard.returnedFromRecursiveCall) {
				var newText = "    for subPerm in ";
				var list = permutations(ex.data.content.list.slice(state.topCard.depth + 1, ex.data.content.list.length));
				newText += listToString(list);
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
			else if (state.topCard.curLineNum >= 6 && line.lineNum == 7 && !state.taskFinished){
				return "";
			}
			else if (state.topCard.curLineNum == 6 && line.lineNum == 6){
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

		line.hide = function(start){
            ex.graphics.ctx.fillStyle = state.topCard.fill;
            ex.graphics.ctx.fillRect(line.x+start,line.y,line.highlightWidth-start,state.topCard.lineHeight);
		}

		line.draw = function(){
			var keywordColor = "rgb(249, 38, 114)";
			var numberColor = "rgb(61, 163, 239)";
   			ex.graphics.ctx.fillStyle = "rgb(0, 0, 0)";
			ex.graphics.ctx.font = "14px Courier";
			var text = line.getText();
			if (state.topCard.circlei) state.topCard.linesList[4].circle(state.topCard.curSubPerm);
			if (state.topCard.circleInner) {
				state.topCard.linesList[5].circle(state.topCard.innerLoopI);
			}
			if (line.lineNum == 0){
               
				ex.graphics.ctx.fillText("permutations([", line.x, line.y + state.topCard.lineHeight);
				var numText = "";
				for (var numIndex = line.depth; numIndex < ex.data.content.list.length; numIndex++){
					if (numIndex == ex.data.content.list.length - 1) {
						numText += ex.data.content.list[numIndex].toString();
					}else {
						numText += ex.data.content.list[numIndex].toString() + ", ";
					}
				}
				ex.graphics.ctx.fillStyle = "blue";
				ex.graphics.ctx.fillText(numText, line.x+120, line.y + state.topCard.lineHeight);
				ex.graphics.ctx.fillStyle = "rgb(0, 0, 0)";
				ex.graphics.ctx.fillText("])", line.x+120+numText.length*10, line.y + state.topCard.lineHeight);
			}
			else ex.graphics.ctx.fillText(text, line.x, line.y + state.topCard.lineHeight);
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
					// display feedback if needed
					if (state.topCard.depth == 0){
						ex.alert("Does the function return here? <br>If so, click the return button. <br>If not, keep clicking on the next line to execute.", {color: "blue", stay: true});
					}
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
					//state.topCard.setToDraw(false);
					state.topCard.unhighlightAll();
					state.topCard = state.getCard(depthToActivate);
					state.topCard.setToDraw(true);
					break;
				case 5: // for i
					if (state.topCard.depth == 2){
						ex.alert("Fill in the value to replace the line of code.<br>e.g. [0, 1]", {color: "blue", stay: true});
					}
					line.showTextBox = true;
					state.topCard.curLineNum = 5;
					state.topCard.circlei = true;
					break;
				case 6: // allPerms
					// deactivate previous button
					state.topCard.returnedFromRangeTextBox = true;
					state.getLineFromTopCard(5).rangeDoneButton.deactivate();
					state.getLineFromTopCard(5).rangeTextBox.deactivate();
					//hide last line of code
		            state.getLineFromTopCard(7).hide(0);
					// change curLineNum to 6
					//state.topCard.unhighlightAll();
					//state.topCard.curLineNum = 6;
					//state.getLineFromTopCard(6).highlight();
					// change text to previous text box's answer
					var correct = range(0, ex.data.content.list.length - line.depth, 1);
					var correctStr = "[" + correct.join() + "]";
					state.getLineFromTopCard(5).getText();
					// deactivate previous button
					state.getLineFromTopCard(5).rangeDoneButton.deactivate();
					state.getLineFromTopCard(5).rangeTextBox.deactivate();
					state.getLineFromTopCard(5).showTextBox = false;
					// create another text area and button
					line.showAllPermsTextBox = true; 
					//state.topCard.refreshText();
					var allPermTextBoxX = 218 + 4 * line.depth;
					var allPermTextBoxY = state.topCard.lineHeight * 6 + state.topCard.lineHeight * 4 * line.depth + button_margin;
					line.allPermsTextBox = TextBox(allPermTextBoxX, allPermTextBoxY, "[subPerm[:i] + [a[0]] + subPerm[i:]]", 1, 40);
					line.allPermsTextBox.activate();
					line.allPermsDoneButton.activate();
					// activate the return allPerms button as well
					line.returnAllPermsButton.activate();
					break;
				default: 
					state.topCard.getAndSetNextLine();
					break;
			}
			state.saveCurState();
		};

		line.drawIndicator = function(x, y, width) {
			var ctx = ex.graphics.ctx
			ctx.strokeStyle = "#1221df"
			ctx.beginPath()
			ctx.moveTo(x, y)
			ctx.lineTo(x + width, y)
			ctx.lineTo(x + width - width / 4, y - width / 4);
			ctx.moveTo(x + width, y)
			ctx.lineTo(x + width - width / 4, y + width / 4);
			ctx.stroke();
		}

		line.showMouseOver = function() {
			var lineHeight = state.topCard.lineHeight
			var start_x = line.x - lineHeight;
			ex.graphics.ctx.clearRect(0, 0, ex.width(), ex.height())
			state.draw();
			line.drawIndicator(start_x, line.y + lineHeight / 2 + 4, lineHeight)
		}

		line.deactivateReturnButton = function() {
			if (line.baseReturnButton != undefined) {
				line.baseReturnButton.deactivate();
				line.baseReturnButton = undefined;
			}
			line.showBaseReturnButton = false;
		}

		line.deactivateAllPermsDoneButton = function() {
			if (line.allPermsDoneButton != undefined) {
				line.allPermsDoneButton.deactivate();
				line.allPermsDoneButton = undefined;
			}
		}

		line.deactivateRangeTextBox = function() {
			if (line.rangeTextBox != undefined) {
				line.rangeTextBox.deactivate();
				line.rangeTextBox = undefined;
				line.showTextBox = false;
			}
		}

		line.deactivateRangeDoneButton = function() {
			if (line.rangeDoneButton != undefined) {
				line.rangeDoneButton.deactivate();
				line.rangeDoneButton = undefined;
			}
		}

		line.deactivateReturnAllPermsButton = function() {
			if (line.returnAllPermsButton != undefined) {
				line.returnAllPermsButton.deactivate();
				line.returnAllPermsButton = undefined;
			}
		}

		line.deactivateAllPermsTextBox = function() {
			if (line.allPermsTextBox != undefined) {
				line.allPermsTextBox.deactivate();
				line.allPermsTextBox = undefined;
				line.showAllPermsTextBox = false;
			}
		}

		line.checkClick = function(x, y){
			//Compensate for imprecision in clicks
			var click_cmpst = 0;
			if (x >= line.x && y >= line.y - click_cmpst && y <= line.y + state.topCard.lineHeight + click_cmpst) {
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
		button.height = 14

		button.myButton = undefined;

		button.activate = function(){
			if (keybinding == undefined){
				button.myButton = ex.createButton(button.x, button.y, text, 
														 {
														 	size:button.size,
														  	color: "lightBlue",
														  	height:button.height,
														 });
			}
			else{
				button.myButton = ex.createButton(button.x, button.y, text, 
														 {
														 	size:button.size,
														  	color: "lightBlue",
														  	keybinding: keybinding,
														  	height:button.height,
														 });
			}
			console.log(button.height);
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

		textBox.setText = function(text) {
			if (textBox.myTextBox != undefined) {
				textBox.myTextBox.text(text);
			}
		}

		return textBox;
	}

	function mouseMoved(event) {
		for (var i = 0; i < state.topCard.linesList.length; i++) {
			var line = state.topCard.linesList[i];
			if (line.checkClick(event.offsetX, event.offsetY)) {
				if (currentLineMouseHovers == undefined || line.lineNum != currentLineMouseHovers[0] || state.topCard.depth != currentLineMouseHovers[1]) {
					line.showMouseOver();
					currentLineMouseHovers = [line.lineNum, state.topCard.depth];
				}
			}
		}
	}

	function mouseClicked(event){
		//Check click legal before drawing
		var isLegal = false;
		var validLineClick = false;
		var clickOnCurLine = false;
		for (var i = 0; i < state.topCard.linesList.length; i++) {
			var line = state.topCard.linesList[i];
			if (line.checkClick(event.offsetX, event.offsetY)) {
				validLineClick = true;
				if (line.lineNum == state.topCard.curLineNum) {
					clickOnCurLine = true;
				}
				else if (line.clickIsLegal()) {
					line.doClick();
					isLegal = true;
					break;
				}
			}
		}
		if (!isLegal) {
			if (state.topCard.curLineNum == 5) {
				ex.alert("Please fill in the value of the list first.", {color: "yellow", transition: "alert-long"});
				return;
			}
			if (state.topCard.curLineNum == 6) {
				ex.alert("Please fill in the value of the list first.", {color: "yellow", transition: "alert-long"});
				return;
			}
			if (validLineClick) {
				state.subTractScore(0.02);
			}
			var message = "This is not the next line that executes. Try again.";
			if (clickOnCurLine) {
				message = "Click on the next line rather than the current line"
			}
			else if (validLineClick) {
				if (mode == "quiz-immediate" || mode == "quiz-delay") {
					if (state.topCard.depth < ex.data.content.list.length) {
						message = "That's incorrect."
					}else {
						message = "That's incorrect. We are in the base case now."
					}	
				}
			}else {
				message = "Please click on the code"
			}
			ex.alert(message, {color: "yellow"});
			if (mode == "quiz-immediate" || mode == "quiz-delay") {
				//state.advanceState();
			}
			//return;
		} 
		state.draw();
	}
	ex.graphics.on("mousedown", mouseClicked);

	var button_margin = 5;
	var state = State();
	var mode = ex.data.meta.mode;
	mode = "quiz-immediate";

	var taskReset = false;
	var taskNew = false;
	var currentLineMouseHovers = undefined

	ex.chromeElements.undoButton.disable();
	ex.chromeElements.redoButton.disable();
	ex.chromeElements.resetButton.on("click", function () {resetTask(true)});
	ex.chromeElements.newButton.enable();
	ex.chromeElements.newButton.on("click", function() {resetTask(false)});
	ex.chromeElements.displayCAButton.disable();
	ex.chromeElements.submitButton.disable();
	ex.chromeElements.submitButton.on("click", function() {
		if (ex.data.content.score != undefined) {
			var feedBack = "You have completed the task";
			ex.setGrade(ex.data.content.score, feedBack);
		}
	});
	ex.data.content.score = 1.0;
	state.init();
	state.draw();
	ex.graphics.on("mousemove", mouseMoved);
	ex.alert("Click on the next line that executes", {color: "blue", stay: true});

};
