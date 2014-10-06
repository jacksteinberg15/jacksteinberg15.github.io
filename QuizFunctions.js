    /*
    Javascript and Jquery code for the Quiz app written:
    Broken into functions that handle the next button,
    The back button,
    The submit button,
    The Pie Chart,
    and the initial set up
    
    This project relys heavily on jQuery access and 
    modification of HTML Elements in my QuizMain.html
    */

    //Vars for the whole document declared up here
    var qcount = 1;
    var checkeds = ["", "", "", "", "", "", "", "", "", ""];
    var text = '{"name":"John Johnson","street":"Oslo West 16","phone":"555 1234567"}';
    var obj = JSON.parse(text);

    //jQuery document ready
    $(document).ready(function () {

        //Hide quiz things and buttons
        $('#quizform').hide();
        $('#backButton').hide();
        $('#nextButton').hide();
        $('#submitButton').hide();
        $('#resultsfrm').hide();
        $('#Swag').hide();

        //Pie Chart sample shenanigans
        var numright = 4;

        var pieChart = new PieChart("piechart", {
            includeLabels: true,
            data: [(numright / 10) * 360, ((10 - numright) / 10) * 360],
            labels: ["" + numright + "0%", "" + (10 - numright) + "0%"],
            colors: [
                    ["#00FF00", "#00FF00"],
                    ["#FF0000", "#FF0000"]
                ]
        });


        $.ajaxSetup({
            async: false
        });

        //Snag the JSON 
        $.getJSON("QuestionSheet.json", function (response) {
            obj = response;
        });

        //pieChart.draw();

        $('#piechart').hide();
    });

    //JSON text

    /*
    var text = '{"questions":[' +
        '{ "q":"1). What is the speed of light in a vacuum?" , "ca":"1.2x10^7", "cb":"2.5x10^8", "cc":"3.0x10^8", "cd":"3.0x10^7",' +
        '"a":"3.0x10^8" }, ' +
        '{ "q":"2). F = ___" , "ca":"c/v", "cb":"mv", "cc":"delta-y/delta-x", "cd":"ma", "a":"ma" },' +
        '{ "q":"3). What is Newtons Third Law?" , "ca":"V = IR" , "cb":"For every action there is an equal and opposite reaction" , "cc":"The speed of light in a vacuum is constant" , "cd":"Cats can be both dead and alive" , "a":"For every action there is an equal and opposite reaction" },' +
        '{ "q":"4). The acceleration due to gravity on Earth is approximately ___ m/s^2" , "ca":"9.8", "cb":"3.0", "cc":"144.0", "cd":"96.0", ' +
        '"a":"9.8"}, ' +
        '{ "q":"5). How many types of quarks are there?" , "ca":"3", "cb":"6", "cc":"9", "cd":"12", "a":"6" },' +
        '{ "q":"6). What units measure force?" , "ca":"Pints", "cb":"GeV", "cc":"Pascals", "cd":"Newtons", "a":"Newtons" },' +
        '{ "q":"7). The first law of thermodynamics is a restatement of" , "ca":"Gay-Lussacs Law", "cb":"Entropy", "cc":"Enthalpy",' +
        ' "cd":"Avogadro\'s Hypothesis", "a":"Entropy" },' +
        '{ "q":"8). Water boils at what temperature?" , "ca":"100f", "cb":"150f", "cc":"0c", "cd":"100c", "a":"100c" },' +
        '{ "q":"9). Electric resistance is measured in which unit?" , "ca":"Volts", "cb":"Ohms", "cc":"Amperes", "cd":"Avogadros", "a":"Ohms" },' +
        '{ "q":"10). Which particle does NOT carry a force?" , "ca":"Neutron", "cb":"Photon", "cc":"Gluon", "cd":"W boson", "a":"Neutron"' +
        '}]}';
        
        */

    //JSON actual
    //var obj = JSON.parse(text);

    //Function to step forward a question
    function stepForward() {
        if (checkButtons()) {

            $('#question').html(obj.questions[qcount - 1].q).fadeOut(800);
            $('#ca1').html(obj.questions[qcount - 1].c[0]["ca"]).fadeOut(800);
            $('#cb1').html(obj.questions[qcount - 1].c[1]["cb"]).fadeOut(800);
            $('#cc1').html(obj.questions[qcount - 1].c[2]["cc"]).fadeOut(800);
            $('#cd1').html(obj.questions[qcount - 1].c[3]["cd"]).fadeOut(800);

            if (qcount < 10)
                qcount += 1;
            //$('#Swag').html(qcount);
            if (qcount > 9) {
                $('#nextButton').hide();
                $('#submitButton').show();
            }
            if (qcount > 1) {
                $('#backButton').show();
            }
            $('#question').html(obj.questions[qcount - 1].q).fadeIn(800);
            $('#ca1').hide().html(obj.questions[qcount - 1].c[0]["ca"]).fadeIn(800);
            $('#cb1').hide().html(obj.questions[qcount - 1].c[1]["cb"]).fadeIn(800);
            $('#cc1').hide().html(obj.questions[qcount - 1].c[2]["cc"]).fadeIn(800);
            $('#cd1').hide().html(obj.questions[qcount - 1].c[3]["cd"]).fadeIn(800);

            setButtons();
        }
    }

    //Function to step backward a question
    function stepBack() {
        //if (checkButtons()) {
        $('#question').html(obj.questions[qcount - 1].q).fadeOut(800);
        $('#ca1').html(obj.questions[qcount - 1].c[0]["ca"]).fadeOut(800);
        $('#cb1').html(obj.questions[qcount - 1].c[1]["cb"]).fadeOut(800);
        $('#cc1').html(obj.questions[qcount - 1].c[2]["cc"]).fadeOut(800);
        $('#cd1').html(obj.questions[qcount - 1].c[3]["cd"]).fadeOut(800);
        if (qcount > 1)
            qcount -= 1;
        //$('#Swag').html(qcount);
        if (qcount < 2) {
            $('#backButton').hide();
        }
        if (qcount < 10) {
            $('#nextButton').show();
            $('#submitButton').hide();
        }
        $('#question').html(obj.questions[qcount - 1].q).fadeIn(800);
        $('#ca1').hide().html(obj.questions[qcount - 1].c[0]["ca"]).fadeIn(800);
        $('#cb1').hide().html(obj.questions[qcount - 1].c[1]["cb"]).fadeIn(800);
        $('#cc1').hide().html(obj.questions[qcount - 1].c[2]["cc"]).fadeIn(800);
        $('#cd1').hide().html(obj.questions[qcount - 1].c[3]["cd"]).fadeIn(800);

        setButtons();
        //}
    }

    //Check the buttons and their pressed states
    function checkButtons() {
        //Whenever button pressed check which radio button is pressed,
        //store it, then set all the buttons to which one is checked for
        //the next / prev question
        if ($('#ca').prop('checked')) {
            //$('#Swag').html("This returns a bool m80");
            checkeds[qcount - 1] = 'c[0]["ca"]';
            return true;
        } else if ($('#cb').prop('checked')) {
            //$('#Swag').html("This returns a bool m808");
            checkeds[qcount - 1] = 'c[1]["cb"]';
            return true;
        } else if ($('#cc').prop('checked')) {
            //$('#Swag').html("This returns a bool m8080");
            checkeds[qcount - 1] = 'c[2]["cc"]';
            return true;
        } else if ($('#cd').prop('checked')) {
            //$('#Swag').html("This returns a bool m80808");
            checkeds[qcount - 1] = 'c[3]["cd"]';
            return true;
        } else {
            return false;
        }
    }

    //Set buttons to checked if necesary
    function setButtons() {
        if (checkeds[qcount - 1].length > 1) {
            $('#' + checkeds[qcount - 1]).prop('checked', true);
            //$('#Swag').html("Swagged to " + checkeds[qcount - 1]);
        } else {
            $('#ca').prop('checked', false);
            $('#cb').prop('checked', false);
            $('#cc').prop('checked', false);
            $('#cd').prop('checked', false);
        }
    }

    //function to submit a quiz
    function subQuiz() {
        if (checkButtons()) {
            var numright = 0;
            //hide other unnecesary frames, and show results
            $('#quizform').hide();
            $('#backButton').hide();
            $('#submitButton').hide();
            $('#resultsfrm').show();
            $('#piechart').show();
            //$('#Swag').html(obj.questions[1]['cd'] === obj.questions[1]['a']);

            //remember to deal with color
            for (i = 0; i < 11; i++) {
                if (obj.questions[i]['' + checkeds[i]].localeCompare(obj.questions[i]['a']) == 0) {
                    $('#r' + (i + 1)).html('<p style=\'color: #00FF00;\'>' + 'Correct' + '</p>');
                    numright += 1;
                } else {
                    $('#r' + (i + 1)).html('<p style=\'color: #FF0000;\'>' + 'Incorrect' + '</p>');
                }

                if (numright < 7)
                    $('#ratio').html('<h1 style=\'color: #FF0000;\'>' + numright + '/10</h1>');
                else if (numright >= 7)
                    $('#ratio').html('<h1 style=\'color: #00FF00;\'>' + numright + '/10</h1>');
                drawPC(numright);
            }

            //Pie Chart Shenanigans
            /*
            var pieChart = new PieChart("piechart", {
                includeLabels: true,
                data: [(numright / 10) * 360, ((10 - numright) / 10) * 360],
                labels: ["" + numright + "%", "" + (10 - numright) + "%"],
                colors: [
                    ["#00FF00", "#00FF00"],
                    ["#FF0000", "#FF0000"]
                ]
            });

            pieChart.draw();
            */
        }
    }

    //Draw the pie chart function
    function drawPC(numright) {

        //$('#name_display').html(numright);

        var numsright = numright;

        var pieChart = new PieChart("piechart", {
            includeLabels: true,
            data: [(numsright / 10) * 360, ((10 - numsright) / 10) * 360],
            labels: ["" + numsright + "0%", "" + (10 - numsright) + "0%"],
            colors: [
                    ["#00FF00", "#00FF00"],
                    ["#FF0000", "#FF0000"]
                ]
        });

        pieChart.draw();


    }

    //To snag the name and hide its form
    //Basically an initial setup for the forms
    function subName() {
        var firstName = document.getElementById("fn");
        if (!(firstName.contains("\n"))) {
            //var lastName = document.getElementById("ln");
            var text = "" + firstName.value + "" + /* lastName.value +*/ "'s Quiz";
            var pureName = "" + firstName.value //+ " " + lastName.value + "";
            document.getElementById("Name").innerHTML = text;
            //Hide the name things and show the Buttons
            $('#name_submission').hide();
            $('#quizform').show();
            //$('#backButton').show();
            $('#nextButton').show();
            //$('#Swag').html(obj.questions[0].cc);
            $('#question').html(obj.questions[0].q);
            $('#ca1').html(obj.questions[0].c[0]["ca"]);
            $('#cb1').html(obj.questions[0].c[1]["cb"]);
            $('#cc1').html(obj.questions[0].c[2]["cc"]);
            $('#cd1').html(obj.questions[0].c[3]["cd"]);
        }
    }