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

`npm run build` runs both targets concurrently (`npm:build:*`): `build:source` (tsdown → `Scripts/main.cjs`) and `build:treesitter` (`build.sh` → the dylib, ad-hoc codesigned in `postbuild:treesitter`).

The grammar source (`parser.c`) comes from the `tree-sitter-nsis` npm package. Override with `TREE_SITTER_NSIS=/path/to/tree-sitter-nsis ./build.sh`.

The `nsis-lsp` language server is deliberately **not** bundled — users install it themselves — but diagnostics and formatting come from it exclusively, so install it locally (`npm i -g @nsis/lsp`) to exercise either feature.

There are no tests or linter.

## Architecture

The extension has three layers:

1. **Syntax definition** (`NSIS.novaextension/Syntaxes/nsis.xml`) — declares the language to Nova: file type detectors, indentation rules, comment styles, bracket pairs, and a `<tree-sitter language="nsis">` block that connects to the parser and query files.

2. **Tree-sitter queries** (`NSIS.novaextension/Queries/*.scm`) — drive editor features using the compiled parser (`libtree-sitter-nsis.dylib`):
   - `highlights.scm` — maps tree-sitter AST nodes to Nova theme selectors (e.g. `@keyword`, `@identifier.function`, `@processing`, `@string`, `@comment`)
   - `folds.scm` — defines foldable regions
   - `symbols.scm` — populates the symbol navigator

The dylib in `Syntaxes/` is a universal (arm64 + x86_64) shared library compiled from the [tree-sitter-nsis](https://github.com/idleberg/tree-sitter-nsis) grammar. It must export `tree_sitter_nsis` — verify with `nm -g ... | grep tree_sitter`.

3. **Extension scripts** (`Source/*.ts`, bundled to `Scripts/main.cjs`) — `lsp.ts` owns the `nsis-lsp` client and `build.ts` provides the makensis task. Diagnostics and formatting are the server's alone: it publishes diagnostics itself, and `format.ts` only drives `textDocument/formatting` against it. There are deliberately **no** built-in fallbacks — without the server the extension is syntax highlighting plus the build task. Don't reintroduce an in-process formatter or a makensis issue assistant.

### Language server notes

- `nsis-lsp` is resolved from `nsis.languageServer.path`, else looked up with `command -v` in a login shell — Nova's extension host does not inherit the user's `PATH`, so a bare command name in `ServerOptions.path` never resolves. If it isn't found, the user is notified once (flagged by the undeclared `nsis.languageServer.notified` config key) and diagnostics and formatting stay off.
- `nsis-lsp` advertises `completion` (triggers `!` and `$`), `hover`, `signatureHelp`, `definition`, `codeAction`, `documentFormatting`, `documentSymbol`, `references` and `rename`, plus push diagnostics. Nova only consumes a subset — `documentSymbol` (Nova uses `symbols.scm`), `references` and `rename` are not wired into the editor and would need manual `sendRequest` calls behind commands.
- Settings only reach the server through `initializationOptions` (snake_case: `diagnostics.preprocess_mode`, `diagnostics.enabled_on_save`, `makensis.path`, `formatter.*`) — it has no `workspace/didChangeConfiguration` handler, so config changes restart the client. Unknown keys are ignored silently, so a typo fails quietly.
- Nova has no built-in format-on-save, so `format.ts` drives it from `onWillSave` (the callback may return a Promise; the runtime allows at least 5 seconds). It applies the returned edits itself, converting LSP line/character positions to Nova character offsets; the server answers with a single edit spanning the whole document. If the client isn't running, saving is a no-op. Formatter settings travel on two channels: indentation per request (`tabSize`/`insertSpaces`, from the editor's tab settings), and `end_of_line`, `print_width`, `trim_empty_lines`, `single_quote` in `initializationOptions` from `nsis.format.*` — hence the restart on change.
- Verify capabilities by piping an `initialize` request into the binary over stdio; `nova.inDevMode()` enables LSP traffic in the Extension Console.

## Nova-Specific Conventions

- Nova capture names differ from standard tree-sitter: use Nova's theme selectors (`@keyword`, `@processing`, `@identifier.function`, `@identifier.variable`, `@value.number`, `@string`, `@comment`, `@operator`, `@invalid`) rather than generic tree-sitter names (`@keyword.function`, `@function`, `@number`, etc.). See https://docs.nova.app/extensions/themes/ for the full selector list.
- `extension.json` must have `"min_runtime"` of at least `"10.0"` or tree-sitter support is silently ignored; it is currently `"14.0"` for Nova 14's language server fixes. Launching the server also needs `"entitlements": { "process": true }`.
- `nova.fs` throws at runtime without `"entitlements": { "filesystem": … }`, even for files inside the extension bundle — the extension deliberately avoids it and detects a broken language server path via `LanguageClient.onDidStop` instead.
- The `language` attribute in `<tree-sitter language="nsis">` must match the dylib filename (`libtree-sitter-nsis.dylib`) and the exported C symbol (`tree_sitter_nsis`).

## Related Repositories

- **tree-sitter-nsis** (`../tree-sitter-nsis`) — the grammar this extension compiles; query patterns reference its AST node types
- **vscode-nsis-lsp** (`../../_vscode/vscode-nsis-lsp`) and **language-nsis-lsp** (`../../_atom/language-nsis-lsp`) — the VS Code and Pulsar clients for the same `nsis-lsp` server; useful references for `initializationOptions`
- **vscode-nsis** — the VS Code counterpart; its `syntaxes/nsis.tmLanguage.json` and `package.json` are useful references for NSIS language coverage
