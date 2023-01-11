<p align='center'>
	<img src="./img/logo.png" width=300 />
</p>


CloudResponder
---

Repo for CommandDING contest 2022.

CloudResponder is an open source data-driven incident response and visualization platform for first-responders.

### How to run

This app uses <a href="firebase.com">firebase</a> for authentication. Add the following variables to your environment before starting the project (ex: by adding an `.env.local` file)

<pre>
REACT_APP_FB_KEY={YOUR_FIREBASE_KEY}
REACT_APP_FB_DOMAIN={YOUR_FIREBASE_DOMAIN}
REACT_APP_FB_PROJECT_ID={YOUR_FIREBASE_PROJECT_ID}
REACT_APP_FB_BUCKET={YOUR_FIREBASE_BUCKET_ID}
REACT_APP_FB_SENDER={YOUR_FIREBASE_SENDER_ID}
REACT_APP_FB_APP={YOUR_FIREBASE_APP_ID}
REACT_APP_VIDEO_API_URL={VIDEO_FEED_URL} # (optional) defaults to http://qil2.uh.edu
REACT_APP_NIST_API_PASSWORD={NIST_API_PASSWORD} # API password for 'CloudResponder' user
</pre>

`yarn && yarn dev`

Use `yarn start`: for openssl legacy provider.

<!--
CloudResponder is currently configured to work with a <a href="firebase.com">firebase</a> application.

-->


### Point cloud examples:

* Plyloader: https://sbcode.net/threejs/loaders-ply/
* Camera control: https://medium.com/geekculture/how-to-control-three-js-camera-like-a-pro-a8575a717a2
* Video API: http://qil2.uh.edu/docs/


Not used:
* https://github.com/pnext/three-loader

### Deployment
(requires surge account)
Deploys to cloudresponder.surge.sh
`yarn deploy`


### Useful links:
* Contest Resource folder: https://app.box.com/s/izdgds6vuqt4jqsh7za4ili2byfoj6uz
* Contest Entry page: https://www.freelancer.com/contest/commanding-tech-challenge-phase-2100691
* Requirements Matrix: https://app.box.com/s/izdgds6vuqt4jqsh7za4ili2byfoj6uz/file/966675015929
* Example ply files: https://people.sc.fsu.edu/~jburkardt/data/ply/ply.html

# Phase 2 documents
https://app.box.com/s/rxsrp8pvgl53urkp3zkovs0v5aennq27/file/997497847483

### Dev notes:
* https://www.freecodecamp.org/news/github-user-authentication-using-firebase-and-reactjs-with-hooks/


### NIST API
http://qil2.uh.edu/docs/