/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	/*********************************************************************
	 * Server functions
	 ********************************************************************/

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

	// grade is a server function that returns a float between 0 and 1 that
	// represents the percentage of points the student received
	function grade(content, state){
		// @TODO
		return Math.random();
	}

    /**********************************************************************
	 * Find Permutations
	 *********************************************************************/

	 function permutation(list) {
	 	if (list.length == 0) {
	 		return [[]];
	 	}else {
	 		var allPerms = [];
	 		for (subPerm in permutation(list.slice(1, list.length))) {
	 			for (var i = 0; i < subPerm.length + 1; i++) {
	 				allPerms = subPerm.slice(0, i);
	 				allPerms.concat(list[0]);
	 				allPerms.concat(subPerm.slice(i, subPerm.length));
	 			}
	 		}
	 		return allPerms;
	 	}
	 }

	/**********************************************************************
	 * Step
	 *********************************************************************/
	
	//Step takes in a function and its argument arrays, calls the function
	//when the step is executed
	function Step(lineNum, func, args) {
		var step = {};
		step.lineNum = lineNum;
		step.func = func;
		step.args = args;
		step.span = 1;

		step.updateSpan = function(span) {
			step.span = span;
		};

		step.call = function () {
			if(func != undefined) {
				if (args != undefined) {
					func(args);
				}else {
					func();
				}
			}
		}

		return step;
	}

	/**********************************************************************
	 * Timeline 
	 *********************************************************************/

	function Timeline(x0, y0, x1, y1){
		var timeline = {};
		timeline.x0 = x0;
		timeline.y0 = y0;
		timeline.x1 = x1;
		timeline.y1 = y1;

		timeline.draw = function(){
			// draw line
			ex.graphics.ctx.fillStyle = "blue";
			ex.graphics.ctx.moveTo(timeline.x0, timeline.y0);
	        ex.graphics.ctx.lineTo(timeline.x1, timeline.y1);
	        ex.graphics.ctx.stroke();
		};

		return timeline;
	}

	/**********************************************************************
	 * Timeline 
	 *********************************************************************/

	function getLineY(lineNum, w) {
		switch (lineNum) {
			case 0: return 13; break;
			case 5: return 86; break;
			case 8: 
			if (w < 400) {
				return 144
			}else {
				return 130
			}
			break;
			case 10: 
			if (w < 400) {
				return 174
			}else {
				return 160
			}
			break;
			default: return (lineNum + 1) * 14; break;
		}
	}


	/**********************************************************************
	 * CodeWell
	 *********************************************************************/

	function CodeWell(left, top, w, h, inputList){
		var code = {};
		code.left = left;
		code.top = top;
		code.w = w;
		code.h = h;
		code.steps = [];
		code.curStep = 0;
		code.curStepImage = undefined;

		code.addSimpleStep = function(lineNum) {
			var step = Step(lineNum, undefined, undefined);
			code.steps.push(step);
		};

		code.addFuncStep = function(lineNum, func, args) {
			var step = Step(lineNum, func, args);
			code.steps.push(step);
		};

		code.init_steps = function() {
			var listLen = 2;
			//Load function
			code.addSimpleStep(0);
			//Print statement
			code.addSimpleStep(10);
			var totalDepth = 3;
			//Recursive case
			while (listLen > 0) {
				var addCard = function () {
					cardNum = ex.data.cards.count;
					var card = Card(cardNum + 1, totalDepth);
					if (ex.data.cards.count > 0) {
						var curCard = ex.data.cards.getAtIndex(cardNum - 1);
						curCard.checkbox_r.removeCheck();
						curCard.checkbox_b.removeCheck();
					}
					ex.data.cards.insert(card);
					card.draw();
				};
				//Call the function
				code.addFuncStep(0, addCard, undefined);
				//Check if condition
				code.addSimpleStep(1);
				//Initialize allPerms
				code.addSimpleStep(4);
				//for loop of sub permutations
				code.addSimpleStep(5);
				--listLen;
			}
			//The card for the base case
			var addCard = function() {
				var cardNum = ex.data.cards.count;
				var card = Card(cardNum + 1, totalDepth);
				if (ex.data.cards.count > 0) {
					var curCard = ex.data.cards.getAtIndex(cardNum - 1);
					curCard.checkbox_r.removeCheck();
					curCard.checkbox_b.removeCheck();
				}
				ex.data.cards.insert(card);
				card.draw();
				
			}
			code.addFuncStep(0, addCard, undefined);
			code.addSimpleStep(1);
			//Things to be done when return from base case
			var returnBCase = function() {
				var card = ex.data.cards.getAtIndex(ex.data.cards.count-1);
				card.drawReturn();
			}
			code.addFuncStep(2, returnBCase, undefined);
			//Steps for "for" loops
			var returnListLen = 1;
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < returnListLen * (returnListLen + 1); j++) {
				var step = Step(5, undefined, undefined);
				if (code.w < 400) {
					step.updateSpan(4);
				}else {
					step.updateSpan(3);
				}
				code.steps.push(step);
			    }
			    code.addSimpleStep(8);
			}
		}

		code.totalStep = function () {
			return 42;
		}

		code.nextStep = function () {
			if(code.curStep < code.steps.length - 1) {
				code.curStep += 1;
				code.steps[code.curStep].call();
				var curSpan = code.steps[code.curStep].span;
				code.colorCode(code.steps[code.curStep].lineNum, curSpan,
					"img/codeColor.png");
			}
		};

		code.prevStep = function () {
			if (code.curStep > 0){
				code.curStep -= 1;
				code.colorCode(code.steps[code.curStep].lineNum, 1,
					"img/codeColor.png");
			}
		}

		code.draw = function (size) {
			var display = ex.data.code.display + ex.data.content.printStatement
			ex.createCode(left, top, display, {
				width: code.w,
				height: code.h,
				language: ex.data.code.language,
				size: size
			})

		};

		//Color the code starting at line start with span of span lines
		code.colorCode = function (start, span, colorImage) {
			if (code.curStepImage != undefined) {
				code.curStepImage.remove();
			}
			var codeHeight = 14;
			code.curStepImage = ex.createImage(0, 
				getLineY(start, code.w), 
				colorImage, {
				width: code.w + right_margin,
				height: codeHeight * span
			});
			
		};
		return code;
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
	 * Check
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
	 * Cards
	 *********************************************************************/

	function Card(level,level_count){
		//create one index card, representing a recursive call
		var card = {};

		//initiate return value and return value from last call
		card.rvalue = undefined;
		card.last_return = undefined;
		card.level = level;
        card.list = [];
        card.base = false;
        card.recursive = false;
        card.level_count = level_count;

        //recursive or not
        if (card.level == level_count) card.base = true;
        else card.recursive = true;
        card.case_answer_correct = false;

		//set dimensions
		card.x = side_margin + ex.width()/2+ (card.level-1)*side_margin;
		card.y = side_margin + (card.level-1)*up_margin;
		card.width = total_width - (card.level-1)*side_margin*2;
		card.height = total_height - (card.level-1)*(up_margin + margin);
		card.returnText = undefined;
        
        card.checkbox_r = Check("recursive",card.x+30,card.y+30);
        card.checkbox_b = Check("base",card.x+130,card.y+30);

		//set color
		card.r = (card_color[0]*(level_count-card.level+1)/level_count).toString(16);
		card.g = ((card_color[1]*(level_count-card.level+1))/level_count).toString(16);
		card.b = ((card_color[2]*(level_count-card.level+1))/level_count).toString(16);

		card.pop_up = function(){
			//@TODO
		};

		card.vanish = function(){
			//@TODO
		};
        
  		card.draw = function(){
			//just rects right now, will be fancier
			ex.graphics.ctx.fillStyle = "#"+card.r+card.g+card.b;
            ex.graphics.ctx.fillRect(card.x,card.y,card.width,card.height);
            ex.graphics.ctx.fillStyle = "white";
            //write page number and list
            ex.graphics.ctx.fillText(
            	"permutations([ "+card.list.toString()+" ])",card.x+10,card.y+20);
            ex.graphics.ctx.fillText(card.level.toString(),
            	ex.width()-margin-30*card.level/card.level_count,card.y+20);
            card.checkbox_b.draw();
            card.checkbox_r.draw();
		};

		card.drawReturn = function() {
			var returnValue = "";
			var returnList = permutation(card.list);
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
			ctx.fillStyle = "#ffffff";
			ctx.fillText(returnValue, card.x+30, card.y + card.height / 2);
		}

		return card;
	}

	function Cards(all_cards,list){
		//collection of cards
		var cards = {};
		cards.count = all_cards.length;
		cards.num_list = list;
		cards.card_list = all_cards;
        
        cards.getAtIndex = function(index) {
        	return cards.card_list[index];
        }

		cards.insert = function(card) {
			cards.card_list.push(card);
			card.list = cards.num_list.slice(cards.count,2);
			++cards.count;
		}
        
        cards.update = function(){
        	//@TODO
        }
        
		cards.degrade = function(){
			var gone_card = cards.card_list.splice(cards.count - 1,1);
			gone_card.vanish();
			cards.count -= 1;
			cards.card_list[cards.count-1].last_return = gone_card.rvalue;
		}

		cards.draw = function(){
			for (i = 0;i < cards.count;i++){
                var current = cards.card_list[i];
                current.draw();
			}
		}

		return cards;
	}
	
	/**********************************************************************
	 * Mouse Events
	 *********************************************************************/

    //Check if the user clicks inside check box
	function checkCheckbox(x, y) {
	 	if (ex.data.cards.length == 0) {
	 		return;
	 	}
	 	//Get the card on the top
	 	var topCard = ex.data.cards.getAtIndex(ex.data.cards.count - 1);
	 	var isBaseCase = (ex.data.cards.count == 3);
	 	var rBox = topCard.checkbox_r;
	 	var bBox = topCard.checkbox_b;
	 	//Disable click if the quesiton is already answered
	 	if (rBox.chosen || bBox.chosen) {
	 		return;
	 	}
	 	if (rBox.clicked(x, y)) {
	 		if (!isBaseCase) {
	 			ex.showFeedback("Correct!");
	 			topCard.case_answer_correct = true;
	 			rBox.chosen = true;
	 			rBox.draw();
	 		}else {
	 			ex.showFeedback("Incorrect: List length is 0!");
	 			bBox.checkmark = "img/checkmark_incorrect.png";
	 			bBox.chosen = true;
	 			bBox.draw();
	 		}
	 		return;
	 	}
	 	if (bBox.clicked(x, y)) {
	 		if (isBaseCase) {
	 			ex.showFeedback("Correct!");
	 			topCard.case_answer_correct = true;
	 			bBox.chosen = true;
	 			bBox.draw();
	 		}else {
	 			ex.showFeedback("Incorrect: List length is greater than 0!");
	 			rBox.checkmark = "img/checkmark_incorrect.png";
	 			rBox.chosen = true;
	 			rBox.draw();
	 		}
	 		return;
	 	}
	}

	function mouseClicked(event) {
	 	checkCheckbox(event.offsetX, event.offsetY);
	}

	/**********************************************************************
	 * Init
	 *********************************************************************/

	ctx = ex.graphics.ctx;

	generateContent();

	// create codewell
	var bottom_margin = 20;
	var right_margin = 20;
	var code_height = 375
	//Create code well
	var code = CodeWell(0, 0, ex.width() / 2 - right_margin, code_height);
	code.init_steps();
	code.draw("small");
	code.colorCode(code.steps[code.curStep].lineNum, 1, "img/codeColor.png");

	// create next button
	var buttonSize = 30;
	var nextX = ex.width()/2 - right_margin - buttonSize;
	var nextY = ex.height() - bottom_margin - buttonSize;
	var nextButton = ex.createButton(nextX, nextY, ">", 
									 {
									 	size:"small",
									  	keybinding:["", 39],
									  	color: "lightBlue"
									 });
	nextButton.on("click", code.nextStep);

	// create prev button
	var prevX = buttonSize - right_margin/2;
	var prevButton = ex.createButton(prevX, nextY, "<",
										{
											size:"small",
											keybinding:["", 37],
											color: "lightBlue"
										});
	prevButton.on("click", code.prevStep);

	// create timeline
	var timeline = Timeline(prevX + buttonSize - 2, nextY + buttonSize/2, 
							nextX, nextY + buttonSize/2);	
	timeline.draw();

    //create cards
	var card_color = [48,144,255];
	var up_margin = 25;
	var margin = 20;
	var side_margin = 10;
	var total_width = ex.width()/2 - side_margin*2;
	var total_height = ex.height() - side_margin*2;

	ex.data.cards = Cards([],ex.data.content.list);

	ex.graphics.on("mousedown", mouseClicked);


}
