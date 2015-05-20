# boomvideo

This is a hackathon project @ Fullstack Academy.

Everything about meetings stink. Fumbling for passcodes, multi-tasking participants, the materials haven't been shared early enough, expansion of scope, no one took notes. It's no surprise that we don't like them.

This project is an experiment with web-video streaming over webRTC built on IceComm.io. The idea is that face-to-face meetings should be launched quickly, and with absolutely minimum overhead.

1. A meeting host visits the site, and launches a meeting room
2. The meeting room name is set
3. The room is now open and ready for guests
4. The host shares a link to guests either via email or phone
5. The guest visits the link and joins the appropriate video channel with the host and other guests

The text editor utilizes a text differential and patching library to do the following:

1. Compare two texts, and create a differential file of their delta
2. Create a patch, which is essentially an instruction on how to update the old text and migrate it to the new version of the text
3. Apply the patch, executing the instructions in step two.

A socket connection opens a persistent connection between browsers, allowing real-time text updates to appear for all other guests in the meeting room.