var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi', {debug: true});

$(document).ready(function () {
  console.log('Page Load Finished.');
  console.log('Location: ', location);
  var roomNumberToShare;
  
  // if branch for guests visiting a shared link
  if(location.pathname.indexOf('/boomroom/') !== -1) {
      var guestRoomNumber = location.pathname.match(/\d+/)[0];
      console.log("guest attempting to connect to room ", guestRoomNumber);
      comm.connect(guestRoomNumber.toString(), {audio: false});
  }

  // logic used to create and launch a room
  $( '.launch' ).on('click', function() {
    console.log('launch clicked');
    var roomName = location.pathname.replace('/', '');
    console.log('room name after launch', roomName);
    var that = $(this);

    // Get a unique counter value from the backend to name the room
    $.ajax({
        type: 'GET',
        url: '/counter/',
        success: function (response) {
          console.log('counter retrieved: ', response);
          roomName = response;
          roomNumberToShare = response;
          comm.connect(roomName, {audio: false});

          console.log('roomName is equal to...', roomName);
          that.remove();
        }
    });

  });

  // Create a shareable link with the room's number.
  $( '.share' ).on('click', function() {
    console.log('share clicked');
    console.log('site name', location);
    console.log('room path', location.origin + '/boomroom/' + roomNumberToShare);

  });

  comm.on('local', function(peer) {
    localVideo.src = peer.stream;
    console.log("Local Video: ", localVideo);
  });

  comm.on('connected', function(peer) {
    console.log("Peer Obj: ", peer);
    document.body.appendChild(peer.getVideo());
  });

  comm.on('disconnect', function(peer) {
    document.getElementById(peer.ID).remove();
    var header = document.createElement("p");
    document.body.appendChild(header).html("A user has disconnected");
  });

});




