   //
    function Token(str,lineNbr) {
        "use strict";
        
        function tokenType(str) {
            if (isTypeToken(str)) {
                return "TYPE";
            } 
            if (isStructToken(str)) {
                return "STRUCT";
            }
            if (isBuiltInFunctionToken(str)) {
                return "BUILTIN";
            }
            if (isValidBoolean(str)) {
                return "BOOLEAN_VAL";
            }
            if (isValidVarName(str)) {
                return "VARIABLE";
            }
            if (isValidInteger(str)) {
                return "INTEGER_VAL" ;
            }
            if (isOperatorToken(str)) {
                return "OPERATOR";
            }
            if (isValidChar(str)) {
                return "CHARACTER_VAL";
            }
            if (isValidReal(str)) {
                return "REAL_VAL";
            }
            return "OTHER";
        };

        this.indentationChange = function () {
            var increase = ["VAR","THEN","("];
            var decreaseIncrease = ["BEGIN","ELSE"];
            var decrease = ["ELSE IF","END IF","END",")"];
             
            // the first number is used to change the indentation
            // of the current line
            // the second number to change the indentation of the next line
            // compared to the indentation of the previous one 
            if ($.inArray(this.str,increase) !== -1) {
                return [0,1];
            }
            
            if ($.inArray(this.str,decreaseIncrease) !== -1) {
                return [-1,0];
            }
            if ($.inArray(this.str,decrease) !== -1) {
                return [-1,-1];
            }
            return [0,0];
        };


        this.type = tokenType(str);
        this.userStr = str;
        this.str = str.toUpperCase();
        this.lineNbr = lineNbr;
        this.isCantHaveTwice =  function () {
            var answer = this.type === 'STRUCT' || this.type === 'BUILTIN';
            return answer;
                
        }
    }
    /**
     *
     */
    function mergeToken(toMergeTokens) {
        var tokensStr = []
        var previousTokensConsumedTwo = false;
        var mergeWithNextIfPossible = function (tmpToken, nbr) {
            // if we've used this token to merge it with the
            // previous one, we directly jump to the next one
            if (previousTokensConsumedTwo) {
                previousTokensConsumedTwo = false;
                return;
            };

            // if at the end there's no need 
            // to try to merge with the next one ;-)
            if (nbr === toMergeTokens.length - 1) {
                tokensStr.push(tmpToken);
                return;
            }

            // as some token like END IF can actually be seen
            // as two tokens, we need to merge them
            var upperTmpToken = tmpToken.toUpperCase();
            var nextTmpToken = toMergeTokens[nbr+1];
            var upperNextToken = nextTmpToken.toUpperCase();

            var mergedToken = tmpToken + ' ' + nextTmpToken;
            var upperMergedToken = mergedToken.toUpperCase();
            if (isKeyword(upperMergedToken)) {

                tokensStr.push(mergedToken);
                previousTokensConsumedTwo = true;
                return;
            } 
            tokensStr.push(tmpToken);
        }

        toMergeTokens.forEach(mergeWithNextIfPossible); 

        return tokensStr;

    }

    /**
     *
     */

    /**
     *
     */
    function splitToken(token) {
        tokens = [];
        tmpToken = '';
        token.split('').forEach(function(character){

            if (isSingleCharToken(character)) {
                if (tmpToken !== '') {
                    tokens.push(tmpToken);
                }
                tokens.push(character);   
                tmpToken = '';
                return;
            }
            if (!isValidToken(tmpToken+character)) {
                if (tmpToken !== '') {
                    tokens.push(tmpToken);
                    tmpToken = '';
                }
            }
            tmpToken += character;
        });

        // if there's a remaining token, push it 
        if (tmpToken !== '') {
            tokens.push(tmpToken);
        } 
        return tokens;

    }

    /**
     *
     */
    function splitTokens(toSplitTokens) {
        var tokens = [];
        toSplitTokens.forEach(function (tmpToken, nbr) {
            tokens = tokens.concat(
                splitToken(tmpToken)
            );
        });
        return tokens;
    }


    /**
     *
     */
    function analyzeTokensString(tokensStr,lineNbr) {
        var tokens = [];
        tokensStr.forEach(function (tokenStr) {
            tokens.push(new Token(tokenStr,lineNbr));
        }); 
        return tokens;
    }

    /**
     *
     */
    function tokenize(line, lineNbr) {
        var workingLine = $.trim(line);
        if (workingLine === '') {
            return [];
        }
        workingLine = workingLine.replace(/ +(?= )/g, '');
        var tokensStr = workingLine.split(' ');
        tokensStr = splitTokens(tokensStr);
        tokensStr = mergeToken(tokensStr);
        var tokens = analyzeTokensString(tokensStr,lineNbr);
        return tokens;
    }
