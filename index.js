import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from "@snap/camera-kit";

let cameraKit;
let session;
let currentSource;
let currentStream;
let currentCameraType = 'user';

async function init() {
  const apiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY2NTQ2NTcwLCJzdWIiOiI5ZjMzNjgyMC1mZmU1LTRiOWUtYWU3Zi02NWEwMGQ3ZDRkZGF-UFJPRFVDVElPTn44NWVhMDc1Zi0yNzU0LTRhZDMtYTkxOS04NDM1ZTZmZjZlMmMifQ.GsN5muzCjhgw9L2IBV__jYK7XTA4AAG1cJjFmGpoITE";
  cameraKit = await bootstrapCameraKit({ apiToken });

  const canvas = document.getElementById("my-canvas");
  session = await cameraKit.createSession({ liveRenderTarget: canvas });

  await setupCamera();

  const lens = await cameraKit.lensRepository.loadLens(
    "904d21c1-8594-46c8-9213-75e96917fd88",
    "80fbb4a2-5c57-4bc6-8821-8494bf5a8e69"
  );
  await session.applyLens(lens);

  await session.play();
  console.log("Lens rendering has started!");

  document.getElementById('switch-camera').addEventListener('click', switchCamera);
}

async function setupCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  currentStream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: currentCameraType } 
  });

  currentSource = createMediaStreamSource(currentStream, {
    transform: currentCameraType === 'user' ? Transform2D.MirrorX : Transform2D.None,
    cameraType: currentCameraType
  });

  await session.setSource(currentSource);
}

async function switchCamera() {
  currentCameraType = currentCameraType === 'user' ? 'environment' : 'user';
  console.log(`Switching to ${currentCameraType} camera...`);
  
  const btn = document.getElementById('switch-camera');
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.5';

  try {
    await setupCamera();
  } catch (error) {
    console.error("Failed to switch camera:", error);
    // Revert if failed
    currentCameraType = currentCameraType === 'user' ? 'environment' : 'user';
  } finally {
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = '1';
  }
}

init();
