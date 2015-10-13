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
					var card = Card(ex.data.cards.count + 1, totalDepth);
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
				var card = Card(ex.data.cards.count + 1, totalDepth);
				ex.data.cards.insert(card);
				card.draw();
			}
			code.addFuncStep(0, addCard, undefined);
			code.addSimpleStep(1);
			//Things to be done when return from base case
			var returnBCase = function() {
				//@TODO
			}
			code.addFuncStep(2, returnBCase, undefined);
			//Steps for "for" loops
			var returnListLen = 1;
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < returnListLen * (returnListLen + 1); j++) {
				var step = Step(5, undefined, undefined);
				step.updateSpan(3);
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
				code.steps[code.curStep].call();
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
				codeHeight * (start + 1), 
				colorImage, {
				width: ex.width() / 2,
				height: codeHeight * span
			});
			
		};
		return code;
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
		//set dimensions
		card.x = side_margin + ex.width()/2+ (card.level-1)*side_margin;
		card.y = side_margin + (card.level-1)*up_margin;
		card.width = total_width - (card.level-1)*side_margin*2;
		card.height = total_height - (card.level-1)*(up_margin + margin);

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
            ex.graphics.ctx.fillText(
            	"Permutations([ "+card.list.toString()+" ])",ex.width()-120,card.y+20);
		};

		return card;
	}

	function Cards(all_cards,list){
		var cards = {};
		cards.count = all_cards.length;
		cards.num_list = list;
		cards.card_list = all_cards;
        
        
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
	 * Init
	 *********************************************************************/

	generateContent();

	// create codewell
	var bottom_margin = 20;
	var right_margin = 20;
	var code_height = 375
	var code = CodeWell(0, 0, ex.width()/2 - right_margin, code_height);
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
	var up_margin = 40;
	var margin = 20;
	var side_margin = 10;
	var total_width = ex.width()/2 - side_margin*2;
	var total_height = ex.height() - side_margin*2;

	ex.data.cards = Cards([],ex.data.content.list);
	//ex.data.cards = Cards([Card(1,3),Card(2,3),Card(3,3)]);
    //ex.data.cards.draw();


}
