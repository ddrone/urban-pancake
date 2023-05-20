import m from 'mithril';
import { FlatExpr, FlatIdent, FlatStmt } from './compiler';
import { TextRange } from './ast';

export interface VisAttrs {
  source: string;
  compiled: FlatStmt[];
}

export class Vis implements m.ClassComponent<VisAttrs> {
  highlightRange?: TextRange;

  span(range: TextRange, content: m.Children): m.Child {
    return m('span', {
      onmouseover: () => {
        this.highlightRange = range;
      },
      onmouseout: () => {
        this.highlightRange = undefined;
      }
    }, content);
  }

  renderIdent(ident: FlatIdent): m.Children {
    switch (ident.kind) {
      case 'generated':
        return this.span(ident.range, [
          'gen',
          m('sub', `${ident.value}`)
        ])
      case 'source':
        return this.span(ident.range, ident.value)
    }
  }

  renderExpr(expr: FlatExpr): m.Children {
    switch (expr.kind) {
      case 'const':
        return `${expr.constValue}`
      case 'lookup':
        return this.renderIdent(expr.name)
      case 'binary':
        return [
          this.renderIdent(expr.left),
          ` ${expr.op} `,
          this.renderIdent(expr.right),
        ]
    }
  }

  renderStmt(stmt: FlatStmt): m.Children {
    switch (stmt.kind) {
      case 'print':
        return [
          'print(',
          this.renderIdent(stmt.expr),
          ')'
        ];
      case 'assign':
        return [
          this.renderIdent(stmt.name),
          ' = ',
          this.renderExpr(stmt.expr),
        ]
    }
  }

  renderSource(source: string): m.Children {
    if (this.highlightRange === undefined) {
      return source;
    }
    return [
      source.substring(0, this.highlightRange.startOffset),
      m('span.highlight', source.substring(this.highlightRange.startOffset, this.highlightRange.endOffset)),
      source.substring(this.highlightRange.endOffset)
    ];
  }

  view(vnode: m.Vnode<VisAttrs>): m.Child {
    return m('div',
      m('pre', this.renderSource(vnode.attrs.source)),
      m('ul',
        vnode.attrs.compiled.map(stmt => m('li', this.renderStmt(stmt)))
      )
    );
  }
}
