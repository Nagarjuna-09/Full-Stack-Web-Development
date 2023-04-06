var all_buttons = document.querySelectorAll("button");

function playSound(){
    if(event.type=="click"){
        var letter = this.innerHTML;
    }
    else if(event.type=="keydown"){
        var letter = event.key;
    }
    buttonAnimation(letter);   
    switch(letter){
        case 'w':
            var crash = new Audio('sounds/crash.mp3');
            crash.play();
            break;
        case 'a':
            var kick_bass = new Audio('sounds/kick-bass.mp3');
            kick_bass.play();
            break;
        case 's':
            var snare = new Audio('sounds/snare.mp3');
            snare.play();
            break;
        case 'd':
            var tom1 = new Audio('sounds/tom-1.mp3');
            tom1.play();
            break;
        case 'j':
            var tom2 = new Audio('sounds/tom-2.mp3');
            tom2.play();
            break;
        case 'k':
            var tom3 = new Audio('sounds/tom-3.mp3');
            tom3.play();
            break;
        case 'l':
            var tom4 = new Audio('sounds/tom-4.mp3');
            tom4.play();
            break;
        default: console.log(letter);
}
}

document.addEventListener("keydown", playSound);

for (var i = 0; i <= all_buttons.length; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", playSound);
};

function buttonAnimation(letter){
    var active_button = document.querySelector("."+letter);
    active_button.classList.add("pressed");
    setTimeout(function(){
        active_button.classList.remove("pressed");
    }, 100);
}


// function playSound(letter) {
//     switch (letter) {
//         case 'w':
//             var crash = new Audio('sounds/crash.mp3');
//             crash.play();
//             break;
//         case 'a':
//             var kick_bass = new Audio('sounds/kick-bass.mp3');
//             kick_bass.play();
//             break;
//         case 's':
//             var snare = new Audio('sounds/snare.mp3');
//             snare.play();
//             break;
//         case 'd':
//             var tom1 = new Audio('sounds/tom-1.mp3');
//             tom1.play();
//             break;
//         case 'j':
//             var tom2 = new Audio('sounds/tom-2.mp3');
//             tom2.play();
//             break;
//         case 'k':
//             var tom3 = new Audio('sounds/tom-3.mp3');
//             tom3.play();
//             break;
//         case 'l':
//             new Audio('sounds/tom-4.mp3').play();
//             break;
//         default: console.log(letter);
//     }
// }

// document.addEventListener("keydown", function () {
//     playSound(event.key);
// });


// for (var i = 0; i <= all_buttons.length; i++) {
//     document.querySelectorAll(".drum")[i].addEventListener("click",function(){
//         playSound(this.innerHTML);
//     } );
    
// };

