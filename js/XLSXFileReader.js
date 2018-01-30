document.getElementById('excel').addEventListener('change', function(){
    var myxls = document.getElementById('excel');
    var reader = new FileReader();
    reader.readAsArrayBuffer(myxls.files[0]);
    
    reader.onload = function(){
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data,{type:'array'});
        var ws = wb.Sheets['GUION'];
        var json = XLSX.utils.sheet_to_json(ws); //array de objetos en json
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
        document.getElementById('guion').innerHTML = json[i].guion;
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
                console.log(i);
                document.getElementById('guion').innerHTML = json[i].guion;
                document.getElementById('select-div').innerHTML = "Fila: " + (i+1);
                //cambiar y calcular valores de tiempo
                 var inTimeVal = msToTime(json[i].tNarracion*1000);
                document.getElementById('inTime').value = inTimeVal;
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