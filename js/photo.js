(function(){
    var video = document.getElementById('video'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
     photo = document.getElementById('photo'),
    vendorUrl = window.URL || window.webKitURL;

    navigator.getMedia =    navigator.getUserMedia ||
                            navigator.webKitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

    navigator.getMedia({
        video:true,
        audio:false
    },  function(stream){
        video.srcObject = stream;
        video.play();
    },  function(error){
        //error occured
        //error.code
    });

    document.getElementById('capture').addEventListener('click',function(){
        context.drawImage(video,0,0,400,300);
        document.body.append("image about to upload");
        console.log("image abut to uploaded");
        photo.setAttribute('src',canvas.toDataURL('image/png'));
       document.body.append("image uploaded");
       console.log("image uploaded");
       
       const image = document.getElementById('photo')
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ]).then(start)

        async function start()
        {
            const container = document.createElement('div')
            container.style.position = 'relative'
            document.body.append(container)
            const labeledFaceDescriptors = await loadLabeledImages()
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4)
            console.log("image uploaded333");
            const canvas = faceapi.createCanvasFromMedia(image)
            container.append(canvas)
            const displaySize = { width: image.width, height: image.height }
            faceapi.matchDimensions(canvas, displaySize)
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

           results.forEach((result,i) => {
                const box = resizedDetections[i].detection.box 
                const drawBox = new faceapi.draw.DrawBox(box,{label: result.toString()})
                drawBox.draw(canvas)           
           });
           
            console.log("image uploaded 111");
            console.log(detections.length)
        }


        
function loadLabeledImages() {
    const labels = ['pranay']
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/pranaysaha077/java_script_face_recognition/master/train_images/${label}/${i}.png`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }
       
        console.log("image uploaded2222");
    });

})();