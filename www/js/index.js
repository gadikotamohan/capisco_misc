var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);

        try{
		    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		    window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024,  app.onInitFs, app.errorHandler);
        }
		catch(e){
          document.write("error: receivedEvent: "+e.message);
        }

    },
    errorHandler: function(e){
      var msg = '';
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = e.message;
          break;
      };
      console.log('Error: ' + msg);
	  alert("Error errorHandler: "+msg);
    },
   onInitFs: function(fs){
     self = this;
	 alert("Got the file system: "+fs.root.name);
	 try{
		 fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
		   fileEntry.createWriter(function(fileWriter) {
		     fileWriter.onwriteend = function(e) {
		       console.log('Write completed.');
		     };
		     fileWriter.onerror = function(e) {
		       console.log('Write failed: ' + e.toString());
		     };
		     var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
		     fileWriter.write(blob);
         var safe = cordova.plugins.disusered.safe;
         var path = cordova.file.dataDirectory;
         var file_name = "log.txt"

         key = 'someKey';
         function success(encryptedFile) {
           console.log('Encrypted file: ' + encryptedFile);
           safe.decrypt(encryptedFile, key, function(decryptedFile) {
             alert('Decrypted file: ' + decryptedFile);
           }, error);
         }
         function error() {
           alert('Error with cryptographic operation');
         }
         safe.encrypt(path+"/"+file_name, key, success, error);

		   }, app.errorHandler);
		 }, app.errorHandler);	
     }
	 catch(err){ document.write("Error onInitFs: "+err.message);}

   }
};
app.initialize();
