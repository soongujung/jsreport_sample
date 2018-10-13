var fs = require('fs');
// var str_result = fs.readFileSync('./data/SamplePerfDevice/dataJson.json');

function beforeRender(request, response, done) {
    console.log('asdfasdfasdf');
    fs.readFile('./data/data/SamplePerfDevice/dataJson.json', 'utf8', function(err, data){
        if(err) throw err;
        console.log('=== DATA LOAD === (BEGIN)');
        console.log('data :: ' + data);
        console.log('=== DATA LOAD === (END)');
        request.data = {
            sp_data : data
        };
        done();
    });
}

