(function(){
    const peer = new Peer();
    const localVideo = document.getElementById('vw-local-video');
    const remoteVideo = document.getElementById('vw-remote-video');
    const whiteboard = document.getElementById('vw-whiteboard');
    const ctx = whiteboard.getContext('2d');
    let localStream;
    let dataConn;
    let drawing = false;
    let lastPos = {x:0, y:0};

    peer.on('open', id => {
        const myIdElem = document.getElementById('vw-my-id');
        if (myIdElem) {
            myIdElem.textContent = id;
        }
    });

    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;

        peer.on('call', call => {
            call.answer(stream);
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        });
    });

    document.getElementById('vw-connect').addEventListener('click', () => {
        const remoteId = document.getElementById('vw-peer-id').value;
        if (!remoteId) return;
        dataConn = peer.connect(remoteId);
        dataConn.on('data', drawFromData);
        const call = peer.call(remoteId, localStream);
        call.on('stream', remoteStream => {
            remoteVideo.srcObject = remoteStream;
        });
    });

    peer.on('connection', conn => {
        dataConn = conn;
        dataConn.on('data', drawFromData);
    });

    function drawLine(x1, y1, x2, y2){
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawFromData(data){
        drawLine(data.x1, data.y1, data.x2, data.y2);
    }

    whiteboard.addEventListener('mousedown', e => {
        drawing = true;
        lastPos = {x: e.offsetX, y: e.offsetY};
    });

    whiteboard.addEventListener('mouseup', () => drawing = false);
    whiteboard.addEventListener('mouseleave', () => drawing = false);

    whiteboard.addEventListener('mousemove', e => {
        if (!drawing) return;
        const x = e.offsetX;
        const y = e.offsetY;
        drawLine(lastPos.x, lastPos.y, x, y);
        if (dataConn && dataConn.open) {
            dataConn.send({x1: lastPos.x, y1: lastPos.y, x2: x, y2: y});
        }
        lastPos = {x, y};
    });
})();
