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
			// add 2 test states
		};

		timeline.next = function(){
			if (timeline.currStateIndex < timeline.states.length - 1){
				timeline.currStateIndex += 1;
				timeline.states[timeline.currStateIndex].draw();
				console.log("next: ", timeline.currStateIndex);
			}
		};

		timeline.prev = function(){
			if (timeline.currStateIndex > 0){
				timeline.currStateIndex -= 1;
				timeline.states[timeline.currStateIndex].draw();
				console.log("prev: ", timeline.currStateIndex);
			}
		};

		timeline.goto = function(index){
			if (index >= 0 && index < timeline.states.length){
				timeline.currStateIndex = index;
				timeline.states[timeline.currStateIndex].draw();
			}
		};

		return timeline;
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
	var codeH = 375;
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
	var prevX = buttonSize - margin/2;
	var prevButton = ex.createButton(prevX, nextY, "<",
										{
											size:"small",
											keybinding:["", 37],
											color: "lightBlue"
										});
	prevButton.on("click", timeline.prev);


}
