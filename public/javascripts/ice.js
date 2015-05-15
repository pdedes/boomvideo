var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});



var roomSize = function () {
  var size = comm.getRoomSize();
  console.log("room size: ", size);
}

$(document).ready(function () {
  var roomNumberToShare;
  
  // if branch for guests visiting a shared link
  if(location.pathname.indexOf('/boomroom/') !== -1) {
      var guestRoomNumber = location.pathname.match(/\d+/)[0];
      iceConnect(guestRoomNumber);
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
          iceConnect(roomNumberToShare);

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

  comm.on('local', function(peer) {
    localVideo.src = peer.stream;
    // document.getElementById('video-box').appendChild(peer.getVideo());
    console.log("Local Video: ", localVideo);
  });

  comm.on('connected', function(peer) {
    console.log(arguments);
    console.log("Peer Obj: ", peer);
    document.body.appendChild(peer.getVideo());
  });

  comm.on('disconnect', function(peer) {
    document.getElementById(peer.ID).remove();
    // var header = document.createElement("p");
    // document.body.appendChild(header).html("A user has disconnected");
  });

  comm.on('global_connect', function(peer) {
    console.log('Global connect', peer.data);
  });

  comm.on('error', function(err) {
    console.log("IC Error: ", err);
  });

  console.log("comm object: ", comm);

});


//---  FUNCTIONS ---//

var iceConnect = function(roomName) {
    comm.connect(roomName, {audio: false}, function(err) {
        // console.log("CB Args:", arguments);
        // console.log("Room Connect CB ", err);
    });
}

//Instantiate a comm object from Icecomm
function getIcecommInstance(){
  if(!comm){
    comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});
  }
  return comm;
};

//Add a callback to the connection.
function setCallingInstance(callback){
    getIcecommInstance().on('data', callback);
};

//NEW ICECOMM INSTANCE
function iceWrapper (roomName) {

    var comm = getIcecommInstance();

    comm.connect(roomName, {audio: false});

    comm.on('local', function(peer) {
      localVideo.src = peer.stream;
      // document.getElementById('video-box').appendChild(peer.getVideo());
      console.log("Local Video: ", localVideo);
    });

    comm.on('connected', function(peer) {
      console.log(arguments);
      console.log("Peer Obj: ", peer);
      document.body.appendChild(peer.getVideo());
    });

    comm.on('disconnect', function(peer) {
      document.getElementById(peer.ID).remove();
      // var header = document.createElement("p");
      // document.body.appendChild(header).html("A user has disconnected");
    });

    // comm.on('global_connect', function(peer) {
    //   console.log('Global connect', peer.data);
    // });

    // comm.on('error', function(err) {
    //   console.log("IC Error: ", err);
    // });

    // console.log("comm object: ", comm);
}




