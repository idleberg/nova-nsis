# nova-nsis

> [!TIP]
> See the [internal README](/NSIS.novaextension/README.md) for installation and usage instructions.

## Development

### Prerequisites

- [Node.js](https://nodejs.org) v24+
- [pnpm](https://pnpm.io)

If you use [mise](https://mise.jdx.dev), the included `mise.toml` handles both.

### Building the Parser

To rebuild the tree-sitter dylib from source:

```sh
pnpm install
pnpm run build
```

This requires a C compiler (Xcode Command Line Tools). The grammar source is pulled from npm automatically. To use a local checkout instead, set `TREE_SITTER_NSIS=/path/to/tree-sitter-nsis`.

## License

This work is licensed under the [MIT License](LICENSE).
