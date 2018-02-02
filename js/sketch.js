var mic, recorder, soundFile;
var state = 0; 
var clock;
var percent = 100;
var timer = new Timer();
var timerLetras;
var actualShowRowData;
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
        cdt[0] = parseInt(cdt[0]); //hora
        cdt[1] = parseInt(cdt[1]); //minuto
        var ms = cdt[2].split("."); 
        cdt[2] = parseInt(ms[0]); //segundo
        cdt[3] = parseFloat(ms[1]); //milesima a segundo

        //calculate ms
        cdt[4] = (( 
            (cdt[0]*60+cdt[1])
            *60)
            +cdt[2]) + cdt[3]/1000; // total seconds = 100%
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
                    secondTenths: cdt[3]/1000
                }
            }
        );
        timer.addEventListener('secondsUpdated', function (e) {
        inputClock.textContent = timer.getTimeValues().toString();
        });

        //* ************************************************ *//
        //separar palabras
        var str = document.getElementById('guion').innerHTML;
        var palabras = [];
        var tiempoPintado;
        palabras = str.split(" "); //entrega palabras
        tiempoPintado = palabras.length/100; //calculado en ms
        var texto = [];
        //llenar arreglo de texto con duracion calculada
        for(var i = 0; i <= palabras.length-1; i++ ){
            arrPalabraDuracion = [palabras[i], tiempoPintado];
            texto.push(arrPalabraDuracion);
        }
        //crear nuevo guion
        document.getElementById('guion').innerHTML = "";
        var nuevoGuion = "";
        var numeroPalabra = 0;
        for(var palabra of texto){
            nuevoGuion += '<span id="p' + numeroPalabra + '">' + texto[numeroPalabra][0] + ' </span>';
            numeroPalabra++;
        }
        //convertir tiempo de cada palabra a ms 
        ;
        //obtener tiempo total de ejecucion timer
        document.getElementById('guion').innerHTML = nuevoGuion;
        //animar
        var index = 0;
        document.getElementById('p0').classList.add('pintar-letras');
        var intervalKaraoke = setInterval(function(){
            //agregar clase
            index++;
            document.getElementById('p' + index).classList.add('pintar-letras');
            
        }, (actualShowRowData["T Narra."]/texto.length)*1000);
        setTimeout(function(){
            clearInterval(intervalKaraoke);
        }, actualShowRowData["T Narra."]*1000);

        
        /**************************************************/
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
                timer.stop();
                $('#dial-section').pietimer("pause");
                clearInterval(timerLetras); 
                state = 2;
            }
        });
        state++;
    }
});

document.getElementById("btnStop").addEventListener("click", function(){
    if (state === 1) {
        timer.stop();
        $('#dial-section').pietimer("pause");
        recorder.stop();
        state = 2;
      } else {
        showMessage();
    }
});

document.getElementById("btnNewRecord").addEventListener("click", function(){
    if(state === 2 ){
        timer.removeEventListener("secondsUpdated");
        timer.reset;
        $("#clock-section > p").remove();
        $("#dial-section > canvas").remove();
        //remover clases 
        document.getElementById('guion').innerHTML = actualShowRowData["Guión"];
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

document.getElementById('excel').addEventListener('change', function(){
    var myxls = document.getElementById('excel');    
    var reader = new FileReader();
    reader.readAsArrayBuffer(myxls.files[0]);
    
    reader.onload = function(){
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data,{type:'array'});
        var ws = wb.Sheets['GUION'];
        json = XLSX.utils.sheet_to_json(ws); //array de objetos en json
        var rowsCount = json.length;
        var select_div = document.getElementById('select-div');
        var value = [];
        //si no existen elementos en select-div
        init(select_div, json);                
    };
});
//
function init(select_div, json){
    if(select_div.innerHTML == ""){
        //crear label
        select_div.innerHTML = "Fila: " + 1;
        var i = 0;
        actualShowRowData = json[i];
        document.getElementById('guion').innerHTML = json[i]["Guión"];
        document.getElementById('inTime').value = msToTime(json[i]["T Narra."]*1000);
        //agregar listeners a flechas guion
        document.onkeydown = function(e){
            var cont = false;
            switch(e.keyCode){
                case 37:
                    if(i - 1 >= 0){
                        i--;
                        cont = true;
                    }
                    break;
                case 39:
                    if(i + 1 < json.length){
                        i++;
                        cont = true;
                    }
                    break;
            }

            if(cont == true){
                actualShowRowData = json[i];
                document.getElementById('guion').innerHTML = json[i]["Guión"];
                document.getElementById('select-div').innerHTML = "Fila: " + (i+1);
                //cambiar y calcular valores de tiempo
                var inTimeVal = msToTime(json[i]["T Narra."]*1000);
                document.getElementById('inTime').value = inTimeVal;
                //newRecord()
                
            }
        }
    }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/10)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

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