
function onload_setup_frames() { 
   update_frame(title_frame, '<html><head><link rel="stylesheet" type="text/css" href="apt.css"/></head><body><body><CENTER><H3>Results : legoprofile -  </CENTER></body></html>');
} 
 
   
	document.getElementsByClassName = function(cl) {
   var retnode = [];
   var myclass = new RegExp('\b'+cl+'\b');
   var elem = this.getElementsByTagName('*');
   for (var i = 0; i < elem.length; i++) {
      var classes = elem[i].className;
      if (classes == cl) retnode.push(elem[i]);
   }
   return retnode;
}; 

//PSSTOOLS13023
function showColor(elem)
{
    var id   = elem.id;
     if (id == "color_log")
   {
    document.getElementById('color_cmd').style.color='#467aa7';
    document.getElementById('color_xml').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='#467aa7';
    document.getElementById('color_testcase').style.color='#467aa7';
    document.getElementById('color_config').style.color='#467aa7';
    document.getElementById('color_log').style.color='Red';
   }
     else if(id == "color_cmd")
   {
    document.getElementById('color_log').style.color='#467aa7';
    document.getElementById('color_xml').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='#467aa7';
    document.getElementById('color_testcase').style.color='#467aa7';
    document.getElementById('color_config').style.color='#467aa7';
    document.getElementById('color_cmd').style.color='Red';
   }
      else if(id == "color_xml")
   {
    document.getElementById('color_log').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='#467aa7';
    document.getElementById('color_cmd').style.color='#467aa7';
    document.getElementById('color_testcase').style.color='#467aa7';
    document.getElementById('color_config').style.color='#467aa7';
    document.getElementById('color_xml').style.color='red';
   }
                        
    else if(id == "color_styleXml")
   {
    document.getElementById('color_log').style.color='#467aa7';
    document.getElementById('color_xml').style.color='#467aa7';
    document.getElementById('color_cmd').style.color='#467aa7';
    document.getElementById('color_testcase').style.color='#467aa7';
    document.getElementById('color_config').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='Red';
   }
    else if(id == "color_testcase")
   {
    document.getElementById('color_log').style.color='#467aa7';
    document.getElementById('color_xml').style.color='#467aa7';
    document.getElementById('color_cmd').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='#467aa7';
   }
    else if(id == "color_config")
   {
    document.getElementById('color_log').style.color='#467aa7';
    document.getElementById('color_xml').style.color='#467aa7';
    document.getElementById('color_cmd').style.color='#467aa7';
    document.getElementById('color_styleXml').style.color='#467aa7';
   }
}

function hideCmdFrame(){
   parent.document.getElementById('Atual_info').rows  = "0%,*";
   parent.document.getElementById('main_status').rows = "100%,0%";
   parent.document.getElementById('descr_info').cols = "100%,0%";
}



