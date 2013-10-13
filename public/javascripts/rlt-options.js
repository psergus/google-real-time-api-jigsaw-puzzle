var RTL = function(puzzlesNum) {

	this.appId = '957766365169-2cjtv3f4gkej9duils2mm5rjftpvrsch.apps.googleusercontent.com';
	this.puzzlesNum = puzzlesNum;
	this.myList = null;
	this.startCallback = null;
	this.realtimeLoader = null;
	var $that = this;

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

	var initializeModel = function(model) {
		$that.myList = model.createList();
		model.getRoot().set('puzzle', $that.myList);
		var init_array = [];
		for(var i = 0; i < $that.puzzlesNum; i++) {
			init_array.push(i);
		}
		//console.log('initialized array');
		var shuffled = shuffleArray(init_array);
		//console.log('shuffled array');
		for(var i = 0; i < $that.puzzlesNum; i++) {
			$that.myList.push( shuffled[i] );
		}
		//console.log('pushed array to a model');
		//console.log($that.myList);
	}
	var onFileLoaded = function(doc) {
		var puzzleList = doc.getModel().getRoot().get('puzzle');
		if($that.startCallback) {
			$that.startCallback(
			    puzzleList, 
			    doc, 
			    {
				appId: $that.appId,
				fileIds: rtclient.getParams().fileIds,
				userId: rtclient.getParams().userId
			    }
			);
		}
	}
	/**
	* Options for the Realtime loader.
	*/
	var realtimeOptions = {
		/**
		* Client ID from the APIs Console.
		*/
		clientId: $that.appId, // '957766365169.apps.googleusercontent.com',

		/**
		* The ID of the button to click to authorize. Must be a DOM element ID.
		*/
		authButtonElementId: 'authorizeButton',

		/**
		* Function to be called when a Realtime model is first created.
		*/
		initializeModel: initializeModel,

		/**
		* Autocreate files right after auth automatically.
		*/
		autoCreate: true,

		/**
		* The name of newly created Drive files.
		*/
		defaultTitle: "New Realtime Puzzle",

		/**
		* The MIME type of newly created Drive Files. By default the application
		* specific MIME type will be used:
		*     application/vnd.google-apps.drive-sdk.
		*/
		newFileMimeType: null, // Using default.

		/**
		* Function to be called every time a Realtime file is loaded.
		*/
		onFileLoaded: onFileLoaded,

		/**
		* Function to be called to inityalize custom Collaborative Objects types.
		*/
		registerTypes: null, // No action.

		/**
		* Function to be called after authorization and before loading files.
		*/
		afterAuth: null // No action.
	}

	/**
	* Start the Realtime loader with the options.
	*/

	return {
		getList: function() {
			return $that.myList;
		},
		startRealtime: function(callback) {
			$that.startCallback = callback || null;
			$that.realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
			$that.realtimeLoader.start();
		}
	};
};