import { type ValidatorInfo } from "./types";
import { type Address, hexToBigInt, pad, toHex } from "viem";

export function getValidatorKey(validator: Address): bigint {
  return hexToBigInt(
    validator,
    { size: 24 }, // uint192
  );
}

export function getValidatorSettings(validator: Address): ValidatorInfo {
  return {
    key: getValidatorKey(validator),
    storageKey: pad(validator, {
      dir: "left",
    }),
    storageValue: pad(validator, {
      dir: "left",
    }),
  };
}

export function getKeyFromNonce(nonce: bigint): bigint {
  return nonce >> 64n;
}

export function getValidatorFromKey(key: bigint): Address {
  return toHex(key, { size: 20 }) as Address;
}

export function getValidatorFromNonce(nonce: bigint): Address {
  return getValidatorFromKey(getKeyFromNonce(nonce));
}
