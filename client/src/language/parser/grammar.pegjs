start = stmts

stmts = (stmt semi)*

stmt
  = identifier assign expr
  / print open expr close

expr
  = mult "+" mult
  / mult

mult
  = primary '*' primary
  / primary

primary
  = integer
  / identifier
  / open expr close

print = "print" ws

open = '(' ws

close = ')' ws

identifier = [a-zA-Z_][a-zA-Z0-9_] ws

integer = [0-9+] ws

assign = '=' ws

semi = ';' ws

ws = [ \t\r\n]*
