var reproductor = document.getElementById("music");
var playButton = document.getElementById("iniciar");

var playList = {
    music1:"audio/DarkRain-IMOJIC.mp3",
    music2:"audio/LostWoods-Zelda-IMOJIC.mp3"
}

reproductor.audioTracks = playList;

reproductor.src = playList.music1;
reproductor.volume = 0.6;
// detect when user start
playButton.addEventListener("click", function() {
    reproductor.play();
});
// after song end, play next one
reproductor.onended = function () {   
    reproductor.src = playList.music2;
    reproductor.volume = 0.5;
    reproductor.play();
}
