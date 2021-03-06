window.onload = function () {
    "use strict";

    // will be used to store all the erros
    var context = new Context();
    var errors = [];

    /**
     *check if the character is a tab or space
     */
    function isSpaceOrTab(character) {
        return character === ' ' || character === '\t';

    }


    // check if the line is not indented with a soup of tab and
    // spaces
    function checkNotMixingTabSpace(line, lineNbr) {
        if (line.size === 0) {
            return true;
        }
        var firstChar = line[0];

        if (!isSpaceOrTab(firstChar)) {
            return true;
        }

        line.split('').forEach(function (character, charNbr) {
            if (isSpaceOrTab(character)) {
                if (character !== firstChar) {
                    var tmpError = new Error(
                        'Mixing tab and spaces',
                        lineNbr,
                        charNbr
                    );
                    errors.push(tmpError);
                    return false;
                }
            }
        });
        return true;
    }

    // check the keyword on a line
    //   1 - if they're correctly written (i.e in upper case)
    //   2 - if we've one keyword by line, (i.e   no   IF () THEN ELSE
    //       in one line
    function checkUpperCase(token) {
        if (isKeyword(token.str)) {
            // check if correctly written
            if (token.str !== token.userStr) {
                var tmperror = new Error(
                    token.userStr + ' should be written ' + token.str,
                    token.lineNbr,
                    0
                );
                errors.push(tmperror);
            }
        }
    }

    /**
     *
     */
    function checkTokensInLine(tokens, lineNbr) {

        var prevKeywordToken = null;
        tokens.forEach(function (token) {
            checkUpperCase(token);
            if (token.isCantHaveTwice()) {
                // check if no keyword before
                if (prevKeywordToken !== null) {
                     var tmpError = new Error(
                        token.str + ' should be written on a new line',
                        lineNbr,
                        0
                    );
                    errors.push(tmpError);
                }
                // we note that we've already found a keyword 
                prevKeywordToken = token;
            }

        });
    }


    /**
     *do all the check that are context free 
     */
    function checkLine(line, lineNbr) {

        checkNotMixingTabSpace(line, lineNbr);
        // check that token are 
        //  correctly written (upper case etc.)
        //check no double space
        //check no trailing space
    }

    function getIndentation(line) {
        var blankCharacter = 0;
        var indendationPartFinished = false 
        line.split('').forEach(function (character) {
            if (indendationPartFinished) {
                return;
            }
            if (isSpaceOrTab(character)) {
                blankCharacter++;
            } else {
                indendationPartFinished = true;
            }
        });
        return blankCharacter;
    }

    function checkIndentation(tokens, lineIndent, lineNbr) {
        //
        if (tokens.length === 0) {
            return;
        }
        // the current line is affected only by the first token
        // while the next line is affected by 'nbr of opening' - 'nbr of closing'
        var tmp = 0;
        tokens.forEach(function (token) {
            tmp  += token.indentationChange()[1]; 
        });
        var change = [
            tokens[0].indentationChange()[0],
            tmp
        ];

        var supposedIndent = (context.indentLevel + change[0])*context.indentation;
        if (supposedIndent !== lineIndent) {
            var tmpError = new Error(
                "The line is suppose to start at position " + supposedIndent +
                " not " + lineIndent,
                lineNbr,
                supposedIndent
            );
            errors.push(tmpError);
        }
        context.indentLevel += change[1]; 
    } 

    /**
     *
     */
    function analyzeLine(line, lineNbr) {
        checkLine(line, lineNbr);

        var newTokens = tokenize(line, lineNbr);
        var lineIndent = getIndentation(line);

        checkTokensInLine(newTokens, lineNbr);
        checkIndentation(
            newTokens,
            lineIndent,
            lineNbr
        );

        context.tokensStack = context.tokensStack.concat(
            newTokens
        );
    }


    /**
     *
     */
    function checkPresence(
        tokens,
        presenceChecker,
        occurence,
        forbiddenTokens,
        endTokens,
        blockCallBack
    ) {

        var endFound = false;
        var foundCount = 0; 
        var tokenConsumed = 0;
        var firstNotExpectedToken = 1;
        tokens.forEach(function (token) {
            if (endFound) {
                return;
            }
            if (presenceChecker.check(token)) {
                foundCount += 1;
                // we ignore the first token
                // as we've just analyze it
                blockCallBack(tokens.slice(1))
            }

            if (foundCount > 0) {
                if ($.inArray(token.str, endTokens) !== -1) {
                    endFound = true;
                } else if ($.inArray(token.str, forbiddenTokens) !== -1) {
                    var tmpError = new Error(
                        'The keyword ' + token.str + ' is not supposed to be there' ,
                        token.lineNbr,
                        0
                    );
                    errors.push(tmpError);
                    tokenConsumed += 1;
                    if (firstNotExpectedToken === 0) {
                        firstNotExpectedToken = tokenConsumed - 1;
                    }

                } else {
                    tokenConsumed += 1;
                }
            } else if ( foundCount === 0 ) {
                endFound = true;
                if (occurence === '1' ) {
                    var tmpError = new Error(
                        presenceChecker.notFoundError(token),
                        token.lineNbr,
                        0
                    );
                    errors.push(tmpError);
                }

            }            
        });

        // after iterating we check how many we've found
        if (
            (occurence === '1' && foundCount !== 1) ||
            (occurence === '?' && foundCount > 1)
        ) {
            var tmpError = new Error(
                presenceChecker.occurenceError(occurence),
                9999,
                0
            );
            errors.push(tmpError);
            return 0;
        } 

        if (!endFound) {
            return firstNotExpectedToken;
        }
        return tokenConsumed;
    
    }



    function checkVarDeclaration(tokens) {
        var endPosition = 0;
        endPosition += checkPresence(
            tokens,
            new GrammarTokenEqualType('VARIABLE'),
            '1',
            ['IF','ELSE','BEGIN'],
            ['<-',':'],
            function(tokens){}
        );
        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr('<-'),
            '?',
            ['IF','ELSE','BEGIN','VAR'],
            [':'],
            function(tokens){}
        );

        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr(':'),
            '1',
            ['IF','ELSE','BEGIN','VAR'],
            ['INTEGER','STRING','CHARACTER','REAL','BOOLEAN'],
            function(tokens){}
        );

        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualType('TYPE'),
            '1',
            ['IF','ELSE','BEGIN','VAR'],
            ['INTEGER','STRING','CHARACTER','REAL','BOOLEAN'],
            function(tokens){}
        );


        
    }


    function checkBeginBlock(tokens) {
        var endPosition = 0;
        endPosition += checkPresence(
            tokens,
            new GrammarTokenEqualStr('SOFTWARE'),
            '1',
            ['IF','ELSE','BEGIN'],
            ['CONST','VAR','BEGIN'],
            function(tokens){}
        );


    }

    function checkGrammar(tokens) {
        var endPosition = 0;
        endPosition += checkPresence(
            tokens,
            new GrammarTokenEqualStr('SOFTWARE'),
            '1',
            ['IF','ELSE','BEGIN'],
            ['CONST','VAR','BEGIN'],
            function(tokens){}
        );

        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr('CONST'),
            '?',
            ['IF','ELSE','END IF','THEN'],
            ['BEGIN','VAR'],
            checkVarDeclaration
        )
        
        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr('VAR'),
            '1',
            ['IF','ELSE','END IF','THEN'],
            ['BEGIN'],
            checkVarDeclaration
        )
        
        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr('BEGIN'),
            '1',
            ['VAR'],
            ['END'],
            function(tokens){}
        )

        endPosition += checkPresence(
            tokens.slice(endPosition),
            new GrammarTokenEqualStr('END'),
            '1',
            ['SOFTWARE'],
            ['END'],
            function(tokens){}
        )

    }

    document.getElementById('check').onclick = function () {
        // we empty it
        context = new Context();
        errors = [];
        var textArray = $("#foobar").val().split('\n');
        textArray.forEach(analyzeLine);
        //context.debugTokens();
        checkGrammar(context.tokensStack);
        displayErrors(errors);
    };

};