function setStepFrames(stepname, iteration, order, url,warnings) {

   var parentURL = "";
   if (typeof(url) != 'undefined') {
     parentURL = url + "/";
   }
   
   if ( stepname ==  'config' ) {  
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "config");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'config.html';   
   }
   else if ( stepname ==  'testcase' ) {  
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "testcase");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'testcase.html';   
   }  
   else if ( stepname ==  'additional_logs' ) {  
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "additional_logs");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = url;   
   }
   else if ( stepname ==  'xml_logs' ) {  
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "xml_logs");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'launch.xml';   
   } 
   else if ( stepname ==  'style_xml_logs' ) {  
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "style_xml_logs");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'launchcss.xml';   
   } 
   else if ( stepname ==  'cmd_resp_logs' ) {
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "cmd_resp_logs");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'cmd_resp_logs.html';
   }
   else if ( stepname ==  'logs' ) {
     hideFrame();
     window.localStorage.clear();
     window.localStorage.setItem("view", "logs");
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'testcase_end_result.html';
   }
   else if ( stepname == -2  ) {  
     var expectFrameHtml = 'about:blank';
     var descrFrameHtml  = 'about:blank';
     var actualFrameHtml = 'about:blank';
     hideFrame();
      parent.document.getElementById('main').cols  = "0%,*";
     return;
   } 

   else if ( iteration > 0 ) { 
     //showFrame();
	 if (warnings == 0){
		 hideWarningFrame();
		 var expectFrameHtml = parentURL + 'expected-' + iteration + '-' + order + '.html'; 
		 var descrFrameHtml  = parentURL + 'descript-' + iteration + '-' + order + '.html';
		 var actualFrameHtml = parentURL + 'actual-'   + iteration + '-' + order + '.html';
	 	}
	 else {
		showWarningFrame()
		 var expectFrameHtml = parentURL + 'expected-' + iteration + '-' + order + '.html'; 
		 var descrFrameHtml  = parentURL + 'descript-' + iteration + '-' + order + '.html';
		 var actualFrameHtml = parentURL + 'actual-'   + iteration + '-' + order + '.html';
		 var warningFrameHtml = parentURL + 'warning-'   + iteration + '-' + order + '.html';
   		} 
   }
   else { 
     hideFrame();
     var expectFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'testcase_end_result.html'; 
     var actualFrameHtml = 'about:blank';
   } 

   //PSSTOOLS13023
   
   if((window.localStorage.getItem("view") == "cmd_resp_logs") && (stepname != "cmd_resp_logs")) {
     hideCmdFrame();
     var expectFrameHtml = 'about:blank';
     var actualFrameHtml = 'about:blank';
     var descrFrameHtml  = parentURL + 'cmd_resp_logs.html' + '#' + stepname;
   }
   else  if (window.localStorage.getItem("view") == "style_xml_logs"){
     // code here
   }
   else  if (window.localStorage.getItem("view") == "xmlLogs") {
     // code here
   }

   parent.expect_frame.location = expectFrameHtml; 
   parent.descr_frame.location  = descrFrameHtml;
   parent.actual_frame.location = actualFrameHtml;
   parent.wraning_frame.location = warningFrameHtml;

} 


function update_frame(framename, content) {
  framename.document.open("text/html","replace");
  framename.document.write(content);
  framename.document.close();
}

function make_frame(framename, title, body) {
  var content = "<html><body><h3>" + title + "</h3>" + body + "</body></html>";
  update_frame(framename, content);
}

function toggleMe(a, b) {
  var e=document.getElementById(a);
  if(!e)return true;
    if(e.style.display=="none"){
      e.style.display="block"
      document.getElementById(b).innerHTML = "-"
    }
    else{
      e.style.display="none"
      document.getElementById(b).innerHTML = "+"
    }         
 
  return true;
}

function toggleChildren(round) { 
   var e= document.getElementById('round_' + round);  
   if (e.style.display=="block") return
   parent.expect_frame.location = 'about:blank';
   parent.descr_frame.location  = 'about:blank';
   parent.actual_frame.location = 'about:blank';
   var roundChildren = document.getElementsByClassName(round); 
   for (var i = 0; i < roundChildren.length; i++) { 
      if (roundChildren[i].id.indexOf('testsymbol') == 0) {
         roundChildren[i].innerHTML = "+" ;
         hideFrame();
      } else { 
         roundChildren[i].style.display="none";
      }  
   }   
} 

function hideFrame() {

   parent.document.getElementById('Atual_info').rows  = "0%,*";
   parent.document.getElementById('main_status').rows = "100%,0%";
   parent.document.getElementById('descr_info').cols = "100%,0%";
   parent.descr_frame.location = 'testcase_end_result.html'; 
}



function showFrame() {

   //parent.document.getElementById('other_info').cols  = "33%,67%";
   //parent.document.getElementById('main_status').rows = "35%,65%";
   parent.document.getElementById('Atual_info').rows  = "67%,33%";
   parent.document.getElementById('main_status').rows = "30%,70%";
   parent.document.getElementById('descr_info').cols = "50%,50%"

}

function hideWarningFrame() {
	parent.document.getElementById('main_status').rows = "30%,70%";
	parent.document.getElementById('descr_info').cols = "50%,50%"
	parent.document.getElementById('Atual_info').rows  = "100%,0%";
}

function showWarningFrame() {
	parent.document.getElementById('Atual_info').rows  = "67%,33%";
   parent.document.getElementById('main_status').rows = "30%,70%";
   parent.document.getElementById('descr_info').cols = "50%,50%"
	

}


