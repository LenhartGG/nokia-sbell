
var _nodeList = []; // list of all nodes in the connection
var _neList   = []; // list of all nes in the connection
var _portList = []; // list of all ports in the connection
var _connList = []; // list of all connections
var _ctpPortList = []; // list of all connections
var _opsaportList = []; // list of all OPSA ports not used in links in the connection
var _xcList   = []; // list of all xcs in the connection
var _lcList   = []; // list of all lcs in the connection
var _pgList   = []; // list of all pgs in the connection
var _neIdObjectMap = {};
var _nodeBoxList = []; //list of all nodeBox in the connection
var _packList = []; //list of all _packList in the E2E connection

var _nodeMap  = [];	// map containing the node objects created for nodes 
var _portMap  = [];	// map containing the smallNode objects created for internal ports
var _packMap = [];  //for adding pack 
var _connId   = -1;
var fbrRefresh   = true;
var fbrIntermRefresh   = false;
var fiberDetails = null;
var _nprConnId   = -1;
var _nprTlId   = "-1";
var _currentRoute   = "false";
var _sdhConnectionId   = -1;
var _aNodeId   = -1;
var _zNodeId   = -1;
var _aPortName   = "";
var _zPortName   = "";
var _aNodeName   = "";
var _zNodeName   = "";
var _isThirdPartySupported = "false";
var _isFiberSupported = false;
var _is3R   = "false";
var _isSLTESupported = "false";
var _protectionRole = "";
var _isL1   = "false";

var _connType = "trail";
var _connName = "";
var _primaryConnObject = new Object();

var _channelContext   = -1;

var setNodeList = function( l ) { _nodeList = l; };
var getNodeList = function()    { return _nodeList; };
var setPackList = function( l ) { _packList = l; };
var getPackList = function()    { return _packList; };
var setElementsList = function( l ) { _elements = l; };
var getElementsList = function()    { return _elements; };
var setNodeBoxList = function( l ) { _nodeBoxList = l; };
var getNodeBoxList = function()    { return _nodeBoxList; };
var setNeList   = function( l ) { _neList = l; };
var getNeList   = function()    { return _neList; };
var setPortList = function( l ) { _portList = l; };
var getPortList = function()    { return _portList; };
var setCtpPortList = function( l ) { _ctpPortList = l; };
var getCtpPortList = function()    { return _ctpPortList; };
var setOPSAPortList = function( l ) { _opsaportList = l; };
var getOPSAPortList = function()    { return _opsaportList; };
var setConnList = function( l ) { _connList = l; };
var getConnList = function()    { return _connList; };
var setXcList   = function( l ) { _xcList = l; };
var getXcList   = function()    { return _xcList; };
var setLcList   = function( l ) { _lcList = l; };
var getLcList   = function()    { return _lcList; };
var setPgList   = function( l ) { _pgList = l; };
var getPgList   = function()    { return _pgList; };
var setNeIdMap  = function( l ) { _neIdObjectMap = l; };
var getNeIdMap  = function()    { return _neIdObjectMap; };
var setPackIdMap  = function( l ) { _packIdObjectMap = l; };
var getPackIdMap  = function()    { return _packIdObjectMap; };
var setPortIdMap  = function( l ) { _portIdObjectMap = l; };
var getPortIdMap  = function()    { return _portIdObjectMap; };
var setNodeMap  = function( l ) { _nodeMap = l; };
var getNodeMap  = function()    { return _nodeMap; };
var setPackMap  = function( l ) { _packMap = l; };
var getPackMap  = function()    { return _packMap; };
var setPortMap  = function( l ) { _portMap = l; };
var getPortMap  = function()    { return _portMap; };
var setConnId   = function( l ) { _connId = l; };
var getConnId   = function()    { return _connId; };
var setNprConnId   = function( l ) { _nprConnId = l; };						
var getNprConnId   = function()    { return _nprConnId; };
var setNprTlId   = function( l ) { _nprTlId = l; };						
var getNprTlId   = function()    { return _nprTlId; };
var setCurrentRoute   = function( l ) { _currentRoute = l; };
var getCurrentRoute   = function() { return _currentRoute; };
var setConnType   = function( l ) { _connType = l; };
var getConnType   = function()    { return _connType; };
var setConnName   = function( l ) { _connName = l; };
var getConnName   = function()    { return _connName; };
var setContextMenu   = function( l ) { _contextMenu = l; };
var getContextMenu   = function()    { return _contextMenu; };
var setChannelContext   = function( l ) { _channelContext = l; };
var getChannelContext  = function()    { return _channelContext; };
var setSdhConnectionId  = function( l ) { _sdhConnectionId = l; };
var getSdhConnectionId  = function()    { return _sdhConnectionId; };
var setANodeId  = function( l ) { _aNodeId = l; };
var getANodeId  = function()    { return _aNodeId; };
var setZNodeId  = function( l ) { _zNodeId = l; };
var getZNodeId  = function()    { return _zNodeId; };
var setAPortName  = function( l ) { _aPortName = l; };
var getAPortName  = function()    { return _aPortName; };
var setZPortName  = function( l ) { _zPortName = l; };
var getZPortName  = function()    { return _zPortName; };
var setANodeName  = function( l ) { _aNodeName = l; };
var getANodeName  = function()    { return _aNodeName; };
var setZNodeName  = function( l ) { _zNodeName = l; };
var getZNodeName  = function()    { return _zNodeName; };
var setIs3R  = function( l ) { _is3R = l; };
var getIs3R  = function()    { return _is3R; };
var setProtectionRole = function(l) { _protectionRole = l; };
var getProtectionRole = function()  { return _protectionRole; };
var setIsL1  = function( l ) { _isL1 = l; };
var getIsL1  = function()    { return _isL1; };
var setIsThirdPartySupported  = function( l ) { _isThirdPartySupported = l; };
var getIsThirdPartySupported  = function()    { return _isThirdPartySupported; };
var setIsFiberSupported  = function( l ) { _isFiberSupported = l; };
var getIsFiberSupported  = function()    { return _isFiberSupported; };
var setIsSLTESupported  = function( l ) { _isSLTESupported = l; };
var getIsSLTESupported  = function()    { return _isSLTESupported; };
var setPrimaryConn = function( connItem ){
	_primaryConnObject = connItem;
	setConnType( connItem.connectionType );
	setConnId  ( connItem.id );
};
var getPrimaryConn = function( ){
	return _primaryConnObject;
}

