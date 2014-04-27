//Declare Globals
var streamURL = "";
var artURL = "";
var description = "";
var trackTitle = "";

//Setup Object To Get Selected Song Information
var getSongInfo = function () {
    SC.get(uri, function (track) {
        trackTitle = track.title;
        description = track.description;
        $('#albumCover').attr('src', track.artwork_url);        
    })    
}

//Setup Object To Play Selected Song
var playSong = {

    play: function () {
        SC.stream(streamURL, function (sound) {
            sound.play();

            $('#btnBack').click(function () {
                try {
                    sound.destruct();
                }
                catch (error) {
                    alert(error);
                }
            })
            $('#btnPause').click(function () {
                sound.togglePause();                
            })
        })
    }
};

//Script That's Called When Homepage is Shown
$(document).on("pageshow", "#home", function () {

    $('#btnSearch').click(function () {
        $('#songInfo').empty();
        var rbPop = $('#rbPop').is(':checked');
        var rbRock = $('#rbRock').is(':checked');
        var rbCountry = $('#rbCountry').is(':checked');
        var rbMetal = $('#rbMetal').is(':checked');

        if (rbPop) {
            selection = "pop";
        }
        else if (rbRock) {
            selection = "rock";
        }
        else if (rbMetal) {
            selection = "metal";
        }
        else {
            selection = "country";
        }

        SC.get('/tracks', { genres: selection, limit: 500, filter: 'streamable', duration: {from: 2000} }, function (tracks) {

            $(tracks).each(function (index, track) {
                if (track.release_day == null) {
                    track.release_day = "";
                    track.release_year = "";
                    track.release_month = "";
                }
                if (track.artwork_url == null) {
                    track.artwork_url = "res/images/noArt.png";
                }

                $('#songInfo').append
                ('<li class="foundTracks" data-theme="b"><a id="' + track.uri + '" value="' + track.stream_url + '" href="/mediaPlayer.html"><img class="albumArt" src="' + track.artwork_url + '" />'
                + track.title + '<p id="description"><b>Description</b>: ' + track.description + '</p>' +
                '<p><b>Release Date</b>: ' + track.release_month + '/' + track.release_day + '/' + track.release_year +
                '<p><b>Length</b>: ' + track.duration / 60 + '</p>' +
                '<p><img id="waveform" src="' + track.waveform_url + '" />' + '</p>' + '</p>' + '</a></li>')
                .listview('refresh');

            });
            $('li a').click(function () {
                streamURL = $(this).attr('value');
                uri = $(this).attr('id');                
            })
        });
    })

});

//Script That's Calle When MediaPlayer Page is Called
$(document).on("pageshow", "#mediaPlayer", function () {

    playSong.play();
    getSongInfo();
   

    
    /*SC.stream(streamURL, function (sound) {
    sound.play();

    $('#btnBack').click(function () {
    alert("working");
    sound.destruct();
    })
    $('#btnPlay').click(function () {
    sound.play();
    })
    $('#btnPause').click(function () {
    sound.pause();
    })
    })*/
});

