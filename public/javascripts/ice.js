var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi');

$(document).ready(function () {
  console.log('Doc Load has Finished.');
  console.log('Location: ', location);
  
  $( '.launch' ).on('click', function() {
    console.log('launch clicked');
    var roomName = location.pathname.replace('/', '');
    var that = $(this);

    $.ajax({
        type: 'GET',
        url: '/counter/',
        success: function (response) {
          console.log('counter retrieved: ', response);
          roomName = response;
          comm.connect(roomName, {audio: false});

          console.log('roomName is equal to...', roomName);
          that.remove();
        }
    });

  });

  $( '.share' ).on('click', function() {
    console.log('share clicked');
  });

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
});