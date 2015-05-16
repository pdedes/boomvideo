//var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});

$( document ).ready(function () {
  var roomNumberToShare;
  
  // if branch for guests visiting a shared link
  if(location.pathname.indexOf('/boomroom/') !== -1) {
      var guestRoomNumber = location.pathname.match(/\d+/)[0];
      iceBootUp(guestRoomNumber);
  }

  // logic used to create and launch a room
  $( '.launch' ).on('click', function() {
    var roomName = location.pathname.replace('/', '');

    var that = $(this);
    var form = $(" #invite-form ");

    // Get a unique counter value from the backend to name the room
    $.ajax({
        type: 'GET',
        url: '/counter/',
        success: function (response) {
          roomName = response;
          roomNumberToShare = response;
          iceBootUp(roomNumberToShare);

          console.log('roomName is equal to...', roomName);
          that.remove();
          form.remove();
        }
    });

  });

  // Create a shareable link with the room's number.
  $( '.send-invite' ).click(function() {
    console.log('share clicked');
    // var phoneNum = $( '#inputPhone' );
    // console.log("Entered Phone", phoneNum);

    var that = $(this);

    $.ajax({
        type: 'POST',
        url: '/sms/',
        success: function (response) {
          console.log('sms share hit: ', response);
          that.remove();
        }
    });

  });

});


//////////////////////
//---  FUNCTIONS ---//
//////////////////////



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
};

//Add a callback to the connection.
function setCallingInstance(callback){
    getIcecommInstance().on('data', callback);
};

//How many peers are in the room?
var roomSize = function () {
  var size = comm.getRoomSize();
  console.log("room size: ", size);
}

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
};




