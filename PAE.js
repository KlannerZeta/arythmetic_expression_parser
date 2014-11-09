function PAE(string){

//FUNCTIONS DECLARATIONS::

	function apply(f, array){
		return reduce(array.slice(1), f, array[0]);
	}

	function sum(init, current){
		if ( isNaN(init) && isNaN(current) ) {
			throw 'FATAL ERROR AT PLUS';
		} else if ( isNaN(init) ){
			return current;
		} else if ( isNaN(current) ) {
			return init;
		} else {
			return init + current;
		}
	}

	function subt(init, current){
		if ( isNaN(init) && isNaN(current) ) {
			throw 'FATAL ERROR AT MINUS';
		} else if ( isNaN(init) ){
			return 0 - current;
		} else if ( isNaN(current) ) {
			return init;
		} else {
			return init - current;
		}
	}

	function mul(init, current){
		if ( isNaN(init) && isNaN(current) ) {
			throw 'FATAL ERROR AT MUL';
		} else if ( isNaN(init) ){
			return current;
		} else if ( isNaN(current) ) {
			return init;
		} else {
			return init * current;
		}
	}

	function div(init, current){
		if ( isNaN(init) && isNaN(current) ) {
			throw 'FATAL ERROR AT DIV';
		} else if ( isNaN(init) ){
			return 1 / current;
		} else if ( isNaN(current) ) {
			return init;
		} else {
			return init / current;
		}
	}

	function power(init, current){
		if ( isNaN(init) && isNaN(current) ) {
			throw 'FATAL ERROR AT POWER';
		} else if ( isNaN(init) ){
			return 1;
		} else if ( isNaN(current) ) {
			return init;
		} else {
			return Math.pow(init, current);
		}
	}

	function reduce(array, f, init){
		if ( array.length == 0 ){
			return init;
		} else {
			return reduce(array.slice(1), f, f(init, array[0]));
		}
	}

	function map(f, array){
		return reduce (array, map_step(f), []);
	}

	function map_step(f){
		return function(init, current){
			return init.concat(f(current));
		}
	}

	function hasNOTEqualAmountOfParenthesis(string){
		var a = string.split('');
		var open = reduce(a, function(init, current){
			if ( current == '(' ){
				init++;
			}
			return init;
		}
		, 0);
		var close = reduce(a, function(init, current){
			if ( current == ')' ){
				init++;
			}
			return init;
		}
		, 0);
		
		if ( open == close ){
			return false;
		} else if ( open > close ) {
			return 'c' + (open - close);
		} else {
			return 'o' + (close - open);
		}
	}
		
	function addNessesaryParenthesis(string, par_var){
		var side = par_var.substr(0, 1);
		var num = parseInt(par_var.substr(1));
		
		function recursive(num, sub, result){
			if ( num == 0 ){
				return result;
			}
			result += sub;
			return recursive(--num, sub, result);
		}
		
		if ( side == 'c' ){
			var close = recursive(num, ')', '');
			return string + close;
		} else {
			var open = recursive(num, '(', '');
			return open + string;
		}
	}

	function custom_split(string, array){
		return custom_split_internal(array, string, [].concat(string.substring(0,array[0])));
	}

	function custom_split_internal(array, string, accumulator){
		if ( array.length == 1 ){
			accumulator = accumulator.concat(string.substr(array[0] + 1));
			return accumulator;
		}
		return custom_split_internal(array.slice(1), string, accumulator.concat(string.substring(array[0] + 1, array[1])));
	}

	function getNoDeepSignPositions(sign, string){
		var a = string.split('');
		
		function getNoDeepSign_traverse(array, deep, sign, result, counter){
			if ( array.length == 0 ) {
				return result;
			}
			if ( array[0] == '(' || array[0] == ')' ) {
				if ( array[0] == '(' ) {
					deep++;
				}
				if ( array[0] == ')' ) {
					deep--;
				}
			} else if ( deep == 0 && array[0] == sign ) {
				result.push(counter);
			}
			return getNoDeepSign_traverse(array.slice(1), deep, sign, result, ++counter);
		}
		
		var result = getNoDeepSign_traverse(a, 0, sign, [], 0);
		
		return (result.length > 0) ? result : false ;
	}

	function edgy(string){
		var a = string.split('');
		
		function edgy_traverse(array, deep){
			if ( array.length == 0 ) {
				return true;
			}
			if ( array[0] == '(' ) {
				deep++;
			}
			if ( array[0] == ')' ) {
				deep--;
			}
			if ( deep == 0 && array.length != 1 ) {
				return false;
			}
			return edgy_traverse(array.slice(1), deep);
		}
		
		if ( !edgy_traverse(a, 0) ){
			return false;
		}
		
		var sub = string.substr(1, string.length - 2);
		var deep_down = edgy(sub);
		return (!deep_down) ? sub : deep_down;
	}

	function recursive_positions_of_empty_par(array, counter, result){
		if ( array.length == 1 ){
			return result;
		}
		if ( array[0] == ')' && array[1] == '(' ){
			result.push(counter + 1);
		}
		return recursive_positions_of_empty_par(array.slice(1), ++counter, result);
	}
	
	function mul_insert(init, current){
		return init.substring(0, current) + '*' + init.substr(current);
	}
//END OF FUNCTIONS DECLARATIONS
	if ( string.indexOf(' ') != -1 ){
		return PAE(string.replace(/ /g, ''));
	} else if ( string.indexOf('(') != -1 || string.indexOf(')') != -1 ){
		var par_var = hasNOTEqualAmountOfParenthesis(string);
		if ( ! par_var ){
			if ( string.indexOf(')(') != -1 ){
				return PAE(reduce(recursive_positions_of_empty_par(string.split(''), 0, []), mul_insert, string));
			} else var edgy_var = edgy(string);
			if ( edgy_var ){
				return PAE(edgy_var);
			} else {
				var noDeepSigns = getNoDeepSignPositions('+', string);
				if ( noDeepSigns ){
					return apply(sum, map(PAE, custom_split(string, noDeepSigns)));
				} else noDeepSigns = getNoDeepSignPositions('-', string);
				if ( noDeepSigns ){
					return apply(subt, map(PAE, custom_split(string, noDeepSigns)));
				} else noDeepSigns = getNoDeepSignPositions('*', string);
				if ( noDeepSigns ){
					return apply(mul, map(PAE, custom_split(string, noDeepSigns)));
				} else noDeepSigns = getNoDeepSignPositions('/', string);
				if ( noDeepSigns ){
					return apply(div, map(PAE, custom_split(string, noDeepSigns)));
				} else noDeepSigns = getNoDeepSignPositions('^', string);
				if ( noDeepSigns ) {
					return apply(power, map(PAE, custom_split(string, noDeepSigns)));
				} else if ( string.substring(0, 4) == 'sqrt' ) {
					return Math.sqrt(PAE(string.substr(5, string.length - 6)));
				} else if ( string.substring(0, 3) == 'sin' ) {
					return Math.sin(PAE(string.substr(4, string.length - 5)));
				} else if ( string.substring(0, 3) == 'cos' ) {
					return Math.cos(PAE(string.substr(4, string.length - 5)));
				} else {
					return NaN;
				}
			}
		} else {
			return PAE(addNessesaryParenthesis(string, par_var));
		}
	} else if ( string.indexOf('+') != -1 ) {
		return apply(sum, map(PAE, string.split('+')));
	} else if ( string.indexOf('-') != -1 ) {
		return apply(subt, map(PAE, string.split('-')));
	} else if ( string.indexOf('*') != -1 ) {
		return apply(mul, map(PAE, string.split('*')));
	} else if ( string.indexOf('/') != -1 ) {
		return apply(div, map(PAE, string.split('/')));
	} else if ( string.indexOf('^') != -1 ) {
		return apply(power, map(PAE, string.split('^')));
	} else if ( /^[-+]?[0-9]*\.?[0-9]+$/.test(string) ) {
		return parseFloat(string);
	} else if ( string == 'e' || string == 'E' ) {
		return Math.E;
	} else if ( string == 'pi' || string == 'PI' || string == 'Pi' || string == 'pI' ) {
		return Math.PI;
	} else {
		return NaN;
	}
}