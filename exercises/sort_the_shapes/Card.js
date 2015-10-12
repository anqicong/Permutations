/** 
 * @file test
 * @author Anqi Cong, Luyao Hou, Emma Zhong
 */

var main = function(ex) {
	var color = [30,144,255];
	var up_margin = 40;
	var margin = 20;
	var side_margin = 10;
	var total_width = ex.width()/2 - margin*2;
	var total_height = ex.height - margin*2;
	function Card(level,level_count){
		var card = {};
		card.rvalue = undefined;
		card.last_return = undefined;
		card.level = level;
		card.x = margin + (card.level-1)*side_margin;
		card.y = margin + (card.level-1)*up_margin;
		card.width = total_width - (card.level-1)*side_margin*2;
		card.height = total_height - (card.level-1)*(top_margin + margin);
		card.r = (color[0]*card.level/level_count).toString(16);
		card.g = (color[1]*card.level/level_count).toString(16);
		card.b = (color[2]*card.level/level_count).toString(16);

		card.pop_up = function(){};

		card.vanish = function(){};

		card.draw = function(){
			ex.graphics.ctx.fillStyle = "#"+card.r+card.g+card.b;
            ex.graphics.ctx.fillRect(card.x,card.y,card.width,card.height);
		};

		return card;
	}

	function Cards(all_cards){
		var cards = {};
		cards.count = all_cards.length;
		cards.card_list = all_cards;

		cards.degrade = function(){
			var gone_card = cards.card_list.splice(cards.count - 1,1);
			gone_card.vanish();
			cards.count -= 1;
			cards.card_list[cards.count-1].last_return = gone_card.rvalue;
		}

		cards.draw = function(){
			for (i = 0;i < cards.count;i++){
                var current = card_list[i];
                current.draw();
			}
		}

		return cards;
	}
    
    ex.data.cards = Cards([Card(1,3),Card(2,3),Card(3,3)]);
    ex.data.cards.draw();



}