import { ECPairFactory } from "ecpair";
import * as ecclib from "tiny-secp256k1";

export const ECPair = ECPairFactory(ecclib);
export const ecc = ecclib;
