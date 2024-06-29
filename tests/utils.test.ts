import {
  getValidatorKey,
  getValidatorSettings,
  getKeyFromNonce,
  getValidatorFromKey,
  getValidatorFromNonce,
} from "../src/utils";
import { getAddress, type Address } from "viem";

const testValidator = "0xF62849F9A0B5Bf2913b396098F7c7019b51A820a";
const testKey = 1405310203571408291950365054053061012934685786634n;
const testStorageKey =
  "0x000000000000000000000000F62849F9A0B5Bf2913b396098F7c7019b51A820a";
const testStorageValue =
  "0x000000000000000000000000F62849F9A0B5Bf2913b396098F7c7019b51A820a";

function mockGetNonce(key: bigint, sequenceNumber: bigint): bigint {
  return sequenceNumber | (key << 64n);
}

function randomBigInt(min: bigint, max: bigint): bigint {
  const range = max - min + 1n;
  const bits = range.toString(2).length;
  let result;
  do {
    result = BigInt(
      `0b${Array.from({ length: bits }, () => (Math.random() < 0.5 ? "0" : "1")).join("")}`,
    );
  } while (result >= range);
  return result + min;
}

function randomAddress(): Address {
  const address = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
  return getAddress(address);
}

describe("Validator Utility Functions", () => {
  test("getValidatorKey", () => {
    expect(getValidatorKey(testValidator)).toBe(testKey);
  });

  test("getValidatorSettings", () => {
    const settings = getValidatorSettings(testValidator);
    expect(settings.key).toBe(testKey);
    expect(settings.storageKey.toLowerCase()).toBe(
      testStorageKey.toLowerCase(),
    );
    expect(settings.storageValue.toLowerCase()).toBe(
      testStorageValue.toLowerCase(),
    );
  });

  test("Fuzz testing: getKeyFromNonce and getValidatorFromNonce", () => {
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const randomKey = randomBigInt(0n, (1n << 160n) - 1n);
      const randomSequence = randomBigInt(0n, (1n << 64n) - 1n);
      const nonce = mockGetNonce(randomKey, randomSequence);

      expect(getKeyFromNonce(nonce)).toBe(randomKey);
      expect(getKeyFromNonce(nonce)).toBe(randomKey);
    }
  });

  test("Property-based testing: Nonce properties", () => {
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const randomAddr = randomAddress();
      const key = getValidatorKey(randomAddr);
      const randomSequence = randomBigInt(0n, (1n << 64n) - 1n);
      const nonce = mockGetNonce(key, randomSequence);

      expect(nonce & ((1n << 64n) - 1n)).toBe(randomSequence);
      expect(nonce >> 64n).toBe(key);

      const recoveredAddress = getValidatorFromNonce(nonce);
      expect(() => getAddress(recoveredAddress)).not.toThrow();

      expect(getValidatorFromKey(getValidatorKey(randomAddr))).toBe(
        randomAddr.toLowerCase(),
      );
    }
  });

  test("Invariant testing: Key and nonce relationships", () => {
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      const randomAddr = randomAddress();
      const key = getValidatorKey(randomAddr);
      const randomSequence = randomBigInt(0n, (1n << 64n) - 1n);
      const nonce = mockGetNonce(key, randomSequence);

      expect(getKeyFromNonce(nonce)).toBeLessThan(1n << 192n);
      expect(getValidatorFromNonce(nonce).length).toBe(42);
      expect(getValidatorFromKey(getKeyFromNonce(nonce))).toBe(
        getValidatorFromNonce(nonce),
      );
    }
  });

  test("Roundtrip: address -> key -> address", () => {
    const address = testValidator;
    const key = getValidatorKey(address);
    const recoveredAddress = getValidatorFromKey(key);
    expect(recoveredAddress).toBe(address.toLowerCase());
  });

  test("Roundtrip: address -> key -> nonce -> key -> address", () => {
    const address = testValidator;
    const key = getValidatorKey(address);
    const sequence = 123n; // Example sequence number
    const nonce = mockGetNonce(key, sequence);
    const recoveredKey = getKeyFromNonce(nonce);
    const recoveredAddress = getValidatorFromKey(recoveredKey);
    expect(recoveredAddress).toBe(address.toLowerCase());
  });
});
