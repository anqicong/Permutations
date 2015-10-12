/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	// generateContent is a server function that randomly generates 2 starting
	// numbers and the corresponding print statement
	function generateContent(){
		var random1 = Math.round(Math.random()*100);
		var random2 = Math.round(Math.random()*100);
		ex.data.content.list = [random1, random2]
		ex.data.content.printStatement = "print permutations([" 
										+ random1.toString() 
										+ ", " 
										+ random2.toString() 
										+ "])"
	}
	generateContent();

	// grade is a server function that returns a float between 0 and 1 that
	// represents the percentage of points the student received
	function grade(content, state){
		// @TODO
		return Math.random();
	}
	
	//Step takes in a function and its argument arrays, call the function
	//when the step is executed
	function Step(lineNum, func, args) {
		var step = {};
		step.lineNum = lineNum;
		step.func = func;
		step.args = args;
		step.call = function () {
			if(func != undefined && args != undefined) {
				func(args);
			}
		}
		return step;
	}

	function CodeWell(left, top, w, h, inputList){
		var code = {};
		code.left = left;
		code.top = top;
		code.w = w;
		code.h = h;
		code.steps = [];
		code.curStep = 0;
		code.curStepImage = undefined;

		code.init_steps = function() {
			var step = Step(0, undefined, undefined);
			var step2 = Step(9, undefined, undefined);
			code.steps = [step, step2];
		}

		code.totalStep = function () {
			return 42;
		}

		code.nextStep = function () {
			if(code.curStep < code.steps.length) {
				code.curStep += 1;
				code.steps[code.curStep].call();
				code.colorCode(code.steps[code.curStep].lineNum, 1,
					"codeColor.png");
			}
		};

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
	var card_color = [48,144,255];
	var up_margin = 40;
	var margin = 20;
	var side_margin = 10;
	var total_width = ex.width()/2 - side_margin*2;
	var total_height = ex.height() - side_margin*2;

	function Card(level,level_count){
		var card = {};
		card.rvalue = undefined;
		card.last_return = undefined;
		card.level = level;
		card.x = side_margin + ex.width()/2+ (card.level-1)*side_margin;
		card.y = side_margin + (card.level-1)*up_margin;
		card.width = total_width - (card.level-1)*side_margin*2;
		card.height = total_height - (card.level-1)*(up_margin + margin);
		card.r = (card_color[0]*(level_count-card.level+1)/level_count).toString(16);
		card.g = ((card_color[1]*(level_count-card.level+1))/level_count).toString(16);
		card.b = ((card_color[2]*(level_count-card.level+1))/level_count).toString(16);

		card.pop_up = function(){};

		card.vanish = function(){};

		card.draw = function(){
			ex.graphics.ctx.fillStyle = "#"+card.r+card.g+card.b;
            ex.graphics.ctx.fillRect(card.x,card.y,card.width,card.height);
            console.log(card.r,card.g,card.b);
            console.log(ex.graphics.ctx.fillStyle);
            console.log(card.level,card.x,card.y,card.width,card.height);
		};

		return card;
	}

	function Cards(all_cards){
		var cards = {};
		cards.count = all_cards.length;
		cards.card_list = all_cards;

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
	var bottom_margin = 20;
	var right_margin = 20;
	var code = CodeWell(0, 0, ex.width()/2 - right_margin, 
		                ex.height() - bottom_margin);
    
    ex.data.cards = Cards([Card(1,3),Card(2,3),Card(3,3)]);
    ex.data.cards.draw();

	code.init_steps();
	code.draw("small");
	code.colorCode(code.steps[code.curStep].lineNum, 1, "codeColor.png");
	ex.chromeElements.redoButton.on("click", code.nextStep);

}
