/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	function Card(level, level_count){
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

		//set dimensions
		card.x = card.side_margin + ex.width()/2+ (card.level-1)*card.side_margin;
		card.y = card.side_margin + (card.level-1)*card.up_margin;
		card.width = card.total_width - (card.level-1)*card.side_margin*2;
		card.height = card.total_height - (card.level-1)*(card.up_margin + card.margin);
		card.returnText = undefined;
        
        card.checkbox_r = Check("recursive",card.x+30,card.y+30);
        card.checkbox_b = Check("base",card.x+130,card.y+30);

		//set color
		card.r = (card.card_color[0]*(level_count-card.level+1)/level_count).toString(16);
		card.g = ((card.card_color[1]*(level_count-card.level+1))/level_count).toString(16);
		card.b = ((card.card_color[2]*(level_count-card.level+1))/level_count).toString(16);

		card.pop_up = function(){
			//@TODO
		};

		card.vanish = function(){
			//@TODO
		};

		card.draw_loop = function(){
			ex.graphics.ctx.fillText("Click on the box to insert" 
				+ card.list[0].toString(),card.x+50,card.y+50);
			card.last_return = permutations(card.list[1:]);
			ex.graphics.ctx.fillText("[",card.x+30,card.y+100);
			var insert_box_1 = Rect(card.x+30,card.y+100,15,15);
			insert_box_1.draw();
			for (var i = 0; i < card.last_return.length;i++){
                ex.graphics.ctx.fillText(card.last_return[i].toString(),
                	card.x+60+i*20,card.y+100);
                var insert_box = Rect(card.x+80+i*20,card.y+100,15,15);
			    insert_box.draw();
			}
		    ex.graphics.ctx.fillText("]",card.x+60+i*20,card.y+100);

		}

		card.draw_loop = function(){
			ex.graphics.ctx.fillText("Click on the box to insert " 
				+ card.list[0].toString(),card.x+30,card.y+80);
			console.log(card.list.slice(1,card.list.length));
			card.last_return = permutation(card.list.slice(1,card.list.length));
			ex.graphics.ctx.fillText("[",card.x+30,card.y+100);
			var insert_box_1 = Rect(card.x+40,card.y+90,15,15);
			insert_box_1.draw();
			for (var i = 0; i < card.last_return.length;i++){
                ex.graphics.ctx.fillText(card.last_return[i].toString(),
                	card.x+60+i*30,card.y+100);
                console.log(card.last_return[0][0]);
                var insert_box = Rect(card.x+70+i*30,card.y+90,15,15);
			    insert_box.draw();
			}
		    ex.graphics.ctx.fillText("]",card.x+60+i*30,card.y+100);
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
				return 130 + codeHeightl
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


	function State(lineNum, lineSpan, cardList){
		var state = {};
		state.lineNum = lineNum;
		state.lineSpan = lineSpan;
		state.cardList = cardList;
		state.curStepImage = undefined;
		state.codeColorImage = "img/codeColor.png";

		//Color the code curretly being executed
		state.colorCode = function(){
			var codeHeight = 14;
			var codeHeight = 14;
			state.curStepImage = ex.createImage(margin, 
				getLineY(lineNum, ex.width() / 2) + margin, 
				state.codeColorImage, {
				width: ex.width() / 2,
				height: codeHeight * state.lineSpan
			});
		};

		state.clear = function () {
			//Clear the code color image
			if (state.curStepImage != undefined) {
				state.curStepImage.remove();
			}
			ex.graphics.ctx.clearRect(ex.width() / 2, 0, ex.width() / 2,
				ex.height());
		}

		state.draw = function() {
			state.colorCode();
		}

		return state;
	}

	function Timeline(){
		var timeline = {};
		timeline.states = [];
		timeline.currStateIndex = 0;

		timeline.init = function(){
			// add 2 test states
			var state0 = State(0, 1, [Card(1, 3)]);
			timeline.states.push(state0);
			var state1 = State(10, 1, [Card(2, 3)]);
			timeline.states.push(state1);
			// creating all the cards
			var cards = [];
			for (var i = 0; i < ex.data.content.list.length; i++){
				cards.push(Card(i, ex.data.content.list.length+1));
			}
		};

		timeline.next = function(){
			if (timeline.currStateIndex < timeline.states.length - 1){
				timeline.states[timeline.currStateIndex].clear();
				timeline.currStateIndex += 1;
				timeline.states[timeline.currStateIndex].draw();
				console.log("next: ", timeline.currStateIndex);
			}
		};

		timeline.prev = function(){
			if (timeline.currStateIndex > 0){
				timeline.states[timeline.currStateIndex].clear();
				timeline.currStateIndex -= 1;
				timeline.states[timeline.currStateIndex].draw();
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
	 * Init
	 *********************************************************************/

	// create codewell
	var margin = 20;
	var display = ex.data.code.display + ex.data.content.printStatement;
	var codeW = ex.width()/2 - margin;
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


}
