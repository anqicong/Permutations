/** 
 * @file test
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {
	function Box(level){
		var box = {};
		box.rvalue = undefined;
		box.last_return = undefined;
		box.level = level;

		box.pop_up = function(){};

		box.vanish = function(){};

		box.draw = function(){};

		return box;
	}

	function Boxes(all_boxes){
		var boxes = {};
		boxes.count = all_boxes.length;
		boxes.box_list = all_boxes;

		boxes.degrade = function(){
			var gone_box = boxes.splice(boxes.count - 1,1);
			gone_box.vanish();
			boxes.count -= 1;
			boxes.box_list[boxes.count-1].last_return = gone_box.rvalue;
		}

		boxes.draw = function(){
			for (i = 0;i < boxes.count;i++){
                var current = box_list[i];
                current.draw();
			}
		}

		return boxes;
	}
}