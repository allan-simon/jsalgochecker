    /**
     *
     */
    function GrammarTokenEqualStr(str) {
        "use strict";
        this.str = str;
        this.strHTML = $('<div/>').text(str).html();
        this.check = function (token) {
            return this.str === token.str
        };
        this.notFoundError = function (token) {
            return this.strHTML +
                ' expected, but found ' + $('<div/>').text(token.str).html() +
                ' instead';
        };
        this.occurenceError = function (occurence) {
            if (occurence === '1') {
                return 'The keyword ' + this.strHTML +
                    ' should be present one time';
            } else if (occurence === '?') {
                return 'The keyword ' + this.strHTML +
                    ' should be present zero or one time';
            }

        }
    }

    /**
     *
     */
    function GrammarTokenEqualStr(str) {
        "use strict";
        this.str = str;
        this.strHTML = $('<div/>').text(str).html();
        this.check = function (token) {
            return this.str === token.str
        };
        this.notFoundError = function (token) {
            return this.strHTML +
                ' expected, but found ' + $('<div/>').text(token.str).html() +
                ' instead';
        };
        this.occurenceError = function (occurence) {
            if (occurence === '1') {
                return 'The keyword ' + this.strHTML +
                    ' should be present one time';
            } else if (occurence === '?') {
                return 'The keyword ' + this.strHTML +
                    ' should be present zero or one time';
            }

        }
    }




    /**
     *
     */
    function GrammarTokenEqualType(tokenType) {
        "use strict";
        this.tokenType = tokenType;
        this.check = function (token) {
            return this.tokenType === token.type;
        };
        this.notFoundError = function (token) {
            return token.humanType(this.tokenType) + 
                ' expected, but found ' +
                token.humanType(token.type) +
                ': ' +
                token.str +
                ' instead';
        };
        this.occurenceError = function () {
            return 'A ' + this.tokenType + ' should be present one time';
            if (occurence === '1') {
                return 'A ' + this.tokenType + ' should be present one time';
            } else if (occurence === '?') {
                return 'A ' + this.tokenType + ' should be present zero or one time';
            }


        }
    }


