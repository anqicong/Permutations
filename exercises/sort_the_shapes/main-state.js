/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	function Card(level, maxLevel){
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

	function State(lineNum, lineSpan, cardList){
		var state = {};
		state.lineNum = lineNum;
		state.lineSpan = lineSpan;
		state.cardList = cardList;

		state.draw = function(){

		};

		return state;
	}

	function Timeline(){
		var timeline = {};
		timeline.states = [];
		timeline.currStateIndex = 0;

		timeline.init = function(){

		};

		timeline.next = function(){

		};

		timeline.prev = function(){

		};

		timeline.goto = function(){

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

	generateContent();

	// create codewell

	// create timeline

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

}
