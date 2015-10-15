/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	// display loop?
	var displayLoop = false;

    /**********************************************************************
	 * Find Permutations
	 *********************************************************************/

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


	function Card(level, level_count){
		//create one index card, representing a recursive call
		var card = {};

		//initiate return value and return value from last call
		card.rvalue = undefined;
		card.level = level;
        card.list = ex.data.content.list.slice(card.level,level_count);
        card.last_return = permutations(card.list.slice(1,card.list.length));
        card.base = false;
        card.recursive = false;
        card.level_count = level_count;
        

        // variables for creating cards
        card.card_color = [48,144,255];
		card.up_margin = 25;
		card.margin = 20;
		card.side_margin = 10;
		card.total_width = ex.width()/2 - card.side_margin*2;
		card.total_height = ex.height() - card.side_margin*2;

        //recursive or not
        if (card.level == level_count) card.base = true;
        else card.recursive = true;

        card.case_answer_correct = false;
        card.displayCheckboxes = false;

		//set dimensions
		card.x = card.side_margin + ex.width()/2 + (card.level)*card.side_margin;
		card.y = card.side_margin + (card.level)*card.up_margin;
		card.width = card.total_width - (card.level)*card.side_margin*2;
		card.height = card.total_height - (card.level)*(card.up_margin + card.margin);
		card.returnText = undefined;
        
        var list_x = card.x + 90;
        var cur_y = card.y + card.height/2;

        card.insertion_boxes =[];
        for (var i = 0;i < card.last_return.length;i++){
        	var cur_list = card.last_return[i];
        	var cur_boxes = [];
            for (var j=0;j<cur_list.length+1;j++){
            	cur_boxes.push(Rect(list_x,cur_y-10,15,15));
            	list_x += 45;
            }
            list_x += 10;
            card.insertion_boxes.push(cur_boxes);
        }
        card.checkbox_r = Check("recursive case", card.x+30, card.y+30);
        card.checkbox_b = Check("base case", card.x+190, card.y+30);

		//set color
		card.r = (card.card_color[0]*(level_count-card.level)/level_count).toString(16);
		card.g = ((card.card_color[1]*(level_count-card.level))/level_count).toString(16);
		card.b = ((card.card_color[2]*(level_count-card.level))/level_count).toString(16);

		card.setDisplayCheckboxes = function(newDisplayCheckboxes){
			card.displayCheckboxes = newDisplayCheckboxes;
		};

		card.pop_up = function(){
			//@TODO
		};

		card.vanish = function(){
			//@TODO
		};

		
		card.draw_loop = function(){
			// draw the interactive part
			ex.graphics.ctx.fillText("Insert " 
				+ card.list[0].toString() + " to the right places",
				card.x+30,cur_y - 20);
			ex.graphics.ctx.fillText("[",card.x+60,cur_y);
			var cur_x = card.x+70;
			for (var i = 0; i < card.last_return.length;i++){
				var cur_list = card.last_return[i];
				ex.graphics.ctx.fillStyle = "white";
				ex.graphics.ctx.fillText("[",cur_x,cur_y);
				cur_x += 20;

			    card.insertion_boxes[i][0].draw();
			    if (card.insertion_boxes[i][0].chosen){
			        var num_x = card.insertion_boxes[i][0].left;
			       	var num_y = card.insertion_boxes[i][0].top;
			       	ex.graphics.ctx.fillStyle = "black";
			       	console.log(card.list[0].toString());
			       	console.log(num_x,num_y);
			       	ex.graphics.ctx.fillText(card.list[0].toString(),num_x,num_y+10);
			    }
				for (var j=0;j<cur_list.length;j++){
					cur_x += 25;
					ex.graphics.ctx.fillStyle = "white";
                    ex.graphics.ctx.fillText(cur_list[j].toString(),
                	    cur_x,cur_y);
                    cur_x += 20;
			        card.insertion_boxes[i][j+1].draw();
			        ex.graphics.ctx.fillStyle = "black";
			        if (card.insertion_boxes[i][j+1].chosen){
			        	var num_x = card.insertion_boxes[i][j+1].left;
			        	var num_y = card.insertion_boxes[i][j+1].top;
			        	ex.graphics.ctx.fillText(card.list[0].toString(),num_x,num_y+10);
			        }
			    }

			    cur_x += 25;
			    ex.graphics.ctx.fillStyle = "white";
			    ex.graphics.ctx.fillText("]",cur_x,cur_y);
			    cur_x += 25;

			    
			}
			cur_x -= 10;
		    ex.graphics.ctx.fillText("]",cur_x,cur_y);
		}

		card.drawReturn = function() {
			var returnValue = "";
			var returnList = permutations(card.list);
			for (var i = 0; i < returnList.length; i++) {
				if (returnList[i].length == 0) {
					returnValue += "[ ]";
				}else {
					returnValue += "[ " + returnList[i].toString() + " ]";
					if (i != returnList.length - 1) {
						returnValue += ", ";
					}
				}
			}
			returnValue = "return: [ " + returnValue + " ]";
			ex.graphics.ctx.fillStyle = "#ffffff";
			ex.graphics.ctx.fillText(returnValue, card.x+30, card.y + card.height / 2);
		}
		
        
  		card.draw = function(){
			//just rects right now, will be fancier
			ex.graphics.ctx.fillStyle = "#"+card.r+card.g+card.b;
            ex.graphics.ctx.fillRect(card.x, card.y, card.width, card.height);
            ex.graphics.ctx.fillStyle = "white";
            //write page number and list
            ex.graphics.ctx.font = "16px Courier New"
            ex.graphics.ctx.fillText(
            	"permutations([" + card.list.toString() +"])", card.x+10, card.y+20);
            console.log(card.list);
            ex.graphics.ctx.fillText("depth: " + card.level.toString(),
            	ex.width()-5*margin-30*card.level/card.level_count, card.y+20);
            // draw checkboxes
            if (card.displayCheckboxes){
	            ex.graphics.ctx.font = "14px Courier New"
	            card.checkbox_b.draw();
	            card.checkbox_r.draw();
	        }
            // draw the loop if stage is loop
            if (card.list.length<1) displayLoop = false;
            if (displayLoop == true){
            	card.draw_loop();
            }
		};

		return card;
	}

	//Approximate the start of y coordinate of the line
	function getLineY(lineNum, w) {
		var codeWellLimit = 400;
		var codeHeight = 14;
		switch (lineNum) {
			case 0: return 13; break;
			case 5: return 86; break;
			//reuturn allPerms
			case 8: 
			if (w < codeWellLimit) {
				return 130 + codeHeight
			}else {
				return 130
			}
			break;
			//print statement
			case 10: 
			if (w < codeWellLimit) {
				return 160 + codeHeight
			}else {
				return 160
			}
			break;
			default: return (lineNum + 1) * codeHeight; break;
		}
	}


	function State(lineNum, lineSpan, cardList, enter, exit){
		var state = {};
		state.lineNum = lineNum;
		state.lineSpan = lineSpan;
		state.cardList = cardList;
		state.curStepImage = undefined;
		state.codeColorImage = "img/codeColor.png";
		state.enterFunc = enter;
		state.exitFunc = exit;

		//Color the code curretly being executed
		state.colorCode = function(){
			var codeHeight = 14;
			var codeHeight = 14;
			state.curStepImage = ex.createImage(margin, 
				getLineY(lineNum, ex.width() / 2) + margin, 
				state.codeColorImage, {
				width: ex.width() / 2 - 2*margin,
				height: codeHeight * state.lineSpan
			});
		};

		state.enter = function() {
			if (state.enterFunc != undefined) {
				state.enterFunc();
			}
		}

		state.exit = function() {
			state.clear();
			if (state.exitFunc != undefined) {
				state.exitFunc();
			}
		}

		state.clear = function () {
			//Clear the code color image
			if (state.curStepImage != undefined) {
				state.curStepImage.remove();
			}
			// clear the rectangles
			ex.graphics.ctx.clearRect(ex.width() / 2, 0, ex.width() / 2, ex.height());
		}

		state.draw = function() {
			state.colorCode();
			for (var i = 0; i < cardList.length; i++){
				cardList[i].draw();
			}
		}

		return state;
	}

	/**********************************************************************
	 * Enter and exit functions
	 *********************************************************************/

	var showCheckboxes = function() {
		var curState = timeline.states[timeline.currStateIndex];
		var topCard = curState.cardList[curState.cardList.length - 1];
		topCard.displayCheckboxes = true;
		topCard.draw();
	};

	var hideCheckboxes = function() {
		var curState = timeline.states[timeline.currStateIndex];
		var topCard = curState.cardList[curState.cardList.length - 1];
		topCard.displayCheckboxes = false;
		topCard.draw();
	};

	var drawBReturn = function() {
		cards[cards.length - 1].drawReturn();
	};

	var showLoop = function() {
		displayLoop = true;
		var curState = timeline.states[timeline.currStateIndex];
		var topCard = curState.cardList[curState.cardList.length - 1];
		topCard.draw_loop();
	};

	var noLoop = function() {
		displayLoop = false;
	};

	var drawRReturn = function() {
		var curState = timeline.states[timeline.currStateIndex];
		var topCard = curState.cardList[curState.cardList.length - 1];
		topCard.drawReturn();
	};

	/************************************************************************
	 * Timeline
	 ***********************************************************************/

	function Timeline(){
		var timeline = {};
		timeline.states = [];
		timeline.currStateIndex = 0;

		timeline.init = function(){
			// def and print line states
			var state0 = State(0, 1, []);
			state0.draw(); // initialize
			var state1 = State(10, 1, []); 
			// creating all the cards
			var cards = [];
			for (var i = 0; i < ex.data.content.list.length + 1; i++){
				var card = Card(i, ex.data.content.list.length + 1);
				card.list = ex.data.content.list.slice(i, 
					ex.data.content.list.length);
				cards.push(card);

			}
			// generalization
			timeline.states = [state0, state1];
			var lineNumsBeforeRecurse = [0, 1, 3, 4, 5];
			var lineNumsForBaseCase = [0, 1, 2];
			var lineNumsAfterRecurse = [5, 8];
			// for the non-base case depths
			for (var i = 0; i < ex.data.content.list.length; i++){
				for (var lineNum = 0; lineNum < lineNumsBeforeRecurse.length; lineNum++){
					// if we get to the if statement, then we want to show the r/b checkboxes
					if (lineNumsBeforeRecurse[lineNum] == 1){
						timeline.states.push(State(lineNumsBeforeRecurse[lineNum], 1, 
											 cards.slice(0, i+1), showCheckboxes, undefined));
					}
					// if we go back to the beginning, hide the checkboxes
					else if (lineNumsBeforeRecurse[lineNum] == 0){
						timeline.states.push(State(lineNumsBeforeRecurse[lineNum], 1, 
											 cards.slice(0, i+1), hideCheckboxes, undefined));
					}
					else{
						timeline.states.push(State(lineNumsBeforeRecurse[lineNum], 1, 
											 cards.slice(0, i+1), undefined, undefined));
					}
				}
			}
			// base case 
			for (var lineNum = 0; lineNum < lineNumsForBaseCase.length; lineNum++){
				if (lineNumsForBaseCase[lineNum] == 2) {
					timeline.states.push(State(lineNumsForBaseCase[lineNum], 1, cards, drawBReturn, undefined));
				}else if (lineNumsForBaseCase[lineNum] == 1){
					timeline.states.push(State(lineNumsForBaseCase[lineNum], 1, cards, showCheckboxes, undefined));
				}else {
					timeline.states.push(State(lineNumsForBaseCase[lineNum], 1, cards, undefined, undefined));
				}
			}
			// going back down the stack
			for (var i = ex.data.content.list.length - 1; i >= 0; i--){
				for (var lineNum = 0; lineNum < lineNumsAfterRecurse.length; lineNum++){
					if (lineNumsAfterRecurse[lineNum] == 5){
						timeline.states.push(State(lineNumsAfterRecurse[lineNum], 3, cards.slice(0, i+1), showLoop, noLoop));
					}
					else{
						timeline.states.push(State(lineNumsAfterRecurse[lineNum], 1, cards.slice(0, i+1), drawRReturn, undefined));
					}
				}
			}
		};

		timeline.next = function(){
			if (timeline.currStateIndex < timeline.states.length - 1){
				timeline.states[timeline.currStateIndex].exit();
				timeline.currStateIndex += 1;
				timeline.states[timeline.currStateIndex].draw();
				timeline.states[timeline.currStateIndex].enter();
				console.log("next: ", timeline.currStateIndex);
			}
		};

		timeline.prev = function(){
			if (timeline.currStateIndex > 0){
				timeline.states[timeline.currStateIndex].exit();
				timeline.currStateIndex -= 1;
				timeline.states[timeline.currStateIndex].draw();
				timeline.states[timeline.currStateIndex].enter();
				console.log("prev: ", timeline.currStateIndex);
			}
		};

		timeline.goto = function(index){
			if (index >= 0 && index < timeline.states.length){
				timeline.states[timeline.currStateIndex].clear();
				timeline.currStateIndex = index;
				timeline.states[timeline.currStateIndex].draw();
			}
		};

		return timeline;
	}

	/**********************************************************************
	 * Rect
	 *********************************************************************/

	function Rect (l,t,w,h) {
        var r = {};
        r.left = l;
        r.top = t;
        r.w = w;
        r.h = h;
        r.chosen = false;
        r.right = r.left + r.w;
        r.bottom = r.top + r.h;
        r.draw = function () {
            ex.graphics.fillStyle = "white";
            ex.graphics.ctx.fillRect(r.left,r.top,r.w,r.h);
        };
        r.clicked = function (x,y) {
            if (x > r.left && x < r.right && y > r.top && y  < r.bottom) {
                return true;
            } else {
                return false;
            }
        };
        r.move = function(dx,dy) {
            r.left += dx;
            r.top += dy;
            r.right = r.left + r.w;
            r.bottom = r.top + r.h;
        };
        return r;
    }

    /**********************************************************************
	 * Checkbox
	 *********************************************************************/

    function Check(text,x,y){
    	//class checkbox 
    	//user can select base or recursive case
    	var check = {};
    	check.x = x;
    	check.y = y;
    	check.w = 10;
    	check.text = text;
    	check.box = Rect(check.x,check.y,check.w,check.w);
    	check.chosen = false;
    	check.checkmark = "img/checkmark_correct.png";
    	check.checkImage = undefined;

    	check.clicked = function (x, y) {
    		if (x >= check.x && x <= check.x + check.w && y >= check.y && 
    			y <= check.y + check.w) {
    		    return true;
    		}else {
    			return false;
    		}
    	}

    	check.draw = function(){
    		check.box.draw();
    		ex.graphics.ctx.fillText(check.text,check.x+20,check.y+10);
            if (check.chosen) {
            	check.checkImage = ex.createImage(check.x,check.y,
            		check.checkmark,{width:"10px",height:"10px"});
            }
    	}
        
        //remove the checkmark
    	check.removeCheck = function() {
    		if (check.checkImage != undefined) {
    			check.checkImage.remove();
    			check.checkImage = undefined;
    		}
    	}

        return check;

    }



	/**********************************************************************
	 * Server functions
	 *********************************************************************/

	// generateContent is a server function that randomly generates 2 starting
	// numbers and the corresponding print statement
	function generateContent(){
		var random1 = Math.round(Math.random()*100);
		var random2 = Math.round(Math.random()*100);
		ex.data.content.list = [random1, random2];
		ex.data.content.printStatement = "print permutations([" 
										+ random1.toString() 
										+ ", " 
										+ random2.toString() 
										+ "])";
	}

	/**********************************************************************
	 * Mouse Events
	 *********************************************************************/
    function checkInsertionBox(x,y){
    	var curState = timeline.states[timeline.currStateIndex];
	 	if (curState.cardList.length == 0) {
	 		return;
	 	}
	 	var topCard = curState.cardList[curState.cardList.length - 1];
	 	var cur_boxes = topCard.insertion_boxes;
	 	for (var i = 0;i < cur_boxes.length;i++){
	 		var inner_list = cur_boxes[i];
            for (var j = 0;j < inner_list.length;j++){
            	if (inner_list[j].clicked(x,y)){
                    clicked_i = i;
                    clicked_j = j;
                    break;
            	}
            }
	 	}
	 	for (var i = 0;i < cur_boxes.length;i++){
	 		var inner_list = cur_boxes[i];
            for (var j = 0;j < inner_list.length;j++){
            	if ((i == clicked_i) && (j == clicked_j)){
            		topCard.insertion_boxes[i][j].chosen = true; 
            	}else{
            		topCard.insertion_boxes[i][j].chosen = false;
            	}
            }
	 	}
	 	if (displayLoop) topCard.draw_loop();

    }
    //Check if the user clicks inside check box
	function checkCheckbox(x, y) {
	 	//Get the card on the top
	 	var curState = timeline.states[timeline.currStateIndex];
	 	if (curState.cardList.length == 0) {
	 		return;
	 	}
	 	var topCard = curState.cardList[curState.cardList.length - 1];
	 	var isBaseCase = (curState.cardList.length == 
	 		ex.data.content.list.length + 1);
	 	var rBox = topCard.checkbox_r;
	 	var bBox = topCard.checkbox_b;
	 	//Disable click if the quesiton is already answered
	 	if (rBox.chosen || bBox.chosen) {
	 		return;
	 	}
	 	if (rBox.clicked(x, y)) {
	 		if (!isBaseCase) {
	 			//ex.showFeedback("Correct!");
	 			topCard.case_answer_correct = true;
	 			rBox.chosen = true;
	 			rBox.draw();
	 		}else {
	 			ex.showFeedback("Incorrect: List length is 0!");
	 			bBox.checkmark = "img/checkmark_incorrect.png";
	 			//bBox.chosen = true;
	 			//bBox.draw();
	 		}
	 		return;
	 	}
	 	if (bBox.clicked(x, y)) {
	 		if (isBaseCase) {
	 			//ex.showFeedback("Correct!");
	 			topCard.case_answer_correct = true;
	 			bBox.chosen = true;
	 			bBox.draw();
	 		}else {
	 			ex.showFeedback("Incorrect: List length is greater than 0!");
	 			rBox.checkmark = "img/checkmark_incorrect.png";
	 			//rBox.chosen = true;
	 			//rBox.draw();
	 		}
	 		return;
	 	}
	}

	function mouseClicked(event) {
	 	checkCheckbox(event.offsetX, event.offsetY);
	 	checkInsertionBox(event.offsetX, event.offsetY);
	}


	/**********************************************************************
	 * Init
	 *********************************************************************/

	generateContent();

	// create codewell
	var margin = 20;
	var display = ex.data.code.display + ex.data.content.printStatement;
	var codeW = ex.width()/2 - 3*margin;
	var codeH = 250;
	ex.createCode(margin, margin, display, {
		width: codeW,
		height: codeH,
		language: ex.data.code.language,
		size: "small"
	})

	// create timeline
	var timeline = Timeline();
	timeline.init();

	// create next and prev button
	var buttonSize = 30;
	var nextX = ex.width()/2 - margin - buttonSize;
	var nextY = ex.height() - margin - buttonSize;
	var nextButton = ex.createButton(nextX, nextY, ">", 
									 {
									 	size:"small",
									  	keybinding:["", 39],
									  	color: "lightBlue"
									 });
	nextButton.on("click", timeline.next);

	// create prev button
	var prevX = buttonSize + margin/2;
	var prevButton = ex.createButton(prevX, nextY, "<",
										{
											size:"small",
											keybinding:["", 37],
											color: "lightBlue"
										});
	prevButton.on("click", timeline.prev);

	ex.graphics.on("mousedown", mouseClicked);


}
