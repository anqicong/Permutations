/** 
 * @file Permutations
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {

	function Card(level, maxLevel){
		var card = {};

		card.draw = function(){

		};

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
