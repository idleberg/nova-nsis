# nova-nsis

> [!TIP]
> See the [internal README](/NSIS.novaextension/README.md) for installation and usage instructions.

## Development

### Prerequisites

- [Node.js](https://nodejs.org) v24+
- [pnpm](https://pnpm.io)

If you use [mise](https://mise.jdx.dev), the included `mise.toml` handles both.

### Building

```sh
pnpm install
pnpm run build
```

This builds two artifacts:

- `Scripts/main.cjs` — the extension scripts
- `Syntaxes/libtree-sitter-nsis.dylib` — the tree-sitter parser, which requires a C compiler (Xcode Command Line Tools). The grammar source is pulled from npm automatically; to use a local checkout instead, set `TREE_SITTER_NSIS=/path/to/tree-sitter-nsis`.

The [nsis-lsp](https://github.com/idleberg/nsis-lsp) language server is _not_ bundled, but diagnostics and formatting depend on it. Install it separately (`npm i -g @nsis/lsp` or `cargo install nsis-lsp`) to work on those features.

## License

This work is licensed under the [MIT License](LICENSE).
