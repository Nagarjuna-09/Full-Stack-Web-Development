var colors = ['green', 'red', 'yellow', 'blue'];
var game_pattern = [];
var user_clicked_pattern=[];
level = 0;
game_started = false;
var clicks = 0;


function playSound(random_color){
    var sound = new Audio("sounds/" + random_color+".mp3");
    sound.play();
}

function animate_press(color){
    $("#" + color).addClass("pressed");
    playSound(color);
    setTimeout(function () {
        $("#" + color).removeClass("pressed");
    }, 100);
}

function restart_game(){
    $("h1").text("Game Over, Press Any Key to Restart");
    level = 0;
    game_pattern = [];
    user_clicked_pattern = [];
    game_started = false;
    clicks = 0;
}

function choose_a_random_color(){
    random_color = colors[Math.floor(Math.random() * 4)]
    animate_press(random_color);
    game_pattern.push(random_color);
}

function checkanswer(no_of_clicks){
    if (user_clicked_pattern[no_of_clicks] == game_pattern[no_of_clicks]){
        // clicks += 1;
        if (no_of_clicks+1 == game_pattern.length) {
            setTimeout(function() {
                nextsequence();
            },1000);
        }
        clicks += 1;
    }
    else{
        $("body").addClass("game-over");
        var sounds = new Audio("sounds/wrong.mp3");
        sounds.play();
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 100);
        restart_game();
    }
}

$(document).keydown(function(){
    if (!game_started){
        game_started = true;
        nextsequence();
    }
}
);

function nextsequence(){
    user_clicked_pattern = [];
    clicks = 0;
    level+=1;
    $("h1").text("level "+ level);
    choose_a_random_color();
}

$(".btn").click(function(){
    animate_press($(this).attr("id"));
    user_clicked_pattern.push($(this).attr("id"))
    checkanswer(clicks);
});

