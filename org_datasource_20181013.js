var mysql = require('mysql');

var con = mysql.createConnection({
    host: "10.110.1.101",
    user: "netcruz",
    password: "netcruz!#$134",
    database: "NMS_DB",
    port: "3306"
});

function beforeRender(request, response, done) {
    con.connect(function(err) {
        if (err) throw err;
        con.query("CALL SP_REPORT_PERF_DEVICE_CHART('2018-08-13 00:00:00', '2018-08-13 23:59:59', 'H', 'N', 'N', 'm_user')",
            function(err, result, fields) {
                if (err) throw err;
                // var lookup_table = getMappedData(result[0]);
                var lookup_table_chart = loadLookUpData(result[0]);
                loadLookUpGrid(result[0]);
                
                request.data = {
                    perf_data : result[0],
                    // lookup_table : getMappedData(result[0])
                    lookup_table_chart : lookup_table_chart
                }
                // Object.assign(request.data, {
                //     perf_data: result
                // });
                
                console.log(result[0]);
                console.log("====================");
                done();
            });
    });
}

// 장비에 대해 세부 데이터 insert

// var data = {
// 	"Router,CPU": {
//   	"IPS_#1":[
//     	{PERF_MAX: 1, REG_DT: 1, INDIC_NM: 'CPU'},
//       {PERF_MAX: 2, REG_DT: 2, INDIC_NM: 'CPU'},
      
//     ],
// 	"IPS_#2":[
//     	{PERF_MAX: 3, REG_DT: 3, INDIC_NM: 'CPU'},
//       {PERF_MAX: 4, REG_DT: 4, INDIC_NM: 'CPU'},
      
// 		]
//   },
//   "Router,MEM": {
//   	"IPS_#1":[
//     	{PERF_MAX: 5, REG_DT: 5, INDIC_NM: 'MEM'},
//       {PERF_MAX: 6, REG_DT: 6, INDIC_NM: 'MEM'},
      
//     ],
// 		"IPS_#2":[
//     	{PERF_MAX: 7, REG_DT: 7, INDIC_NM: 'MEM'},
//       {PERF_MAX: 8, REG_DT: 8, INDIC_NM: 'MEM'},
      
// 		]
//   }
// };

// var data = {
//   "Router,CPU":[
//       {
//          "MCH_TYPE_NM":"Router",
//          "MCH_NM":"IPS_#1(a)",
//          "REG_DT":"2018-08-13 21:00:00",
//          "PERF_MAX":49,
//          "PERF_MXA":45.33,
//          "INDIC_TYPE":"CPU",
//          "MCH_IP":"10.170.1.157",
//          "MCH_ID":11
//       },
//       {
//          "MCH_TYPE_NM":"Router",
//          "MCH_NM":"IPS_#1",
//          "REG_DT":"2018-08-13 05:00:00",
//          "PERF_MAX":47,
//          "PERF_MXA":43.83,
//          "INDIC_TYPE":"CPU",
//          "MCH_IP":"10.170.1.161",
//          "MCH_ID":13
//       },
//       ...
//     ],
//     "Router,MEM":[
//       {
//          "MCH_TYPE_NM":"Router",
//          "MCH_NM":"IPS_#1",
//          "REG_DT":"2018-08-13 05:00:00",
//          "PERF_MAX":55,
//          "PERF_MXA":53.17,
//          "INDIC_TYPE":"MEM",
//          "MCH_IP":"10.170.1.161",
//          "MCH_ID":13
//       },
//       {
//          "MCH_TYPE_NM":"Router",
//          "MCH_NM":"IPS_#1(a)",
//          "REG_DT":"2018-08-13 21:00:00",
//          "PERF_MAX":62,
//          "PERF_MXA":56.67,
//          "INDIC_TYPE":"MEM",
//          "MCH_IP":"10.170.1.157",
//          "MCH_ID":11
//       },
//       ...
//     ],
//     ...
// }

function groupBy(data_arr, key){
    return data_arr.reduce(function(ret_val, current){
        (ret_val[current[key]] = ret_val[current[key]] || []).push(current);
        return ret_val;
    },{});
}

