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
    countDownTime = cdt[4]*1000;
    console.log(countDownTime)
    //initialize timer
    var timer = new Timer();
    timer.start(
        {
            precision: "secondTenths",
            countdown: true,
            startValues: {
                hours: cdt[0],
                minutes: cdt[1],
                seconds: cdt[2],
                secondTenths: 0
            }
        }
    );
    timer.addEventListener('secondTenthsUpdated', function (e) {
       inputClock.textContent = timer.getTimeValues().toString();
       //console.log(timer.getTimeValues().toString());
    });

    //set chartjs animation with duration = cdt[4]
    var data = {
        datasets: [{
            data: [100],
            backgroundColor: [
                "rgba(255, 0, 0, 1)"
            ],
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth:1,
       }]
    };
    var options = {
        responsive: false,
        animation: {
            duration: countDownTime,
            easing: "linear",
            onComplete: function(animation){
                console.log(animation.animationObject.currentStep / animation.animationObject.numSteps);
                console.log(timer.getTotalTimeValues().toString());
            }
        },
    }
    var ctx = document.getElementById("myChart").getContext('2d');
    //start myPieChartAnimation
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: data,
        options: options
    });


}