var mic, recorder, soundFile;
var state = 0; 
var clock;
var percent = 100;
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
    if(clock){
        clock.stop();
    }
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
    // set timer
    var clockSection = document.getElementById("clock-section");
    var inputClock = document.createElement("p");
    inputClock.setAttribute("id", "clock");
    clockSection.appendChild(inputClock);
    inputClock.textContent = document.getElementById("inTime").value;
    //create knob
    var dialSection = document.getElementById("dial-section");
    var inputDial = document.createElement("input");
    inputDial.setAttribute("type", "text");
    inputDial.setAttribute("id", "dial");
    inputDial.setAttribute("value", "100");
    inputDial.setAttribute("class", "dial");
    dialSection.appendChild(inputDial);
    //set dates
    var inTime = document.getElementById("inTime").value;
    var cdt = inTime.split(":"); //HH:MM:SS array*/
    //str to num
    cdt[0] = parseFloat(cdt[0]);
    cdt[1] = parseFloat(cdt[1]);
    //var ms = cdt[2].split(".");
    cdt[2] = parseFloat(cdt[2]);
    //cdt[3] = parseFloat(ms[1]/1000);
    //calculate ms
    cdt[4] = (( 
        (cdt[0]*60+cdt[1])
        *60)
        +cdt[2]); // total seconds = 100%
    countDownTime = cdt[4];
    //setup knob
    $(".dial").knob({
        //config
        readOnly: true,
        rotation: "clockwise",
        max: 100,
        step: 0.01,
        //UI
        'displayInput': false,
        'fgColor': "#FF0000"
    });
    //initialize timer
    var timer = new Timer();
    timer.start(
        {
            precision: "secondTenths",
            countdown: true,
            startValues: {
                hours: cdt[0],
                minutes: cdt[1],
                seconds: cdt[2]
            }
        }
    );
    timer.addEventListener('secondTenthsUpdated', function (e) {
       inputClock.textContent = timer.getTimeValues().toString();
    });
    var sitId = setInterval(function(){
        if(timer.getTotalTimeValues().secondTenths <= 0){
            //stop interval
            clearInterval(sitId);
        }
        $(".dial").val(percent).trigger("change");
        percent = timer.getTotalTimeValues.secondTenths * 100 / countDownTime;
    }, 1);
    //paint knob
    /*
    var timer1 = new Timer();
    timer1.start(
        {
            precision: "secondTenths",
            countdown: true,
            startValues: {
                hours: cdt[0],
                minutes: cdt[1],
                seconds: cdt[2]
            }
        }
    );
    timer1.addEventListener('secondTenthsUpdated', function (e) {
       
       //percent = percent - 0.1;
       //console.log(percent);
       percent = timer.getTotalTimeValues().seconds * 100 / cdt[4];
    });*/

    
    //countdown loop
    /*
    var sitId = setInterval(function(){
        if(timer.getTotalTimeValues().secondTenths <= 0){
            //stop interval
            clearInterval(sitId);
        }
        percent = timer.getTotalTimeValues.secondTenths * 100 / countDownTime;
        inputClock.textContent = timer.getTimeValues();//ms2TimeString(timer.getTotalTimeValues("secondTenths"));
        $(".dial").val(percent).trigger("change");
        timer.getTotalTimeValues().secondTenths = timer.getTotalTimeValues().secondTenths - 10;
    }, 10);*/
}
/*
function ms2TimeString(a,k,s,m,h){
    return k=a%1e3, // optimized by konijn
     s=a/1e3%60|0,
     m=a/6e4%60|0,
     h=a/36e5%24|0,
     (h?(h<10?'0'+h:h)+':':'')+ // optimized
     (m<10?0:'')+m+':'+  // optimized
     (s<10?0:'')+s+'.'+ // optimized
     (k<100?k<10?'00':0:'')+k // optimized
   }*/