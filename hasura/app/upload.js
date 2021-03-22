const fs = require("fs");
const ipfsClient = require("ipfs-http-client");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const Clone = require("readable-stream-clone");

app.register(require("fastify-multipart"));

app.post("/upload", async function (req, res) {
  const ipfs = ipfsClient(process.env.IPFS_URL);
  const data = await req.file();

  const s1 = new Clone(data.file);
  const s2 = new Clone(data.file);
  const s3 = new Clone(data.file);
  const s4 = new Clone(data.file);

  const { cid } = await ipfs.add(s1);
  const name = cid.toString();

  const path = `/export/${name}`;
  const ext = data.filename.split(".")[1];

  try {
    if (ext === "gif") throw new Error("Can't process gifs");
    if (ext === "mp4") {
      await createFragmentPreview(s2, s3, path);
    } else {
      let ws = fs.createWriteStream(path);
      let t = sharp().resize(1000).webp();
      s2.pipe(t).pipe(ws);
    }
  } catch (e) {
    console.log("Processing failed", e);
    console.log("Writing full file to thumbnail", path);
    let ws = fs.createWriteStream(path);
    s4.pipe(ws);
  }

  res.send(name);
});

const createFragmentPreview = async (
  s2,
  s3,
  outputPath,
  fragmentDurationInSeconds = 4
) => {
  return new Promise(async (resolve, reject) => {
    const { durationInSeconds: videoDurationInSeconds } = await getVideoInfo(
      s2
    );

    const startTimeInSeconds = getStartTimeInSeconds(
      videoDurationInSeconds,
      fragmentDurationInSeconds
    );

    return (
      ffmpeg()
        .input(s3)
        .inputOptions([`-ss ${startTimeInSeconds}`])
        .inputFormat("mp4")
        .size("1000x?")
        .outputOptions([`-t ${fragmentDurationInSeconds}`])
        .noAudio()
        .output(outputPath)
        .outputFormat("mp4")
        .on("end", resolve)
        .on("error", reject)
        .run()
    );
  });
};

const getStartTimeInSeconds = (
  videoDurationInSeconds,
  fragmentDurationInSeconds
) => {
  // by subtracting the fragment duration we can be sure that the resulting
  // start time + fragment duration will be less than the video duration
  const safeVideoDurationInSeconds =
    videoDurationInSeconds - fragmentDurationInSeconds;

  // if the fragment duration is longer than the video duration
  if (safeVideoDurationInSeconds <= 0) {
    return 0;
  }

  return getRandomIntegerInRange(
    0.25 * safeVideoDurationInSeconds,
    0.75 * safeVideoDurationInSeconds
  );
};

const getRandomIntegerInRange = (min, max) => {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
};

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        return reject(error);
      }

      const { duration, size } = videoInfo.format;

      return resolve({
        size,
        durationInSeconds: Math.floor(duration),
      });
    });
  });
};
