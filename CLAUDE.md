# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A [Panic Nova](https://nova.app) extension providing NSIS (Nullsoft Scriptable Install System) language support via tree-sitter. The extension is a `.novaextension` bundle — a directory that Nova treats as a plugin.

## Build

Rebuild the tree-sitter dylib (requires Xcode Command Line Tools):

```sh
npm install
npm run build
```

The grammar source (`parser.c`) comes from the `tree-sitter-nsis` npm package. Override with `TREE_SITTER_NSIS=/path/to/tree-sitter-nsis ./build.sh`.

There are no tests or linter.

## Architecture

The extension has two layers:

1. **Syntax definition** (`NSIS.novaextension/Syntaxes/nsis.xml`) — declares the language to Nova: file type detectors, indentation rules, comment styles, bracket pairs, and a `<tree-sitter language="nsis">` block that connects to the parser and query files.

2. **Tree-sitter queries** (`NSIS.novaextension/Queries/*.scm`) — drive editor features using the compiled parser (`libtree-sitter-nsis.dylib`):
   - `highlights.scm` — maps tree-sitter AST nodes to Nova theme selectors (e.g. `@keyword`, `@identifier.function`, `@processing`, `@string`, `@comment`)
   - `folds.scm` — defines foldable regions
   - `symbols.scm` — populates the symbol navigator

The dylib in `Syntaxes/` is a universal (arm64 + x86_64) shared library compiled from the [tree-sitter-nsis](https://github.com/idleberg/tree-sitter-nsis) grammar. It must export `tree_sitter_nsis` — verify with `nm -g ... | grep tree_sitter`.

## Nova-Specific Conventions

- Nova capture names differ from standard tree-sitter: use Nova's theme selectors (`@keyword`, `@processing`, `@identifier.function`, `@identifier.variable`, `@value.number`, `@string`, `@comment`, `@operator`, `@invalid`) rather than generic tree-sitter names (`@keyword.function`, `@function`, `@number`, etc.). See https://docs.nova.app/extensions/themes/ for the full selector list.
- `extension.json` must have `"min_runtime": "10.0"` or tree-sitter support is silently ignored.
- The `language` attribute in `<tree-sitter language="nsis">` must match the dylib filename (`libtree-sitter-nsis.dylib`) and the exported C symbol (`tree_sitter_nsis`).

## Related Repositories

- **tree-sitter-nsis** (`../tree-sitter-nsis`) — the grammar this extension compiles; query patterns reference its AST node types
- **vscode-nsis** — the VS Code counterpart; its `syntaxes/nsis.tmLanguage.json` and `package.json` are useful references for NSIS language coverage
