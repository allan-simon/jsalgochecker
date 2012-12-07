    function Context() {
        this.indentation = 4; // by default a tabulation
        this.indentLevel = 0;
        this.tokensStack = [];
        this.inside = 'ALL';
        this.ast = {};

        this.debugTokens = function() {
            var tokensStr = [];
            this.tokensStack.forEach(function(token){
                tokensStr.push(token.str);
            });
            console.log(tokensStr);
        }
        /*
        this.checkTokens = function() {
            this.tokensStack.forEach(function(token) {
                function goInBlock
            });
        }
        */
    }