var graph = null;
var paper = null;
var isRefresh = false;
 
var setGraph   = function( l ) { graph = l; };
var getGraph   = function()    { return graph; };
var setPaper   = function( l ) { paper = l; };
var getPaper   = function()    { return paper; };
var setRefresh   = function( l ) { isRefresh = l; };
var getRefresh   = function()    { return isRefresh; };

// var otm    = new OtnMsgUtils();
// var otnRest = new OtnREST();
// var otn_i18nStrings = otm.getI18nStrings();
var loadingMsg = "loadingMessage";
var panAndZoom = '';

var nodeColor = {
		NODEBOX_ONE: '#E0FFFF',  	//​LightCyan       
		NODEBOX_TWO: '#B0E0E6',		// PowderBlue 		
		NODEBOX_THREE: '#87CEFA',	// LightSkyBlue
		NODEBOX_FOUR: '#E6E6FA',	// Lavender	
		NODEBOX_FIVE: '#D8BFD8',	// Thistle   
		NODEBOX_SIX: '#DDA0DD', 	// Plum
		NODEBOX_SEVEN: '#FFEFD5',	// ​PapayaWhip
		NODEBOX_EIGHT: '#F5DEB3',	// Wheat 
		NODEBOX_NINE: '#DEB887',	// BurlyWood                
		NODEBOX_TEN: '#BDB76B',		// DarkKhaki

};
var alarmMap = {
		1: "AS_CRITICAL",
		2: "AS_MAJOR",
		3: "AS_MINOR",
		4: "AS_WARNING",
		5: "AS_PROMPT",
		6: "AS_DEFERRED",
		7: "AS_INFO",
		8: "AS_INDETERMINATE",
		9: "AS_CLEARED",
		// Below were added to support String values
		"Critical" : "AS_CRITICAL",
		"Major"    : "AS_MAJOR",
		"Minor"    : "AS_MINOR",
		"Warning"  : "AS_WARNING",
		"Prompt"   : "AS_PROMPT",
		"Deferred" : "AS_DEFERRED",
		"Info"     : "AS_INFO",
		"Indeterminate": "AS_INDETERMINATE",
		"Cleared"  : "AS_CLEARED",
		"None"     : "AS_CLEARED",
};
var alarmValue = {
		AS_CRITICAL		:"1",
		AS_MAJOR		:"2",
		AS_MINOR		:"3",
		AS_WARNING		:"4",
		AS_PROMPT		:"5",
		AS_DEFERRED		:"6",
		AS_INFO			:"7",
		AS_INDETERMINATE:"8",
		AS_CLEARED		:"9",
};
var connectionIconIds = {
		"StepState"					:"StepState",
		"commissioningStatus"		:"commissioningStatus",
		"serverAlmState"			:"serverAlmState",
		"alarmState"				:"alarmState",
		"OpticalLayer"				:"OpticalLayer",
		"OperationalState"			:"OperationalState",
		"ServiceState"				:"ServiceState",
		"ConnectionDirection"		:"ConnectionDirection",
		"ProtectionType"			:"ProtectionType",
		"pm15MinEnabled"			:"pm15MinEnabled",
		"pm24HrEnabled"				:"pm24HrEnabled",
		"TCMStatus"					:"TCMStatus",
		"tcm15MinPMEnabled"			:"tcm15MinPMEnabled",
		"tcm24HrPMEnabled"			:"tcm24HrPMEnabled",
		"band"						:"band",
		"connObjectId"				:"connObjectId",
		"connImageId"				:"connImageId",
		"connNameId"				:"connNameId",
		"olcState"					:"olcState",
};

