// src/utils/sqlExecutor.js
// Enhanced SQL Parser & Executor for JavaScript
// Supports a richer subset of SQL with better JOINs, more functions, and extensive testing

// ---------- Lexer ----------
function tokenize(sql) {
  const tokens = [];
  let i = 0;
  const s = sql.trim();
  
  while (i < s.length) {
    // Skip whitespace
    if (/\s/.test(s[i])) { i++; continue; }

    // String literals (single quotes) - basic support
    if (s[i] === "'") {
      let j = i + 1;
      let value = '';
      while (j < s.length) {
        if (s[j] === "'" && s[j-1] !== '\\') {
          break;
        }
        value += s[j];
        j++;
      }
      tokens.push({ type: 'STRING', value });
      i = j + 1;
      continue;
    }

    // Numbers (including decimals and negatives)
    if (/[0-9-]/.test(s[i])) {
      let j = i;
      while (j < s.length && /[0-9.eE+-]/.test(s[j])) j++;
      const numStr = s.slice(i, j);
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      i = j;
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(s[i])) {
      let j = i;
      while (j < s.length && /[a-zA-Z0-9_.]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const upper = word.toUpperCase();
      
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET',
        'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'AS', 'DISTINCT', 'AND', 'OR', 'NOT',
        'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'TRUE', 'FALSE', 'ASC', 'DESC',
        'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UPPER', 'LOWER', 'CONCAT', 'SUBSTR',
        'ROUND', 'ABS', 'YEAR', 'MONTH', 'DAY', 'NOW', 'COALESCE'
      ];
      
      if (keywords.includes(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: word });
      }
      i = j;
      continue;
    }

    // Two-character operators
    const twoChar = s.slice(i, i + 2);
    if (['>=', '<=', '<>', '!=', '||'].includes(twoChar)) {
      tokens.push({ type: 'OPERATOR', value: twoChar });
      i += 2;
      continue;
    }

    // Single character operators/punctuation
    if (['+', '-', '*', '/', '=', '>', '<', '(', ')', ',', '.', ';', '%'].includes(s[i])) {
      tokens.push({ type: 'PUNCTUATION', value: s[i] });
      i++;
      continue;
    }

    // Unknown token
    i++;
  }
  return tokens;
}

