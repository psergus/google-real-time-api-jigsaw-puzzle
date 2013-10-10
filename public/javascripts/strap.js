$(function() {
	var rtl = new RTL();
	rtl.startRealtime( function(puzzleList) {
		var puzzlesNum = 12;
		var rows = 3;
		var cols = 4;
		var solve = function() {
			for(var i = 1; i < puzzlesNum; i++) {
				//console.log(i + ' insert after ' + (i-1));
				$('#pic_' + i).insertAfter($('#pic_' + (i-1)));
			}
			$('#sortable').sortable('refresh');
			//console.log( $( "#sortable" ).sortable( "toArray" ) );
		}
		var shuffle = function(b) { //Fisher-Yates implementation
			var shuffled = [];
			var rand;
			for(var i = 0; i < b.length; i++) {
				rand = Math.floor(Math.random()*i);
				shuffled[i] = shuffled[rand];
				shuffled[rand] = b[i];
				switchSquares(i, rand);
			}
			$('#sortable').sortable('refresh');
			//console.log( $( "#sortable" ).sortable( "toArray" ) );
		}
		var switchSquares = function(indx1, indx2) {
			if(indx1 != indx2) {
				$('#sortable li:eq(' + indx1 + ')').insertAfter($('#sortable li:eq(' + indx2 + ')'));
			}
			//don't forget to refresh the placeholder after all switches!!!
		}
		var initPlaceHolder = function() {
			for(var i = 0; i < puzzlesNum; i++) {
				var li_id = 'pic_' + i;
				var canv_id = 'canv_' + i;
				$('#sortable').append('<li class="ui-state-default" id="' + li_id + '"><canvas id="' + canv_id + '" width="104" height="94"></canvas></li>');
				puzzleList.push({
					id: li_id
				});
			}
			console.log(puzzleList);
		}

		var srcImage = new Image();
		var images = [];
		srcImage.onload = function() {
			console.log(this.width + ' x ' + this.height );
			var stepx = this.width / cols;
			var stepy = this.height / rows;
			//twist css -- hehe
			$('#sortable').css({
				width: this.width + 50, //extra space
				height: this.height + 50
			});
			$('#sortable li').css({
				width: stepx + 'px',
				height: stepy + 'px'
			});
			$('#sortable li canvas').css({
				width: stepx + 'px',
				height: stepy + 'px'
			});

			var img_index = 0;
			for(j = 0, y = 0; j < rows; j += 1, y += stepy) {
				for(var i = 0, x = 0; i < cols; i += 1, x += stepx) {
					images.push({
						x: x,
						y: y,
						w: stepx,
						h: stepy
					});
				}
			}
			//console.log(images);
			drawImages();
		}
		var drawImages = function() {
			$.each(images, function(index, img) {
				//console.log('draw: ' + index + ' : ' + img);
				var canv_id = 'canv_' + index;
				var canv = document.getElementById(canv_id);
				var ctx = canv.getContext('2d');
				ctx.drawImage(srcImage, img.x, img.y, img.w, img.h, 0, 0, img.w, img.h);
				//console.log('draw from src image x: ' + img.x + ' y: ' + img.y + ' width: ' + img.w + ' height: ' + img.h);
			});
		}

		//init sortable placeholder
		$( "#sortable" ).sortable({
			opacity: 0.6,
			cursor: 'move',
			update: function(event, ui) {
				var sortedIDs = $( "#sortable" ).sortable( "toArray" );
				console.log(ui);
				console.log( sortedIDs );
			}
		});
		$( "#sortable" ).disableSelection();

		initPlaceHolder();
		$('#sortable').sortable('refresh');
		srcImage.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';

		//buttons
		$('#shuffle').on('click', function(e) {
			shuffle( $( "#sortable" ).sortable( "toArray" ) );
		});
		$('#solve').on('click', function(e) {
			solve();
		});
	});

})
