random_number1 = Math.floor(Math.random() * 5) + 1;
random_number2 = Math.floor(Math.random() * 5) + 1;
var random_image1 = "images/dice" + random_number1+".png";
var random_image2 = "images/dice" + random_number2 + ".png";
document.querySelectorAll("img")[0].setAttribute("src", random_image1);
document.querySelectorAll("img")[1].setAttribute("src", random_image2);

if(random_image1>random_image2){
    document.querySelector(".result").textContent = " 🚩 Player 1 Wins";
}
else if (random_image2 > random_image1){
    document.querySelector(".result").textContent = "Player 2 Wins 🚩";
}
else{
    document.querySelector(".result").textContent = "Draw ⚔️";
}