function loadLookUpGrid(data){
    var lookup_table = new Object();
    var obj_map = new Object(); // ex) Router,CPU : [1,3,5,6,7,...] // DEVICE_TYPE,INDIC : MCH_ID ARRAY [] 
    
    if(data.length > 0){
        for(var i=0; i<data.length; i++){
            var devObj = null;
            var mch_type_nm = data[i].MCH_TYPE_NM + '';
            var indic_nm = data[i].INDIC_TYPE + '';
            var pk = mch_type_nm +',' +indic_nm;
            
            if(lookup_table[pk] == null || lookup_table[pk]=='' || lookup_table[pk] == undefined){
                lookup_table[pk] = new Array();
            }
            
            var sub_result = new Object();
            sub_result.MCH_TYPE_NM = mch_type_nm;
            sub_result.MCH_NM = data[i].MCH_NM + '';
            sub_result.REG_DT = data[i].REG_DT + '';
            sub_result.PERF_MAX = data[i].PERF_MAX;
            sub_result.PERF_MXA = data[i].PERF_MXA;
            sub_result.INDIC_TYPE = indic_nm;
            sub_result.MCH_IP = data[i].MCH_IP;
            sub_result.MCH_ID = data[i].MCH_ID;
            
            lookup_table[pk].push(sub_result);
        }
        
        // obj_map
        // {
        //     Router,CPU : [1,4,9,16,25,36],
        //     Router,MEM : [2,3,5,6,7,8,9],
        // }
        //
        
        for(var pk in lookup_table){
            var obj_groupby_mch = groupBy(lookup_table[pk], 'MCH_ID');
            obj_map[pk] = Object.keys(obj_groupby_mch);
            console.log('obj_groupby_mch :: ' + JSON.stringify(obj_groupby_mch));
            console.log('Object.keys(...) :: ' + JSON.stringify(Object.keys(obj_groupby_mch)));
            // console.log('obj_map :: ' + JSON.stringify(obj_map));
        }
        console.log('obj_map :: ' + JSON.stringify(obj_map));
        
        for(var pk in obj_map){
            var mch_ids = obj_map[pk];
            var obj_groupby_mch = groupBy(lookup_table[pk], 'MCH_ID');
            console.log('mch_ids :: ' + mch_ids);
            for(var i in mch_ids){
                var arr_mch_data = obj_groupby_mch[mch_ids[i]];
                // console.log('TYPE_OF arr_mch_data :: ' + typeof(arr_mch_data) + '');
                // console.log('mch_id :: ' + typeof(mch_id));
                // console.log('pk, mch_id :: ' + '(' + pk + ',' + mch_ids[i] + ')');
                console.log('TYPE_OF arr_mch_data :: ' + typeof(arr_mch_data));
                console.log('mch_ids[i] :: ' + mch_ids[i]);
                // var max = arr_mch_data.reduce(function(ret_val, current){
                //   return ret_val > current ? ret_val : current; 
                // });
                // console.log('<MCH_ID, MAX> :: ' + mch_id + ', ' + max);
            }
        }
    }

    var data = JSON.stringify(lookup_table);
    console.log('=== MERGED DATA === (BEGIN)');
    console.log(data);
    console.log('=== MERGED DATA === (END)');
    
    console.log('=== MAP DATA === (BEGIN)');
    console.log(JSON.stringify(obj_map));
    console.log('=== MAP DATA === (END)');
    return JSON.parse(data);
    // return JSON.stringify(lookup_table);
}

