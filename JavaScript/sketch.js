var mic, recorder, soundFile;
var state = 0; 
var clock;
var percent = 0;

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

function beginRecord() {
  var btnRecord = document.getElementById("btnRecord");
  
  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {
    startTimer(); 
    //change button value
    btnRecord.innerHTML = "STOP";
    // record to our p5.SoundFile
    recorder.record(soundFile);
    state++;
  }
  else if (state === 1) {
    btnRecord.innerHTML = "RECORD";
    //stop flipclock
    clock.stop();
    // stop recorder and
    // send result to soundFile
    recorder.stop();
    state++;
  }
}

function getSoundFile(){
    if (state === 2) {
        soundFile.play(); // play the result!
        save(soundFile, 'mySound.wav');
        state++;
      }
}

function newRecord(){
    if(state > 0 ){
        state = 0;
        btnRecord.innerHTML = "RECORD";
        clock.stop();
        recorder.stop();
    }
}

function startTimer(){
    var countDownTime = document.getElementById("inTime").value;
    var cdt = countDownTime.split(":"); //HH:MM:SS array
    //str to num
    cdt[0] = parseInt(cdt[0]);
    cdt[1] = parseInt(cdt[1]);
    cdt[2] = parseInt(cdt[2]);
    //calculate ms
    cdt[3] = (( 
        (cdt[0]*60+cdt[1])
        *60)
        +cdt[2]); // total seconds = 100%
    //timer setup
    clock = new FlipClock($(".clock"), cdt[3], {
        clockFace: "SecondCounter",
        countdown: true,
        language: "es-es",
        autoStart: false
    });
    //create knob
    var dialSection = document.getElementById("dial-section");
    var inputDial = document.createElement("input");
    inputDial.setAttribute("type", "text");
    inputDial.setAttribute("id", "dial");
    inputDial.setAttribute("value", "100");
    inputDial.setAttribute("class", "dial");
    dialSection.appendChild(inputDial);
    //setup knob
    $(".dial").knob({
        //config
        readOnly: true,
        rotation: "clockwise",
        step: 0.1,
        //UI
        'format' : function (value) {
            return value + '%';
         }
    });
    //activate timer and knob
    clock.start(function(){
        //setup behavior
        var currentTime = (clock.time);//get timer time (distinct from the clock shown)
        //calculate knob value
        percent =  (currentTime*100)/cdt[3];
        //change knob value
        $(".dial").val(percent).trigger("change");
        if(currentTime==0){
            clock.flip();//final flip required
            //stop clock
            clock.stop();
        }
    });
}