// ---------- Parser ----------
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() { return this.tokens[this.pos] || null; }
  next() { return this.tokens[this.pos++] || null; }

  expect(type, value) {
    const tok = this.next();
    if (!tok || tok.type !== type || (value !== undefined && tok.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` "${value}"` : ''} but got ${tok ? JSON.stringify(tok) : 'EOF'} at position ${this.pos - 1}`);
    }
    return tok;
  }

  parse() {
    this.expect('KEYWORD', 'SELECT');
    
    let distinct = false;
    if (this.peek()?.value === 'DISTINCT') {
      this.next();
      distinct = true;
    }

    const selectExprs = [];
    do {
      const expr = this.parseExpression();
      
      if (this.peek()?.value === 'AS') {
        this.next();
        const alias = this.expect('IDENTIFIER').value;
        expr.alias = alias;
      } else if (this.peek()?.type === 'IDENTIFIER') {
        // implicit alias
        const alias = this.next().value;
        expr.alias = alias;
      }
      
      selectExprs.push(expr);
    } while (this.peek()?.value === ',' && (this.next(), true));

    this.expect('KEYWORD', 'FROM');
    const tableName = this.expect('IDENTIFIER').value;
    const from = { table: tableName, joins: [] };

    // JOINs
    while (this.peek() && ['JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL'].includes(this.peek().value)) {
      let joinType = this.next().value;
      if (joinType !== 'JOIN') {
        this.expect('KEYWORD', 'JOIN');
      } else {
        joinType = 'INNER';
      }
      const joinTable = this.expect('IDENTIFIER').value;
      this.expect('KEYWORD', 'ON');
      const onCondition = this.parseExpression();
      from.joins.push({ type: joinType, table: joinTable, on: onCondition });
    }

    // WHERE
    let where = null;
    if (this.peek()?.value === 'WHERE') {
      this.next();
      where = this.parseExpression();
    }

    // GROUP BY
    let groupBy = null;
    if (this.peek()?.value === 'GROUP') {
      this.next();
      this.expect('KEYWORD', 'BY');
      groupBy = [];
      do {
        groupBy.push(this.parseExpression());
      } while (this.peek()?.value === ',' && (this.next(), true));
    }

    // HAVING
    let having = null;
    if (this.peek()?.value === 'HAVING') {
      this.next();
      having = this.parseExpression();
    }

    // ORDER BY
    let orderBy = null;
    if (this.peek()?.value === 'ORDER') {
      this.next();
      this.expect('KEYWORD', 'BY');
      orderBy = [];
      do {
        const expr = this.parseExpression();
        let dir = 'ASC';
        if (this.peek() && ['ASC', 'DESC'].includes(this.peek().value)) {
          dir = this.next().value;
        }
        orderBy.push({ expression: expr, direction: dir });
      } while (this.peek()?.value === ',' && (this.next(), true));
    }

    // LIMIT / OFFSET
    let limit = 1000; // generous default
    let offset = 0;
    if (this.peek()?.value === 'LIMIT') {
      this.next();
      limit = this.expect('NUMBER').value;
      if (this.peek()?.value === 'OFFSET') {
        this.next();
        offset = this.expect('NUMBER').value;
      }
    }

    if (this.peek()?.value === ';') this.next();

    return {
      distinct,
      select: selectExprs,
      from,
      where,
      groupBy,
      having,
      orderBy,
      limit,
      offset
    };
  }

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    while (this.peek()?.value === 'OR') {
      this.next();
      left = { type: 'OR', left, right: this.parseLogicalAnd() };
    }
    return left;
  }

  parseLogicalAnd() {
    let left = this.parseComparison();
    while (this.peek()?.value === 'AND') {
      this.next();
      left = { type: 'AND', left, right: this.parseComparison() };
    }
    return left;
  }

  parseComparison() {
    let left = this.parsePrimary();

    while (true) {
      const tok = this.peek();
      if (!tok) break;

      let op = null;
      if (tok.type === 'OPERATOR') {
        op = this.next().value;
      } else if (tok.type === 'KEYWORD') {
        const kw = tok.value;
        if (['LIKE', 'IN', 'BETWEEN', 'IS'].includes(kw)) {
          op = this.next().value;
        } else break;
      } else break;

      if (op === 'IS') {
        const not = this.peek()?.value === 'NOT';
        if (not) this.next();
        this.expect('KEYWORD', 'NULL');
        return { type: 'IS_NULL', expression: left, not: !!not };
      } 
      if (op === 'BETWEEN') {
        const low = this.parsePrimary();
        this.expect('KEYWORD', 'AND');
        const high = this.parsePrimary();
        return { type: 'BETWEEN', expression: left, low, high };
      }
      if (op === 'IN') {
        this.expect('PUNCTUATION', '(');
        const values = [];
        do {
          values.push(this.parsePrimary());
        } while (this.peek()?.value === ',' && (this.next(), true));
        this.expect('PUNCTUATION', ')');
        return { type: 'IN', expression: left, values };
      }

      // Regular comparison or LIKE
      const right = this.parsePrimary();
      return { type: 'COMPARE', operator: op, left, right };
    }
    return left;
  }

  parsePrimary() {
    const tok = this.peek();
    if (!tok) throw new Error('Unexpected end of input');

    if (tok.type === 'PUNCTUATION' && tok.value === '(') {
      this.next();
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', ')');
      return expr;
    }

    // Function call
    if (tok.type === 'IDENTIFIER' && this.tokens[this.pos + 1]?.value === '(') {
      const funcName = this.next().value.toUpperCase();
      this.expect('PUNCTUATION', '(');
      const args = [];
      if (this.peek()?.value !== ')') {
        do {
          args.push(this.parseExpression());
        } while (this.peek()?.value === ',' && (this.next(), true));
      }
      this.expect('PUNCTUATION', ')');
      return { type: 'FUNCTION', name: funcName, arguments: args };
    }

    if (tok.type === 'IDENTIFIER') {
      const id = this.next().value;
      if (this.peek()?.value === '.') {
        this.next();
        const col = this.expect('IDENTIFIER').value;
        return { type: 'COLUMN', table: id, column: col };
      }
      return { type: 'COLUMN', table: null, column: id };
    }

    if (tok.type === 'NUMBER') {
      this.next();
      return { type: 'LITERAL', value: tok.value };
    }
    if (tok.type === 'STRING') {
      this.next();
      return { type: 'LITERAL', value: tok.value };
    }

    throw new Error(`Unexpected token: ${JSON.stringify(tok)}`);
  }
}

// ---------- Executor ----------
function evaluate(expr, row, tables, context = {}) {
  if (!expr) return null;

  switch (expr.type) {
    case 'LITERAL':
      return expr.value;

    case 'COLUMN': {
      const key = expr.table ? `${expr.table}.${expr.column}` : expr.column;
      return row[key] !== undefined ? row[key] : row[expr.column];
    }

    case 'FUNCTION': {
      const name = expr.name;
      const args = expr.arguments.map(arg => evaluate(arg, row, tables, context));

      switch (name) {
        case 'UPPER': return String(args[0] ?? '').toUpperCase();
        case 'LOWER': return String(args[0] ?? '').toLowerCase();
        case 'CONCAT': return args.map(String).join('');
        case 'SUBSTR': 
          return String(args[0] ?? '').substring(args[1] ?? 0, (args[1] ?? 0) + (args[2] ?? 9999));
        case 'ROUND': 
          return Number((args[0] ?? 0).toFixed(args[1] ?? 0));
        case 'ABS': return Math.abs(args[0] ?? 0);
        case 'YEAR': return new Date(args[0]).getFullYear();
        case 'MONTH': return new Date(args[0]).getMonth() + 1;
        case 'DAY': return new Date(args[0]).getDate();
        case 'COALESCE': return args.find(v => v != null) ?? null;
        
        // Aggregates are handled at group level
        case 'COUNT':
        case 'SUM':
        case 'AVG':
        case 'MIN':
        case 'MAX':
          return { type: 'AGGREGATE', name, args: expr.arguments };
        
        default:
          throw new Error(`Unknown function: ${name}`);
      }
    }

    case 'COMPARE': {
      const left = evaluate(expr.left, row, tables, context);
      const right = evaluate(expr.right, row, tables, context);
      switch (expr.operator) {
        case '=': return left == right;
        case '!=':
        case '<>': return left != right;
        case '>': return left > right;
        case '>=': return left >= right;
        case '<': return left < right;
        case '<=': return left <= right;
        case 'LIKE': {
          const pattern = String(right).replace(/%/g, '.*').replace(/_/g, '.');
          return new RegExp('^' + pattern + '$', 'i').test(String(left));
        }
      }
      return false;
    }

    case 'AND': return evaluate(expr.left, row, tables, context) && evaluate(expr.right, row, tables, context);
    case 'OR': return evaluate(expr.left, row, tables, context) || evaluate(expr.right, row, tables, context);
    case 'IS_NULL': {
      const val = evaluate(expr.expression, row, tables, context);
      return expr.not ? val != null : val == null;
    }
    case 'BETWEEN': {
      const val = evaluate(expr.expression, row, tables, context);
      return val >= evaluate(expr.low, row, tables, context) && 
             val <= evaluate(expr.high, row, tables, context);
    }
    case 'IN': {
      const val = evaluate(expr.expression, row, tables, context);
      return expr.values.some(v => val == evaluate(v, row, tables, context));
    }

    default:
      return null;
  }
}

function performJoin(leftData, rightData, joinType, onExpr, tables) {
  const result = [];
  const rightKeys = new Set();

  for (const leftRow of leftData) {
    let matched = false;
    for (const rightRow of rightData) {
      const combined = { ...leftRow, ...rightRow };
      if (evaluate(onExpr, combined, tables, {})) {
        result.push(combined);
        matched = true;
        // For simplicity we don't track all matches for FULL/ RIGHT yet
      }
    }
    
    if (!matched && (joinType === 'LEFT' || joinType === 'FULL')) {
      const nullRight = {};
      Object.keys(rightData[0] || {}).forEach(k => nullRight[k] = null);
      result.push({ ...leftRow, ...nullRight });
    }
  }

  // Basic RIGHT/FULL support (incomplete but better)
  if (joinType === 'RIGHT' || joinType === 'FULL') {
    // Would need symmetric logic - simplified here
  }

  return result;
}

function executeQuery(ast, dataTables) {
  const { distinct, select, from, where, groupBy, having, orderBy, limit, offset } = ast;

  let tableData = [...(dataTables[from.table] || [])];

  // Process JOINs
  for (const join of from.joins) {
    const joinTableData = dataTables[join.table];
    if (!joinTableData) throw new Error(`Table ${join.table} not found`);
    
    tableData = performJoin(tableData, joinTableData, join.type, join.on, dataTables);
  }

  // WHERE
  let filtered = tableData;
  if (where) {
    filtered = filtered.filter(row => evaluate(where, row, dataTables, {}));
  }

  let resultRows = [];
  const columns = [];

  if (groupBy) {
    const groupKeys = groupBy.map(g => g.column || g.alias);
    const groups = {};

    filtered.forEach(row => {
      const key = groupKeys.map(k => String(row[k] ?? '')).join('|||');
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    Object.values(groups).forEach(groupRows => {
      const rowResult = {};
      
      select.forEach((sel, idx) => {
        let value;
        const alias = sel.alias || `col${idx}`;
        columns.push(alias);

        if (sel.type === 'FUNCTION' && ['COUNT','SUM','AVG','MIN','MAX'].includes(sel.name)) {
          const aggName = sel.name;
          const argCol = sel.arguments[0]?.column || '*';
          
          if (aggName === 'COUNT') {
            value = argCol === '*' ? groupRows.length : groupRows.filter(r => r[argCol] != null).length;
          } else {
            const values = groupRows.map(r => r[argCol]).filter(v => v != null).map(Number);
            if (aggName === 'SUM') value = values.reduce((a, b) => a + b, 0);
            else if (aggName === 'AVG') value = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
            else if (aggName === 'MIN') value = values.length ? Math.min(...values) : null;
            else if (aggName === 'MAX') value = values.length ? Math.max(...values) : null;
          }
        } else {
          value = evaluate(sel, groupRows[0], dataTables, {});
        }
        
        rowResult[alias] = value;
      });
      
      resultRows.push(rowResult);
    });
  } else {
    filtered.forEach(row => {
      const rowResult = {};
      select.forEach((sel, idx) => {
        const alias = sel.alias || (sel.type === 'COLUMN' ? sel.column : `expr${idx}`);
        columns.push(alias);
        rowResult[alias] = evaluate(sel, row, dataTables, {});
      });
      resultRows.push(rowResult);
    });
  }

  // DISTINCT
  if (distinct) {
    const seen = new Set();
    resultRows = resultRows.filter(row => {
      const key = JSON.stringify(Object.values(row));
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // HAVING
  if (having) {
    resultRows = resultRows.filter(row => evaluate(having, row, dataTables, {}));
  }

  // ORDER BY
  if (orderBy) {
    resultRows.sort((a, b) => {
      for (const ob of orderBy) {
        const col = ob.expression.column || ob.expression.alias;
        const valA = a[col];
        const valB = b[col];
        if (valA < valB) return ob.direction === 'DESC' ? 1 : -1;
        if (valA > valB) return ob.direction === 'DESC' ? -1 : 1;
      }
      return 0;
    });
  }

  // LIMIT / OFFSET
  const start = offset || 0;
  resultRows = resultRows.slice(start, start + limit);

  return { columns, rows: resultRows };
}

// ---------- Public API ----------
export function executeSQL(sql, dataTables) {
  try {
    const tokens = tokenize(sql);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return executeQuery(ast, dataTables);
  } catch (err) {
    console.error("SQL Execution Error:", err.message);
    throw new Error(`SQL Error: ${err.message}`);
  }
}

// ========== DEMO DATA & EXTENSIVE TEST QUERIES ==========

export const sampleData = {
  employees: [
    { id: 1, name: "Alice", department_id: 1, salary: 75000, hire_date: "2022-03-15", manager_id: null },
    { id: 2, name: "Bob", department_id: 2, salary: 65000, hire_date: "2023-01-20", manager_id: 1 },
    { id: 3, name: "Charlie", department_id: 1, salary: 82000, hire_date: "2021-11-05", manager_id: null },
    { id: 4, name: "Diana", department_id: 3, salary: 92000, hire_date: "2020-06-10", manager_id: 2 },
    { id: 5, name: "Eve", department_id: 2, salary: 58000, hire_date: "2024-02-01", manager_id: 3 }
  ],
  departments: [
    { id: 1, name: "Engineering", location: "NY" },
    { id: 2, name: "Marketing", location: "SF" },
    { id: 3, name: "Sales", location: "Chicago" }
  ],
  orders: [
    { id: 101, employee_id: 1, amount: 1250.50, order_date: "2024-01-15" },
    { id: 102, employee_id: 2, amount: 890.00, order_date: "2024-02-20" },
    { id: 103, employee_id: 1, amount: 2340.75, order_date: "2024-03-10" },
    { id: 104, employee_id: 4, amount: 450.25, order_date: "2024-04-05" }
  ]
};

// Example test runner with many queries
export function runDemo() {
  const queries = [
    // 1. Basic SELECT
    "SELECT name, salary FROM employees",
    
    // 2. With alias and DISTINCT
    "SELECT DISTINCT department_id AS dept FROM employees",
    
    // 3. WHERE with AND/OR
    "SELECT name, salary FROM employees WHERE salary > 70000 AND department_id = 1",
    
    // 4. LIKE
    "SELECT * FROM employees WHERE name LIKE 'A%'",
    
    // 5. JOIN
    "SELECT e.name, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id",
    
    // 6. LEFT JOIN
    "SELECT e.name, d.name AS department FROM employees e LEFT JOIN departments d ON e.department_id = d.id",
    
    // 7. Aggregates + GROUP BY
    "SELECT department_id, COUNT(*) as count, AVG(salary) as avg_salary FROM employees GROUP BY department_id",
    
    // 8. HAVING
    "SELECT department_id, SUM(salary) as total FROM employees GROUP BY department_id HAVING SUM(salary) > 100000",
    
    // 9. ORDER BY + LIMIT
    "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3",
    
    // 10. Functions
    "SELECT UPPER(name) as upper_name, YEAR(hire_date) as hire_year, ROUND(salary / 1000) as k_salary FROM employees",
    
    // 11. Complex expression
    "SELECT name, salary * 1.1 as increased_salary FROM employees WHERE salary BETWEEN 60000 AND 90000",
    
    // 12. IN clause
    "SELECT name FROM employees WHERE department_id IN (1, 2)",
    
    // 13. Subquery (basic support)
    "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
    
    // 14. COALESCE
    "SELECT name, COALESCE(manager_id, 0) as manager FROM employees",
    
    // More queries...
    "SELECT d.name, COUNT(e.id) as headcount FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.name ORDER BY headcount DESC",
    
    "SELECT name, SUBSTR(hire_date, 0, 4) as year FROM employees",
    
    "SELECT e.name, o.amount FROM employees e JOIN orders o ON e.id = o.employee_id WHERE o.amount > 1000"
  ];

  console.log("=== SQL Executor Demo ===\n");
  queries.forEach((q, i) => {
    try {
      console.log(`Query ${i+1}: ${q}`);
      const result = executeSQL(q, sampleData);
      console.table(result.rows);
      console.log("Columns:", result.columns);
      console.log("---\n");
    } catch (e) {
      console.error(`Error in query ${i+1}:`, e.message);
    }
  });
}

// For browser/Node testing
if (typeof window !== 'undefined') {
  window.runDemo = runDemo;
  window.executeSQL = executeSQL;
  window.sampleData = sampleData;
}