var reproductor = document.getElementById("music");

var playList = {
    music1:"audio/DarkRain-IMOJIC.mp3",
    music2:"audio/LostWoods-Zelda-IMOJIC.mp3"
}

reproductor.audioTracks = playList;

reproductor.src = playList.music1;
reproductor.volume = 0.6;
reproductor.play();

reproductor.onended = function () {   
    reproductor.src = playList.music2;
    reproductor.volume = 0.5;
    reproductor.play();
}
