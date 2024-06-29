import { Hex } from "viem";

export interface ValidatorInfo {
  key: bigint;
  storageKey: Hex;
  storageValue: Hex;
}
