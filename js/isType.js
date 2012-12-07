    /**
     *
     */

    function isSingleCharToken(token) {
        var singleCharTokens = [
            '(',
            ')',
            ':',
            ',',
            ';'
        ];
        if ($.inArray(token, singleCharTokens) === -1) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    function isOperatorToken(token) {
        var operatorToken = [
            '+',
            'DIV',
            'MOD',
            '/',
            '*',
            '-',
            '==',
            '>=',
            '!=',
            '=',
            '!',
            'AND',
            'OR',
            '<-'
        ];
        if ($.inArray(token, operatorToken) === -1) {
            return false;
        }
        return true;

    }

    /**
     *
     */
    function isTypeToken(token) {
        var typeTokens = [
            'INTEGER',
            'STRING',
            'CHARACTER',
            'REAL',
            'BOOLEAN'
        ];
        if ($.inArray(token, typeTokens) === -1) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    function isCantHaveTwiceToken(token) {
        return isStructToken(token) || isBuiltInFunctionToken(token);
    }
    
    /**
     *
     */
    function isStructToken(token) {
        var structTokens = [
            'SOFTWARE',
            'VAR',
            'CONST',
            'BEGIN',
            'END',

            'IF',
            'THEN',
            'ELSE IF',
            'ELSE',
            'END IF',
        ];
        if ($.inArray(token, structTokens) === -1) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    function isBuiltInFunctionToken(token) {
        var builtInFunctionTokens = [
            'WRITE',
            'READ',        
            'EXTRACT',
            'CONCATENATE',
            'LENGTH'
        ];
        if ($.inArray(token, builtInFunctionTokens) === -1) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    function isKeyword(token) {
        return isSingleCharToken(token) ||
               isTypeToken(token) ||
               isOperatorToken(token) ||
               isStructToken(token) ||
               isBuiltInFunctionToken(token);
    }

    /**
     *
     */
    function isValidVarName(token) {
        var re = /^[a-zA-Z_]([a-zA-Z0-9_])*$/;
        return token.match(re);
    }

    function isValidInteger(token) {
        var re = /^-?[0-9]+$/;
        return token.match(re);
    }

    function isValidReal(token) {
        var re = /^-?[0-9]+\.[0-9]+$/;
        return token.match(re);
    }

    function isValidBoolean(token) {
        var upperToken = token.toUpperCase();
        return upperToken === 'TRUE' || upperToken === 'FALSE';
    }

    function isValidChar(token) {
        if (token.length === 3) {
            return token[0] === "'" && token[1] === "'";
        }
        return false;
    } 
        
        
    /**
     *
     */
    function isValidToken(token) {
        if (isKeyword(token)) {
            return true;
        }
        if (isValidVarName(token)) {
            return true;
        }
        if (isValidBoolean(token)) {
            return true;
        } 
        if (isValidReal(token)) {
            return true;
        }
        if (isValidInteger(token)) {
            return true;
        }
        return false;
    } 


