// game play
// wait for document to load
$(document).ready(function() {
  // render start screen
  renderStartScreen();
  // start game
  startGame();
});

// variables
var questionSet = [];
var totalQuestionSet = [];
var questionCounter = 0;
var currentQuestion;
var correctAnswers = 0;
var yourResponse = '';
var responseIsCorrect = false;
var timeRemaining;

function startGame() {
  $('.start-game').on('click', function() {
    // render dom
    renderDom();
    // play the game
    playGame();
  });
}

function playGame() {
  // set the question set
  setQuestionSet();
  // print question text
  printQuestion();
  // check response
  checkCorrectResponse();
  // listen for response
  showResultsUponResponse();
  // restart game
  restartGame();
}

function setQuestionSet() {
  for (var i = 0; i < 5;) {
    // get a random number between 0 and 19
    var index = Math.floor(Math.random() * 19);
    // get the question at that index of the objects array
    var question = trivia.questions[index];
    // if the questionSet does not include this question
    if (questionSet.indexOf(question) === -1) {
      // add the question to the questionSet
      questionSet.push(question);
      // increment the counter -- here because I only want it to increment
      // if the questionSet got a new question
      i++;
    }
  }
}

function setCurrentQuestion() {
  currentQuestion = questionSet[questionCounter];
}

function printQuestion() {
  // show question area
  $('.question').removeClass('hidden');
  // hide results area
  if (!$('.result').hasClass('hidden')) {
    $('.result').addClass('hidden');
  }
  // print starting timer
  $('#timer').text('Time remaining: 30');
  // set timer to 30 seconds
  timeRemaining = 30;
  // start timer
  startTimer();
  // set question
  setCurrentQuestion();
  // print the question in the label
  $('label').text(currentQuestion.question);
  // print the responses in the buttons
  for (var i = 0; i < 4; i++) {
    $('#response' + i).text(currentQuestion.answers[i]);
  }
  // increment question counter
  questionCounter++;
}

function checkCorrectResponse() {
  $('.response').on('click', function() {
    yourResponse = $(this).text();
    if (yourResponse === currentQuestion.correctAnswer) {
      correctAnswers++;
      responseIsCorrect = true;
    } else {
      responseIsCorrect = false;
    }
  });
}

function showResultsUponResponse() {
  $('.response').on('click', function() {
    // print results
    printResults();
  });
}

function printResults() {
  // stop timer
  stopTimer();
  // hide question area
  $('.question').addClass('hidden');
  // show result area
  $('.result').removeClass('hidden');
  // print question
  $('strong').text(currentQuestion.question);
  // give feedback on response
  if (responseIsCorrect === true) {
    $('.result-message').html('<h3 class="text-success">Correct!</h3>');
  } else if (timeRemaining <= 0) {
    $('.result-message').html('<h3 class="text-warning">Times up!</h3>');
  } else {
    $('.result-message').html('<h3 class="text-danger">Nope!</h3>');
  }
  // reset responseIsCorrect to false
  responseIsCorrect = false;
  // print user response
  $('.your-response').html('Your response was: ' + yourResponse);
  // reset your response
  yourResponse = '';
  // print correct response
  $('.correct-answer').html(
    'The correct response is: ' + currentQuestion.correctAnswer
  );
}

function startTimer() {
  // start the timer
  timer = setInterval(decrement, 1000);
}

function decrement() {
  // subtract one from the time remaining
  timeRemaining--;
  // print the time remaining to the screen
  $('#timer').html('Time remaining: ' + timeRemaining);
  if (timeRemaining <= 0) {
    printResults();
  }
}

function stopTimer() {
  clearInterval(timer);
  // after waiting for 5 seconds print new question
  waitThenPrintNewQuestion();
}

function waitThenPrintNewQuestion() {
  if (questionCounter >= questionSet.length) {
    setTimeout(checkEndOfGame, 3 * 1000);
  } else {
    setTimeout(printQuestion, 3 * 1000);
  }
}

function checkEndOfGame() {
  // hide result
  $('.result').addClass('hidden');
  // show game result
  $('.game-result').removeClass('hidden');
  // blank out timer
  $('#timer').html('');
  // print number correct
  $('.number-correct').text('You got ' + correctAnswers + ' out of ' +
                            questionSet.length + ' questions correct');
  // show restart button
  $('.restart').removeClass('hidden');
}

function restartGame() {
  $('.restart').on('click', function() {
    // reset variables
    reset();
    // hide game result area
    $('.game-result').addClass('hidden');
    // restart button
    $('.restart').addClass('hidden');
    // set the question set
    setQuestionSet();
    // print the question
    printQuestion();
  });
}

function reset() {
  questionCounter = 0;
  correctAnswers = 0;
  questionSet = [];
}