function loadLookUpData(data){
    var lookup_table = new Object();

    if(data.length > 0){
        for(var i=0; i<data.length; i++){
            var devObj = null;
            var mch_type_nm = data[i].MCH_TYPE_NM + '';
            var indic_nm = data[i].INDIC_TYPE + '';
            var pk = mch_type_nm +',' +indic_nm;
            
            if(lookup_table[pk] == null || lookup_table[pk]=='' || lookup_table[pk] == undefined){
                // lookup_table[pk] = new Object();
                // lookup_table[pk].DATA = new Array();
                lookup_table[pk] = new Object();
            }
            else{}
            
            if(lookup_table[pk][data[i].MCH_NM] == null || lookup_table[pk][data[i].MCH_NM] == '' || lookup_table[pk][data[i].MCH_NM] == undefined){
                lookup_table[pk][data[i].MCH_NM] = new Array();
            }
            
            var sub_result = new Object();
            sub_result.MCH_TYPE_NM = mch_type_nm;
            sub_result.MCH_NM = data[i].MCH_NM + '';
            sub_result.REG_DT = data[i].REG_DT + '';
            sub_result.PERF_MAX = data[i].PERF_MAX;
            sub_result.PERF_MXA = data[i].PERF_MXA;
            sub_result.INDIC_TYPE = indic_nm;
            sub_result.MCH_IP = data[i].MCH_IP;
            sub_result.MCH_ID = data[i].MCH_ID;
            
            lookup_table[pk][data[i].MCH_NM].push(sub_result);
            
            // lookup_table[pk].DATA.push(sub_result);
            // lookup_table[pk].MCH_TYPE_NM = mch_type_nm;
            // lookup_table[pk].INDIC_NM = indic_nm;
            // lookup_table[pk].push(sub_result);
        }
    }
    var data = JSON.stringify(lookup_table);
    console.log('=== JSON DATA === (BEGIN)');
    console.log(data);
    console.log('=== JSON DATA === (END)');
    return JSON.parse(data);
    // return JSON.stringify(lookup_table);
}

function getLookUpTable(data){
    
    var lookup_table = new Object();

    if(data.length > 0){
        for(var i=0; i<data.length; i++){
            var devObj = null;
            var mch_type_nm = data[i].MCH_TYPE_NM + '';
            var indic_nm = data[i].INDIC_TYPE + '';
            var pk = mch_type_nm +',' +indic_nm;
            
            // num_curr_indic = (arr_indic.length-1)*1;
            
            if(lookup_table[pk] == null || lookup_table[pk]=='' || lookup_table[pk] == undefined){
                // lookup_table[pk] = new Object();
                // lookup_table[pk].DATA = new Array();
                
                lookup_table[pk] = new Array();
            }
            else{}
            
            var sub_result = new Object();
            sub_result.MCH_NM = data[i].MCH_NM + '';
            sub_result.REG_DT = data[i].REG_DT + '';
            sub_result.MCH_TYPE_NM = mch_type_nm;
            sub_result.INDIC_NM = indic_nm;
            
            // lookup_table[pk].DATA.push(sub_result);
            // lookup_table[pk].MCH_TYPE_NM = mch_type_nm;
            // lookup_table[pk].INDIC_NM = indic_nm;
            
            lookup_table[pk].push(sub_result);
        }
    }
    var data = JSON.stringify(lookup_table);
    console.log('=== JSON DATA === (BEGIN)');
    console.log(data);
    console.log('=== JSON DATA === (END)');
    return JSON.parse(data);
    // return JSON.stringify(lookup_table);
}


function getMappedData(data){
    
    var lookup_table = new Array();

    if(data.length > 0){
        for(var i=0; i<data.length; i++){
            var devObj = null;
            var mch_type_nm = data[i].MCH_TYPE_NM + '';
            var indic_nm = data[i].INDIC_TYPE + '';
            var pk = mch_type_nm +',' +indic_nm;
            
            var sub_result = new Object();
            sub_result.MCH_NM = data[i].MCH_NM + '';
            sub_result.REG_DT = data[i].REG_DT + '';
            
            // num_curr_indic = (arr_indic.length-1)*1;
            
            if(lookup_table[pk] == null || lookup_table[pk]=='' || lookup_table[pk] == undefined){
                lookup_table[pk] = new Object();
                lookup_table[pk].DATA = new Array();
                // lookup_table[pk].MCH_TYPE_NM = mch_type_nm;
                // lookup_table[pk].INDIC_NM = indic_nm;
                
            }
            else{
                // lookup_table[pk].MCH_TYPE_NM = mch_type_nm;
                // lookup_table[pk].INDIC_NM = indic_nm;
            }
            lookup_table[pk].MCH_TYPE_NM = mch_type_nm;
            lookup_table[pk].INDIC_NM = indic_nm;
            lookup_table[pk].DATA.push(sub_result);
            // console.log("**************");
            // console.log(typeof(sub_result));
            // console.log(sub_result.MCH_NM);
            // console.log("**************");
        }
    }
    
    return lookup_table;
}

