import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

const readSlice = async (file, start, size) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const slice = file.slice(start, start + size);

    fileReader.onload = () => resolve(new Uint8Array(fileReader.result));
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(slice);
  });

const sha256 = async (file) => {
  let sha256 = CryptoJS.algo.SHA256.create();
  const sliceSize = 10_485_760;
  let start = 0;

  while (start < file.size) {
    const slice = await readSlice(file, start, sliceSize);
    const wordArray = CryptoJS.lib.WordArray.create(slice);
    sha256 = sha256.update(wordArray);
    start += sliceSize;
  }

  sha256.finalize();

  return sha256._hash;
};

const convert = (wordArray) => {
  let len = wordArray.words.length,
    u8_array = new Uint8Array(len << 2),
    offset = 0,
    word,
    i;
  for (i = 0; i < len; i++) {
    word = wordArray.words[i];
    u8_array[offset++] = word >> 24;
    u8_array[offset++] = (word >> 16) & 0xff;
    u8_array[offset++] = (word >> 8) & 0xff;
    u8_array[offset++] = word & 0xff;
  }
  return u8_array;
};

export default async (file) => {
  const multihash = (await import("multihashes")).default;
  return multihash.toB58String(
    multihash.encode(convert(await sha256(file)), "sha2-256")
  );
};