function hideShowLayer() 
{ 
  var layerCount = document.layerCount.lineCounter.value; 
  //Check to see if checked or not...
  if (document.showdate.displayDate.checked == true) { 
     var displayMode = "inline";
  } else { 
     var displayMode = "none";
  } 

  for(i=1; i <= layerCount; i++) 
  {
    if (document.getElementById("line_"+i) != null ) { 
       document.getElementById("line_"+i).style.display=displayMode;
    } 
  } 
} 
function hideShowTraceLayer() 
{ 
	var trace=document.getElementById("trace_0");
	var symbol=document.getElementById("symbol_0");
	var i=0;
	var displayMode = "";
	//Check to see if checked or not...
	if (document.showtrace.displaytrace.checked == true) { 
		displayMode = "inline";
		//'trace_0','symbol_0'
		i=0;
		while (trace != null && symbol != null ){
			trace.style.display="block";
			symbol.innerHTML = "-"
			trace=document.getElementById("trace_" + i);
			symbol=document.getElementById("symbol_"+ i);
			i=i+1;
			}  
	}
	else { 
		i=0;
		while (trace != null && symbol != null ){
			displayMode = "none";
			trace.style.display="none"
			symbol.innerHTML = "+"
			trace=document.getElementById("trace_" + i);
			symbol=document.getElementById("symbol_"+ i);
			i=i+1;
			}  
		
	} 
  
 }  


function hideShowStepInfo() 
{ 
  var stepInfoCount = document.stepInfoCount.stepInfoCounter.value;
  var borderMode = "1px solid black";
  if (document.showStepInfo.displayStepInfo.checked == true) { 
     var displayMode = "table";
     var displayModeTD = "table-cell";
     var displayModeTH = "table-cell";
  } else { 
     var displayMode = "none";
     var displayModeTD = "none";
     var displayModeTH = "none";
  } 

  if (document.getElementById("step_info_heading") != null ) { 
       document.getElementById("step_info_heading").style.display=displayModeTH;
  }
  
  for(i=1; i <= stepInfoCount; i++) 
  {
    if (document.getElementById("step_info_"+i) != null ) { 
       document.getElementById("step_info_cell_"+i).style.display=displayModeTD;
       document.getElementById("step_info_"+i).style.display=displayMode;
    }
  }
} 

function hideShowStepElapsedTime()
{
  var stepInfoCount = document.stepInfoCount.stepInfoCounter.value;
  var borderMode = "1px solid black";
  if (document.showElapsedTime.displayElapsedTime.checked == true) {
     var displayMode = "table";
     var displayModeTD = "table-cell";
     var displayModeTH = "table-cell";
  } else {
     var displayMode = "none";
     var displayModeTD = "none";
     var displayModeTH = "none";
  }
 
  if (document.getElementById("elapsed_time_heading") != null ) {
       document.getElementById("elapsed_time_heading").style.display=displayModeTH;
  }
 
  for(i=1; i <= stepInfoCount; i++)
  {
    if (document.getElementById("elapsed_time_"+i) != null ) {
       document.getElementById("elapsed_time_cell_"+i).style.display=displayModeTD;
       document.getElementById("elapsed_time_"+i).style.display=displayMode;
    }
  }
}

function loadExpected(expRef) 
{ 
	parent.expect_frame.location.href = expRef;
}

function loadActual(actRef) 
{ 
	parent.actual_frame.location.href = actRef;
}
 
function loadWarning(warningRef) 
{ 
	parent.actual_frame.location.href = warningRef;
 }

function popout(target) 
{ 
	//window.open(target);	
	var OpenWindow=window.open(target, 'toolbar=no, menubar=no, location=no, status= no, scrollbars=yes, resizable=yes');
	
	
	//not working in IE8
	//OpenWindow.onload = function(){OpenWindow.document.getElementById("popoutWindow").style.visibility="hidden";};
    
	OpenWindow.onload = new function() { OpenWindow.document.getElementById("popoutWindow").style.visibility="hidden";};	
	
	return false;	
 }


  