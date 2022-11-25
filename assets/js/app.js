// Set constraints for the video stream
let constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraOutputWrapper = document.querySelector("#camera--output-wrapper"),
  cameraSensor = document.querySelector("#camera--sensor"),
  context = cameraSensor.getContext("2d"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  frame = document.querySelector("#overlay--frame-img"),
  saveButton = document.querySelector("#save"),
  frameSelectors = document.querySelectorAll(".frame--selector"),
  textInput = document.querySelector("#overlay--text-input"),
  text = document.querySelector("#overlay--text-content"),
  editImage = document.querySelector("#edit-image"),

  editedCanvasWrapper = document.querySelector("#edited--canvas--wrapper"),


  // Get the canvas for the edited image
  editedCanvas = editedCanvasWrapper.querySelector("#editedCanvas"),
  // Get the 2D context of the image
  editedContext = editedCanvas.getContext("2d"),

  hiddens = document.querySelectorAll(".hidden"),

  // Get the sliders
  brightnessSlider = document.querySelector("#brightnessSlider"),
  contrastSlider = document.querySelector("#contrastSlider"),
  grayscaleSlider = document.querySelector("#grayscaleSlider"),
  hueRotateSlider = document.querySelector("#hueRotateSlider"),
  saturateSlider = document.querySelector("#saturationSlider"),
  sepiaSlider = document.querySelector("#sepiaSlider")
  ;

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
frameSelectors.forEach((selector) => {
  selector.onclick = function () {
    frame.style.display = "block";
    let src = selector.dataset.img;
    frame.src = "/assets/img/" + src;
  };
});

// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;

      // Remove all hidden items on page load so they dont obstruct loading screen
      hiddens.forEach((hidden) => {
        hidden.classList.remove("hidden");
      });
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function () {
  let width = cameraView.videoWidth;
  let height = cameraView.videoHeight;
  cameraSensor.width = width;
  cameraSensor.height = height;

  context.drawImage(cameraView, 0, 0);
  context.drawImage(frame, 0, 0, width, height);

  // Add text, I dont want comic sans but i cant figure out how to retain the text from the dom
  context.font = "26px Comic Sans MS";
  context.fillStyle = "red";
  context.textAlign = "center";
  context.fillText(text.innerHTML, width / 2, height * 0.4);

  // Add src to img using the camerasensor data
  let img = cameraSensor.toDataURL("image/png");
  cameraOutput.src = img;
  cameraOutputWrapper.classList.add("taken");
  cameraOutputWrapper.style.width = width;
  cameraOutputWrapper.style.height = height;

  editedCanvas.width = width;
  editedCanvas.height = height;

  cameraOutputWrapper.style.display = "block";
};

textInput.onchange = function () {
  if (textInput.value) {
    text.innerHTML = "Merry Christmas from " + textInput.value;
  }
};

// Reset all the slider values to their default values
function resetImage() {
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  grayscaleSlider.value = 0;
  hueRotateSlider.value = 0;
  saturateSlider.value = 100;
  sepiaSlider.value = 0;
  applyFilter();
}

function saveImage() {
  // Select the temporary element we have created for
  // helping to save the image
  saveButton.setAttribute("download", "christmas.png");

  // Convert the canvas data to a image data URL
  let canvasData = editedCanvas.toDataURL("image/png");

  // Replace it with a stream so that
  // it starts downloading
  canvasData.replace("image/png", "image/octet-stream");

  // Set the location href to the canvas data
  saveButton.setAttribute("href", canvasData);
}

// This function is used to update the image
// along with all the filter values
function applyFilter() {
  // Create a string that will contain all the filters
  // to be used for the image
  let filterString =
    "brightness(" +
    brightnessSlider.value +
    "%" +
    ") contrast(" +
    contrastSlider.value +
    "%" +
    ") grayscale(" +
    grayscaleSlider.value +
    "%" +
    ") saturate(" +
    saturateSlider.value +
    "%" +
    ") sepia(" +
    sepiaSlider.value +
    "%" +
    ") hue-rotate(" +
    hueRotateSlider.value +
    "deg" +
    ")";

  // Apply the filter to the image
  editedContext.filter = filterString;

  // Draw the edited image to canvas
  editedContext.drawImage(cameraOutput, 0, 0);
}

// Each of these will first reset the image
// and then apply a certain parameter before
// redrawing the image
function brightenFilter() {
  resetImage();
  brightnessSlider.value = 130;
  contrastSlider.value = 120;
  saturateSlider.value = 120;
  applyFilter();
}

function bwFilter() {
  resetImage();
  grayscaleSlider.value = 100;
  brightnessSlider.value = 120;
  contrastSlider.value = 120;
  applyFilter();
}

function funkyFilter() {
  resetImage();

  // Set a random hue rotation everytime
  hueRotateSlider.value = Math.floor(Math.random() * 360) + 1;
  contrastSlider.value = 120;
  applyFilter();
}

function vintageFilter() {
  resetImage();
  brightnessSlider.value = 120;
  saturateSlider.value = 120;
  sepiaSlider.value = 150;
  applyFilter();
}