function portSeverity(nodeMap, portname, portAlarmSeverity)
{
	//端口port 的text显示 截取自portname
	var text = portname.substring(0, portname.lastIndexOf("-"));
	nodeMap.portProp(portname, 'attrs/text/text', text);	//text: { text: 'port1' }

	//Support of new jontjs version 1.0.3
	if (portAlarmSeverity.indexOf("AS_CRITICAL") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill', 'red'); //red	
	} else if (portAlarmSeverity.indexOf("AS_MAJOR") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill','ORANGE'); //Orange
	} else if (portAlarmSeverity.indexOf("AS_MINOR") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill', 'YELLOW'); //Yellow
	} else if (portAlarmSeverity.indexOf("AS_WARNING") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill', '#18EEE6'); //Blue 
	} else if (portAlarmSeverity.indexOf("AS_INDETERMINATE") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill','WHITE'); //White
	} else if (portAlarmSeverity.indexOf("AS_NOALARM") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill','lightgreen'); //Green for all other cases
	}else if (portAlarmSeverity.indexOf("AS_CLEARED") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/fill', 'lightgreen'); //Green for all other cases //#00FF00
	}
	
	
	/*if (portAlarmSeverity.indexOf("AS_CRITICAL") == 0) {
		nodeMap.attr('[port='+portname+']/fill', 'red'); //red	
	} else if (portAlarmSeverity.indexOf("AS_MAJOR") == 0) {
		nodeMap.attr('[port='+portname+']/fill', 'ORANGE'); //Orange
	} else if (portAlarmSeverity.indexOf("AS_MINOR") == 0) {
		nodeMap.attr('[port='+portname+']/fill', 'YELLOW'); //Yellow
	} else if (portAlarmSeverity.indexOf("AS_WARNING") == 0) {
		nodeMap.attr('[port='+portname+']/fill', '#18EEE6'); //Blue 
	} else if (portAlarmSeverity.indexOf("AS_INDETERMINATE") == 0) {
		nodeMap.attr('[port='+portname+']/fill','WHITE'); //White
	} else if (portAlarmSeverity.indexOf("AS_NOALARM") == 0) {
		nodeMap.attr('[port='+portname+']/fill', 'lightgreen'); //Green for all other cases
	}else if (portAlarmSeverity.indexOf("AS_CLEARED") == 0) {
		nodeMap.attr('[port='+portname+']/fill', 'lightgreen'); //Green for all other cases //#00FF00
	}*/
};


