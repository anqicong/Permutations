/** 
 * @file Select the Language
 * @Luyao Hou 
 */

var main = function(ex) {
	
	var ctx = ex.graphics.ctx;
	//Disable display correct answer button
    ex.chromeElements.displayCAButton.disable();
    //Add events to other buttons
    ex.chromeElements.submitButton.on("click", submitAnswer);
    ex.chromeElements.undoButton.on("click", undoChange);
    ex.chromeElements.redoButton.on("click", redoChange);
    ex.chromeElements.resetButton.on("click", reset);

    //Margin from the exercise to the edges
    var margin = 10;
    //Width and height of font change buttons
    var bWidth = 20;
    var bHeight = 10;
    //Margin between bottom of options and bottom edge
    var bottom_margin = 100;
    var header_height = 50;
    //space between header and font buttons
    var linespace = 40;
    //height of options
    var option_height = 20;
    //Left and right margin from answers to middle of canvas and 
    //right edge respectively
    var lan_margin = 130;
    var img_widths = [10, 15, 20, 25];
    var fonts = ["small", "medium", "large", "xlarge"];
    if(ex.data.font_index == -1) {
    	ex.data.font_index = 1;
    }
    var font_index = ex.data.font_index;

    //Number to be added to x in the code
    var add_num = ex.data.add_num;
    
    //Store option buttons
    var option_b = new Array();
    var header_arr = new Array();
    var font_b = new Array();

    //The answer that user choses, -1 represents not choosing any answer
    var answer_chosen = ex.data.answer_chosen;

    //Undo and redo for font changes
    var font_undo = new Array();
    var font_redo = new Array();

    //Record which options are hidden
    if(ex.data.hide_info.length == 0) {
    	ex.data.hide_info = hide_arr();
    }
    var hide_info = ex.data.hide_info;

    //A wrapper class for options
    function Option(index) {
    	var r = {};
    	r.index = index;
    	r.para = undefined;
    	r.img = undefined;
    	r.select = function() {
    		op_select(r.index);
    	};
    	r.hide = function() {
    		hide_info[r.index] = true;
    		r.para.hide();
    		r.img.hide();
    	};
    	return r;
    }

    //Generate the number in the code as string type between 
    //1 to 10 inclusive
    function generate_num() {
    	return Math.floor(Math.random() * 10 + 1).toString();
    }

    //Create an array that stores hiding information of options
    //true represents hidden
    function hide_arr() {
    	var length = ex.data.answer.options.length;
    	var result = new Array();
    	for (var i = 0; i < length; i++) {
    		result[i] = false;
    	}
    	return result;
    }

    //Decrease the font size of answers, "d" denotes decrease in font
    function decrease_font(){
    	if(font_index != 0) {
    		--font_index;
    		font_undo.push("d");
    		ex.data.font_index = font_index;
    		drawAll();
    	}
    }

    //Increase the font size of answers, "i" denotes increase in font
    function increase_font() {
    	if(font_index != fonts.length - 1) {
    		++font_index;
    		ex.data.font_index = font_index;
    		font_undo.push("i");
    		drawAll();
    	}
    }

    //Increase the font size without pushing to undo
    function increase_font_no_undo() {
    	if(font_index != fonts.length - 1) {
    		++font_index;
    		ex.data.font_index = font_index;
    		drawAll();
    	}
    }

    //Decrease the font size without pushing to undo
    function decrease_font_no_undo() {
    	if(font_index != 0) {
    		--font_index;
    		ex.data.font_index = font_index;
    		drawAll();
    	}
    }

    //When an option is selected
    function op_select(index) {
    	answer_chosen = index;
    	ex.data.answer_chosen = answer_chosen;
    	drawAll();
    }

    //submit user answer
    function submitAnswer() {
    	if(answer_chosen == -1) {
    		ex.showFeedback("Incorrect!");
    	}else {
    		var answer = ex.data.answer.options[answer_chosen];
    		if(answer == ex.data.answer.correct) {
    			ex.showFeedback("Correct!");
    		}else {
    			ex.showFeedback("Incorrect!");
    		}
    	}
    	for(var i = 0; i < font_b.length; i++) {
    		font_b[i].disable();
    	}
    	for(var i = 0; i < option_b.length; i++) {
    		if(option_b[i].para != undefined) {
    			option_b[i].para.off("click", option_b[i].select);
    		}
    	}
    	ex.data.submitted = true;
    }

    //Reset font and hide
    function reset() {
    	hide_info = hide_arr();
    	ex.data.hide_info = hide_info;
    	font_index = 1;
    	ex.data.font_index = font_index;
    	drawAll();
    }

    //Undo font change
    function undoChange() {
    	if(font_undo.length > 0) {
    		var action = font_undo[font_undo.length - 1];
    		if(action == "d") {
    			increase_font_no_undo();
    			font_redo.push("d");
    		}else {
    			decrease_font_no_undo();
    			font_redo.push("i");
    		}
    		var len = font_undo.length;
    		font_undo.splice(len - 1, 1);
    	}
    }

    //Redo font change
    function redoChange() {
    	if(font_redo.length > 0) {
    		var action = font_redo[font_redo.length - 1];
    		if(action == "d") {
    			decrease_font();
    		}else {
    			increase_font();
    		}
    		var len = font_redo.length;
    		font_redo.splice(len - 1, 1);
    	}
    }

    //Draw the code well on the left part of exercise
    function drawCode(){
    	var margin_subtract = 4;
    	var code = ex.data.code.display;
    	var escapeStr = ex.data.code.variableEscape + "1";
    	if(add_num == -1) {
    		add_num = generate_num();
    		ex.data.add_num = add_num;
    	}
    	code = code.replace(escapeStr, add_num);
    	var codeWell = ex.createCode(margin, margin, code, {
    		//to accomodate the space taken by code
    		width: ex.width() / 2 - margin * 2,
    		height: ex.height() - margin * margin_subtract,
    		language: ex.data.code.lang,
    		size: "large"
    	});
    }

    //Draw the options composed of paragraphs and images
    //Also add click events to paragraphs and images
    function drawOptions() {
    	//Height of each option
    	var options = ex.data.answer.options;
    	var option_space = (ex.height() - margin - header_height - 
    	                   bottom_margin - linespace * 2 - bHeight - 
    	                   option_height * options.length)/(
    	                   options.length - 1);
    	for (var i = 0; i < options.length; i++) {
    		var font_style = "default";
    		if (i == answer_chosen) {
    			font_style = "italic";
    		}
    		//Create paragraph
    		var p = undefined;
    		if(!hide_info[i]) {
    			var p = ex.createParagraph(ex.width()/2 + lan_margin, 
			margin + bHeight + header_height + linespace * 2 + 
			(option_height + option_space) * i, options[i],{
				width: ex.width() / 2 - lan_margin * 2,
				height: option_height,
				textAlign: "left",
				fontStyle: font_style,
				size: fonts[font_index],
				transition: "fade"
			});
    			//keep hidden options hidden
    		}else {
    			var p = ex.createParagraph(0, 0, "", {
    				width: 0,
    				height: 0
    			});
    		}
			
    		var new_op = Option(i);
    		new_op.para = p;
    		p.on("click", new_op.select);
    		//Create images
    		var img = undefined;
    		if(!hide_info[i]) {
                var img_width = img_widths[font_index];
    			var img = ex.createImage(ex.width() - lan_margin,
			margin + bHeight + header_height + linespace * 2 + 
			(option_height + option_space) * i, "button_close.png", {
				width: img_width,
				height: img_width,
				transition: "fade"
			});
    			//keep hidden options hidden
    		}else {
    			var img = ex.createImage(0, 0, "button_close.png", {
    				width: 0,
    				height: 0
    			});
    		}
    		new_op.img = img;
    		img.on("click", new_op.hide);
    		option_b[i] = new_op;
    	}
    }

    //Draw the Select Language header and store the header
    function drawHeader() {
    	var x = ex.width() / 2;
    	var y = margin + bHeight + linespace;
    	var header = ex.createHeader(x, y, "Select Language:", {
    		textAlign: "center",
    		width: ex.width() / 2,
    		height: header_height,
    		size: "large"
    	});
    	header_arr[0] = header;
    }


    //Draw font size change buttons, store in font_b
    function drawFontButton() {
    	//Calculate the possition of buttons
    	var smallB = ex.createButton(ex.width() - bWidth * 4 - margin * 2, 
    		margin, "", {
    			width: bWidth,
    			height: bHeight,
    			keybinding: ["-", 189]
    		}).on("click", decrease_font);
    	var largeB = ex.createButton(ex.width() - margin - bWidth * 2,
    		margin, "", {
    			width: bWidth,
    			height: bHeight,
    			keybinding: ["+", 187]
    		}).on("click", increase_font);
    	font_b[0] = smallB;
    	font_b[1] = largeB;
    }

    //Clear all UI elements on the canvas
    function clearElements() {
    	ctx.clearRect(0, 0, ex.width(), ex.height());
    	//Remove options
    	if (option_b.length != 0) {
    		for (var i = 0; i < option_b.length; i++) {
    			if(option_b[i].para != undefined) {
    				option_b[i].para.remove();
    			}
    			if(option_b[i].img != undefined) {
    				option_b[i].img.remove();
    			}
    		}
    	}
    	//Remove header
    	if(header_arr.length > 0) {
    		header_arr[0].remove();
    	}
    	//Remove buttons
    	if(font_b.length > 0) {
    		font_b[0].remove();
    		font_b[1].remove();
    	}
    }

    //Draw all UI elements
    function drawAll(){
    	clearElements();
    	drawCode();
    	drawFontButton();
    	drawHeader();
    	drawOptions();
    }
    drawAll();
    //Auto submit if the user has already submitted his or her answer
    if(ex.data.submitted) {
    	submitAnswer();
    }
}
