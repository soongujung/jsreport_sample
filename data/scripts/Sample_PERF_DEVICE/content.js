var fs = require('fs');
// var str_result = fs.readFileSync('./data/SamplePerfDevice/dataJson.json');

function beforeRender(request, response, done) {
    console.log('asdfasdfasdf');
    fs.readFile('./data/data/SamplePerfDevice/dataJson.json', 'utf8', function(err, data){
        if(err) throw err;
        console.log('=== DATA LOAD === (BEGIN)');
        console.log('data :: ' + data);
        console.log('=== DATA LOAD === (END)');
        processDataForTable(data);
        request.data = {
            sp_data : data
        };
        done();
    });
}

function groupBy(data_arr, key){
    return data_arr.reduce(function(ret_val, current){
        (ret_val[current[key]] = ret_val[current[key]] || []).push(current);
        return ret_val;
    },{});
}

function processDataForTable(data){
    var total_data = new Array();
    
    console.log('=== process === (BEGIN)');
    console.log(data);
    console.log('=== process === (END)');
    
    data = JSON.parse(data);
    
    // console.log(typeof(data));
    // console.log('=== PK === (BEGIN)');
    // Object.keys(data).forEach(function(key){
    //   console.log(key) 
    // });
    // console.log('=== PK === (END)');
    // console.log(total_data);
    
    // 1. pk별로 정해진 1차원 병합 데이터 생성
    // for (var pk in data){
    Object.keys(data).forEach(function(pk){
        // *) sub_data
        console.log(pk);
        var sub_data = new Object();
        
        // // 1) groupBy MCH_ID in for each pk
        // var each_mch_group = groupBy(data[pk], 'MCH_ID');
        
        // // 2) prepare key structure
        // sub_data['pk'] = pk;
        // sub_data['mch_id'] = new Array();
        // sub_data['data'] = null;
        
        // // PERF_MAX, PERF_MXA, REG_DT, MCH_ID
        // // INDIC_TYPE, MCH_IP, MCH_NM
        // for (var mch_id in each_mch_group){
        //     sub_data['mch_id'].push(mch_id);
            
        //     if(sub_data['data'] == null || sub_data['data'] == undefined)
        //         sub_data['data'] = each_mch_group[mch_id];
        //     else{
        //         sub_data['data'].push.apply(sub_data['data'], each_mch_group[mch_id]);
        //     }
        // }
        
        // total_data.push(sub_data);
    // }
    });
    
    // var agg_all = new Array();
    // // 2. each pk, merged_data
    // for (var i in total_data){
    //     var sub_data = total_data[i];
    //     // var agg_data = new Object();
    //     for (var i_mch in sub_data['mch_id']){
    //         var temp = groupBy(sub_data['data'], sub_data['mch_id'][i_mch]);
    //         agg_all.push(temp);
    //     }
    // }
    // console.log('=== AGG DATA === (BEGIN)');
    // console.log(agg_all);
    // console.log('=== AGG DATA === (END)');
}

