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

		step.call = function () {
			if(func != undefined && args != undefined) {
				func(args);
			}
		}

		return step;
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
	 * Init
	 *********************************************************************/

	generateContent();

	// create codewell
	var bottom_margin = 20;
	var right_margin = 20;
	var code = CodeWell(0, 0, ex.width()/2 - right_margin, 
		                ex.height() - bottom_margin);
	code.init_steps();
	code.draw("small");
	code.colorCode(code.steps[code.curStep].lineNum, 1, "img/codeColor.png");

	// create next button
	var halfButtonSize = 25;
	var nextX = ex.width()/2 - right_margin - halfButtonSize;
	var nextY = ex.height() - bottom_margin - halfButtonSize;
	var nextButton = ex.createButton(nextX, nextY, ">", 
									 {
									 	size:"small",
									  	keybinding:["", 39],
									  	color: "lightBlue"
									 });
	nextButton.on("click", code.nextStep);

	// create prev button
	var prevX = halfButtonSize;
	var prevButton = ex.createButton(prevX, nextY, "<",
										{
											size:"small",
											keybinding:["", 37],
											color: "lightBlue"
										});
	prevButton.on("click", code.prevStep);



}
