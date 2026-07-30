# NSIS for Nova

> [NSIS](https://nsis.sourceforge.io) (Nullsoft Scriptable Install System) support for [Panic's Nova](https://nova.app) editor.

## Features

- Tree-sitter-based syntax highlighting
- Code folding for functions, sections, macros, and preprocessor blocks
- Symbol navigation
- Comment toggling
- Bracket and quote auto-pairing
- Build task assistant

With the [nsis-lsp](https://github.com/idleberg/nsis-lsp) language server installed, you also get:

- Completions for instructions, preprocessor directives and variables
- Documentation on hover
- Signature help
- Jump to definition for defines, macros and functions
- Code actions
- Diagnostics from `makensis`
- Code formatting, on save

## Requirements

Nova 14 or later.

The [nsis-lsp](https://github.com/idleberg/nsis-lsp) language server is required for diagnostics and formatting — there are no built-in fallbacks. Install it with `npm i -g @nsis/lsp` or `cargo install nsis-lsp`; the extension picks it up from your `PATH`, or you can point at it explicitly in the extension settings.

## Installation

Install from the [Nova Extension Library](https://extensions.panic.com/), or clone this repository and double-click `NSIS.novaextension`.

## License

This work is licensed under the [MIT License](LICENSE).
