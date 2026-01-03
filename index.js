import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from "@snap/camera-kit";

async function init() {
  const apiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY2NTQ2NTcwLCJzdWIiOiI5ZjMzNjgyMC1mZmU1LTRiOWUtYWU3Zi02NWEwMGQ3ZDRkZGF-UFJPRFVDVElPTn44NWVhMDc1Zi0yNzU0LTRhZDMtYTkxOS04NDM1ZTZmZjZlMmMifQ.GsN5muzCjhgw9L2IBV__jYK7XTA4AAG1cJjFmGpoITE";
  const cameraKit = await bootstrapCameraKit({ apiToken });

  const canvas = document.getElementById("my-canvas");
  const session = await cameraKit.createSession({ liveRenderTarget: canvas });

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const source = createMediaStreamSource(stream, {
    transform: Transform2D.MirrorX,
    cameraType: 'user'
  });
  await session.setSource(source);

  const lens = await cameraKit.lensRepository.loadLens(
    "904d21c1-8594-46c8-9213-75e96917fd88",
    "80fbb4a2-5c57-4bc6-8821-8494bf5a8e69"
  );
  await session.applyLens(lens);

  await session.play();
  console.log("Lens rendering has started!");
}

init();
