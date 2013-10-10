var RTL = function() {

	this.myList = null;
	this.startCallback = null;
	var $that = this;

	function initializeModel(model) {
		$that.myList = model.createList();
		model.getRoot().set('puzzle', $that.myList);
		console.log($that.myList);
	}
	function onFileLoaded(doc) {
		var puzzleList = doc.getModel().getRoot().get('puzzle');
		console.log(puzzleList);
		if($that.startCallback) {
			$that.startCallback(puzzleList);
		}
	}
	/**
	* Options for the Realtime loader.
	*/
	var realtimeOptions = {
		/**
		* Client ID from the APIs Console.
		*/
		clientId: '957766365169.apps.googleusercontent.com',

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
			var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
			realtimeLoader.start();
		}
	};
};