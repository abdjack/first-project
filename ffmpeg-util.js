import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.3/dist/ffmpeg.min.js';

const ffmpeg = createFFmpeg({ log: true });

async function trimVideo() {
  await ffmpeg.load(); // Load ffmpeg.wasm

  const fileInput = document.getElementById('videoInput');
  const video = fileInput.files[0];

  const start = document.getElementById('start').value;
  const duration = document.getElementById('duration').value;

  // Load file into ffmpeg's memory
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));

  // Run FFmpeg command to trim video
  await ffmpeg.run('-ss', start, '-t', duration, '-i', 'input.mp4', 'output.mp4');

  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4');

  // Convert to Blob for download or preview
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const videoUrl = URL.createObjectURL(videoBlob);

  const preview = document.getElementById('videoPreview');
  preview.src = videoUrl;

  // Optional: Create download link
  const a = document.createElement('a');
  a.href = videoUrl;
  a.download = 'trimmed_video.mp4';
  a.innerText = 'Download Video';
  document.body.appendChild(a);
}