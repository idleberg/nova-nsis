(function_definition
  name: (_) @name
  (#set! role function)) @subtree

(section_definition
  parameter: (_) @name
  (#set! role tag)) @subtree

(section_group
  parameter: (_) @name
  (#set! role category)) @subtree

(macro_definition
  name: (identifier) @name
  (#set! role function)) @subtree

(variable_declaration
  name: (identifier) @name
  (#set! role variable)) @subtree
