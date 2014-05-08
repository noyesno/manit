
var AppConfig = {
  base: { 
    //'tcl-8.5'  :'http://doc.noyesno.net/repo/tcl/tcl8.5',
    //'git-1.8.5':'http://doc.noyesno.net/repo/git'
    'tcl-8.5'  :'http://dn-noyesno.qbox.me/manit/repo/tcl/tcl8.5',
    'git-1.8.5':'http://dn-noyesno.qbox.me/manit/repo/git'
  }
};

function print_query(recordset){
  var buffer = [];
  for(var i=0, n=recordset.length; i<n; i++){
    var $r = recordset[i];
    var $url = AppConfig.base[$r['lang']+'-'+$r['version']]+'/'+$r['page'];
    // TODO: fallback to lang only 
    buffer.push('<tr>',
         '<th>',"<a href='",$url,"' target='docwin'>",$r['token'],'</a></th>',
         '<td class="hint">',$r['lang'],'</td>',
         '<td class="hint">',$r['version'],'</td>',
         '<td class="hint" title="',$r['npage'],'">',$r['page'],'</td>',
         '</tr>');
  }
  $('#query-result tbody').html(buffer.join(''));
}

function request_query(){
  console.log('request ...');
  var $this = $('form');
  var url    = $this.attr('action');
  var query = $this.get(0).q.value;
  if(query.length<=1) return;
  var params = $this.serialize();
  $('#query-result caption').text("query: "+query+ " ...");
  $.getJSON(url, params, function(data, status){
    print_query(data);
  });
}

$('form').on('submit',function(){
  request_query();
  return false;
});

$('#query').on('keypress',function(evt){
  if(evt.which==13){
    return false;
  }
  clearTimeout(request_query.timer);
  request_query.timer = setTimeout(request_query,300);
  console.log(evt.which);
});

$(document.body).on('click', function(){
  console.log("body fadeToggle");
  $('#docwin').fadeToggle();
});

$(document.body).on('click', 'input', function(){
  $('#docwin').fadeOut();
  return false;
});

$('#query-result').on('click', 'a', function(event){
  console.log("a fadein");
  $('#docwin').fadeIn();
  $(document.body).addClass('aside');
  event.stopPropagation();
});


/*
 * localStroge Size Limit: 5MB
 */

function db_tidy(){
  // TODO:
  for(var i=0, n=window.localStorage.length; i<n; i++){
    var key = localStorage.key(i);
    console.log(key);
  }
}

function db_clear(){
  localStorage.clear();
}

function db_save_history(text, href){
   var kv = window.localStorage; 
   kv['recent:'+text] = href;
   var recent = kv['recent'];
   var items = recent?recent.split("\t"):[];
   var idx   = items.indexOf(text);
   if(idx<0) items.push(text);
   if(items.length > 24){
     var key = items.shift();
     kv.removeItem(key);
   }
   kv['recent'] = items.join("\t");
}

$('#query-result').on('click', 'a', function(){
   var href = this.href, text = this.innerText;
   db_save_history(text, href);
});

console.log('stat: localStorage.length = ' + localStorage.length);
