var matrixSize = 16;
var color = $('#setColor').val();
var draws=[];
var domain_path="./";



$(document).ready(function(){

  let ele = document.getElementById('matrix');
  ele.addEventListener('contextmenu', (ev)=>{
    ev.preventDefault(); // this will prevent browser default behavior 
  });


  /**  
  $.getJSON("https://schilders.com/getip.php", function(data){
    var obj = $.parseJSON(data);
     console.log(obj.ipaddress);
   })
   */

    buildMatrix(matrixSize);
    readMatrix();
    buildImages();


    $('.led').mousedown(function(event) {

      switch (event.which) {
        case 1:
          $(this).css("background-color", color);
            break;
        case 2:
            console.log('Middle mouse button is pressed');
            break;
        case 3:

          $(this).css("background-color", '#000000');
            break;
        default:
          console.log('Nothing');
      }
    });

    
    $('.colorbox').click(function(){
      console.log("click");
      $(".colorbox").css("border","1px solid black");
      color=$(this).css("background-color");
      $(this).css("border","4px solid black");
    });

    $(".led").click(function(){
      $(this).css("background-color", color);
    });

    $("#setColor").change(function(){
      color=$(this).val();
    });

    $("#readMatrix").click(function(){
       var json=readMatrix();
       postData(json);
       draws.push(json);
    });

    $("#playMatrix").click(function(){
      var value=0;
      playMatrix(value);
    });

    $("#loadMatrix").click(function(){
      const obj = JSON.parse($('#loadData').val());
      loadMatrix(obj);
    });

    $('#saveMatrix').click(function(){

      console.log(draws.length);
      var jsondata= readMatrix();
      html2canvas(document.querySelector("#matrix")).then(function(canvas) {    
        $.ajax({
          method: 'POST',
          url: domain_path+'/saveimage.php',
          data: {
            'image' : canvas.toDataURL('image/png'),
            'json' : jsondata
          },
          success: function(data) {
            buildImages();
          }
        }); 
      });
    });

    $(".sendtoMatrix").click(function(){
       console.log("Send data");
       postData($(this).val());
    });
});


function loadMatrix(json){
  var data = JSON.stringify(json.seg.i);
  data = data.replace("[","").replace("]", "");
  data = data.split(',');
  for (i=0; i < data.length; i=i+2){
    var bcolor="#"+data[i+1].replace('"', "").replace('"', "");
    var cid="#C"+data[i].toString();
    //console.log(cid+":"+bcolor);
    $(cid).css( "background-color",bcolor);
  }
}

function playMatrix(value){
    if (value < draws.length){  
      setTimeout(function(){
        //postData(draws[value]);
        loadMatrix(draws[value]);
        value=value+1;
        //console.log(value);
        playMatrix(value);
      }, 500);
    }
}


function readMatrix(){
  var divider="";
  var json='{"seg":{"i":[';
  var counter=0;
  $( ".led" ).each(function( index ) {
    if ($( this ).css( "background-color" )){
       var bcolor=rgb2hex($( this ).css( "background-color" ));
         json=json+divider;
         json=json+counter.toString()+',"'+bcolor.replace('#','')+'"';
         divider=", "
    }
    counter++;
  });
  json=json+']}}';
  return json;
}
function postData(datastring){
  var wledip= $('#ipadres').val();
  if (wledip == ''){wledip="192.168.0.53";}
  $.ajax({
    type: "POST",
    url: "http://"+wledip+"/json/state",
    data: datastring,
    success: function(data) { console.log('data: ' ); },
    contentType: "application/json",
    dataType: 'json'
  }); 
}

function buildMatrix(size){
  var cel_counter=0;
  for (c=0; c<size; c++){
    $("#matrix").append("<div id=\"C"+cel_counter+"\" class=\"led nowrap\"></div>");
    for (r=1; r<size; r++){
      cel_counter++;
      var myid=r.toString()+"-"+c.toString();
      $("#matrix").append("<div id=\"C"+cel_counter+"\" class=\"led\"></div>");
      
    }
    cel_counter++; 
  } 
}


function buildImages(){
  $("#saved").html("");

  $.getJSON(  domain_path+'/getsaved.php', function( data ) {
    var items = [];
    $.each( data.files, function( key, val ) {
      $("#saved").append("<img id='"+val+"' class='thumbnails' src='images/"+val+".png'/>");  
    });  

    $('.thumbnails').click(function(){
      var id=$(this).attr('id');
      $.get('./images/'+id+".json", function(result) {
        loadMatrix(result);
      }); 
    });

  });

}


function rgb2hex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
   ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
 }