function ctpPortSeverity(nodeMap, portname, portAlarmSeverity)
{
	//Support of new jontjs version 1.0.3				
	if (portAlarmSeverity.indexOf("AS_CRITICAL") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 9);
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '4');
		nodeMap.portProp(portname, 'attrs/circle/stroke', 'red'); //red	
	} else if (portAlarmSeverity.indexOf("AS_MAJOR") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 9);
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '4');
		nodeMap.portProp(portname, 'attrs/circle/stroke','ORANGE'); //Orange
	} else if (portAlarmSeverity.indexOf("AS_MINOR") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 9); 
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '4');
		nodeMap.portProp(portname, 'attrs/circle/stroke', 'YELLOW'); //Yellow
	} else if (portAlarmSeverity.indexOf("AS_WARNING") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 9);
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '4');
		nodeMap.portProp(portname, 'attrs/circle/stroke', '#18EEE6'); //Blue 
	} else if (portAlarmSeverity.indexOf("AS_INDETERMINATE") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 9);
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '4');
		nodeMap.portProp(portname, 'attrs/circle/stroke','WHITE'); //White
	} else if (portAlarmSeverity.indexOf("AS_NOALARM") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 7); //lightgreen
		//nodeMap.portProp(portname, 'attrs/circle/stroke','lightgreen'); //Green for all other cases
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '1');
		nodeMap.portProp(portname, 'attrs/circle/stroke','black'); //Black
	}else if (portAlarmSeverity.indexOf("AS_CLEARED") == 0) {
		nodeMap.portProp(portname, 'attrs/circle/r', 7); //lightgreen
		//nodeMap.portProp(portname, 'attrs/circle/fill', 'lightgreen'); //Green for all other cases //#00FF00
		nodeMap.portProp(portname, 'attrs/circle/stroke-width', '1');
		nodeMap.portProp(portname, 'attrs/circle/stroke','black'); //Black
	}				

};

function setNodeCommissionStatus(node, nodeMap, strokeWidth) {		
	if(nodeMap[node.NeId]){
		if (node.commsStatus && node.commsStatus.indexOf("CS_UP") == 0) {
			nodeMap[node.NeId].attr({rect:{stroke:"green", 'stroke-width':strokeWidth}}); //green
		} else if (node.commsStatus && (node.commsStatus.indexOf("CS_DOWN") == 0 || node.commsStatus.indexOf("CS_FAILED") == 0)) {
			nodeMap[node.NeId].attr({rect:{stroke:"magenta", 'stroke-width':strokeWidth}}); //Magenta
		} else if (node.commsStatus && (node.commsStatus.indexOf("CS_NA") == 0 || node.commsStatus.indexOf("CS_DEACTIVATED") == 0 || node.commsStatus.indexOf("CS_UNKNOWN") == 0)) {
			nodeMap[node.NeId].attr({rect:{stroke:"darkGray", 'stroke-width':strokeWidth}}); //Gray
		} 
		return nodeMap;
	}
};

/*********************************************
 * BEGIN: ZOOM/PAN support
 *********************************************/
function svgPanningConfigParam(targetElement){
	// var targetElement= $('#paper')[0];
	//need to be changed for new jointjs 1.0.3
        // window.panZoomPenguin = svgPanZoom('#pvjs-diagram-1', {
		// 	zoomEnabled: true,
		// 	controlIconsEnabled: true,
		// 	fit: true,
		// 	center: true
		//   });
		panAndZoom = svgPanZoom('svg', 
			{
				// viewportSelector: targetElement.childNodes[1].childNodes[0],
				fit: false,
				zoomScaleSensitivity: 0.2,
				panEnabled: false,
				center: false,
				zoomEnabled: true,
				dblClickZoomEnabled: false,
				maxZoom: 5,
				minZoom: 0.2,  // leave very small, to zoomout on really large configurations
				onZoom: function(scale){
					currentScale = scale;
				},
				beforePan: function(oldpan, newpan){
					//no operations required before pan
				}
			});
		};

function svgPanningDragAndDrop(){
	getPaper().on('blank:pointerdown', function (evt, x, y) {
					panAndZoom.enablePan();
	});
	//Disable pan when the mouse button is released
	getPaper().on('cell:pointerup blank:pointerup', function(cellView, event) {
			panAndZoom.disablePan();			
	});
};

function svgZoomIn(){		
	panAndZoom.zoomIn(2, {x: 10, y: 10});
};

function svgZoomOut(){		
	panAndZoom.zoomOut(2);
};

function svgE2EZoomOut(zoomValue){		
	panAndZoom.zoom(zoomValue);
};
// 重置缩放比
function svgZoomReset(){
	panAndZoom.resetZoom();
};
// 重置仪表盘的位置
function svgResetPan(){
	panAndZoom.resetPan();
}
/*********************************************
 * END  : ZOOM/PAN support
 *********************************************/