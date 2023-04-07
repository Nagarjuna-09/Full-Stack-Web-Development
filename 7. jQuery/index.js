$("h1").css("color", "red");

// $("button").click(function() {
//     $("h1").css("color", "green");
// }
// )

// for(i = 0;i<=document.querySelectorAll("button").length;i++){
// document.querySelectorAll("button")[i].addEventListener("click",function(){
//     document.querySelector("h1").style.color = "green";
// })
// }

$(document).keydown(function() {
    $("h1").text(event.key);
});

$("button:eq(0)").click(function() {
    $("h1").slideUp().delay("slow").slideDown().delay("slow").animate({opacity:0.5});
});