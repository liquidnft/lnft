import fs from "fs";
import ipfsClient from "ipfs-http-client";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import Clone from "readable-stream-clone";
import { app } from "./app.js";
import fastifyMultipart from "fastify-multipart";

app.register(fastifyMultipart);

app.post("/upload", async function (req, res) {
  const ipfs = ipfsClient(process.env.IPFS_URL);
  const data = await req.file();

  const s1 = new Clone(data.file);
  const s2 = new Clone(data.file);
  const s3 = new Clone(data.file);
  const s4 = new Clone(data.file);
  const s5 = new Clone(data.file);

  const { cid } = await ipfs.add(s1);
  const name = cid.toString();

  const ext = data.mimetype.split("/")[1];
  const path = `/export/${name}`;
  const thumb = `${path}.${ext}`;

  try {
    s4.pipe(fs.createWriteStream(path));

    if (ext === "gif") throw new Error("Can't process gifs");
    if (ext === "mp4") {
      await createFragmentPreview(s2, s3, thumb);
    } else {
      let t = sharp().rotate().resize(1000).webp();
      s2.pipe(t).pipe(fs.createWriteStream(thumb));
    }
  } catch (e) {
    console.log("Processing failed", e);
    s5.pipe(fs.createWriteStream(thumb));
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

    return ffmpeg()
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
      .run();
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
