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
