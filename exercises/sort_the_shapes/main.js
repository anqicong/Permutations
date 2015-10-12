/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {
	
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
			ex.createCode(left, top, ex.data.code.display, {
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

	var bottom_margin = 20;
	var right_margin = 20;
	var code = CodeWell(0, 0, ex.width()/2 - right_margin, 
		                ex.height() - bottom_margin);
	code.init_steps();
	code.draw("small");
	code.colorCode(code.steps[code.curStep].lineNum, 1, "codeColor.png");
	ex.chromeElements.redoButton.on("click", code.nextStep);

}
