function parseJSON(data){
    return JSON.parse(data);
}

function loggingData(data){
    console.log(JSON.parse(data));
    return data;
}

function stringData(perf_data) {
    return perf_data[0].length;
}

function lengthData(perf_data) {
    return perf_data[0].length;
}

function firstData(perf_data){
    return perf_data[0];
}

function getStrLabel(category, pk){
    var sepIdx = pk.indexOf(',');
    var substring = '';
    if(category==='MCH_TYPE_NM'){
        substring = pk.substring(0,sepIdx);
    }
    else{
        substring = pk.substring(sepIdx+1, pk.length);
    }
    return substring;
}
/*
[
    { 
        pk : ROUTER+CPU
        MCH_TYPE_NM : ROUTER,
        INDIC_NM    : CPU,
        DATA : 
        [
            {
                MCH_NM : IPS_#1(a),
                REG_DT : 2018-ASDFASDFASDF
            },
            {
                MCH_NM : IPS_#1,
                REG_DT : 2018-ASDFASDFASDF
            },
            ...
        ]
    },
    {
        pk : ROUTER+MEM
        MCH_TYPE_NM : ROUTER,
        INDIC_NM    : MEM,
        DATA :
        [
            {
                MCH_NM : IPS_#1(a),
                REG_DT : 2018-ASDFASDFASDF
            },
            {
                MCH_NM : IPS_#1(a),
                REG_DT : 2018-ASDFASDFASDF
            },
            ...
        ]
    }
    ...
] 
*/