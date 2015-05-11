var comm = new Icecomm('UQnIHb5NSBcbmpYjxOOUWgK66Z9OVohKadkBZy5n8ALDLcBGKi');

comm.connect('custom room name', {audio: false});

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

module.exports = {

};