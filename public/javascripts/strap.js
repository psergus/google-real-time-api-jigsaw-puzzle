'use strict';
$(function() {
	var puzzlesNum = 36;
	var rows = 6;
	var cols = 6;
	var rtl = new RTL(puzzlesNum);
	rtl.startRealtime( function(puzzleList, realtimeDocument, params) {
		var collaborators = [];

		var isNumber = function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		

		/*
		var solve = function() {
			for(var i = 1; i < puzzlesNum; i++) {
				//console.log(i + ' insert after ' + (i-1));
				$('#pic_' + i).insertAfter($('#pic_' + (i-1)));
			}
			$('#sortable').sortable('refresh');
			//console.log( $( "#sortable" ).sortable( "toArray" ) );
		}
		*/
		var shuffleArray = function(b) {
			var shuffled = [];
			var rand;
			for(var i = 0; i < b.length; i++) {
				rand = Math.floor(Math.random()*i);
				shuffled[i] = shuffled[rand];
				shuffled[rand] = b[i];
			}
			return shuffled;
		}
		/*
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
		*/

		var collaboratorListener = function () {
			collaborators = realtimeDocument.getCollaborators();
			updateCollaboratorsList(collaborators);
		}
		var updateCollaboratorsList = function(collaborators) {
			$('#collaborators').empty();
			$.each(collaborators, function(index, obj) {
				console.log(obj);
				if(!obj.isMe) {
					$('#collaborators').append('<li class="collaborator"><img src="' + obj.photoUrl + '" border="0" title="' + obj.displayName + '" + data-user-id="' + obj.userId + '" /></li>');
				}
			});
		}

		var putOneAfterAnother = function(id1, id2) {
			if(id1 != id2) {
				$('#pic_' + id1).insertAfter($('#pic_' + id2));
			}
			//don't forget to refresh the placeholder after all switches!!!
		}
		var UpdateOnChange = function(event) {
			console.log( puzzleList.asArray() );
			console.log("Item added", event.values);
			for(var i = 0; i < event.values.length; i++) {
				//console.log('through: ' + event.values[i]);
				if(event.values[i] !== undefined) {
					var indxOfPrev = puzzleList.indexOf(event.values[i]) - 1;
					console.log('indxOfPrev: ' + indxOfPrev);
					var curr_val = event.values[i];
					var prev_val = 0;
					if(indxOfPrev !== -1) {
						prev_val = puzzleList.get( indxOfPrev );
					}
					else {
						//switch
						prev_val = curr_val;
						prev_val = puzzleList.get( puzzleList.indexOf(event.values[i]) + 1);
					}
					putOneAfterAnother( curr_val, prev_val);
					console.log( 'Put pic_' + curr_val + ' after pic_' + prev_val);
				}
			}
			$('#sortable').sortable('refresh');
		}
		var UpdateOnAllValues = function(event) {
			console.log( puzzleList.asArray() );
			refreshFromDocument(puzzleList.asArray());
		}

		var refreshFromDocument = function(a) {
			for(var i = 1; i < a.length; i++) {
				if(isNumber(a[i])) {
					//console.log(a[i] + ' insert after ' + a[i-1]);
					$('#pic_' + a[i]).insertAfter($('#pic_' + a[i-1]));
				}
			}
			$('#sortable').sortable('refresh');
			//console.log(a);
			//console.log( $( "#sortable" ).sortable( "toArray" ) );
		}
		var initPlaceHolder = function() {
			var a = [];
			for(var i = 0; i < puzzlesNum; i++) {
				a.push(i);
				var li_id = 'pic_' + i;
				var canv_id = 'canv_' + i;
				$('#sortable').append('<li class="ui-state-default" id="' + li_id + '"><canvas id="' + canv_id + '"></canvas></li>');
			}
			//console.log(puzzleList);
			return a;
		}
		var share = function() {
			//var client = new gapi.drive.share.ShareClient(params.appId);
			console.log('fileId: ' + params.fileIds);
			var client = new gapi.drive.share.ShareClient(957766365169);
			client.setItemIds([params.fileIds]);
			client.showSettingsDialog();
		}

		var srcImage = new Image();
		var images = [];
		srcImage.onload = function() {
			//console.log(this.width + ' x ' + this.height );
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
			}).attr({
				width: stepx,
				height: stepy
			});

			var img_index = 0;
			for(var j = 0, y = 0; j < rows; j += 1, y += stepy) {
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
			//init our list from the model
			refreshFromDocument(puzzleList.asArray());
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
			cursor: 'move',
			delay: 150,
			distance: 5,
			forcePlaceholderSize: true,
			grid: [ cols, rows ],
			update: function(event, ui) {
				var sortedIDs = $( "#sortable" ).sortable( "toArray" );
				//console.log(ui);
				//console.log( sortedIDs );
				//determine which cell has moved
				var cell_indx = ui.item[0].id.toString().substr(4);
				var cell_position = sortedIDs.indexOf( ui.item[0].id.toString() );
				console.log('We moved cell: ' + cell_indx + ' to cell ' + cell_position);

				realtimeDocument.getModel().beginCompoundOperation();
				puzzleList.removeValue( parseInt(cell_indx) );
				puzzleList.insert( cell_position, parseInt(cell_indx) );
				realtimeDocument.getModel().endCompoundOperation();
			}
		});
		//$( "#sortable" ).disableSelection();

		var original_line = initPlaceHolder();
		$('#sortable').sortable('refresh');
		srcImage.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
		//document model events handlers
		puzzleList.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, UpdateOnChange);
		puzzleList.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, UpdateOnAllValues);
		//collaboratrs events handlers
		realtimeDocument.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorListener);
		realtimeDocument.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorListener);
		//get collaborators and update
		collaborators = realtimeDocument.getCollaborators();
		updateCollaboratorsList(collaborators);

		//just a polite behavior for google :)
		$( window ).on('unload', function() {
			realtimeDocument.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorListener);
			realtimeDocument.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorListener);
		});

		//buttons
		$('#share').on('click', function(e) {
			share();
			return false;
		});
		$('#shuffle').on('click', function(e) {
			//shuffle( $( "#sortable" ).sortable( "toArray" ) );
			var shuffled = shuffleArray(original_line);
			realtimeDocument.getModel().beginCompoundOperation();
			puzzleList.replaceRange(0, shuffled);
			realtimeDocument.getModel().endCompoundOperation();
			refreshFromDocument(puzzleList.asArray());
		});
		$('#solve').on('click', function(e) {
			var init_array = [];
			for(var i = 0; i < puzzlesNum; i++) {
				init_array.push(i);
			}

			realtimeDocument.getModel().beginCompoundOperation();
			puzzleList.replaceRange(0, init_array);
			realtimeDocument.getModel().endCompoundOperation();
			refreshFromDocument(puzzleList.asArray());
		});
	});

})
