//var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});

$( document ).ready(function () {
  var roomNumberToShare;
  
  // if branch for guests visiting a shared link
  if(location.pathname.indexOf('/boomroom/') !== -1) {
      var guestRoomNumber = location.pathname.match(/\d+/)[0];
      socket.emit('join room', { room: guestRoomNumber });
      iceBootUp(guestRoomNumber);
  }

  // logic used to create and launch a room
  $( 'form' ).submit(function(event) {
    event.preventDefault();
    var roomName = location.pathname.replace('/', '');

    var form = $(this);
    var formDetails = $(this).serializeObject();
    var that = $(this);

    // var phoneNumbers = [];
    // var emailAddresses = [];

    var phoneNumbers = _.pluck(formDetails, 'phone');
    var emailAddresses = _.pluck(formDetails, 'email');

    console.log("form numbers: ", phoneNumbers);
    console.log("form emails:  ", emailAddresses);

    console.log('this is the form: ', form);
    console.log('this is the serialized form: ', formDetails);

    // Get a unique counter value from the backend to name the room
    ajaxCounterGet(that, form);

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
      socket.emit('disconnect', { peerId: peer.ID });
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


///////////////////////
//---  AJAX CALLS ---//
///////////////////////

function ajaxCounterGet(that, form) {
  $.ajax({
      type: 'GET',
      url: '/counter/',
      success: function (response) {
        roomName = response;
        roomNumberToShare = response;
        iceBootUp(roomNumberToShare);
        // socket.emit('create room', { room: roomName });

        console.log('roomName is equal to...', roomName);
        // ajaxSmsCall(phonNumbers);

        that.remove();
        form.remove();
      }
  });
}

function ajaxSmsCall(data) {
  $.ajax({
      type: 'POST',
      url: '/sms/',
      data: data,
      success: function (response) {
        console.log('sms share hit: ', response);
        that.remove();
      }
  });
};


