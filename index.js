//Current line
var CurrentId = undefined;

var inputValues = [];
const inputPrompts = [
  "Type 'y' to get another card, type 'n' to pass: ",
  "Do you want to play a game of Blackjack? Type 'y' or 'n': ",
];

const logo = `
.------.            _     _            _    _            _    
|A_  _ |.          | |   | |          | |  (_)          | |   
|( \\/ ).-----.     | |__ | | __ _  ___| | ___  __ _  ___| | __
| \\  /|K /\\  |     | '_ \\| |/ _' |/ __| |/ / |/ _' |/ __| |/ /
|  \\/ | /  \\ |     | |_) | | (_| | (__|   <| | (_| | (__|   < 
'-----| \\  / |     |_.__/|_|\\__,_|\\___|_|\\_\\ |\\__,_|\\___|_|\\_\\
      |  \\/ K|                            _/ |                
      '------'                           |__/           
`;

//Click Run
$(document).ready(function () {
  $("#run-button").click(function () {
    inputValues = [];
    $("#Content").empty();

    NewLine("Do you want to play a game of Blackjack? Type 'y' or 'n': ", true);
  });
});

function newRound() {
  user_score = calculate_score(user_cards);
  computer_score = calculate_score(computer_cards);

  NewLine(`    Your cards: [${user_cards}], current score: ${user_score}`);
  NewLine(`    Computer's first card: ${computer_cards[0]}`);

  console.log(user_score, computer_score);

  if (user_score == 0 || computer_score == 0 || user_score > 21) {
    console.log("game over");
    game_is_over = true;
  } else {
    NewLine(inputPrompts[0], true);
  }
}

function restart() {
  $("#Content").empty();
  inputValues = ["y"];
  user_cards = [];
  computer_cards = [];
  game_is_over = false;
  NewLine(logo, false);
  for (let i = 0; i < 2; i++) {
    user_cards.push(deal_card());
    computer_cards.push(deal_card());
  }

  newRound();
}

let user_cards = [];
let computer_cards = [];
let game_is_over = true;
let user_score;
let computer_score;

//Enter button
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  if (x === 13 || x == 13) {
    var consoleLine = $("#" + CurrentId + " input").val();
    inputValues.push({ id: CurrentId, val: consoleLine });

    if (inputValues[inputValues.length - 1].val == "y" && game_is_over) {
      console.log("0 called");
      restart();
    } else if (inputValues[inputValues.length - 1].val == "n" && game_is_over) {
      $(".console-carrot").remove();
      return;
    }

    if (
      inputValues[inputValues.length - 1].val == "y" &&
      inputValues.length > 1
    ) {
      console.log("-1 called");

      user_cards.push(deal_card());
      newRound();
    } else if (
      inputValues[inputValues.length - 1].val == "n" &&
      inputValues.length > 1
    ) {
      game_is_over = true;
      while (computer_score != 0 && computer_score < 17) {
        computer_cards.push(deal_card());
        computer_score = calculate_score(computer_cards);
      }
    }

    if (game_is_over) {
      NewLine(
        `   Your final hand: [${user_cards}], final score: ${user_score}`,
        false
      );
      NewLine(
        `   Computer's final hand: [${computer_cards}], final score: ${computer_score}`,
        false
      );
      NewLine(compare(user_score, computer_score), false);

      NewLine(
        "Do you want to play a game of Blackjack? Type 'y' or 'n': ",
        true
      );
    }

    // $(".console-carrot").remove();
    // if (biddingShouldContinue) {
    //   NewLine(inputPrompts[inputValues.length - 1], true);
    // }
  }
});
$(document).on("keydown", function (e) {
  var x = event.which || event.keyCode;
  var line = $("#" + CurrentId + " input");
  var length = line.val().length;
  if (x != 8) {
    line.attr("size", 1 + length);
  } else {
    line.attr("size", length * 0.95);
  }
  if (length === 0) {
    $("#" + CurrentId + " input").attr("size", "1");
  }
});
$(document).on("click", function (e) {
  $("#" + CurrentId + " input").focus();
});

//New line
function NewLine(text, isPrompt) {
  $(".console-carrot").remove();
  if (CurrentId !== undefined) {
    $("#" + CurrentId + " input").prop("disabled", true);
  }
  CurrentId = "consoleInput-" + GenerateId();

  if (isPrompt) {
    $("#Content").append(
      //One Line
      '<div id="' +
        CurrentId +
        '">' +
        text +
        '<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" class="terminal-input" /><div class="console-carrot"></div></div>'
    );
    $("#" + CurrentId + " input").focus();
    $("#" + CurrentId + " input").attr("size", "1");
  } else {
    $("#Content").append('<div id="' + CurrentId + '">' + text + "</div>");
  }
  document.getElementById(CurrentId).scrollIntoView();
}

function deal_card() {
  const cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  const card = cards[Math.floor(Math.random() * cards.length)];
  return card;
}

function calculate_score(cards) {
  if (
    cards.reduce((partialSum, a) => partialSum + a, 0) == 21 &&
    cards.length == 2
  ) {
    return 0;
  }
  if (
    cards.includes(11) &&
    cards.reduce((partialSum, a) => partialSum + a, 0) > 21
  ) {
    cards.splice(cards.indexOf(11), 1);
    cards.push(1);
  }
  return cards.reduce((partialSum, a) => partialSum + a, 0);
}

function compare(user_score, computer_score) {
  if (user_score > 21 && computer_score > 21) {
    return "You went over. You lose 😤";
  }

  if (user_score == computer_score) {
    return "Draw 🙃";
  } else if (computer_score == 0) {
    return "Lose, opponent has Blackjack 😱";
  } else if (user_score == 0) {
    return "Win with a Blackjack 😎";
  } else if (user_score > 21) {
    return "You went over. You lose 😭";
  } else if (computer_score > 21) {
    return "Opponent went over. You win 😁";
  } else if (user_score > computer_score) {
    return "You win 😃";
  } else {
    return "You lose 😤";
  }
}

function GenerateId() {
  return Math.random().toString(16).slice(2);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
