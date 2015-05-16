function Room(id) {  
  this.id = id;
  this.owner = null;
  this.people = [];
};

Room.prototype.addPerson = function(personID) {  
    this.people.push(personID);
};

module.exports = Room;  