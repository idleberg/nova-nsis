#!/bin/sh
set -e

TREE_SITTER_NSIS="${TREE_SITTER_NSIS:-node_modules/tree-sitter-nsis}"
OUTPUT="NSIS.novaextension/Syntaxes/libtree-sitter-nsis.dylib"

if [ ! -f "$TREE_SITTER_NSIS/src/parser.c" ]; then
  echo "Error: tree-sitter-nsis not found at $TREE_SITTER_NSIS"
  echo "Set TREE_SITTER_NSIS to the path of your tree-sitter-nsis checkout."
  exit 1
fi

cc -shared -fPIC -O2 \
  -arch arm64 -arch x86_64 \
  -I "$TREE_SITTER_NSIS/src" \
  "$TREE_SITTER_NSIS/src/parser.c" \
  -o "$OUTPUT" \
  -install_name @rpath/libtree-sitter-nsis.dylib

echo "Built $OUTPUT"
