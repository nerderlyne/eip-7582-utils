# eip-7582-utils

Utility functions for working with [EIP-7582 (Modular Accounts with Delegated Validation)](https://eips.ethereum.org/EIPS/eip-7582). It includes functions for converting between different formats and extracting information from nonces.

## Installation

You can install this package using npm (or any other package manager of choice):

```bash
npm install eip-7582-utils viem
```

**Important:** This package requires `viem` as a peer dependency. Make sure to install it alongside `eip-7582-utils` if you haven't already done so.

## API Reference

- `getValidatorKey(validator: Address): bigint`
- `getValidatorSettings(validator: Address): ValidatorInfo`
- `getKeyFromNonce(nonce: bigint): bigint`
- `getValidatorFromKey(key: bigint): Address`
- `getValidatorFromNonce(nonce: bigint): Address`

For detailed information on each function, please refer to the source code or TypeScript definitions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This package is based on the specifications outlined in [EIP-7582](https://eips.ethereum.org/EIPS/eip-7582).
