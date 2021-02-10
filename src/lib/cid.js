import CID from "cids";
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
  const dagPB = (await import("ipld-dag-pb")).default;
  const Hash =  (await import("ipfs-only-hash")).default;
  const DAGNode = dagPB.DAGNode;
  const uint8View = new Uint8Array(await file.arrayBuffer());
  const node1 = new DAGNode(uint8View);
  const multihash = (await import("multihashes")).default;
  const cid = await dagPB.util.cid(node1.serialize());
  /*
  console.log("node1", node1.toJSON(), cid);
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(node1.serialize()));
  a.download='euphoric-shift.bin';
  a.click();
  console.log((await sha256(file)).toString());
  */
  const data = Buffer.from("hello world!");
  const hash = await Hash.of(data);
  console.log(hash); // QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j

  const bytes = convert(await sha256(file));
  const encoded = multihash.encode(bytes, "sha2-256");
  return multihash.toB58String(encoded);
  //return new CID(0, "dag-pb", hash).toString();
};
