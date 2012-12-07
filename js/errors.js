
    // a function declare with a message
    // at a given line and character (numbers)
    function Error(message, line, character) {
        this.message = message;
        this.line = line;
        this.character = character;
    }


    function compareErrors(a,b) {
        if (a.line < b.line) {
            return -1;
        }
        if (a.line > b.line) {
            return 1;
        }
        return 0;
    }

    function displayErrors(errors) {

        $('#results').empty();

        if (errors.length === 0) {
            var noMistake = $("<p id='correct'>No mistakes found (but keep in mind this software is not able to find all mistakes yet)</p>");
            noMistake.appendTo('#results');
        } else {
            var ul = $('<ul id="errors"><ul>');
            errors.sort(compareErrors).forEach(function (error) {
                var li = $(
                    '<li> ' +
                        'line : ' + error.line +
                        ' message: ' + error.message +
                    '</li>'
                );
                li.appendTo(ul);
            });
            ul.appendTo('#results');
        }


    }

