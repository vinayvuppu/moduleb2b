{
	function getPathForTerm(term) {
    	if(term === "totalPrice") {
        	return "$.centAmount";
        }
        if(term === "shippingInfo") {
        	return "$.price.centAmount";
        }
    }
    
    function getOperator(op) {
    	if(op === ">=") {
        	return "greaterThanInclusive"
        }
        if(op === ">") {
        	return "greaterThan"
        }
        if(op === "<=") {
        	return "lessThanInclusive"
        }
        if(op === "<") {
        	return "lessThan"
        }
        if(op === "=") {
        	return "equal"
        }
        if(op === "contains") {
        	return "contains"
        }
    }
}

predicate
  = ws exp:expression ws { return exp; }

parens
  = ws "(" ws ex:expression ws ")" ws { return ex; }
  
expression
  = head:term tail:("or"i term)*
    {
      if (tail.length === 0) {
        return head;
      }

      return {
      	any: [head].concat(tail.map(function(el){return el[1];}))
      };
    }
    
term
  = head:condition tail:("and"i condition)*
    {
      if (tail.length === 0) {
        return { all: [head] };
      }

     return {
      	all: [head].concat(tail.map(function(el){return el[1];}))
      };
   }
   


condition 
 = ws head:field ws op:single_operators ws tail:Value ws
  {
  		let _value = tail;
        
        if (head === 'totalPrice' || head === 'shippingInfo') {
        	_value = tail * 10 ** 2;
        }
  
     	return  {
            fact: head,
            path: getPathForTerm(head),
            operator: getOperator(op),
            value: _value
        }
     }
 / ws parens:parens ws {return parens}

// ----- Operators -----
single_operators
  = ">="
  / ">"
  / "<="
  / "<"
  / "="
  / "contains"
  
boolean_operators
 = "and"
 / "or"
 
ws "whitespace"
  = [ \t\n\r]*

field
 = "order.totalPrice" {return "totalPrice"}
 / "order.createdAt" { return "createdAt"}
 / "order.shippingInfo.price" {return "shippingInfo"}
 / "order.employeeEmail" {return "customerEmail"}
 / "employee.email" {return "email"}
 / "employee.role" { return "roles"}


	
Value 
 = datetime
 / Decimal
 / Integer
 / Char
 
Char "string"
  = ws [a-zA-Z0-9\-\@\.\+\_]+ { return text() }
  
Decimal "decimal"
  = ws [0-9\.]+ { return parseFloat(text()); }  
  
Integer "integer"
  = ws [0-9]+ { return parseInt(text(), 10); }
  
datetime "datetime"
  =  datetime:datetime_format
    { return datetime.map(function(el){return Array.isArray(el) ? el.join('') : el;}).join(''); }

datetime_format = date_format time_mark time_format zulu_mark
time_mark = "T"
zulu_mark = "Z"  
date_format = [0-9][0-9][0-9][0-9] minus [0-9][0-9] minus [0-9][0-9]
time_format = [0-2][0-9] colon [0-5][0-9] colon [0-5][0-9] decimal_point [0-9][0-9][0-9]
colon = ":"
minus = "-"
decimal_point = "."