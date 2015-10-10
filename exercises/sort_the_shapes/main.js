/** 
 * @file Sort the Shapes
 * @author Anqi Cong, acong
 */

var main = function(ex) {
	console.log(ex);
	// disable buttons
	ex.chromeElements.undoButton.disable();
	ex.chromeElements.redoButton.disable();
	ex.chromeElements.resetButton.disable();
	ex.chromeElements.displayCAButton.disable();

	/*************************************
	 * Drawing functions
	 ************************************/

	// creates a rectangle class, edited from kitchen sink
	function makeRect (w, h, left, top){
		var r = {};
		r.w = w;
		r.h = h;
		r.left = left;
		r.top = top;
		r.right = r.left + r.w;
		r.bottom = r.top + r.h;
		r.drag = false;
		// draw
		r.draw = function (){
			ex.graphics.ctx.fillRect(r.left,r.top,r.w,r.h);
		};
		// clicked
		r.clicked = function (x, y){
		    if (x > r.left && x < r.right && y > r.top && y  < r.bottom) {
		    	console.log("rect");
		        return true;
		    } else {
		        return false;
		    }
		};
		// move
		r.move = function(dx,dy) {
	            r.left += dx;
	            r.top += dy;
	            r.right = r.left + r.w;
	            r.bottom = r.top + r.h;
	        };
	    // check on correct side (left)
	    r.check = function(){
	    	return r.right <= ex.width()/2;
	    }
	    return r;
	}

	// make my rectangles
	var myRects = [];
	var margin = 30;
	for (var i = 0; i < ex.data.rectangles.length; i++){
		// load from saved state
		if (ex.data.state.saved == true){
			var left = ex.data.state.myRects[i].left;
			var top = ex.data.state.myRects[i].top;
		}
		// create anew if needed
		else{
			var left = Math.round(Math.random() * ex.width());
			var top = Math.round(Math.random() * ex.height());
			// account for 30 px margin
			if (left < margin){
				left = margin;
			}
			else if (left + ex.data.rectangles[i].w > ex.width() - margin){
				left = ex.width() - margin - ex.data.rectangles[i].w;
			}
			if (top < margin){
				top = margin;
			}
			else if (top + ex.data.rectangles[i].h > ex.height() - margin){
				top = ex.height() - margin - ex.data.rectangles[i].h;
			}
		}
		// add the new rect to the rect list
		myRects.push(makeRect(ex.data.rectangles[i].w,
						  ex.data.rectangles[i].h,
						  left, top));
	}

	// create an ellipse class
	function makeEllipse (w, h, cx, cy){
		var e = {};
		e.w = w;
		e.h = h;
		e.cx = cx;
		e.cy = cy;
		e.drag = false;
		// draw, edited from kitchen sink
		e.draw = function(w, h, cx, cy){
			ex.graphics.drawEllipse(ex.graphics.ctx, e.cx, e.cy, e.w, e.h);
		};
		// clicked
		e.clicked = function(x, y){
			var major = (x - e.cx)*(x - e.cx);
			var minor = (y - e.cy)*(y - e.cy);
			if (major/Math.pow(e.w/2, 2) + minor/Math.pow(e.h/2, 2) <= 1){
				console.log("ellipse");
			}
			return major/Math.pow(e.w/2, 2) + minor/Math.pow(e.h/2, 2) <= 1;
		};
		// move
		e.move = function(dx, dy){
			e.cx += dx;
			e.cy += dy;
		};
		// check on correct side
		e.check = function(){
			return e.cx - e.w/2 >= ex.width()/2;
		}
		return e;
	}

	// make my ellipses
	var myEllipses = [];
	for (var i = 0; i < ex.data.ellipses.length; i++){
		// load from saved
		if (ex.data.state.saved == true){
			var cx = ex.data.state.myEllipses[i].cx;
			var cy = ex.data.state.myEllipses[i].cy;
		}
		// make a new ellipse
		else{
			var cx = Math.round(Math.random() * ex.width());
			var cy = Math.round(Math.random() * ex.height());
			var rx = ex.data.ellipses[i].w/2;
			var ry = ex.data.ellipses[i].h/2;
			// account for margins
			if (cx - rx < margin){
				cx = margin + rx;
			}
			else if (cx + rx > ex.width() - margin){
				cx = ex.width() - margin - rx;
			}
			if (cy - ry < margin){
				cy = margin + ry;
			}
			else if (cy + ry > ex.height() - margin){
				cy = ex.height() - margin - ry;
			}
		}
		// add it the list of ellipses
		myEllipses.push(makeEllipse(ex.data.ellipses[i].w, 
									ex.data.ellipses[i].h,
									cx, cy));
	}

	function drawCenterLine(){
		ex.graphics.ctx.fillStyle = "black";
		ex.graphics.ctx.moveTo(ex.width()/2,0);
        ex.graphics.ctx.lineTo(ex.width()/2,ex.height());
        ex.graphics.ctx.stroke();  
	}

	function drawTimer(){
		var timerMargin = 20;
		ex.graphics.ctx.fillText(ex.data.time.timer, ex.width()-timerMargin,
								 timerMargin);
	}

	// draw everything
	function redrawAll(){
		ex.graphics.ctx.clearRect(0,0,ex.width(),ex.height());
		ex.graphics.ctx.fillStyle = "black";
		// center line
		drawCenterLine();
		// timer
		drawTimer();
		// rectangles
		for (var i = 0; i < myRects.length; i++){
			myRects[i].draw();
		}
		// ellipses
		for (var i = 0; i < myEllipses.length; i++){
			myEllipses[i].draw();
		}
	}

	// display shapes
	ex.onTimer(250, redrawAll);

	/****************************************
	 * Event functions
	 ***************************************/

	// Timer
	var timer = ex.onTimer(1000, timerFired);

	function timerFired(){
		// if timer > 0, decrement, else submit
		if (ex.data.time.timer > 0){
			ex.data.time.timer -= 1;
		}
		else if (ex.data.state.submitted == false){
			submit();
		}
		// if timer == 5, alert
		if (ex.data.time.timer == 5){
			ex.alert("5 seconds left!");
		}
	}

	// Dragging, edited from kitchen sink

    var dragInfo = {};
    dragInfo.mouseLastX = 0;
    dragInfo.mouseLastY = 0;

    dragInfo.mousedown = function(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        for (var i = 0; i < myRects.length; i++){
        	if (myRects[i].clicked(x, y)){
        		myRects[i].drag = true;
        		dragInfo.mouseLastX = x;
        		dragInfo.mouseLastY = y;
        	}
        }
        for (var i = 0; i < myEllipses.length; i++){
        	if (myEllipses[i].clicked(x, y)){
        		myEllipses[i].drag = true;
        		dragInfo.mouseLastX = x;
        		dragInfo.mouseLastY = y;
        	}
        }
        //bind mousemove and mouseup
        ex.graphics.on("mousemove",dragInfo.mousemove);
        ex.graphics.on("mouseup",dragInfo.mouseup);
    };

    dragInfo.mousemove = function(event) {
    	for (var i = 0; i < myRects.length; i++){
    		if (myRects[i].drag){
    			var x = event.offsetX;
    			var y = event.offsetY;
    			var dx = x - dragInfo.mouseLastX;
    			var dy = y - dragInfo.mouseLastY;
    			myRects[i].move(dx, dy);
    			dragInfo.mouseLastX = x;
    			dragInfo.mouseLastY = y;
    			redrawAll();
    		}
    	}
        for (var i = 0; i < myEllipses.length; i++){
        	if (myEllipses[i].drag){
        		var x = event.offsetX;
    			var y = event.offsetY;
    			var dx = x - dragInfo.mouseLastX;
    			var dy = y - dragInfo.mouseLastY;
    			myEllipses[i].move(dx, dy);
    			dragInfo.mouseLastX = x;
    			dragInfo.mouseLastY = y;
    			redrawAll();
        	}
        }
    };

    dragInfo.mouseup = function(event) {
    	for (var i = 0; i < myRects.length; i++){
    		myRects[i].drag = false;
    	}
    	for (var i = 0; i < myEllipses.length; i++){
    		myEllipses[i].drag = false;
    	}
        ex.graphics.off("mousemove",dragInfo.mousemove);
        ex.graphics.off("mouseup",dragInfo.mouseup);
    };

    // bind mousedown
    if (ex.data.state.submitted == false)
    	ex.graphics.on("mousedown",dragInfo.mousedown);

    // bind submit button
    function submit(){
    	if (ex.data.state.submitted == false){
	    	var allCorrect = true;
	    	// check all rectangles
	    	for (var i = 0; i < myRects.length; i++){
	    		if (myRects[i].check() == false){
	    			allCorrect = false;
	    		}
	    	}
	    	// check all ellipses
	    	for (var i = 0; i < myEllipses.length; i++){
	    		if (myEllipses[i].check() == false){
	    			allCorrect = false;
	    		}
	    	}
	    	// display feedback
	    	if (ex.data.meta.mode != "quiz-delay"){
		    	if (allCorrect)
		    		ex.showFeedback("Correct!");
		    	else
		    		ex.showFeedback("Incorrect!");
		    }
	    	// makes shapes not draggable
	    	ex.graphics.off("mousedown", dragInfo.mousedown);
	    	// stop timer
	    	ex.stopTimer(timer);
	    	// mark as we submitted
	    	ex.data.state.submitted = true;
	    	ex.chromeElements.submitButton.disable();
	    }
    }

    ex.chromeElements.submitButton.on("click", submit);

    // unload
    ex.unload(function (){
    	ex.data.state.saved = true;
    	ex.data.state.myRects = myRects;
    	ex.data.state.myEllipses = myEllipses;
    });
    
};
