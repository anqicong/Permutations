/** 
 * @file test
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
			func(args);
		}
	}

	function CodeWell(left, top, w, h, inputList){
		var code = {};
		code.left = left;
		code.top = top;
		code.w = w;
		code.h = h;
		code.steps = [];
		code.curStep = 0;

		code.init_steps = function() {
			code.steps = [];
		}

		code.totalStep = function () {
			return 42;
		}

		code.nextStep = function () {
			if(code.curStep < code.steps.length) {
				code.curStep += 1;
				code.steps[curStep].call();
			}
		};

		code.draw = function (size) {
			var bottom_margin = 15;
			ex.createCode(left, top, ex.data.code.display, {
				width: code.w,
				height: code.h - bottom_margin,
				language: ex.data.code.language,
				size: size
			})

		};

		return code;
	}

	var code = CodeWell(0, 0, ex.width()/2, ex.height());
	code.draw("medium");

};
