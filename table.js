//append input tablet
function constructTablet(){
    let html = "";
    for(let i = 0; i < 5; i++){
        html += '<div class="row">';
        for(let j = 0; j < 5; j++){
            html += '<div class="cell" id="' + (i * 5 + j) + '"></div>';
        }   
        html += '</div>';
    }
    $("#input_container").append($(html));
}

//number of ones in number(binary)
function bitNumber(number) {
    let res = 0;
    for(let i = 0; i < 25; i++){
        if(number & 1){
            res++;
        }
        number = number >>> 1;
    }
    return res;
}

//get differences between two table configurations
function tabletDifference(configuration, pattern) {
    let common = 0;
    let add = 0;
    let move = 0;

    for(let i = 0; i < 25; i++){
        if(configuration & pattern & 1){
            common++;
        }
        else if((pattern & 1) && !(configuration & 1)){
            add++;
        }
        else if( (configuration & 1) && !(pattern & 1)){
            move++;
        }
        configuration = configuration >>> 1;
        pattern = pattern >>> 1;
    }
    add = add - move;

    return [common, add, move];
}

//comparation of results for sorting
function compareFn(a, b) {
    //common tiles
    if (a[1] > b[1]) {
      return -1;
    }
    if (a[1] < b[1]) {
      return 1;
    }
    //tiles to add
    if (a[2] > b[2]) {
        return -1;
    }
      if (a[2] < b[2]) {
        return 1;
    }
    //tiles to move
    if (a[3] > b[3]) {
        return -1;
    }
      if (a[3] < b[3]) {
        return 1;
    }
    return 0;
}

//construct result tablet
function constructResult(configuration, input_tablet){
    let html = '<div class="result">';
    html += '<div class="result_table">';
    for(let i = 0; i < 5; i++){
        html += '<div class="row">';
        for(let j = 0; j < 5; j++){
            html += '<div class="cell';
            if(configuration[0] & 1){
                html += ' active';
            }
            if(configuration[0] & input_tablet & 1){
                html += ' green';
            }
            else if((configuration[0] & 1) && !(input_tablet & 1)){
                html += ' yellow';
            }
            else if( (input_tablet & 1) && !(configuration[0] & 1)){
                html += ' red';
            }
            html += '" id="' + (i * 5 + j) + '"></div>';
            configuration[0] = configuration[0] >>> 1;
            input_tablet = input_tablet >>> 1;
        }   
        html += '</div>'
    }
    html += '</div>';
    html += '<div class="result_text">';
    html += '<div><span>Common tiles: </span><span class="green">' + configuration[1] + '</span></div>';
    html += '<div><span>Tiles to add: </span><span class="yellow">' + configuration[2] + '</span></div>';
    html += '<div><span>Tiles to move: </span><span class="red">' + configuration[3] + '</span></div>';
    html += '</div></div>';
    $("#output_container").append($(html));
}
  

$(document).ready(function () {
    //init input table
    constructTablet();
    let table_configuration;
    //precomputed patterns
    let top_configurations = [32570911, 16571935, 33087007, 31120927, 16572175, 33087247, 31121167, 33087127, 16572055, 33090907, 31179517, 16539325, 33054397, 32109757, 32102077, 15587005, 33092797, 33085117, 16570045, 24827581, 33061951, 32109631, 33092671, 24835135, 32109694, 33092734, 24835198, 25069495, 31585975, 32569015, 16570039, 15586999, 33085111, 32102071, 31119031, 16539199, 33054271, 16539439, 33054511, 31585855, 32568895, 31585918, 32568958, 24827518, 24827758, 24827455, 24827695, 31119151, 31119214, 31118911, 31118974, 24796735, 24796975, 28667455, 30602878, 30602815];
    let result_array = [];

    //tile selection
    $(document).on('click', '#input_container .row .cell', function () {
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }
        else{
            $(this).addClass('active');
        }
    });

    //button click
    $('#button').on('click', function () {
        result_array = []
        //empty previous results
        $("#output_container").empty();
        //get current table configuration
        table_configuration = 0;
        $('#input_container .active').each(function () {
            table_configuration += Math.pow(2, $(this).attr('id'));
        });
        if(bitNumber(table_configuration) > 17){
            //to many tiles
            let html = '<div class="result_error">Too many tiles selected. No possible result.</div>';
            $("#output_container").append($(html));
        }
        else{
            //add description
            //let html = '<div class="result_description"><span class="green">Green</span> tiles are in the right place.<br><span class="yellow">Yellow</span> tiles are missing and need to be filled by changing water tile to empty tile or by moving <span class="red">red</span> tile to it\'s place.<br><span class="red">Red</span> tiles are in wrong place and need to be moved to a <span class="yellow">yellow</span> tile</div>';
            //$("#output_container").append($(html));
            //calculate, sort and print results
            top_configurations.forEach(function myFunction(configuration) {
                let differences = tabletDifference(table_configuration, configuration);
                let output = [configuration, differences[0], differences[1], differences[2]];
                result_array.push(output);

            });
            //sort results
            result_array.sort(compareFn);
            //print results
            result_array.forEach(function myFunction(configuration) {
                constructResult(configuration, table_configuration);
            });
        }
    });
});