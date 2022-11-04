// Set constraints for the video stream
let constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraOutputWrapper = document.querySelector("#camera--output-wrapper"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  frame = document.querySelector("#overlay--frame-img"),
  saveButton = document.querySelector("#camera--output-save");

// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  let context = cameraSensor.getContext("2d");
  context.drawImage(cameraView, 0, 0);
  context.drawImage(frame, 0, 0, cameraView.videoWidth, cameraView.videoHeight);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutputWrapper.classList.add("taken");
  cameraOutputWrapper.style.width = cameraView.videoWidth * 0.8;
  cameraOutputWrapper.style.height = cameraView.videoHeight * 0.8;
  saveButton.style.display = "block";
};
// Add image source to download output
saveButton.onclick = function () {
  saveButton.href = cameraOutput.src;
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
