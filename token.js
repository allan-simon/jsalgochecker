    //

    // name is the string representation of that token
    // quantity can be '1' '?' '*' '+' 
    // starter is the token that we should have to have this token
    //    if it start itself a sequence, then starter is  ''
    // type can be 'opening' 'middle' or 'closing'
    function Token(name,quantity,type = 'middle') {
        this.name = name;
        this.quantity;
        this.starter = starter;
        this.type = type;
    };
    /*
    var tokens = {
        'SOFTWARE' : new Token ('SOFTWARE', '+', '', 'opening'),
        'CONST' : new Token ('CONST', '?', 'SOFTWARE' ),
        'VAR' : new Token ('VAR', '1', 'SOFTWARE'),
        'BEGIN' : new Token ('BEGIN', '1', 'SOFTWARE'), 
        'END' : new Token ('END', '1', 'SOFTWARE', 'closing')
    };

    var blocks = {
        'ALL' : [
            {
                'SOFTWARE_BLOCK' : '*'
            }
        ],
        'SOFTWARE_BLOCK' : [
            {
                'SOFTWARE_NAME' : '1',
                'CONST_BLOCK' : '?',
                'VAR_BLOCK' : '1',
                'BEGIN_BLOCK' : '1',
                'END_BLOCK' : '1'
            }
        ],
        'SOFTWARE_NAME' : [
            {
                'SOFTWARE' : '1',
                //'NAME' :  '+'
            }
        ],
        'CONST_BLOCK' : [
            {
                'CONST' : '1'
            }
        ],
        'VAR_BLOCK' : [
            {
                'VAR' : '1'
            }
        ],
        'BEGIN_BLOCK' : [
            {
                'BEGIN' : '1'
            }
        ]
    };

    */
