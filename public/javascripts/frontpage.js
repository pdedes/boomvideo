
$( document ).ready(function () {
  var roomNumberToShare;
  var dmp = new diff_match_patch();
  
  // if branch for guests visiting a shared link
  if(location.pathname.indexOf('/boomroom/') !== -1) {
      var guestRoomNumber = location.pathname.match(/\d+/)[0];
      socket.emit('join room', { room: guestRoomNumber });
      iceBootUp(guestRoomNumber);
      $(' #editor ').attr('style', 'visibility: visible;');
  }

  // logic used to create and launch a room
  $( 'form' ).submit(function(event) {
    event.preventDefault();
    var roomName = location.pathname.replace('/', '');
    
    var form = $(this);
    var formDetails = $(this).serializeObject();
    var that = $(this);

    var phoneNumbers = _.pluck(formDetails, 'phone');
    var emailAddresses = _.pluck(formDetails, 'email');

    // Get a unique counter value from the backend to name the room
    ajaxCounterGet(that, form, phoneNumbers, emailAddresses);

    $(' #editor ').attr('style', 'visibility: visible;');

  });

  editor.getSession().on('change', function(e) {
    if (e.type) {
      console.log("editor change error: ", e.type);
    } else {
      // var oldText = "Hi my full name be Originally Pedro.";
      // var newText = "Hi my real full name is Actually Peter.";

      var updatedText = editor.getValue();

      socket.emit('text backend', {
        updatedText: updatedText
      });
    }

  });

  socket.on('text update', function(data) {
    console.log('broadcast received in: ', data);
    var oldText = editor.getValue();
    var newText = data.updatedText;

    console.log("client old Text: ", oldText);
    console.log("client new Text: ", newText);

    var updates = performDiffPatch(oldText, newText);
    console.log("client patched text: ", newText);

    // editor.setValue(updates);
  });

});

$( window ).resize(function () {
  editor.resize();
});


//////////////////////////////////////
//---  Text Editor Collaboration ---//
//////////////////////////////////////


function performDiffPatch(text1, text2) {
  var dmp = new diff_match_patch();

  var diffsCreated = dmp.diff_main(text1, text2);           /*  —> creates diffs  */
  var patchesMade = dmp.patch_make(text1, diffsCreated);    /*  —> patches        */
  var patchesApplied = dmp.patch_apply(patchesMade, text1); /*  —> [Array]        */

  console.log("Diffs:   ", diffsCreated);
  console.log("Patches: ", patchesMade);
  console.log("Applied: ", patchesApplied);

  console.log("Text1:   ", text1);
  console.log("Text2:   ", text2);

  editor.setValue(patchesApplied[0]);
}


//////////////////////////////
//---  IceComm FUNCTIONS ---//
//////////////////////////////


var iceConnect = function(roomName) {
    comm.connect(roomName, {audio: false}, function(err) {
        // console.log("CB Args:", arguments);
        // console.log("Room Connect CB ", err);
    });
};

//Instantiate a comm object from Icecomm
function getIcecommInstance(){
  // var comm = null;

  // if(!comm){
  var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});
  // }
  return comm;
}

//Add a callback to the connection.
function setCallingInstance(callback){
    getIcecommInstance().on('data', callback);
}

//How many peers are in the room?
var roomSize = function () {
  var size = comm.getRoomSize();
  console.log("room size: ", size);
};

//NEW ICECOMM INSTANCE
function iceBootUp (roomName) {

    var comm = getIcecommInstance();

    comm.connect(roomName, {audio: false});

    comm.on('connected', function(peer) {
      $("#video-section").append(peer.getVideo());
    });

    comm.on('local', function(peer) {
      $("#localVideoHost").replaceWith(peer.getVideo());
    });

    comm.on('disconnect', function(peer) {
      document.getElementById(peer.ID).remove();
      socket.emit('video disconnect', { peerId: peer.ID });
    });

    // comm.on('local', function(peer) {
    //   // var node = document.createElement("VIDEO");               // Create a <video> node
    //   // console.log("Peer Video: ", peer.getVideo());

    //   // // var textnode = document.createVideoNode("Water");         // Create a text node
    //   // node.appendChild(peer.getVideo()); 
    //   // document.getElementById("video-section").appendChild(node);

    //   $("#video-section").append(peer.stream);
    //   console.log("local video added!");
    //   // document.getElementById('video-box').appendChild(peer.getVideo());
    //   // console.log("Local Video: ", localVideo);
    // });

    // comm.on('connected', function(peer) {
    //   // console.log(arguments);
    //   console.log("Peer Obj: ", peer);
    //   // document.getElementById("localVideoHost").appendChild(peer.getVideo());
    //   $("#video-section").append(peer.stream);
    //   console.log("connected video added!");
    // });

    // comm.on('disconnect', function(peer) {
    //   document.getElementById(peer.ID).remove();
    //   // var header = document.createElement("p");
    //   // document.body.appendChild(header).html("A user has disconnected");
    // });

    // // comm.on('global_connect', function(peer) {
    //   console.log('Global connect', peer.data);
    // });

    // comm.on('error', function(err) {
    //   console.log("IC Error: ", err);
    // });

    // console.log("comm object: ", comm);
}


///////////////////////
//---  AJAX CALLS ---//
///////////////////////


function ajaxCounterGet(that, form, phoneNumbers, emailAddresses) {
  $.ajax({
      type: 'GET',
      url: '/counter/',
      success: function (response) {
        roomName = response;
        roomNumberToShare = response;
        iceBootUp(roomNumberToShare);
        // socket.emit('create room', { room: roomName });

        // console.log("GET phoneNumbers", phoneNumbers);
        // console.log("GET emailAddresses", emailAddresses);
        console.log('roomName is equal to...', roomName);

        var urlPath = location.href.toString();

        // Perform POST requests to Twilio and Mandrill APIs
        var phoneObj = {
          phones: phoneNumbers,
          room: roomName,
          location: urlPath
        };

        var emailObj = {
          email: emailAddresses,
          room: roomName,
          location: urlPath
        };

        ajaxSmsPost(phoneObj);
        ajaxEmailPost(emailObj);

        // remove form elements from the page to begin the chat
        that.remove();
        form.remove();
      }
  });
}

// NOTICE: we must set contentType, dataType, and send as JSON string to properly retrive on the backend.
// If you do not follow these steps the arrays will be filled with undefined entries

function ajaxSmsPost(phoneObj) {
  $.ajax({
      type: 'POST',
      url: '/sms/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(phoneObj),
      success: function (response) {
        console.log('sms invites sent');
      }
  });
}

function ajaxEmailPost(emailObj) {
  $.ajax({
      type: 'POST',
      url: '/email/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(emailObj),
      success: function (response) {
        console.log('email invites hit');
      }
  });
}












