var mic, recorder, soundFile;
var state = 0; 
var clock;
var percent = 100;
var timer = new Timer();
/*                           */
//record actions 
//0: ready to begin
//1: stop record
//2: play/download results
/*                           */

function setup() {  
  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();
}

document.getElementById("btnRecord").addEventListener("click", function(){
    // make sure user enabled the mic
    if (state === 0 && mic.enabled) {
        // set timer
        var clockSection = document.getElementById("clock-section");
        var inputClock = document.createElement("p");
        inputClock.setAttribute("id", "clock");
        clockSection.appendChild(inputClock);
        inputClock.textContent = document.getElementById("inTime").value;
        //set dates
        var inTime = document.getElementById("inTime").value;
        var cdt = inTime.split(":"); //HH:MM:SS array*/
        //str to num
        cdt[0] = parseInt(cdt[0]);
        cdt[1] = parseInt(cdt[1]);
        //var ms = cdt[2].split(".");
        cdt[2] = parseInt(cdt[2]);
        //cdt[3] = parseFloat(ms[1]/1000);
        //calculate ms
        cdt[4] = (( 
            (cdt[0]*60+cdt[1])
            *60)
            +cdt[2]); // total seconds = 100%
        countDownTime = cdt[4];
        //initialize timer
        timer.start(
            {
                precision: "seconds",
                countdown: true,
                startValues: {
                    hours: cdt[0],
                    minutes: cdt[1],
                    seconds: cdt[2],
                    secondTenths: 0
                }
            }
        );
        timer.addEventListener('secondsUpdated', function (e) {
        inputClock.textContent = timer.getTimeValues().toString();
        });

        $('#dial-section').pietimer({
            // countdown from
            seconds: countDownTime,
            // color of the pie timer
            color: 'rgba(255, 0, 0, 1)',
            // width / height of the pie timer
            height: 100,
            width: 100,
            // is reversed?
            is_reversed: true
        });

        $('#dial-section').pietimer("start");
        // record to our p5.SoundFile
        recorder.record(soundFile, countDownTime, function(){
            //some action when record is out of time
            if(state ===1){
                timer.pause();
                $('#dial-section').pietimer("pause");
                state = 2;
            }
        });
        state++;
    }
});

document.getElementById("btnStop").addEventListener("click", function(){
    if (state === 1) {
        timer.pause();
        $('#dial-section').pietimer("pause");
        state = 2;
      } else {
        showMessage();
    }
});

document.getElementById("btnNewRecord").addEventListener("click", function(){
    if(state === 2 ){
        $("#clock-section > p").remove();
        $("#dial-section > canvas").remove();
        state = 0;
    } else {
        showMessage();
    }
});

document.getElementById("btnPlay").addEventListener("click", function(){
    if(state === 2){
        soundFile.play(); // play the result!
    } else {
        showMessage();
    }
});

document.getElementById("btnDownload").addEventListener("click", function(){
    if (state === 2) {
        save(soundFile, 'mySound.wav');
        state = 0;
    } else {
        showMessage();
    }
});

function showMessage(){
    switch(state){
        case 0:
            console.log("Listo para grabar");
        break;
        case 1:
            console.log("grabando");
        break;
        case 2:
            console.log("escuchar/descargar");
        break;
    }
}