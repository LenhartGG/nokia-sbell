
function E2ERoutingDisplay() {
    // 1.电路图
    _initGraphicalRouteDisplay()
    // 3.创建对象列表来画图
    createObjectLists()
}
function _initGraphicalRouteDisplay(){
        //1.创建画布 paper
        pageLayout()
        //2.添加图形事件处理配置
        configureEventHandling()

        isfirstNetworkDiagram = false;
}

var joinAmd = jointAmd();
joint.shapes.devs.ImageObj = joinAmd.ImageObj;
joint.shapes.devs.OTN = joinAmd.OTN;
joint.shapes.devs.Pack = joinAmd.Pack;
joint.shapes.devs.AmplifierPack = joinAmd.AmplifierPack;
joint.shapes.devs.Model = joinAmd.TriangleModel;
joint.shapes.devs.TriangleAmplifierPack = joinAmd.TriangleModel;

/********************************************************
 * GLOBAL VARIABLES:  Declare and initialize variables.
 *  (not for public consumption)
 *  Note that some of the variables we use are defined
 *  in the base class(es).
 ********************************************************/

// For i18n translations
// var otm    = new OtnMsgUtils();
// var i18Str = otm.getI18nStrings();
// var otn_i18nStrings = otm.getI18nStrings();
var dataRetriever = null;
var loadingMsg = "loadingMessage";
var DetailedView = "DetailedView";
var NodeView = "NodeView";
var ThirdPartyIndicator = "thirdPartyIndicator";
var fiberIndicator = "fiberIndicator";
var linkSeqCount = 1;
var isUnitTest = false;
var isPanningSupported = true;
var isSolidLinkHead = true;
var hideWTOCMFlipFlopSupported = false;
var hideDCMFlipFlopSupported = false;
var zoomOutValue = 0.8;
var zoomOutDisplay = false;
var isOLPProtectedConnection = false;
var isOTDRPackSupported = false;

// init paper
var pageLayout = function () {

    // var graph = new joint.dia.Graph();
    if( getPaper() ){
        setPaper(null);
    }
    if( getGraph() ){
        getGraph().clear()
    }
    setGraph(new joint.dia.Graph())
    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: $('#paper').width(),
        height: $('#paper').height(),
        gridSize: 1,
        model: getGraph(),
        linkPinning: false,
        defaultLink: new joint.dia.Link({
            attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
        }),
        validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
            // Prevent linking from input ports.
            if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
            // Prevent linking from output ports to input ports within one element.
            if (cellViewS === cellViewT) return false;
            // Prevent linking to input ports.
            return magnetT && magnetT.getAttribute('port-group') === 'in';
        },
        // Enable marking available cells & magnets
        markAvailable: true
    });
    //Added for panning support 
    if(isPanningSupported){
        svgPanningConfigParam( $('svg') );
    }
    setPaper(paper);
}


// 构造数据
var isConnAndServerLbandSupported = false;
var id = '5026';

// For i18n translations
var hideWTOCMFlipFlopSupported = false;
var hideDCMFlipFlopSupported = false;

// To improve the layout by hiding WTOCM and other layout-disrupting packs/links, 
//   set the following flags to true.
//   2017/03/01: intent is now to hide these by default in 14.2.  
//               May give the user control (via options panel)in 17.6 or later.
var hideLayoutDisruptingPacks = true;
var hideLayoutDisruptingLinks = true;
var isConnAndServerLbandSupported = false;
var isConnAndServerCbandSupported = false;
var isWtcomPacksPresent = false;

var physicalLinkList = [];

// var getUrlForIcon = function( i ) { return OtnREST.getUrlForIcon(i); };
var setPhysicalLinkList = function( l ) { physicalLinkList = l; };
var getPhysicalLinkList = function()    { return physicalLinkList; };


//L1 shows on left, VA1 on right (NFMTSW-243487)
//L1 should be on the "Line" side of the pack, along with the VA1.
//So moving the L1 from left to right side for First AZ link which has IN PORT as L1 port 
//It automatically covers AZ first link LINEIN and LINEOUT ports as well
function isAZFirstLinkLinePort( portDetails, linkDetails, firstLink ) {
    var isPortOnLineSide = false
    if(linkDetails.orientation == 'LCOT_AZ'){
        var portName = portDetails.portName;
        if(portName == undefined){
            portName = portDetails.guiLabel;
        }
        var  linePort = portName.substring(portName.lastIndexOf("-")+1, portName.length);
        if(linePort && linePort.indexOf('L') == 0 && isNextCharNumeric(linePort))
        {
            if( firstLink == 0 ){
                isPortOnLineSide = true;
                //Move line port only if it falls on same pack NFMTSW-277689
                var otherPortId = "";
                var otherPortDetails = [];
                if(portDetails.id === linkDetails.aPortId){	otherPortId = linkDetails.zPortId;}
                else if(portDetails.id === linkDetails.zPortId){otherPortId = linkDetails.aPortId;}
                var portList = this.getPortList();
                for(var i=0; i<portList.length; i++) {
                        if(portList[i].id === otherPortId){
                            if(portList[i].circuitPackId !== portDetails.circuitPackId){
                                    isPortOnLineSide = false;
                            }
                        }
                }
                        
            }else if(isPoolPackInvolved()){
                //If a poolpack connects to a line port's to near by packs it has to be placed outside of a pack
                //code been added to take care of 'L' line port placement (only poolpack case)
                //expecting that the links will all under AZ direction's 
                //need to be over looked for more generic case 
                if(isLinePortConnectingPoolPack(portDetails, linkDetails)){
                    //Added to avoid flip/flop happening at Z end of the connection 
                    //if the links are in AZ direction
                    if(linkDetails.aNEId == getConnList()[0].zNodeId || linkDetails.zNEId == getConnList()[0].zNodeId){
                        isPortOnLineSide = false;
                    }
                    else{
                        isPortOnLineSide = true;
                    }
                }
            }
        }
    }
    return isPortOnLineSide;

};


function isNextCharNumeric( linePort ) {
    var isLPort = false;
    if(linePort.length > 1){
    var nextChar = linePort.charAt(1);
    var isApha = isNaN(nextChar);
    if(isApha){isLPort = false;}
    else{isLPort = true;}
    }
    return isLPort;	 
};
  
function portBelongsToProtectedConnection( portObj ) {
    var pgList = this._pgList;
    if (pgList != null || pgList != undefined){
        for (var i=0; i<pgList.length; i++) {
            if ((pgList[i].protectionGroupId).indexOf(portObj.portId) == 0){
                return true;
            }
        }
    }

};

function isLinePortConnectingPoolPack( portDetails, linkDetails) {
    var isLinePortConnectingPoolPack = false;
    var port = portDetails.portId;	
    var linkConnList = this.getLcList();
    var ports = this.getPortList();
    for (var i=0; i<linkConnList.length; i++) {
        if(linkConnList[i].aPortId == port  && linkConnList[i].orientation == 'LCOT_AZ'){
            for(var p=0; p<ports.length;p++){
                    if(ports[p].portId == linkConnList[i].zPortId && ports[p].circuitPackName == 'PoolPack' ){
                        isLinePortConnectingPoolPack = true;
                        break;
                    }
            }				
        }
        else if(linkConnList[i].zPortId == port  && linkConnList[i].orientation == 'LCOT_AZ'){
            for(var p=0; p<ports.length;p++){
                    if(ports[p].portId == linkConnList[i].aPortId && ports[p].circuitPackName == 'PoolPack' ){
                        isLinePortConnectingPoolPack = true;
                        break;
                    }
            }
        }
    }
    return isLinePortConnectingPoolPack;	 
};

function isPoolPackInvolved( ) {
    var isPoolPackInvolved = false;  
    var pkList = this.getPackList();
    for(var i=0; i<pkList.length;i++){
        if((pkList[i].packType).indexOf('CPT_POOLPACK') == 0){
            isPoolPackInvolved = true;
            break;
        }
    }
    return isPoolPackInvolved;
    
};

function createObjectLists() {
    // var data = getOpticalData();
    var data = getData();
    console.log(data)
    data = data.data
    var nodeList = [];
    var neList = [];
    var portList = [];
    var finalPortList = [];
    var opsaList = [];
    var xcList = [];
    var ctpPortList = [];
    var lcList = [];
    var connList = [];
    var pgList = [];
    var nodeBoxList = [];
    var neIdObjectMap = {};
    var portIdObjectMap = {};
    var packIdObjectMap = {};
    var packList = [];
    var otsList = [];
    var isUniTest = true; //For Unit Test case
    var npr_id = getNprConnId()
    if (data != null) {

        for (var i = 0; i < data.length; i++) {
            if ('portId' in data[i]) {

            } else if ('linkConnectionId' in data[i]) {
                if (data[i].aPortId != data[i].zPortId) {
                    lcList.push(data[i]);
                }
            } else if ('protectionGroupId' in data[i]) {
                pgList.push(data[i]);
            } else if ('sncId' in data[i] && 'aportKey' in data[i]) {
                xcList.push(data[i]);
            } else if ('orderNumber' in data[i]) {
                connectionBandSupported(data[i]);
                if (data[i].id == id) {
                    connList.push(data[i]);
                    setConnId(data[i].id);
                }else if(data[i].nprTlId != "-1" && data[i].nprTlId == npr_id) {
                    connList.push(data[i]);
                    setConnId(data[i].id);
                }else if(isUniTest){
                    //For Unit Test case we are adding both primary connection and associated server connections to connList
                    connList.push(data[i]);
                }
                connList.push(data[i]);
                if (data[i].nprTlId != "-1") {
                    otsList.push(data[i]);
                }
            } else if ('nodeId' in data[i]) {
                nodeBoxList.push(data[i]);
            }

            // TODO: This is the preferred method for assigning objects
            if ('className' in data[i]) {
                if (data[i].className == 'networkElement') {
                    neList.push(data[i]);
                    neIdObjectMap[data[i].id] = data[i];
                }
                else if (data[i].className == 'circuitPack') {
                    packList.push(data[i]);
                    packIdObjectMap[data[i].id] = data[i];
                    if (matchPackOnTypeOrName(data[i], "CPT_WTOCM")) {
                        isWtcomPacksPresent = true;
                    }
                }
                else if (data[i].className == 'port') {
                    portList.push(data[i]);
                    if (data[i].portType == 'CTP') {
                        ctpPortList.push(data[i]);
                    }
                    portIdObjectMap[data[i].id] = data[i];
                }
            }
        }
    } else {
        return;
    }
    console.log("neList = ", neList);
    console.log("portList = ", portList);
    console.log("lcList = ", lcList);
    console.log("xcList = ", xcList);
    console.log("pgList = ", pgList);
    console.log("connList = ", connList);
    console.log("packList = ", packList);
    console.log("otsList = ", otsList);
    console.log("neIdObjectMap = ", neIdObjectMap);
    console.log("packIdObjectMap = ", packIdObjectMap);
    console.log("portIdObjectMap = ", portIdObjectMap);

    
    /*****************************************
     * Set random linkId if linkConnectionId== 0
     *****************************************/

    for (var i = 0; i < lcList.length; i++) {
        if (lcList[i].linkType == 'ACC' || lcList[i].linkConnectionId == 0) {
            lcList[i]["linkConnectionId"] = i;
        }
    }

    for (var i = 0; i < neList.length; i++) {
        for (var j = 0; j < portList.length; j++) {
            if (portList[j].neId == neList[i].id) {
                portList[j]["tpNeName"] = neList[i].guiLabel;
                portList[j]["neType"] = neList[i].neModel;
                portList[j]["isE2ERD"] = true;
                //added for portName issue in current route layout
                if (portList[j].portName == undefined) {
                    portList[j]['portName'] = portList[j].guiLabel;
                }
            }
        }
    }
            /******************************
             * Set the global data lists
             ******************************/
            
    setNodeList( neList );
    setNeList( neList );
    setPortList( portList );
    setCtpPortList( ctpPortList );
    setOPSAPortList ( opsaList );
    setXcList( xcList );
    setLcList( lcList );
    setPgList( pgList );
    setPackList( packList );
    setConnList( connList );
    setNeIdMap( neIdObjectMap );
    setPackIdMap( packIdObjectMap );
    setPortIdMap( portIdObjectMap );
    setNodeBoxList( nodeBoxList );
    setPhysicalLinkList( otsList );
    var packSize = packList.length;
    // 将2个单向链路合并到一个birdiectional链路中以改进布局方法，需要注意在AZ方向上的一个单向链路和ZA方向上的另一个单向链路
    mergeTwoUniToBiLink();
    specialHandlingForD5x500_3RLink();

    // if (!hideWTOCMFlipFlopSupported) {
    //     isWtocmPacksPresent();
    // }

    // if (!hideDCMFlipFlopSupported) {
    //     isDcmPacksPresent();
    // }

    //Added for mis-aligned OTS connections NFMTSW-345592
    alignOTSLinks();
    var neWidth = 200;
    var screenHeight = 50;
    console.log("Dynamically increasing the size of paper based on number of nodes");
    if (packSize > 20) {
        neWidth = 300;
    }
    getPaper().setDimensions(2500 + (neWidth * packSize), 1000 + (screenHeight * packSize));
    // var padLeft = '100px';
    // var padTop = '120px';
    var padLeft = '20px';
    var padTop = '20px';

    getPaper().svg.style.paddingLeft = padLeft;
    getPaper().svg.style.paddingTop = padTop;
    getPaper().svg.style.overflow = 'visible';

    console.log('calling insertPorts');


    insertPortsToPack();
    renderView();

}

function connectionBandSupported(connection) {
    if (connection.band && connection.band.indexOf("L") == 0) {
        isConnAndServerLbandSupported = true;
    } else if (connection.band && connection.band.indexOf("C") == 0) {
        isConnAndServerCbandSupported = true;
    }
}

function matchPackOnTypeOrName(pack, matchValue) {
    var rtnVal = false;
    if (matchPackOnType(pack, matchValue) || matchPackOnName(pack, matchValue)) {
        rtnVal = true;
    }
    return rtnVal;
};

function matchPackOnType(pack, matchValue) {
    var rtnVal = false;
    var packType = pack ? pack.packType : null;
    if (packType && packType == matchValue)
        rtnVal = true;
    return rtnVal;
};

function matchPackOnName(pack, matchValue) {
    var rtnVal = false;
    var packType = pack ? pack.packType : null;
    if (packType && packType.indexOf(matchValue) == 0)
        rtnVal = true;
    return rtnVal;
};

function alignOTSLinks() {
    var lcList = getLcList();
    if (lcList.length === 2) {
        connListItems = getConnList();
        if (connListItems[0].effectiveRate == 'OTS') {
            aNeName = connListItems[0].a1NeName;
            zNeName = connListItems[0].z1NeName;
            for (var j = 0; j < lcList.length; j++) {
                if (lcList[j].orientation == 'LCOT_ZA' && lcList[j].direction == 'CD_UNI') {
                    if (lcList[j].aNEName === aNeName && lcList[j].zNEName === zNeName) {
                        var aPortid = lcList[j].aPortId;
                        var aPortName = lcList[j].aPortName;
                        var aNEName = lcList[j].aNEName;
                        var aNEId = lcList[j].aNEId;

                        lcList[j].aPortId = lcList[j].zPortId;
                        lcList[j].aPortName = lcList[j].zPortName;
                        lcList[j].aNEName = lcList[j].zNEName;
                        lcList[j].aNEId = lcList[j].zNEId;

                        lcList[j].zPortId = aPortid;
                        lcList[j].zPortName = aPortName;
                        lcList[j].zNEName = aNEName;
                        lcList[j].zNEId = aNEId;
                    }
                }
            }
        }
    }
};


//To merge 2 unidirectional link into one birdiectional link to improve the layout 
// Method takes care if one uni link in AZ direction and another in ZA direction 
function mergeTwoUniToBiLink() {
    var linkList = getLcList();
    var finalLinkLists = [];
    var azLinks = [];
    var zaLinks = [];
    for (var i = 0; i < linkList.length; i++) {
        if (linkList[i].orientation == 'LCOT_AZ') {
            azLinks.push(linkList[i]);
        } else {
            zaLinks.push(linkList[i]);
        }
    }
    for (var i = 0; i < azLinks.length; i++) {
        for (var j = 0; j < zaLinks.length; j++) {
            if (azLinks[i].aPortId == zaLinks[j].zPortId && azLinks[i].zPortId == zaLinks[j].aPortId && azLinks[i].direction == zaLinks[j].direction) {
                azLinks[i].direction = "CD_BID";
                zaLinks[j]["duplicate"] = 'true';
            }
        }
    }

    finalLinkLists = azLinks;
    for (var i = 0; i < zaLinks.length; i++) {
        if (!(zaLinks[i].duplicate && zaLinks[i].duplicate == 'true')) {
            finalLinkLists.push(zaLinks[i]);
        }
    }

    setLcList(finalLinkLists);

};

function specialHandlingForD5x500_3RLink() {
    var linkList = getLcList();
    var packList = getPackList();
    var portList = getPortList();
    var d5xPack = [];
    var d5x500Ports = [];
    var d5x500Links = [];
    var d5x500AddedPorts = [];

    for (var i = 0; i < packList.length; i++) {
        if (packList[i].packName == 'D5X500' || packList[i].packName == 'D5X500Q') {
            d5xPack.push(packList[i]);
        }
    }
    for (var i = 0; i < d5xPack.length; i++) {
        for (var j = 0; j < portList.length; j++) {
            if (d5xPack[i].id == portList[j].circuitPackId && portList[j].portType != 'CTP') {
                d5x500Ports.push(portList[j]);
            }
        }
    }
    for (var j = 0; j < linkList.length; j++) {
        for (var i = 0; i < d5x500Ports.length; i++) {
            if (d5x500Ports[i].id == linkList[j].aPortId || d5x500Ports[i].id == linkList[j].zPortId) {
                d5x500Links.push(linkList[j]);
                break;
            }
        }
    }

    for (var i = 0; i < d5x500Links.length - 1; i++) {
        if (d5x500Links[i].aPortId == d5x500Links[i + 1].zPortId && d5x500Links[i + 1].aPortId == d5x500Links[i].zPortId) {
            for (var j = 0; j < d5x500Ports.length; j++) {
                if (d5x500Ports[j].id == d5x500Links[i + 1].zPortId) {
                    portList.push(createAndAddPort(d5x500Ports[j]));
                    d5x500Ports[j]["is3RPort"] = true;
                    d5x500Links[i]["is3RLink"] = true;
                    d5x500AddedPorts.push(d5x500Ports[j]);
                    break;
                }
            }
            for (var j = 0; j < linkList.length; j++) {
                if (linkList[j].aPortId == d5x500Links[i + 1].aPortId && linkList[j].zPortId == d5x500Links[i + 1].zPortId) {
                    linkList[j].zPortId = "-" + linkList[j].zPortId;
                    linkList[j].id = "-" + linkList[j].id;
                }
            }
        }
    }

    for (var j = 0; j < d5x500AddedPorts.length; j++) {
        for (var i = 0; i < d5x500Links.length; i++) {
            /*var zportPack;
            var aportPack;
            for(var k=0; k<portList.length; k++){
                if(d5x500Links[i].zPortId == portList[k].portId){
                    zportPack = portList[k].circuitPackName;
                }
                if(d5x500Links[i].aPortId == portList[k].portId){
                    aportPack = portList[k].circuitPackName;
                }
            }*/
            if (d5x500Links[i].aPortId == d5x500AddedPorts[j].portId && d5x500AddedPorts[j].is3RPort && !(d5x500Links[i].is3RLink)) { //zportPack && d5x500AddedPorts[j].circuitPackName != zportPack){
                d5x500Links[i].aPortId = "-" + d5x500Links[i].aPortId;
                d5x500Links[i].id = "-" + d5x500Links[i].id;
            }
        }
    }
    setPortList(portList);
    setLcList(linkList);
};

function isWtocmPacksPresent() {
    var packList = getPackList();
    document.getElementById("wtocmPack").style.visibility = "hidden";
    document.getElementById("wtocmPackLabel").style.visibility = "hidden";
    for (var i = 0; i < packList.length; i++) {
        if (packList[i].packType == 'CPT_WTOCM') {
            document.getElementById("wtocmPack").style.visibility = "visible";
            document.getElementById("wtocmPackLabel").style.visibility = "visible";
            isWTOCMPacks = true;
        }
    }
};

function isDcmPacksPresent() {
    var packList = getPackList();
    document.getElementById("dcmPack").style.visibility = "hidden";
    document.getElementById("dcmPackLabel").style.visibility = "hidden";
    for (var i = 0; i < packList.length; i++) {
        if (packList[i].packType == 'CPT_DCM') {
            document.getElementById("dcmPack").style.visibility = "visible";
            document.getElementById("dcmPackLabel").style.visibility = "visible";
            isDCMPacks = true;
        }
    }
};


/* Traverse the links.  
* 
*
*If srcPort.packId == snkPort.packId, snkPort will be on right side not left side.  (assuming it hasn’t been placed yet)
*If srcPort is placed, skip.
*If ( positionedPorts[srcPort.id] == null ) 
*    pack.outports.add( srcPort )
*positionedPorts[ srcPort.id ] = srcPort
*If ( positionedPorts[snkPort.id] == null )
*                pack.inports.add( snkPort )
*                positionedPorts[ snkPort.id ] = snkPort
*/
function insertPortsToPack() {
    console.log("in insertPortsToPacks");
    var portList = getPortList();
    var neList = getNeList();
    var packList = getPackList();
    var connection = getConnList();
    var linkList = getLcList();
    var odtrlinkList = [];
    var positionedPorts = {};
    var isSamePack = false;
    for (var i = 0; i < packList.length; i++) {
        packList[i].inPorts = [];
        packList[i].outPorts = [];
        packList[i].rightSide = 0;
        packList[i].leftSide = 0;
        packList[i].inPortsPtpName = [];
        packList[i].outPortsPtpName = [];
        packList[i].inPortsNativeName = [];
        packList[i].outPortsNativeName = [];
        packList[i].inPortsColour = [];
        packList[i].outPortsColour = [];
        packList[i].inPortsCtpOuterColour = [];
        packList[i].outPortsCtpOuterColour = [];
        packList[i].inPortsPG = [];
        packList[i].outPortsPG = [];
    }
    for (var i = 0; i < linkList.length; i++) {
        var srcPortId = linkList[i].aPortId;
        var sinkPortId = linkList[i].zPortId;
        var srcPort = linkList[i].aPortId;
        var sinkPort = linkList[i].zPortId;
        var orientation = linkList[i].orientation;
        var srcPackId = "";
        var sinkPackId = "";
        //Adding fiber details for otdr packs 
        if ((linkList[i].aPortName.indexOf("OTDR") >= 0 || linkList[i].zPortName.indexOf("OTDR") >= 0) && (linkList[i].aNEName != linkList[i].zNEName)) {
            var otsLinks = getPhysicalLinkList();
            var otdrOtsLinks = [];
            for (var r = 0; r < otsLinks.length; r++) {
                if (linkList[i].aNEName == otsLinks[r].a1NeName && linkList[i].zNEName == otsLinks[r].z1NeName) {
                    linkList[i].connectionId = otsLinks[r].id;
                    otdrOtsLinks.push(otsLinks[r]);
                    if (linkList[i].direction == "CD_UNI") {
                        linkList[i].isFiberSupported = true;
                        linkList[i]['otdrAZFiber'] = true;
                    }
                }
                if (linkList[i].aNEName == otsLinks[r].z1NeName && linkList[i].zNEName == otsLinks[r].a1NeName) {
                    linkList[i].connectionId = otsLinks[r].id;
                    otdrOtsLinks.push(otsLinks[r]);
                    if (linkList[i].direction == "CD_UNI") {
                        linkList[i].isFiberSupported = true;
                        linkList[i]['otdrZAFiber'] = true;
                    }
                }
            }

            if (otdrOtsLinks.length > 1) {
                var lst = [];
                var aportId = linkList[i].aPortId;
                var zportId = linkList[i].zPortId;
                var aPortPack;
                var zPortPack;
                for (var pp = 0; pp < portList.length; pp++) {
                    if (portList[pp].id == aportId) {
                        aPortPack = portList[pp].circuitPackId;
                    } else if (portList[pp].id == zportId) {
                        zPortPack = portList[pp].circuitPackId;
                    }
                }

                for (var lin = 0; lin < otdrOtsLinks.length; lin++) {

                    var aPhyPortId = otdrOtsLinks[lin].aPortId;
                    var zPhyPortId = otdrOtsLinks[lin].zPortId;
                    var a2PhyPortId = otdrOtsLinks[lin].a2PortId;
                    var z2PhyPortId = otdrOtsLinks[lin].z2PortId;

                    for (var l = 0; l < linkList.length; l++) {
                        if (aPhyPortId == linkList[l].aPortId || zPhyPortId == linkList[l].aPortId) {
                            lst.push(linkList[i].zPortId);
                        } else if (aPhyPortId == linkList[l].zPortId || zPhyPortId == linkList[l].zPortId) {
                            lst.push(linkList[i].aPortId);
                        }
                    }

                    var isCorrectOts = false;
                    for (var c = 0; c < lst.length; c++) {
                        for (var pp = 0; pp < portList.length; pp++) {
                            if (portList[pp].id == lst[c] && portList[pp].circuitPackId == aPortPack) {
                                isCorrectOts = true;
                            } else if (portList[pp].id == lst[c] && portList[pp].circuitPackId == zPortPack) {
                                isCorrectOts = true;
                            }
                        }
                    }

                    if (isCorrectOts) {
                        linkList[i].connectionId = otdrOtsLinks[lin].id;
                        if (linkList[i].aNEName == otdrOtsLinks[lin].a1NeName && linkList[i].zNEName == otdrOtsLinks[lin].z1NeName) {
                            linkList[i]['otdrAZFiber'] = true;
                            linkList[i]['otdrZAFiber'] = false;
                        } else {
                            linkList[i]['otdrAZFiber'] = false;
                            linkList[i]['otdrZAFiber'] = true;
                        }
                    }
                }

            }
        }
        //Removing ports without any links assoicated for special packs
        if (hideLayoutDisruptingLinks && isLayoutDisruptingLink(linkList[i])) {
            continue;
        } else if (isWtcomPacksPresent) {
            if (isConnAndServerCbandSupported && !isConnAndServerLbandSupported && isLbandWtocmLink(linkList[i])) {
                continue;
            } else if (isConnAndServerLbandSupported && !isConnAndServerCbandSupported && isCbandWtocmLink(linkList[i])) {
                continue;
            }
        }
        for (var j = 0; j < portList.length; j++) {
            if (portList[j].portId == srcPortId) {
                srcPackId = portList[j].circuitPackId;
            } else if (portList[j].portId == sinkPortId) {
                sinkPackId = portList[j].circuitPackId;
                //Vitual Pack fix at A end NE, Observer first link aPortId and zPortId been reversed
                if (i === 0 && portList[j].circuitPackName == "PoolPack") {
                    if (connection[0].aPortId != srcPortId) {
                        srcPort = sinkPortId;
                        sinkPort = srcPortId;
                        linkList[i].aPortId = srcPort;
                        linkList[i].zPortId = sinkPort;
                    }
                }
            }
        }
        //source port is already placed in pack in left side of a pack
        //we tried to push the sink port to right side of a pack
        // trying to avoid placing sink in the left side of a pack
        if (srcPackId == sinkPackId && orientation != 'LCOT_ZA') {
            isSamePack = true;
            srcPort = sinkPortId;
            sinkPort = srcPortId;

        }
        if (orientation == 'LCOT_ZA' && srcPackId != sinkPackId) {
            srcPort = sinkPortId;
            sinkPort = srcPortId;
        }
        if (positionedPorts && positionedPorts[srcPort] == null) {
            for (var j = 0; j < portList.length; j++) {
                if (portList[j].portId == srcPort) {
                    positionedPorts[srcPort] = portList[j];
                    var packId = portList[j].circuitPackId;
                    for (var k = 0; k < packList.length; k++) {
                        if (packList[k].id == packId) {
                            packList[k].outPorts.push(portList[j].portName + "-" + portList[j].portId);
                            packList[k].outPortsColour.push(portList[j].portAlarmState);
                            var ctpPorts = getCtpPortList();
                            var ctpColor = 'AS_NOALARM';
                            var defaultCtpAlarm = 9;
                            for (var c = 0; c < ctpPorts.length; c++) {
                                if (ctpPorts[c].physicalPortId == portList[j].portId) {
                                    var ctpAlm = ctpAlarmMaps(ctpPorts[c].portAlarmState);
                                    if (ctpAlm < defaultCtpAlarm) {
                                        ctpColor = ctpPorts[c].portAlarmState;
                                        portList[j]["ctpPortId"] = ctpPorts[c].portId;
                                        portList[j]["ctpAlarm"] = ctpColor;//otn_i18nStrings[ctpColor];
                                        defaultCtpAlarm = ctpAlarmMaps(ctpPorts[c].portAlarmState);
                                    }
                                }
                            }
                            packList[k].outPortsCtpOuterColour.push(ctpColor);
                            //portList[j][otn_i18nStrings["ctpAlarm"]] = otn_i18nStrings[ctpColor];
                        }
                    }
                }
            }
        }
        if (positionedPorts && positionedPorts[sinkPort] == null) {
            for (var j = 0; j < portList.length; j++) {
                if (portList[j].portId == sinkPort) {
                    positionedPorts[sinkPort] = portList[j];
                    var packId = portList[j].circuitPackId;
                    for (var k = 0; k < packList.length; k++) {
                        if (packList[k].id == packId) {
                            //First link L1 port should be on the "Line" side of the pack
                            var ctpPorts = getCtpPortList();
                            var ctpColor = 'AS_NOALARM';
                            var defaultCtpAlarm = 9;
                            for (var c = 0; c < ctpPorts.length; c++) {
                                if (ctpPorts[c].physicalPortId == portList[j].portId) {
                                    var ctpAlm = ctpAlarmMaps(ctpPorts[c].portAlarmState);
                                    if (ctpAlm < defaultCtpAlarm) {
                                        ctpColor = ctpPorts[c].portAlarmState;
                                        portList[j]["ctpPortId"] = ctpPorts[c].portId;
                                        portList[j]["ctpAlarm"] = ctpColor;//otn_i18nStrings[ctpColor];
                                        defaultCtpAlarm = ctpAlarmMaps(ctpPorts[c].portAlarmState);
                                    }
                                }
                            }
                            if (isAZFirstLinkLinePort(portList[j], linkList[i], i)) {
                                packList[k].outPorts.push(portList[j].portName + "-" + portList[j].portId);
                                packList[k].outPortsColour.push(portList[j].portAlarmState);
                                packList[k].outPortsCtpOuterColour.push(ctpColor);
                            }
                            else {
                                packList[k].inPorts.push(portList[j].portName + "-" + portList[j].portId);
                                packList[k].inPortsColour.push(portList[j].portAlarmState);
                                packList[k].inPortsCtpOuterColour.push(ctpColor);
                            }

                        }
                    }
                }
            }
        }

    }
};

//***********************************************************************************
// Once the data is retrieved through the REST call, this function is invoked
// Add connection Object. Then NE Object.
// For all the objects in neList a node is drawn
// For all the ports that are internal, a "smallNode" object is created and placed within the parent node
// A "node".embed() method is called to embed the smallNode onto the parent node object
//***********************************************************************************
function renderView() {
    //E2E RD will conn data will get enabled once we get it in service call

    // 左上角的图形属性对象
    //this.drawConnectionAttributeObject();

    //E2E Shape testing code 
    /* var amplifierPack = new joint.shapes.devs.Model({
        markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        size: {
        width: 100,
        height: 100
        },                	
        inPorts: [],
        outPorts: []
    });*/

    var packList = getPackList();
    var packMap = getPackMap();
    var neMap = getNodeMap();
    var port = getPortList();
    console.log('packList: ', packList);
    console.log('packMap: ', packMap);
    console.log('neMap: ', neMap);
    console.log('port: ', port);
    
    // Create NEs.
    //    It seems these need to be added to the graph before the packs.
    var nes = getNeList();
    for (var i in nes) {
        // TODO: If there are no packs in this NE, then no need to create it.
        var neId = nes[i].id;
        if (!neHasPacks(neId)) {
            continue;
        }
        neMap[neId] = new joint.shapes.devs.Coupled({
            class: "ne noStatus",
            'neId': neId,
            size: {
                width: 1,
                height: 1
            }
        });
        neMap[neId].attr({ rect: { fill: getNeColor(), stroke: 'white' } });

        var neObj = neMap[neId];
        neObj.title = nes[i].guiLabel;
        neObj.attr({
            '.label': {
                text: nes[i].guiLabel,
                'ref-y': -18,
                'fill': 'black'
            }, tspan: { 'font-size': 14, style: { 'font-weight': 'bold' } }
        });
        getGraph().addCell(neObj);

    }
    setNodeMap(neMap);
    // return;


    // Create the CircuitPacks
    var hideLayoutDisruptingPacks = getHideLayoutDisruptingPacks();
    var layoutDisruptingPacks = [];  // a list of hidden packs
    var hiddenPackMap = [];  // indexed by packId

    // Determine pack dimensions
    // Inputs: portRadius, number of side ports.
    var minVerticalPorts = 2;  // for a default height
    var minHorizontalPorts = 2;  // for a default width
    var portRadius = 8;  // matches joint.shapes.devs.otnAmd.Pack's "circle" radius
    var portOffset = new Object();
    var portSpacing = new Object();
    portOffset.y = 10;  // For now, a guess.  Config is probably in some superclass of Pack
    portOffset.x = 0;   // actually, this is probably a negative number as the port overlaps the edge.
    portSpacing.y = 40;  // Our decision.  Leave enough space btwn pors for links with arrowheads.
    portSpacing.x = 35;
    for (var pack = 0; pack < packList.length; pack++) {
        console.log("packId------- = " + packList[pack].id);
        var packType = packList[pack].packType;
        var thisPack = packList[pack];
        //               var nodeHeight = this.heightUnit*3;//nodeMap[portList[i].neId].attributes.size.height;
        //                var packWidth = this.widthUnit*2;//nodeMap[portList[i].neId].attributes.size.width;
        var numInPorts = thisPack.inPorts ? thisPack.inPorts.length : 0;
        var numOutPorts = thisPack.outPorts ? thisPack.outPorts.length : 0;
        var maxVerticalPorts = Math.max(minVerticalPorts, numInPorts, numOutPorts);
        var maxHorizontalPorts = minHorizontalPorts;  /* may need to revisit */
        var packHeight = 2 * portOffset.y + maxVerticalPorts * (2 * portRadius) + (maxVerticalPorts - 1) * portSpacing.y;
        var packWidth = 2 * portOffset.x + maxHorizontalPorts * (2 * portRadius) + (maxHorizontalPorts - 1) * portSpacing.x;
        //                if(packList[pack].inPorts && packList[pack].inPorts.length > 2 ){
        //					packHeight = packHeight + (packList[pack].inPorts.length * 20);
        //				}
        //				else if (packList[pack].outPorts && packList[pack].outPorts.length > 2)
        //				{
        //					packHeight = packHeight + (packList[pack].outPorts.length * 20);
        //				}
        packList[pack]['size'] = {
            "width": packWidth,
            "height": packHeight
        };
        if (packList[pack].packType == 'CPT_AMPLIFIER') {
            var useSpecialPackShapeForAmplifier = false;
            //AmplifierPack is a rectagular pack, but green
            //TriangleAmplifierPack is a different shape.

            if (useSpecialPackShapeForAmplifier) {
                packMap[packList[pack].id] = new joint.shapes.devs.TriangleAmplifierPack(packList[pack]);
                packList[pack]['size'] = {
                    "width": packWidth + 20,
                    "height": -20
                };
            }
            else {
                packMap[packList[pack].id] = getPackWithColor(packList[pack], getPackColor(packType));
            }

            //var inports = packList[pack].inPorts;
            //var inlength = inports.length;
            var outports = packList[pack].outPorts;
            var outlength = outports.length;
            if (outlength == 2) {
                packMap[packList[pack].id].attr('.outPorts .port0 .port-body', { 'ref-x': -30, 'ref-y': 5 });
                packMap[packList[pack].id].attr('.outPorts .port1 .port-body', { 'ref-x': -30, 'ref-y': -25 });
            }

        }
        else {
            // Skip some packs that cause layout issues
            if (hideLayoutDisruptingPacks && isLayoutDisruptingPack(packList[pack])) {
                // add to list of packs that we're hiding?
                layoutDisruptingPacks.push(packList[pack]);
                hiddenPackMap[packList[pack].id] = packList[pack];
                continue;
            } else if (isWtcomPacksPresent) {
                if (matchPackOnTypeAndBand(packList[pack], "CPT_WTOCM", "L") && isConnAndServerCbandSupported && !isConnAndServerLbandSupported) {
                    hiddenPackMap[packList[pack].id] = packList[pack];
                    continue;
                } else if (matchPackOnTypeAndCband(packList[pack], "CPT_WTOCM", "C") && isConnAndServerLbandSupported && !isConnAndServerCbandSupported) {
                    hiddenPackMap[packList[pack].id] = packList[pack];
                    continue;
                }
            }
            // BEGIN: DELETE ME
            //					// Monitor & Pool packs cause alignment issues.  Mark them separately.
            //					if(packList[pack].packType == 'CPT_MONITOR'){
            //						packMap[packList[pack].id] = this.getPackWithColor(packList[pack],'blue');
            //					}
            //					else if (packList[pack].packType == 'CPT_POOLPACK'){
            //						packMap[packList[pack].id] = this.getPackWithColor(packList[pack],'blue');
            //					}
            //					else {
            //						packMap[packList[pack].id] = new joint.shapes.devs.Pack(packList[pack]);
            //					}
            // END  : DELETE ME
            packMap[packList[pack].id] = getPackWithColor(packList[pack], getPackColor(packType));

            /*packMap[packList[pack].id].attr({
                '.inPorts .port0': {transform: 'rotate(-90)', 'ref-x':-30,'ref-y':-0.3}
            });*/

            //code to place the inport/outport port0 on top of the pack with label positioned need to be altered
            //if its a different port 
            var ins = packList[pack].inPorts.length;
            var out = packList[pack].outPorts.length;
            var portPosition = '';
            var inOrOut = '';
            var isSpecialOMDPack = false;
            if (ins > 0) {
                for (var count = 0; count < ins; count++) {
                    var isInPortomd = packList[pack].inPorts[count].indexOf("OMD");
                    if (isInPortomd > -1) {
                        portPosition = count;
                        inOrOut = 'in';
                        isSpecialOMDPack = true;
                    }
                }
            }
            if (out > 0) {
                for (var count = 0; count < out; count++) {
                    var isOutPortomd = packList[pack].outPorts[count].indexOf("OMD");
                    if (isOutPortomd > -1) {
                        portPosition = count;
                        inOrOut = 'out';
                        isSpecialOMDPack = true;
                    }
                }
            }
            //code to place the outport port0 on tip of the pack with label positioned
            /*if(isSpecialOMDPack && inOrOut == 'out'){
            packMap[packList[pack].id].attr({
                '.outPorts .port0': {transform: 'rotate(-90)', 'ref-x':30,'ref-y':-0.3},
                '.outPorts .port0 text':{transform: 'rotate(90)', y: 0, x: -10 }
                });
            }*/

        }

        // Set NE name as the label  //packList[pack].neName+"\n"+
        // If possible, apply i18n translation to the pack name
        //    Assumes the i18n tag is "CPN_<packName.toUpperCase>"
        var tag_guiLabel = "CPN_" + packList[pack].guiLabel;
        var tag_packName = "CPN_" + packList[pack].packName + "asdasd";
        tag_guiLabel = tag_guiLabel.toUpperCase();
        tag_packName = tag_packName.toUpperCase();
        // packList[pack].guiLabel = otm.getI18nString(tag_guiLabel, packList[pack].guiLabel);
        // packList[pack].packName = otm.getI18nString(tag_packName, packList[pack].packName);

        var packLabel = packList[pack].guiLabel;
        if (packLabel != "YCABLE") {
            // slotLocation is redundant with packLabel
            var slotLocation = packList[pack].slotLocation;
            // var slotLabel = otn_i18nStrings["slotLocation_abbreviated"];
            var slotLabel = 'Slot';// todos
            if (!slotLabel || !slotLocation | slotLocation == "") {
                slotLabel = "";
            }
            //packLabel = packLabel +"\n"+ slotLabel + " " + slotLocation;
            if (packLabel == "") {
                packLabel = slotLabel + " " + slotLocation;
            }
            else {
                packLabel = packLabel + "\n" + slotLabel + " " + slotLocation;
            }
        }
        packMap[packList[pack].id].attr({ '.label': { text: packLabel } });
        if (packList[pack].inPorts) {
            var ports = packList[pack].inPorts;
            if (ports.length > 0) {
                for (var portCount = 0; portCount < ports.length; portCount++) {
                    var portColour = packList[pack].inPortsColour[portCount];
                    var ctpPortColour = packList[pack].inPortsCtpOuterColour[portCount];
                    portSeverity(packMap[packList[pack].id], packList[pack].inPorts[portCount], portColour);  // needs to be looked for alarm update for e2e
                    ctpPortSeverity(packMap[packList[pack].id], packList[pack].inPorts[portCount], ctpPortColour);  // needs to be looked for alarm update for e2e

                }
            }
        }
        if (packList[pack].outPorts) {
            var ports = packList[pack].outPorts;
            if (ports.length > 0) {
                for (var portCount = 0; portCount < ports.length; portCount++) {
                    var portColour = packList[pack].outPortsColour[portCount];
                    var ctpPortColour = packList[pack].outPortsCtpOuterColour[portCount];
                    portSeverity(packMap[packList[pack].id], packList[pack].outPorts[portCount], portColour); // needs to be looked for alarm update for e2e
                    ctpPortSeverity(packMap[packList[pack].id], packList[pack].outPorts[portCount], ctpPortColour); // needs to be looked for alarm update for e2e
                }
            }
        }
        //Set NE Config Download Status using a image object
        //E2E commented not required for pack based layout

        /*
            if (nodeList[node].configDownloadStatus.indexOf("CD_DISABLED") == 0) {
            cfgImageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/cfg_Disabled.gif")} });
            cfgImageObj.title = otn_i18nStrings["configDownLoadState"]+": Disabled";
            }

            var alarmSeverity = nodeList[node].alarmSeverity;
            //Set NE Alarm Status using a image object
            if (alarmSeverity.indexOf("AS_CRITICAL") == 0) {
            imageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/criticalAlarm.gif")} });
            imageObj.title = otn_i18nStrings["AS_CRITICAL"];
            } else if (alarmSeverity.indexOf("AS_MAJOR") == 0) {
            imageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/majorAlarm.gif")} });
            imageObj.title = otn_i18nStrings["AS_MAJOR"];
            } else if (alarmSeverity.indexOf("AS_MINOR") == 0) {
            imageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/minorAlarm.gif")} });
            imageObj.title = otn_i18nStrings["AS_MINOR"];
            } else if (alarmSeverity.indexOf("AS_WARNING") == 0) {
            imageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/warningAlarm.gif")} });
            imageObj.title = otn_i18nStrings["AS_WARNING"];
            } else if (alarmSeverity.indexOf("AS_INDETERMINATE") == 0) {
            imageObj.attr({ image: {'xlink:href': this.getUrlForIcon("common/minorAlarm.gif")} });
            imageObj.title = otn_i18nStrings["AS_MINOR"];
            } else if (alarmSeverity.indexOf("AS_NOALARM") == 0 || alarmSeverity.indexOf("AS_NA") == 0) {
            }

            imageObj.title = otn_i18nStrings["alarmState"]+": "+imageObj.title;
            //Set NE Communication Status by filling the NE border
            if (nodeList[node].commsStatus.indexOf("CS_UP") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"green"}}); //green
            } else if (nodeList[node].commsStatus.indexOf("CS_DOWN") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"magenta"}}); //Magenta
            } else if (nodeList[node].commsStatus.indexOf("CS_FAILED") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"magenta"}}); //Magenta
            } else if (nodeList[node].commsStatus.indexOf("CS_NA") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"darkGray"}}); //Gray
            } else if (nodeList[node].commsStatus.indexOf("CS_DEACTIVATED") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"darkGray"}}); //Gray
            } else if (nodeList[node].commsStatus.indexOf("CS_UNKNOWN") == 0) {
            nodeMap[nodeList[node].NeId].attr({rect:{stroke:"darkGray"}}); //Gray
            }

            */
        //Added for new jontjs version 1.0.3
        packMap[packList[pack].id].attr({ rect: { height: packHeight, width: packWidth } });
        var packObj = packMap[packList[pack].id];
        packObj.title = packMap[packList[pack].id].attributes.id;

        // amplifierPack.attr('.label/text','Model 2')	;             
        // this.getGraph().addCells([amplifierPack]);

        getGraph().addCell([packObj]);
        //this.getPaper().findViewByModel(packObj).options.interactive = false;

        //PG icon should be place above the Port label. So subtracting a small offset value.
        var yOffset = 30;

    }

    // Group the packs into the NEs 把板卡组合放入到网元中
    for (var neCount = 0; neCount < nes.length; neCount++) {
        //Set NE Communication Status by filling the NE border
        setNodeCommissionStatus(nes[neCount], neMap, '1.5');

        for (var count = 0; count < packList.length; count++) {
            if (packList[count].neId == nes[neCount].id) {
                // Is this a pack we've excluded?
                var packId = packList[count].id;
                if (!packMap[packId] || hiddenPackMap[packId])
                    continue;
                neMap[nes[neCount].id].embed(packMap[packList[count].id]);
            }
        }
    }
    // ------------------------------------------------------------
    // Now draw the internal ports by iterating through the port list
    // 1. iterate through the port list
    // 2. check if the port is an internal port
    // 3. if yes, get the parent NE from the node map, the co-ordinates for the port
    // 4. create a smallNode and set the name and co-ordinates and add to theportMap (neId+portId as key)
    // 5. graph.addCell(the new smallNode)
    // ------------------------------------------------------------
    console.log("now draw the internal ports");
    var portList = getPortList();
    var portMap = getPortMap();
    console.log('portList: ', portList);
    console.log('portMap: ', portMap);
    
    setPackMap(packMap);
    setPortMap(portMap);
    //commented to map Inder linear graph 
    drawLinks();
    
    var rankSpace = 190;
    if (isOLPProtectedConnection || isOTDRPackSupported) { rankSpace = 230; }
    else if (isOTDRPackSupported) { rankSpace = 190; }
    // alert("joint.layout.DirectedGraph.layout")
    var $graph = getGraph()
    joint.layout.DirectedGraph.layout($graph, {
        setLinkVertices: false,
        rankDir: "lr",
        nodeSep: 37,     //space between bottom and top nodes
        rankSep: rankSpace,
        clusterPadding: { left: 10, right: 10, top: 30, bottom: 10 },  // gap between parent and the boundary of embedded children
        marginX: 10,
        marginY: 10//space between bottom and top nodes
    });
    // return
    //been moved down of Directed graph because conn box size increases with the cluster padding changes.
    // alert("retrieveDataForAllFibers")
    // retrieveDataForAllFibers();

    if (!(zoomOutDisplay)) {
        if (initialZoomOutToViewElements()) {
            zoomOutDisplay = true;
        }
    }
    // this.drawConnectionAttributeObject();
    // this.drawConnectionObject();

    // if (zoomOutDisplay) {
        // document.getElementById("paper").style.transform = 'matrix(1, 0, 0, 1,-510.175, -290.25)';
        svgE2EZoomOut(zoomOutValue);
    // }

    //this.getGraph().addCells(this.getElementsList());
    // this.getGraph().addCells(this.e2eLinks);

};

function neHasPacks(neId) {
    var rtnVal = false;
    var packs = getPackList();
    for (var i = 0; i < packs.length; i++) {
        if (packs[i].neId == neId) {
            rtnVal = true;
        }
    }
    return rtnVal;
};

function getHideLayoutDisruptingPacks() {
    return hideLayoutDisruptingPacks;
}
function setHideLayoutDisruptingPacks(val) {
    hideLayoutDisruptingPacks = val;
}

// From light to dark
var COLOR_NOKIA_BLUE_050 = "#B6CEF6";
var COLOR_NOKIA_BLUE_100 = "#72A0EE";
var COLOR_NOKIA_BLUE_200 = "#407EE7";
var COLOR_NOKIA_BLUE_300 = "#1959C7";
var COLOR_NOKIA_BLUE_400 = "#154DAC";
var COLOR_NOKIA_BLUE_500 = "#124191";
var COLOR_NOKIA_BLUE_600 = "#0F3576";
var COLOR_NOKIA_BLUE_700 = "#0B295B";
var COLOR_NOKIA_BLUE_800 = "#081C3F";
var COLOR_NOKIA_BLUE_900 = "#041024";

var COLOR_NOKIA_GRAY_050 = "#F5F6F6";
var COLOR_NOKIA_GRAY_100 = "#CCCFD3";
var COLOR_NOKIA_GRAY_200 = "#ADB3B9";
var COLOR_NOKIA_GRAY_300 = "#879098";
var COLOR_NOKIA_GRAY_400 = "#76808A";
var COLOR_NOKIA_GRAY_500 = "#68717A";
var COLOR_NOKIA_GRAY_600 = "#5A6269";
var COLOR_NOKIA_GRAY_700 = "#4C5259";
var COLOR_NOKIA_GRAY_800 = "#3E4348";
var COLOR_NOKIA_GRAY_900 = "#303438";

var PRIMARYCOLOR_NOKIA_BLUE = "#124191";
var PRIMARYCOLOR_NOKIA_LIGHT_BLUE = "#00C9FF";
var PRIMARYCOLOR_NOKIA_DARK_GRAY = "#68717A";
var PRIMARYCOLOR_NOKIA__GRAY = "#A8BBC0";
var PRIMARYCOLOR_NOKIA_LIGHT_GRAY = "#D8D9DA";

function getNeColor() {
    var neColor = 'lightblue';
    neColor = this.COLOR_NOKIA_BLUE_050;
    return neColor;
};
var packColors = null; //{}
function getPackColor(packType) {
    // TEMP:  Monitor & Pool packs cause alignment issues.  Mark them separately. 
    var nonTransmissionPackThatCausesLayoutIssues = PRIMARYCOLOR_NOKIA_BLUE;
    var transmissionPackThatCausesLayoutIssues = PRIMARYCOLOR_NOKIA_BLUE;
    var opticalPacks = COLOR_NOKIA_GRAY_050;
    var amplifierPacks = COLOR_NOKIA_GRAY_100;
    var defaultColor = COLOR_NOKIA_GRAY_200;
    var unknownPackType = COLOR_NOKIA_GRAY_400;
    var interfacePacks = PRIMARYCOLOR_NOKIA_LIGHT_BLUE; //this.PRIMARYCOLOR_NOKIA_LIGHT_GRAY;

    var allTransmissionPacksSameColor = true;
    if (allTransmissionPacksSameColor) {
        //defaultColor   = this.COLOR_NOKIA_BLUE_050;
        opticalPacks = defaultColor;
        amplifierPacks = defaultColor;
        interfacePacks = defaultColor;
        transmissionPackThatCausesLayoutIssues = COLOR_NOKIA_GRAY_300;
        nonTransmissionPackThatCausesLayoutIssues = COLOR_NOKIA_GRAY_400;
        unknownPackType = COLOR_NOKIA_GRAY_500;
    }

    if (!packColors) {
        packColors = {};
        packColors['CPT_GENERIC'] = unknownPackType;
        packColors['CPT_AMPLIFIER'] = amplifierPacks;
        packColors['CPT_SFD'] = defaultColor;
        packColors['CPT_IOMUX'] = defaultColor;
        packColors['CPT_TRANSPONDER'] = interfacePacks;
        packColors['CPT_WAVELENGTH_SWITCH'] = opticalPacks;
        packColors['CPT_PHOTONIC_SPLITTER'] = opticalPacks;
        packColors['CPT_CONTENTIONLESS_FILTER'] = defaultColor;
        packColors['CPT_INTERLEAVER'] = defaultColor;
        packColors['CPT_FIBER_SHUFFLE'] = opticalPacks;
        packColors['CPT_MONITOR'] = nonTransmissionPackThatCausesLayoutIssues;
        packColors['CPT_WTOCM'] = nonTransmissionPackThatCausesLayoutIssues;
        packColors['CPT_DCM'] = nonTransmissionPackThatCausesLayoutIssues;
        packColors['CPT_YCABLE'] = defaultColor;
        packColors['CPT_IROADM'] = defaultColor;
        packColors['CPT_POOLPACK'] = transmissionPackThatCausesLayoutIssues;
    }
    var packColor = packColors[packType];
    if (!packColor) {
        packColor = 'white';
    }
    return packColor;
};
function getPackWithColor(packType, packColour) {
    var pack = new joint.shapes.devs.Pack(packType);
    var gradientStartColor = 'white';
    gradientStartColor = packColour;
    pack.color = packColour,
        pack.attr({
            rect: {
                fill: {
                    type: 'linearGradient',
                    color: packColour,
                    stops: [
                        { offset: '0%', color: gradientStartColor },
                        { offset: '50%', color: packColour }
                    ],
                    attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                }
            }
        });
    return pack;
};

function createLayoutDisruptingLinksConnectingPacks(link, direction, color, listObj) {

    var orientation = listObj.orientation;
    if (direction.indexOf("bi") == 0) {
        link.attr({
            '.connection': { stroke: color, 'stroke-width': '2.0', 'stroke-dasharray': '5 3'},
            '.marker-source': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }
    else if (orientation.indexOf("LCOT_AZ") == 0) {
        link.attr({
            '.connection': { stroke: color, 'stroke-width': '2.0', 'stroke-dasharray': '5 3'},
            //'.marker-source': { fill: 'white', d: 'M 10 0 L 0 5 L 10 10 z' }
            '.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }
    else {
        link.attr({
            '.connection': { stroke: color, 'stroke-width': '2.0', 'stroke-dasharray': '5 3'},
            '.marker-source': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            //'.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }

};

function createCrossConnections(link, direction, color, xcListObj) {

    var orientation = xcListObj.orientation;
    if (direction.indexOf("bi") == 0) {
        link.attr({
            '.connection': { stroke: color, 'stroke-dasharray': '5 3'},
            '.marker-source': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }
    else if (orientation.indexOf("LCOT_AZ") == 0) {
        link.attr({
            '.connection': { stroke: color, 'stroke-dasharray': '5 3'},
            //'.marker-source': { fill: 'white', d: 'M 10 0 L 0 5 L 10 10 z' }
            '.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }
    else {
        link.attr({
            '.connection': { stroke: color, 'stroke-dasharray': '5 3'},
            '.marker-source': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            //'.marker-target': { 'stroke-width': '2.5', fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
            '.link-tools': { display: 'none' },
            '.tools-remove': { display: 'none' }
        });
    }

};

function createLinkConnections(link, direction, color, linkListObj) {

    var neObject =  getNeList();
    var aNeId = linkListObj.aNEId;
    var zNeId = linkListObj.zNEId;
    var isGMREEnabledForSrcNE = "false";
    var isGMREEnabledForSinkNE = "false";
    var isMainActiveL1CP = false; // this.getConnList()[0].isMainActiveL1CP;  //Needs to be enabled in conn object is supported 
    var isSpareActiveL1CP = false; //this.getConnList()[0].isSpareActiveL1CP;  //Needs to be enabled in conn object is supported 
    for(var i=0; i < neObject.length; i++) {
        if(neObject[i].neId == aNeId){
            isGMREEnabledForSrcNE = neObject[i].isGMREEnabled;
        }else if(neObject[i].neId == zNeId){
            isGMREEnabledForSinkNE = neObject[i].isGMREEnabled;
        }
    }
    if(aNeId != zNeId){
        if(isGMREEnabledForSrcNE == "true" && isGMREEnabledForSinkNE != "true")
        {
            linkListObj["srcActive"] = "NA";
        }else if(isGMREEnabledForSrcNE != "true" && isGMREEnabledForSinkNE == "true"){
            linkListObj["sinkActive"] = "NA";
        }
    }
    var orientation = linkListObj.orientation;
    var sinkActive  = linkListObj.sinkActive;
    var srcActive   = linkListObj.srcActive;
    var arrowHeadStrokeWidth = '2.5';
    var arrowHeadStroke = COLOR_NOKIA_GRAY_900;
    var arrowHeadFill = COLOR_NOKIA_GRAY_900;
    if(isSolidLinkHead){
        sinkActive  = "ACTIVE";
        srcActive   = "ACTIVE";
        arrowHeadStrokeWidth = '1.5';
    }
    var displayStyle  = linkListObj.displayStyle;
    var linkStrokeWidth  = 1.5;//linkListObj.displayThickness;
    var L1linkState = linkListObj.displayLinkState;
    if(sinkActive == undefined){sinkActive = 'UNKNOWN'}
    if(srcActive == undefined){srcActive = 'UNKNOWN'}
    if(orientation == undefined){orientation = 'UNKNOWN'}
    var strokeStyle = 0;

    if (displayStyle.indexOf("dotted") == 0){
        strokeStyle = '2 2';
        link.attr({ isASONTCC: true});
    }else{
        link.attr({ isASONTCC: false});
    }
    //To Get Stick Arrows for Bidirectional Connections
    if ( ((srcActive.indexOf("UNKNOWN") == 0) || (srcActive.indexOf("NA") == 0)) &&
        ((sinkActive.indexOf("UNKNOWN") == 0) || (sinkActive.indexOf("NA") == 0)) &&
        (direction.indexOf("bi") == 0) ) {
        if(isMainActiveL1CP && isSpareActiveL1CP){
            if( (isMainActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_WORKING") == 0) || (isSpareActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_PROTECTED") == 0)){
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': '4.0', 'stroke-dasharray': strokeStyle },
                    '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                    '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
            else{
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle },
                    '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                    '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
        }
        else{
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle },
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
    }

    else if (direction.indexOf("bi") == 0) {

        //To Get Filled Arrows
        if ( (srcActive.indexOf("ACTIVE") == 0)  && (sinkActive.indexOf("ACTIVE") == 0)  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle },
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        //To Get Hollow Arrows
        else if ( (srcActive.indexOf("INACTIVE") == 0)  && (sinkActive.indexOf("INACTIVE") == 0)  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle },
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        else if ( (srcActive.indexOf("ACTIVE") == 0)  && (sinkActive.indexOf("INACTIVE") == 0)  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        else if ( (srcActive.indexOf("INACTIVE") == 0)  && (sinkActive.indexOf("ACTIVE") == 0)  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        else if ( (srcActive.indexOf("ACTIVE") == 0)  &&
            ((sinkActive.indexOf("UNKNOWN") == 0) || (sinkActive.indexOf("NA") == 0))  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        else if ( (srcActive.indexOf("INACTIVE") == 0)  &&
            ((sinkActive.indexOf("UNKNOWN") == 0) || (sinkActive.indexOf("NA") == 0))  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }

            });
        }
        else if ( (sinkActive.indexOf("ACTIVE") == 0)  &&
            ((srcActive.indexOf("UNKNOWN") == 0) || (srcActive.indexOf("NA") == 0))  ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
        else if ( (sinkActive.indexOf("INACTIVE") == 0 || sinkActive.indexOf("") == 0)  &&
            ((srcActive.indexOf("UNKNOWN") == 0) || (srcActive.indexOf("NA") == 0) || (srcActive.indexOf("") == 0)) ) {
            link.attr({
                '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.link-tools': { display: 'none' },
                '.tools-remove': { display: 'none' }
            });
        }
    }

    //UniDirectional Links start
    else {

        if ( orientation.indexOf("LCOT_ZA") == 0 ){

            //Source Arrows
            if ( sinkActive.indexOf("ACTIVE") == 0 ) {
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                    '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
            else if ( sinkActive.indexOf("INACTIVE") == 0 ) {
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                    '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
            else if ( (sinkActive.indexOf("UNKNOWN") == 0) || (sinkActive.indexOf("NA") == 0) ) {
                if(isMainActiveL1CP && isSpareActiveL1CP){
                    if( (isMainActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_WORKING") == 0) || (isSpareActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_PROTECTED") == 0)){
                        link.attr({
                            '.connection': { stroke: color, 'stroke-width': '4.0', 'stroke-dasharray': strokeStyle},
                            '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                            '.link-tools': { display: 'none' },
                            '.tools-remove': { display: 'none' }
                        });
                    }
                    else{
                        link.attr({
                            '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                            '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                            '.link-tools': { display: 'none' },
                            '.tools-remove': { display: 'none' }
                        });
                    }
                }
                else{
                    link.attr({
                        '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                        '.marker-source': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                        '.link-tools': { display: 'none' },
                        '.tools-remove': { display: 'none' }
                    });
                }
            }
        }
        else{

            //Sink Arrows
            if ( sinkActive.indexOf("ACTIVE") == 0 ) {
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                    '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: arrowHeadFill, d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
            else if ( sinkActive.indexOf("INACTIVE") == 0 ) {
                link.attr({
                    '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                    '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'transparent', d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.link-tools': { display: 'none' },
                    '.tools-remove': { display: 'none' }
                });
            }
            else if ( (sinkActive.indexOf("UNKNOWN") == 0) || (sinkActive.indexOf("NA") == 0) ) {
                if(isMainActiveL1CP && isSpareActiveL1CP){
                    if( (isMainActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_WORKING") == 0) || (isSpareActiveL1CP.indexOf("true") == 0 && L1linkState.indexOf("DLS_PROTECTED") == 0)){
                        link.attr({
                            '.connection': { stroke: color, 'stroke-width': '4.0', 'stroke-dasharray': strokeStyle},
                            '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                            '.link-tools': { display: 'none' },
                            '.tools-remove': { display: 'none' }
                        });
                    }
                    else{
                        link.attr({
                            '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                            '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                            '.link-tools': { display: 'none' },
                            '.tools-remove': { display: 'none' }
                        });
                    }
                }
                else{
                    link.attr({
                        '.connection': { stroke: color, 'stroke-width': linkStrokeWidth, 'stroke-dasharray': strokeStyle},
                        '.marker-target': { stroke: arrowHeadStroke, 'stroke-width': arrowHeadStrokeWidth, fill: 'none', d: 'M 10 0 L 0 5 L 10 10 ' },
                        '.link-tools': { display: 'none' },
                        '.tools-remove': { display: 'none' }
                    });
                }
            }

        }

    }//Unidirectional links end

};

//***********************************************************************************
// Function to draw the connections between ports:
// Iterate through the connection list to fetch the ports and directionality
// If the port is internal, retrieve the corresponding node object
// Pass this info to the connect function to draw the connections
//***********************************************************************************
function drawLinks() {
    console.log("time to draw links");
    var aNeObj;
    var zNeObj;
    var aNePort;
    var zNePort;
    var connDir = "uni";
    // ------------------------------------------------------------
    // Iterate through the linkConnList array;
    // If a port involved in the connection is an internal port:
    // 		- iterate through the portList array
    //		- get the portId and neId and build the key - neId_portId
    //		- retrieve the internal port object from the port map
    //		- set the aNeObj or zNeObj with the retrieved port object
    // ------------------------------------------------------------
    var linkConnList = getLcList();
    var portList = getPortList();
    var packMap  = getPackMap();
    var portMap  = getPortMap();
    
    // TODO: 2017/1/23: Extract the ZA links, then reverse their order.
    //  Must be done in conjunction with removing the same functionality from the Controller.

    // Some logic for hiding packs & links that trigger an 'bad' layout. 
    // These flags control whether the functionality is triggered.
    var hideLayoutDisruptingLinks = hideLayoutDisruptingLinks;  // if true, successfully removes the links
    var layoutDisruptingLinks = [];
    
    for (var i=0; i<linkConnList.length; i++) {
        aNeObj = packMap[linkConnList[i].aNEId];
        aNePort = linkConnList[i].aPortName;
        aNeId = linkConnList[i].aNEId;
        aPortId = linkConnList[i].aPortId;

        zNeObj = packMap[linkConnList[i].zNEId];
        zNePort = linkConnList[i].zPortName;
        zNeId = linkConnList[i].zNEId;
        zPortId = linkConnList[i].zPortId;

        if ( hideLayoutDisruptingLinks && isLayoutDisruptingLink(linkConnList[i]) ){
            layoutDisruptingLinks.push( linkConnList[i] );
            continue;
        }else if(isWtcomPacksPresent){
            if( isLbandWtocmLink(linkConnList[i]) && isConnAndServerCbandSupported && !isConnAndServerLbandSupported){
                continue;
            }else if( isCbandWtocmLink(linkConnList[i]) && isConnAndServerLbandSupported && !isConnAndServerCbandSupported){
                continue;
            }
        }
        //been fixed in serivce call
        /*if(linkConnList[i].redundantMVAClink){
            continue;
        }*/
        
        for(var j=0; j<portList.length; j++) {
            // PHM: This might match a shorter portId with a longer portId, which would be BAD.
            var circuitPackId = portList[j].circuitPackId;
            var packdetails = packMap[circuitPackId];
            if ((portList[j].portId == aPortId)) {

                // ------------------------------------------------------------
                // aPort is internal and should be present in the portMap
                // ------------------------------------------------------------
                var key = portList[j].neId + "_" + portList[j].portId;
                aNeObj = packdetails;
                aNePort = portList[j].portName+"-"+portList[j].portId;
                if(aNeObj == undefined){
                    aNeObj = packMap[portList[j].circuitPackId];
                }
            }                   	
            if ((portList[j].portId == zPortId)) {

                // ------------------------------------------------------------
                // zPort is internal and should be present in the portMap
                // ------------------------------------------------------------
                var key = portList[j].neId + "_" + portList[j].portId;
                zNeObj = packdetails;
                zNePort = portList[j].portName+"-"+portList[j].portId;
                if(zNeObj == undefined)
                    zNeObj = packMap[portList[j].circuitPackId];
            }
        }

        if (linkConnList[i].direction.indexOf("CD_BID") == 0)
            connDir = "bi";
        else
            connDir = "uni";
        console.log("direction = " + connDir);
    
        if(linkConnList[i].connectionId != -1){
            var physicalLinkList = getPhysicalLinkList();
            for(var x=0;x<physicalLinkList.length;x++){
            if(linkConnList[i].connectionId == physicalLinkList[x].id && physicalLinkList[x].effectiveRate == "OTS"){
                linkConnList[i].isFiberSupported = true;
                linkConnList[i].nprId = physicalLinkList[x].nprTlId;			
                var isBothPortsSFD = ( ( (linkConnList[i].aPortName && linkConnList[i].aPortName.indexOf("SFD") != -1) && (linkConnList[i].zPortName && linkConnList[i].zPortName.indexOf("SFD") != -1) ) ? true : false );
                var isAnyOnePortsSFC = ( ( (linkConnList[i].aPortName && linkConnList[i].aPortName.indexOf("SFC") != -1) || (linkConnList[i].zPortName && linkConnList[i].zPortName.indexOf("SFC") != -1) ) ? true : false );
                if (isBothPortsSFD){
                linkConnList[i].isFiberSupported = false;
                }
                else if(isAnyOnePortsSFC){
                linkConnList[i].isFiberSupported = false;
                }
                if(physicalLinkList[x].singleFiberChannelPlan && physicalLinkList[x].singleFiberChannelPlan != ''){
                linkConnList[i].singleFiberChannelPlan = physicalLinkList[x].singleFiberChannelPlan;
                }
            }
            }
            for(var g=0;g<linkConnList.length;g++){
            if(i==g)
                continue;
            if(linkConnList[g].aNEId != linkConnList[i].aNEId && linkConnList[i].aNEId == linkConnList[g].zNEId && linkConnList[g].aNEId == linkConnList[i].zNEId && !(linkConnList[g].isZSide == true)){
                linkConnList[g].isZSide = true;
                break;
            }
            }

        }
        
        if (linkConnList[i].orientation.indexOf("LCOT_ZA") == 0) {
            // connect these in the reverse order, to get the proper arrowhead.
            connect(zNeObj, zNePort, aNeObj, aNePort,connDir, "false", linkConnList[i]);
        }
        else {
            connect(aNeObj, aNePort, zNeObj, zNePort,connDir, "false", linkConnList[i]);
        }
        console.log("aNeObj = ", aNeObj);
    }

    console.log("----------------------------- x c ----------------------------");
    // need to check the need of XC links hope might require for E2E RD as well
    //so not removing the same 
    
    /* var xcList = this.getXcList();
    for (var i=0; i<xcList.length; i++) {
        aNeObj = nodeMap[xcList[i].aNEId];
        aNePort = xcList[i].aPortName;
        aPortId = xcList[i].aportKey;
        aNeId = xcList[i].aNEId;

        zNeObj = nodeMap[xcList[i].zNEId];
        zNePort = xcList[i].zPortName;
        zPortId = xcList[i].zportKey;
        zNeId = xcList[i].zNEId;

        aNeObj = nodeMap[xcList[i].neId];
        aNeId = xcList[i].neId;
        zNeObj = nodeMap[xcList[i].neId];
        zNeId = xcList[i].neId;

        for(var j=0; j<portList.length; j++) {
            if ((portList[j].portId.indexOf(aPortId) == 0) && portList[j].neId == aNeId) {

                var key = portList[j].neId + "_" + portList[j].portId;
                aNePort = portList[j].portName+"-"+portList[j].portId;
                aNeObj =portMap[key];
                if(aNeObj == undefined){
                    aNeObj = nodeMap[xcList[i].neId];}
                //aNeObj.id = portList[j].portId;


            }
        }

        for(var j=0; j<portList.length; j++) {
            if ((portList[j].portId.indexOf(zPortId) == 0) && portList[j].neId == zNeId) {

                var key = portList[j].neId + "_" + portList[j].portId;
                zNeObj = portMap[key];
                zNePort = portList[j].portName+"-"+portList[j].portId;
                if(zNeObj == undefined){
                    zNeObj = nodeMap[xcList[i].neId];
                }
            }
        }
        if (xcList[i].direction.indexOf("CD_BID") == 0)
            connDir = "bi";
        else
            connDir = "uni";
        console.log("direction = " + connDir);
        this.connect(aNeObj, aNePort, zNeObj, zNePort,connDir, "true", xcList[i]);

        // ------------------------------------------------------------------------------------
        // if one port connects to two different ports, either the ToPortId2 or FromPortId2
        // values will be present.  This has to be taken into account while drawing connections
        // ------------------------------------------------------------------------------------

        //This part been removed we have a separate sncId for each xc link in a connection
        //we have used aportKey and zportKey to draw the  xc links

    }*/
    
};


function ctpAlarmMaps(alarmState){

    var alarmSta = "";
    if(alarmState == 'AS_CRITICAL'){alarmSta = 1;}
    else if(alarmState == 'AS_MAJOR'){alarmSta = 2;}
    else if(alarmState == 'AS_MINOR'){alarmSta = 3;}
    else if(alarmState == 'AS_WARNING'){alarmSta = 4;}
    else if(alarmState == 'AS_PROMPT'){alarmSta = 5;}
    else if(alarmState == 'AS_DEFERRED'){alarmSta = 6;}
    else if(alarmState == 'AS_INFO'){alarmSta = 7;}
    else if(alarmState == 'AS_INDETERMINATE'){alarmSta = 8;}
    else if(alarmState == 'AS_CLEARED' || alarmState == 'AS_NOALARM'){alarmSta = 9;}
    return alarmSta;
};


/****************************************************
 * BEGIN: Helper methods for pack/port/link displays
 ****************************************************/
function isLayoutDisruptingPack(pack) {
    var rtnVal = false;
    if (isWtocmPack(pack)) {
        rtnVal = true;
    }
    else if (isDcmPack(pack)) {
        rtnVal = true;
    }
    //		else if ( !this.isIntegralToTransmissionPathLayout( pack ) ) {
    //			rtnVal = true;
    //		}

    // add other checks here
    return rtnVal;
};
function isWtocmPack(pack) {
    return matchPackOnType(pack, "CPT_WTOCM");
};

function isDcmPack(pack) {
    return matchPackOnType(pack, "CPT_DCM");
};


function isLayoutDisruptingLink(link) {
    var rtnVal = false;
    if ( this.isWtocmLink( link ) ){
        rtnVal = true;
    }
    else if ( this.isDcmLink( link ) ){
        rtnVal = true;
    }
    else if ( !isIntegralToTransmissionPathLayout( link ) ) {
        rtnVal = true;
    }
    link['isLayoutDisruptingLink'] = rtnVal;
    // add other checks here
    return rtnVal;
};
function isIntegralToTransmissionPathLayout(link) {
    var rtnVal = true;
    // TODO: can insert logic here that would case a "false" setting.
    return rtnVal;
};

function isWtocmLink(link) {
    return this.hasEndpointOnPack(link, "CPT_WTOCM");
};

function isLbandWtocmLink(link) {
    return this.hasEndpointOnLbandPack(link, "CPT_WTOCM", "L");
};

function isCbandWtocmLink(link) {
    return this.hasEndpointOnCbandPack(link, "CPT_WTOCM", "C");
};

function isDcmLink(link) {
    return this.hasEndpointOnPack(link, "CPT_DCM");
};

// TODO: Compare with packType or packName or both?
function hasEndpointOnPackType( link, packTypeIn ){
    return this.hasEndpointOnPack( link, packTypeIn, this.PACK_MATCH_ON_TYPE );
};
function hasEndpointOnPack( link, matchValue, attrType ){
    var portIds = [];
    portIds.push( link.aPortId );
    portIds.push( link.zPortId );
    
    // Are any of the ports on a pack of the indicated type?
    for ( var i = 0; i < portIds.length; i++ ){
        var portId = portIds[i];
        var pack = this.getPackFromPortId( portId );
        if ( matchPackOnTypeOrName( pack, matchValue ) )
            return true;
    }
    return false;
};

function hasEndpointOnLbandPack( link, matchValue, band ){
    var portIds = [];
    portIds.push( link.aPortId );
    portIds.push( link.zPortId );
    
    // Are any of the ports on a pack of the indicated type?
    for ( var i = 0; i < portIds.length; i++ ){
        var portId = portIds[i];
        var pack = this.getPackFromPortId( portId );
        if ( matchPackOnTypeAndBand( pack, matchValue, band ) )
            return true;
    }
    return false;
};

function hasEndpointOnCbandPack( link, matchValue, band ){
    var portIds = [];
    portIds.push( link.aPortId );
    portIds.push( link.zPortId );
    
    // Are any of the ports on a pack of the indicated type?
    for ( var i = 0; i < portIds.length; i++ ){
        var portId = portIds[i];
        var pack = this.getPackFromPortId( portId );
        if ( matchPackOnTypeAndCband( pack, matchValue, band ) )
            return true;
    }
    return false;
};
var PACK_MATCH_ON_TYPE = "type";
var PACK_MATCH_ON_NAME = "name";
var PACK_MATCH_ON_TYPE_OR_NAME = "typeOrName";
function matchPack( pack, matchValue, attrType ){
    if ( attrType == PACK_MATCH_ON_TYPE )
        return matchPackOnType( pack, matchValue );
    else if ( attrType == this.PACK_MATCH_ON_NAME )
        return matchPackOnName( pack, matchValue );
    else if ( attrType == PACK_MATCH_ON_TYPE_OR_NAME )
        return matchPackOnTypeOrName( pack, matchValue );
    console.error("matchPack: illegal option: ", attrType);
    return false;
}
function matchPackOnTypeOrName( pack, matchValue ){
    var rtnVal = false;
    if ( matchPackOnType( pack, matchValue ) || matchPackOnName( pack, matchValue) ){
        rtnVal = true;
    }
    return rtnVal;
};

function matchPackOnTypeAndBand( pack, matchValue, band ){
    var rtnVal = false;
    if ( matchPackOnType( pack, matchValue )){
        var packName = pack.packName;
        var  lbandPack = packName.substring(packName.lastIndexOf("-")+1, packName.length);
            if(lbandPack && lbandPack.indexOf(band) >= 0 ){
                rtnVal = true;
            }
    }
    return rtnVal;
};

function matchPackOnTypeAndCband( pack, matchValue, band ){
    var rtnVal = false;
    if ( matchPackOnType( pack, matchValue )){
        var packName = pack.packName;
        var  lbandPack = packName.substring(packName.lastIndexOf("-")+1, packName.length);
            if(lbandPack && lbandPack.indexOf("L") < 0 ){
                rtnVal = true;
            }
    }
    return rtnVal;
};

// Exact match on type
function matchPackOnType( pack, matchValue ){
    var rtnVal = false;
    var packType = pack ? pack.packType : null;
    if( packType && packType == matchValue)
        rtnVal = true;
    return rtnVal;
};
// Soft match on name.  "contains" value
function matchPackOnName( pack, matchValue ){
    var rtnVal = false;
    var packType = pack ? pack.packType : null;
    if( packType && packType.indexOf(matchValue) == 0)
        rtnVal = true;
    return rtnVal;
};

function getPortFromPortId( portId ){
    var portMap  = getPortIdMap();
    return portMap[portId];
};
function getPackFromPortId( portId ){
    var pack;
    var packMap  = getPackIdMap();
    
    var port = getPortFromPortId( portId );
    if ( port && port.circuitPackId ){
        pack = packMap[port.circuitPackId];
    }
    return pack;
};

/****************************************************
 * END  : Helper methods for pack/port/link displays
 ****************************************************/

 
//***********************************************************************************
// Function to draw the connections between the source and target ports
//***********************************************************************************
function connect(source, sourcePort, target, targetPort, direction, xc, linkObj) {
    var link = new joint.dia.Link({
            //Added for new jontjs version 1.0.3
        source: {id: source.id, port: sourcePort},
        target: {id: target.id, port: targetPort},
        
        //source: {id: source.id, selector: source.getPortSelector(sourcePort), port: sourcePort},
        //target: {id: target.id, selector: target.getPortSelector(targetPort), port: targetPort},
        
        // ------------------------------------------------------------
        smooth: true,  //smooth: true for curved lines
        // ------------------------------------------------------------
        attrs: {
            linkId: {},
            sncId: {},
            isSnc: {},
            isIW: {},
            isFiber: {},
            isASONTCC: {}
        }
    });
    var serverCommissioningStatus = "NA";
    var jklmTimeSlot = "NA";
    var isInternal = "false";
    //link.set('metro', true);
    // link.set('connector', { name: 'jumpover', args: { type: 'gap' }});
    /* link.set('router', {
        name: 'manhattan',
        args: {
            startDirections: ['top'],
            endDirections: ['bottom'],
            perpendicular: true,
            padding: 30
        }
    });*/
        //Added code to pad the links to left or right a bit 
    //if it falls on a straight line (same side) of a pack
    if(source.id == target.id)
                {	var srcLeft = false;
                    var srcRight = false;
                    var sinkLeft = false;
                    var sinkRight = false;
                    var rightSide = 0;
                    var leftSide = 0;
                    var packInfo = [];
                    // Space the pack's "sideLinks" recursively farther away so they don't overlap.
                    var gapToAvoidArrowhead = 10;
                    var gapBtwnSideLinks = 7;
                    
                    var packs = getPackList();
                        for(var i=0; i < packs.length; i++) {
                            if(packs[i].id == source.id){
                                rightSide = packs[i].rightSide;
                                leftSide = packs[i].leftSide;
                                packInfo = packs[i];
                                if(packs[i].inPorts && packs[i].inPorts.length > 1 ){
                                for(var j=0; j < packs[i].inPorts.length; j++) {
                                    if(packs[i].inPorts[j] == sourcePort){srcLeft = true;}
                                    else if(packs[i].inPorts[j] == targetPort){sinkLeft = true;}										
                                }
                            }
                            if (packs[i].outPorts && packs[i].outPorts.length > 1)
                            {
                                for(var j=0; j < packs[i].outPorts.length; j++) {
                                    if(packs[i].outPorts[j] == sourcePort){srcRight = true;}
                                    else if(packs[i].outPorts[j] == targetPort){sinkRight = true;}										
                                }
                            }
                        }
                    }
                    if(srcLeft && sinkLeft){
                        link.set('connector', { name: 'normal' });								
                        var linkSrcPortPosition = 0;
                        var linkSinkPortPosition = 0;
                        if (packInfo.inPorts.length && packInfo.inPorts.length > 2)
                        {	
                            var linkSrcPort = link.attributes.source.port;
                            var linkSinkPort = link.attributes.target.port;
                            var inPorts = packInfo.inPorts;
                            for(var count = 0; count < inPorts.length ; count++){
                                if(linkSrcPort == inPorts[count])
                                {
                                    linkSrcPortPosition = count;
                                }
                                if(linkSinkPort == inPorts[count]){
                                    linkSinkPortPosition = count;
                                }
                            }
                            if(!(linkSrcPortPosition == linkSinkPortPosition+1 || linkSrcPortPosition == linkSinkPortPosition-1)){
                                link.set('router', {
                                    name: 'oneSide',
                                    args: {
                                        side: 'left',
                                        padding: gapToAvoidArrowhead + (gapBtwnSideLinks * leftSide-1)
                                    }});
                                    packInfo.leftSide = packInfo.leftSide +1;										
                            }
                        }
                        /*if(leftSide >= 1 ){
                        link.set('router', {
                                    name: 'oneSide',
                                    args: {
                                        side: 'left',
                                        padding: gapToAvoidArrowhead + (gapBtwnSideLinks * leftSide-1)
                                    }});
                        }
                        for(var i=0; i < packs.length; i++) {
                        if(packs[i].id == source.id){
                            packs[i].leftSide = packs[i].leftSide +1;
                        }}*/            						
                    }
                    else if(srcRight && sinkRight)
                        {
                        link.set('connector', { name: 'normal' });
                        var linkSrcPortPosition = 0;
                        var linkSinkPortPosition = 0;
                        if (packInfo.outPorts.length && packInfo.outPorts.length > 2)
                        {	
                            var linkSrcPort = link.attributes.source.port;
                            var linkSinkPort = link.attributes.target.port;
                            var outPorts = packInfo.outPorts;
                            for(var count = 0; count < outPorts.length ; count++){
                                if(linkSrcPort == outPorts[count])
                                {
                                    linkSrcPortPosition = count;
                                }
                                if(linkSinkPort == outPorts[count]){
                                    linkSinkPortPosition = count;
                                }
                            }
                            if(!(linkSrcPortPosition == linkSinkPortPosition+1 || linkSrcPortPosition == linkSinkPortPosition-1)){
                                link.set('router', {
                                        name: 'oneSide',
                                            args: {
                                                side: 'right',
                                                padding: gapToAvoidArrowhead + (gapBtwnSideLinks * rightSide-1)
                                            }
                                    });
                                    packInfo.rightSide = packInfo.rightSide +1;
                                    }
                        }
                        /*if(rightSide >= 1){
                        link.set('router', {
                        name: 'oneSide',
                        args: {
                            side: 'right',
                            padding: gapToAvoidArrowhead + (gapBtwnSideLinks * rightSide-1)
                        }
                    });
                    }
                    for(var i=0; i < packs.length; i++) {
                        if(packs[i].id == source.id){
                            packs[i].rightSide = packs[i].rightSide +1;
                        }}*/
                    }
                }			

    //cross connections coloring
    if (xc == "true") {
        link.attr({sncId: linkObj.sncId});
        link.attr({isSnc: true});
    }
    else {
        link.attr({linkId: linkObj.id});
        link.attr({isSnc: false});
        serverCommissioningStatus = linkObj.serverCommissioningStatus;
        jklmTimeSlot = linkObj.jklmTimeSlot;
        if(jklmTimeSlot){
        if (jklmTimeSlot.localeCompare("") == 0) {
            jklmTimeSlot = "NA";
        }
        }
        isInternal = linkObj.isInternal;
    }

    if (xc.indexOf("true") == 0) {
        var state = linkObj.CrossConnectState;
        if (state.indexOf("WdmLocal") == 0)
            createCrossConnections(link, direction, "black", linkObj); //black
        else if (state.indexOf("WdmPending") == 0)
            createCrossConnections(link, direction, "orange", linkObj); //orange
        else if (state.indexOf("WdmPartial") == 0)
            createCrossConnections(link, direction, "red", linkObj); //red
        else if (state.indexOf("WdmActive") == 0)
            createCrossConnections(link, direction, "green", linkObj); //green
        else if (state.indexOf("WdmImproperDisconnect") == 0)
            createCrossConnections(link, direction, "orange", linkObj); //orange
        else if (state.indexOf("WdmUnknown") == 0)
            createCrossConnections(link, direction, "darkGray", linkObj); //Gray
        else if (state.indexOf("WdmGMRE") == 0)
            createCrossConnections(link, direction, "lightGray", linkObj); //Gray
    }else if (linkObj.isLayoutDisruptingLink != undefined && linkObj.isLayoutDisruptingLink)
    {
        createLayoutDisruptingLinksConnectingPacks(link, direction, "darkGray", linkObj);//Gray
    }
    //Else it is link connections coloring
    else {
        var state = linkObj.displayLinkState;
        if (state.indexOf("DLS_UNPROTECTED") == 0)
            createLinkConnections(link, direction, "Green", linkObj); //green
        else if (state.indexOf("DLS_WORKING") == 0)
            createLinkConnections(link, direction, "blue", linkObj); //blue
        else if (state.indexOf("DLS_PROTECTED") == 0)
            createLinkConnections(link, direction, "magenta", linkObj); //magenta
        else if (state.indexOf("DLS_DELETED") == 0)
            createLinkConnections(link, direction, "darkGray", linkObj); //gray
        else if (state.indexOf("DLS_IMPROPER_DISCONN") == 0)
            createLinkConnections(link, direction, "ornage", linkObj); //orange
        else if (state.indexOf("DLS_UNKNOWN") == 0)
            createLinkConnections(link, direction, "Green", linkObj); //mustard


    }
    link.title = "NA";
    var thirdVendorNtw = false;
    var topFbFisplay = "-2em";
    var bottomFbFisplay = "4em";
    var isFiberDisplayed = false;
    var connDetails = getConnList();
    var fontSize = 14;
    var labelPosition = .5;
    if(isOLPProtectedConnection && linkObj.azFiberDisplay != undefined){
        fontSize = 12;
        topFbFisplay = "-1.5em";
        bottomFbFisplay = "3.5em";	
        if(linkObj.azFiberDisplay === 'A'){labelPosition = .3;}
        else if(linkObj.azFiberDisplay === 'B'){labelPosition = .7;}				
    }
    if(linkObj.otdrAZFiber != undefined || linkObj.otdrZAFiber != undefined){
        fontSize = 12;
        topFbFisplay = "-1.5em";
        bottomFbFisplay = "3.5em";	
        this.isOTDRPackSupported = true;
        if(linkObj.otdrAZFiber){labelPosition = .3;}
        else if(linkObj.otdrZAFiber){labelPosition = .7;}				
    }
    
    // var initialValue = otn_i18nStrings["loadingMessage"];//"Loading..";
    var initialValue = "Loading";
    if (linkObj.isFiberSupported) {
        // link.title = otn_i18nStrings["otsFiberDetails"]; //todos
        link.title = "NA";
        var uniLink = false;
        var biLink = getLcList();
        if (linkObj.isFirstLink != undefined && linkObj.isFirstLink) {
            uniLink = true;
            if (biLink.length > 1) {
                topFbFisplay = "-3.5em";
                bottomFbFisplay = "9.5em";
            }
        }
        var defaultValue = undefined;
        if (linkObj.direction == "CD_BID") {//linkObj.isFirstLink == undefined || 
            isFiberDisplayed = true;
            var lbl = [
                {
                position: labelPosition,
                attrs: {
                    rect: {'fill-opacity': 0},
                    text: {
                    fill: 'black',
                    'font-size': fontSize,
                    y: topFbFisplay,
                    // text: otn_i18nStrings["azSpanLength"] + ": " + initialValue + "\n" + otn_i18nStrings["azDesignSpanLoss"] + ": " + initialValue + "\n" + otn_i18nStrings["azCalculatedLoss"] + ": " + initialValue+ "\n" + otn_i18nStrings["azFiberLoss"] + ": " + initialValue
                    }
                }
                },
                {
                position: labelPosition,
                attrs: {
                    rect: {'fill-opacity': 0},
                    text: {
                    fill: 'black',
                    'font-size': fontSize,
                    y: bottomFbFisplay,
                    // text: otn_i18nStrings["zaSpanLength"] + ": " + initialValue + "\n" + otn_i18nStrings["zaDesignSpanLoss"] + ": " + initialValue + "\n" + otn_i18nStrings["zaCalculatedLoss"] + ": " + initialValue+ "\n" + otn_i18nStrings["zaFiberLoss"] + ": " + initialValue
                    }
                }
                }
                ]
            if(linkObj.singleFiberChannelPlan != undefined && linkObj.singleFiberChannelPlan != "N/A" && linkObj.singleFiberChannelPlan != ""){
                lbl.push({ position: .5, attrs: { rect: { fill: '#f9ee05', stroke:'darkGray', 'stroke-width':'1'}, text: { fill: 'black', text: linkObj.singleFiberChannelPlan } }});
            }
            link.set('labels', lbl);
            link.attr({isFiber: true});
            link.attr({isBiDir: true});
        }
        if (linkObj.direction == "CD_UNI") {//linkObj.isFirstLink == undefined ||
            isFiberDisplayed = true;
            if((linkObj.orientation == "LCOT_AZ" && linkObj.isZSide != true && !linkObj.otdrZAFiber) || (linkObj.orientation == "LCOT_ZA" && linkObj.otdrAZFiber)){	                    
                link.set('labels', [
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {'fill-opacity': 0},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: topFbFisplay,
                                // text: otn_i18nStrings["azSpanLength"] + ": " + initialValue + "\n" + otn_i18nStrings["azDesignSpanLoss"] + ": " + initialValue + "\n" + otn_i18nStrings["azCalculatedLoss"] + ": " + initialValue+ "\n" + otn_i18nStrings["azFiberLoss"] + ": " + initialValue
                            }
                        }
                    }
                ]);
                link.attr({isFiber: true});
                link.attr({isBiDir: false});
            }else if((linkObj.orientation == "LCOT_AZ" && linkObj.otdrZAFiber) || (linkObj.orientation == "LCOT_ZA" && !linkObj.otdrAZFiber) || linkObj.isZSide == true){
                    link.set('labels', [
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {'fill-opacity': 0},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: bottomFbFisplay,
                                // text: otn_i18nStrings["zaSpanLength"] + ": " + initialValue + "\n" + otn_i18nStrings["zaDesignSpanLoss"] + ": " + initialValue + "\n" + otn_i18nStrings["zaCalculatedLoss"] + ": " + initialValue+ "\n" + otn_i18nStrings["zaFiberLoss"] + ": " + initialValue
                            }
                        }
                    }
                ]);
                link.attr({isFiber: true});
                link.attr({isBiDir: false});
            }
        }

    }
    if (getIsThirdPartySupported() && getIsThirdPartySupported().indexOf("true") == 0) {
        // var connDetails = this.getConnList();
        // link.title = otn_i18nStrings["thirdPartyNetwork"];
        link.title = "NA";
        thirdVendorNtw = true;
        link.set('labels', [
            {
                position: .5,
                attrs: {
                    rect: {fill: '#95BEE7', rx: 20, ry: 20, stroke: 'green', 'stroke-width': '1'},
                    text: {
                        fill: 'black',
                        'font-size': 16,
                        text: " " + otn_i18nStrings[ThirdPartyIndicator] + " "
                    }
                }
            }
        ]);
        link.attr({isIW: true});
        if (isFiberDisplayed) {
            link.title = "labels";
            link.set('labels', [
                {
                    position: .5,
                    attrs: {
                        rect: {fill: '#95BEE7', rx: 20, ry: 20, stroke: 'green', 'stroke-width': '1'},
                        text: {
                            fill: 'black',
                            'font-size': 16,
                            text: " " + otn_i18nStrings[ThirdPartyIndicator] + " "
                        }
                    }
                },
                {
                    position: labelPosition,
                    attrs: {
                        rect: {fill: '#e5e7ea'},
                        text: {
                            fill: 'black',
                            'font-size': fontSize,
                            y: topFbFisplay,
                            text: otn_i18nStrings["azSpanLength"] + ": " + azSpanLength + "\n" + otn_i18nStrings["azDesignSpanLoss"] + ": " + azDesignSpanLoss + "\n" + otn_i18nStrings["azCalculatedLoss"] + ": " + azCalculatedLoss+ "\n" + otn_i18nStrings["azFiberLoss"] + ": " + azFiberLoss
                        }
                    }
                },
                {
                    position: labelPosition,
                    attrs: {
                        rect: {fill: '#e5e7ea'},
                        text: {
                            fill: 'black',
                            'font-size': fontSize,
                            y: bottomFbFisplay,
                            text: otn_i18nStrings["zaSpanLength"] + ": " + zaSpanLength + "\n" + otn_i18nStrings["zaDesignSpanLoss"] + ": " + zaDesignSpanLoss + "\n" + otn_i18nStrings["zaCalculatedLoss"] + ": " + zaCalculatedLoss+ "\n" + otn_i18nStrings["zaFiberLoss"] + ": " + zaFiberLoss
                        }
                    }
                }
            ]);
        }
    }
    if(!isFiberDisplayed){
        if(linkObj.singleFiberChannelPlan != undefined && linkObj.singleFiberChannelPlan != "N/A" && linkObj.singleFiberChannelPlan != ""){
        link.set('labels', [
            { position: .5, attrs: { rect: { fill: '#f9ee05', stroke:'darkGray', 'stroke-width':'1'}, text: { fill: 'black', text: linkObj.singleFiberChannelPlan } }}
            ]);
        }
    }
    if (isInternal && isInternal.indexOf("false") == 0) {
        if (serverCommissioningStatus && serverCommissioningStatus.indexOf("Not Commissioned") == 0) {
            // link.title = otn_i18nStrings["notCommissioned"];
            link.title = "NA";
            link.set('labels', [
                {
                    position: .5,
                    attrs: {
                        rect: {fill: 'red', stroke: 'darkGray', 'stroke-width': '1'},
                        text: {fill: 'white', text: 'nc'}
                    }
                }
            ]);
            if (thirdVendorNtw && isFiberDisplayed) {
                link.title = "labels";
                link.set('labels', [
                    {
                        position: .3,
                        attrs: {
                            rect: {fill: 'red', stroke: 'darkGray', 'stroke-width': '1'},
                            text: {fill: 'white', text: 'nc'}
                        }
                    },
                    {
                        position: .7,
                        attrs: {
                            rect: {fill: '#95BEE7', rx: 20, ry: 20, stroke: 'green', 'stroke-width': '1'},
                            text: {
                                fill: 'black',
                                'font-size': 16,
                                text: " " + otn_i18nStrings[ThirdPartyIndicator] + " "
                            }
                        }
                    },
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {fill: '#e5e7ea'},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: topFbFisplay,
                                text: otn_i18nStrings["azSpanLength"] + ": " + azSpanLength + "\n" + otn_i18nStrings["azDesignSpanLoss"] + ": " + azDesignSpanLoss + "\n" + otn_i18nStrings["azCalculatedLoss"] + ": " + azCalculatedLoss+ "\n" + otn_i18nStrings["azFiberLoss"] + ": " + azFiberLoss
                            }
                        }
                    },
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {fill: '#e5e7ea'},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: bottomFbFisplay,
                                text: otn_i18nStrings["zaSpanLength"] + ": " + zaSpanLength + "\n" + otn_i18nStrings["zaDesignSpanLoss"] + ": " + zaDesignSpanLoss + "\n" + otn_i18nStrings["zaCalculatedLoss"] + ": " + zaCalculatedLoss+ "\n" + otn_i18nStrings["zaFiberLoss"] + ": " + zaFiberLoss
                            }
                        }
                    }
                ]);
            }
            else if (thirdVendorNtw) {
                link.title = "labels";
                link.set('labels', [
                    {
                        position: .3,
                        attrs: {
                            rect: {fill: 'red', stroke: 'darkGray', 'stroke-width': '1'},
                            text: {fill: 'white', text: 'nc'}
                        }
                    },
                    {
                        position: .7,
                        attrs: {
                            rect: {fill: '#95BEE7', rx: 20, ry: 20, stroke: 'green', 'stroke-width': '1'},
                            text: {
                                fill: 'black',
                                'font-size': 16,
                                text: " " + otn_i18nStrings[ThirdPartyIndicator] + " "
                            }
                        }
                    }
                ]);
            }
            else if (isFiberDisplayed) {
                link.title = "labels";
                link.set('labels', [
                    {
                        position: .5,
                        attrs: {
                            rect: {fill: 'red', stroke: 'darkGray', 'stroke-width': '1'},
                            text: {fill: 'white', text: 'nc'}
                        }
                    },
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {fill: '#e5e7ea'},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: topFbFisplay,
                                text: otn_i18nStrings["azSpanLength"] + ": " + azSpanLength + "\n" + otn_i18nStrings["azDesignSpanLoss"] + ": " + azDesignSpanLoss + "\n" + otn_i18nStrings["azCalculatedLoss"] + ": " + azCalculatedLoss+ "\n" + otn_i18nStrings["azFiberLoss"] + ": " + azFiberLoss
                            }
                        }
                    },
                    {
                        position: labelPosition,
                        attrs: {
                            rect: {fill: '#e5e7ea'},
                            text: {
                                fill: 'black',
                                'font-size': fontSize,
                                y: bottomFbFisplay,
                                text: otn_i18nStrings["zaSpanLength"] + ": " + zaSpanLength + "\n" + otn_i18nStrings["zaDesignSpanLoss"] + ": " + zaDesignSpanLoss + "\n" + otn_i18nStrings["zaCalculatedLoss"] + ": " + zaCalculatedLoss+ "\n" + otn_i18nStrings["zaFiberLoss"] + ": " + zaFiberLoss
                            }
                        }
                    }
                ]);
            }
        }
        else if (jklmTimeSlot && jklmTimeSlot.localeCompare("NA") < 0) {
            // link.title = otn_i18nStrings["timeslotklm"] + ": " + jklmTimeSlot;
            link.title = "NA";
            if (jklmTimeSlot.length > 5) {
                jklmTimeSlot = jklmTimeSlot.substring(0, 5).concat("..");
            }
            link.set('labels', [
                {
                    position: .5,
                    attrs: {
                        rect: {fill: '#E6E6EF', stroke: 'darkGray', 'stroke-width': '1'},
                        text: {fill: 'black', text: jklmTimeSlot}
                    }
                }
            ]);
        }
    }
    
    
    /*if (source.attributes.neId == target.attributes.neId){
                    //  this.e2eLinks.push(link);
        }
    else*/
    {
        var debug_showLinkSequenceNumberOnLabel = false;
        if ( debug_showLinkSequenceNumberOnLabel ){
            link.set('labels', [              
                            { position: .5, attrs: { text: { fill: 'black', 'font-size': 16, text: linkSeqCount} }}							               
                            ]);
        }
    //link.title = linkSeqCount+"   "+linkObj.id;
    getGraph().addCell(link);
    getPaper().findViewByModel(link).options.interactive = false;
    linkObj.linkSequenceNumber = linkSeqCount;  // add to the object so we can see in the properties panel
    linkSeqCount++;
        }
};


function retrieveDataForAllFibers(){
    // Kick off the max number of requests.
    // Each response will kick off another.
    var max = maxOutstandingFiberDataRequests;  // use local var for debugging.
    var lastFiberIndex = -1;
    for ( var i = 0; i < max; i++ ){
        lastFiberIndex = retrieveDataForNextFiber(null, lastFiberIndex, "");
    }
};
function getNextFiber_forDataRetrieval( previousLink, previousLinkIndex ){
    var nextLink  = null;
    var nextLinkIndex = -1;
    var linkConnList = this.getLcList();
    if ( previousLink ){
        // Update this link
        previousLink.isFiberDataAlreadyRetrieved    = true;
        previousLink.isFiberDataRetrievalInProgress = false;
        // Update "related" links
        for(var g=0;g<linkConnList.length;g++){
            if(previousLink.connectionId == linkConnList[g].connectionId) {
                linkConnList[g].isFiberDataAlreadyRetrieved    = true;
                linkConnList[g].isFiberDataRetrievalInProgress = false;
            }
        }
    }
    var startIndex = 0;
    if ( previousLinkIndex && previousLinkIndex >= 0 ){
        startIndex = previousLinkIndex + 1;
    }
    
    linkConnList = this.getLcList();
    var next
    for (var i=startIndex; i<linkConnList.length; i++) {
        if(  linkConnList[i].isFiberSupported == true && 
                linkConnList[i].orientation == "LCOT_AZ" && 
                !linkConnList[i].isFiberDataRetrievalInProgress &&
                !linkConnList[i].isFiberDataAlreadyRetrieved){
            // Use this one
            nextLink = linkConnList[i];
            nextLinkIndex = i;
            // To keep the logic in one place, we'll update the flag here rather than when sending the request.
            linkConnList[i].isFiberDataRetrievalInProgress = true;
            break;
        }
    }
    
    // Complex return value
    var nextFiber = new Object();
    nextFiber.linkConn = nextLink;
    nextFiber.linkConnIndex = nextLinkIndex;
    return nextFiber;
};


/*************************************************
* BEGIN: Handle retrieve fiber characteristics
*************************************************/

    /*****************************************************
     * Retrieve fiber characteristics for each OTS
     * "schedule" the request, such that only N are outstanding at any one time.
     *****************************************************/

// WARNING:  not coded/tested for incrementing the value of "outstandingFiberDataRequests".
//   The logic may not be proper at this time to handle > 1.
//   May need to add a "dataRetrievalInProgress" attribute on the linkConn[i] so we don't try to send additional requests.
//   ie, Say N=3 and sent requests 0,1,2.  Request 0 finishes first.  
//      Don't want the next request to be for 1 when it should be for 3.  Need to skip over 1 & 2.
var maxOutstandingFiberDataRequests = 1;
function retrieveDataForNextFiber(previousLinkConn, previousLinkIndex, previousStatus) {

    var logPrefix = "RetrieveFiberData: ";
    var rtnVal = -1;  // linkConnIndex for "fiber" being processed.
    
    // Report status of previous run.
    if ( previousLinkConn ){
        console.log(logPrefix + " ** Collected data for link# " + previousLinkIndex + ", status=" +previousStatus);
    }
    // This will also do some updating of the previousLink as it finds the nextLink/Fiber.
    var nextFiber = getNextFiber_forDataRetrieval(previousLinkConn, previousLinkIndex);
    if ( !nextFiber ){
        console.error(logPrefix + "nextFiber is null.  Terminating data collection.");
        return rtnVal;
    }
    var linkConn = nextFiber.linkConn;
    var linkConnIndex = nextFiber.linkConnIndex;
    rtnVal = linkConnIndex;
    if ( !linkConn ){
        console.log(logPrefix + "Fiber data collection complete.");
        return rtnVal;
    }
    
    // Ok, we another link/fiber which needs data. 
    console.log(logPrefix + "Collecting data for link #" + linkConnIndex + ", " + linkConn.guiLabel);
    //var fiberURLStr = this.OtnREST.getUrlForFiberCharDisplayDataOfPhysicalConn(this.getNprTlId(), null);	
    var fiberURLStr = this.OtnREST.getUrlForFiberCharOfPhysicalConn(linkConn.nprId, null);
    if(fbrRefresh){
    try{					
        fiberDetails = this;
        var linkInPaper;
        this.fbrIntermRefresh = true;
        console.log("link to be updated is " +linkConn);
//				linkConn.isFiberDataRetrievalInProgress = true;

        // Locate the corresponding graph object (link)
        var links = getGraph().getLinks();
        for(var x = 0; x < links.length; x++){
            var lc = links[x];
            if(lc.attributes.attrs.linkId == linkConn.id){
                linkInPaper = lc;
                break;
            }
        }
        return
        
        // Get the data
        // Once we get a response, we'll get the data for the next link.
        var xhrArgs = {
            url: fiberURLStr,
            timeout:this.OtnConstants.DEFAULT_TIMEOUT_IN_MS,
            sync:false,
            load: lang.hitch(this,function(data){
                var lc = linkInPaper;
                jsonFiberDataRetrived = JSON.parse(data);
                if(jsonFiberDataRetrived[0] == undefined){
                    linkConn['isAEnd'] = true;
                    linkConn['isDefaultFiberValue'] = true;
                    if(linkConn.direction == "CD_BID"){
                        fiberDetails.updateDefaultValuesForlc(linkConn,lc,true,false,"N/A");																
                    }else if(linkConn.direction == "CD_UNI"){
                        var gotZLink = fiberDetails.getZEndLinkAssociated(fiberDetails,lc,linkConn,jsonFiberDataRetrived,false,true);
                        if( (linkConn.orientation == "LCOT_AZ" && !linkConn.otdrZAFiber) || (linkConn.orientation == "LCOT_ZA" && linkConn.otdrAZFiber)){
                            fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,true,"N/A");
                            fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,false,"N/A");
                        }else{
                            fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,false,"N/A");
                            fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,true,"N/A");
                        }
                    }
                }
                else {
                    var fromNodePort = linkConn.aNEName+ "/" +linkConn.aPortName;
                    var isResponseFromTo = false;
                    var isResponseFromToLBand = false;
                    var fiberlen = jsonFiberDataRetrived.length;
                    var jsonFiberData = [];
                    var jsonFiberData_LBand = [];
                    if(fiberlen > 2){
                        linkConn['isCLBandSupported'] = true;	
                        for(var t=0; t<jsonFiberDataRetrived.length; t++){
                            if(jsonFiberDataRetrived[t].bandStr && jsonFiberDataRetrived[t].bandStr == 'C'){
                                jsonFiberData.push(jsonFiberDataRetrived[t]);
                            }else{
                                jsonFiberData_LBand.push(jsonFiberDataRetrived[t]);
                            }
                        }
                        
                        if(jsonFiberData[0].fromLabel == fromNodePort){								
                            if(jsonFiberData_LBand[0].fromLabel == fromNodePort){
                                this.setCalcSpanLossAZLBand(jsonFiberData, jsonFiberData_LBand);
                            }else{
                                this.setCalcSpanLossZALBand(jsonFiberData, jsonFiberData_LBand);
                                }
                        }else{
                            if(jsonFiberData_LBand[0].fromLabel == fromNodePort){
                                this.setCalcSpanLossZALBand(jsonFiberData, jsonFiberData_LBand);
                            }else{
                                this.setCalcSpanLossAZLBand(jsonFiberData, jsonFiberData_LBand);
                                }
                        }
                    }else{
                        jsonFiberData = jsonFiberDataRetrived;
                    }
                    
                    if(jsonFiberData[0].fromLabel == fromNodePort)
                        isResponseFromTo = true;
                    
                    linkConn['isResponseFromTo'] = isResponseFromTo;
                    linkConn['jsonFiberData'] = jsonFiberData;
                    linkConn['isDefaultFiberValue'] = false;

                    if(linkConn.direction == "CD_BID"){
                        fiberDetails.updateFiberValuesForBiDirLink(linkConn,lc,jsonFiberData,fiberDetails, isResponseFromTo);// // here fiberDetails is the page context
                        
                    }else if(linkConn.direction == "CD_UNI"){
                        var gotZLink = fiberDetails.getZEndLinkAssociated(fiberDetails,lc,linkConn,jsonFiberData,isResponseFromTo,false);
                        
                        if((linkConn.orientation == "LCOT_AZ" && !linkConn.otdrZAFiber) || (linkConn.orientation == "LCOT_ZA" && linkConn.otdrAZFiber)){
                            if(isResponseFromTo){
                                fiberDetails.updateFiberValuesForUniAZLink(linkConn,lc,jsonFiberData[0],fiberDetails);
                                fiberDetails.updateFiberValuesForUniZALink(linkConn,gotZLink,jsonFiberData[1],fiberDetails);
                            }else{
                                fiberDetails.updateFiberValuesForUniAZLink(linkConn,lc,jsonFiberData[1],fiberDetails);
                                fiberDetails.updateFiberValuesForUniZALink(linkConn,gotZLink,jsonFiberData[0],fiberDetails);
                            }
                        }else{
                            if(!isResponseFromTo){
                                fiberDetails.updateFiberValuesForUniZALink(linkConn,lc,jsonFiberData[1],fiberDetails);
                                fiberDetails.updateFiberValuesForUniAZLink(linkConn,gotZLink,jsonFiberData[0],fiberDetails);
                            }else{
                                fiberDetails.updateFiberValuesForUniAZLink(linkConn,lc,jsonFiberData[0],fiberDetails);
                                fiberDetails.updateFiberValuesForUniZALink(linkConn,gotZLink,jsonFiberData[1],fiberDetails);
                            }
                        }
                    }
                }
                this.retrieveDataForNextFiber(linkConn, linkConnIndex, "success");
            }),
            error: lang.hitch(this,function(error){
                 console.log(logPrefix + "ERROR1:" + error);
                    var lc = linkInPaper;
                        //this.updateDefaultValuesForlc(lc);
                    linkConn['isAEnd'] = true;
                    linkConn['isDefaultFiberValue'] = true;
                    if(linkConn.direction == "CD_BID"){
                        fiberDetails.updateDefaultValuesForlc(linkConn,lc,true,false,"N/A");
                        
                    }else if(linkConn.direction == "CD_UNI"){
                        var gotZLink = fiberDetails.getZEndLinkAssociated(fiberDetails,lc,linkConn,jsonFiberData,false,true);
                        if((linkConn.orientation == "LCOT_AZ" && !linkConn.otdrZAFiber) || (linkConn.orientation == "LCOT_ZA" && linkConn.otdrAZFiber)){
                            fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,true,"N/A");
                            fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,false,"N/A");
                        }else{
                            fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,false,"N/A");
                            fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,true,"N/A");
                        }
                    }
                //fiberDetails.updateDefaultFiberValues(connDetails, "NA");
                //fiberDetails.updateFiberValues(fiberDetails, connDetails);
                    
                this.retrieveDataForNextFiber(linkConn, linkConnIndex, error);
            })
        };		
        var deferred = dojo.xhrGet(xhrArgs);
        deferred.then(
                lang.hitch(this,function(data){}),
                lang.hitch(this,function(error){
                      console.log(logPrefix + "ERROR2:" + error);
                      //alert("Error: Unable to reach the server to retrieve Fiber details. It is likely a network error or the server is down.");
                      linkConn['isAEnd'] = true;
                      linkConn['isDefaultFiberValue'] = true;
                      if(linkConn.direction == "CD_BID"){
                          fiberDetails.updateDefaultValuesForlc(linkConn,lc,true,false,"N/A");
                            
                        }else if(linkConn.direction == "CD_UNI"){
                            var gotZLink = fiberDetails.getZEndLinkAssociated(fiberDetails,lc,linkConn, jsonFiberData,false,true);
                            if((linkConn.orientation == "LCOT_AZ" && !linkConn.otdrZAFiber) || (linkConn.orientation == "LCOT_ZA" && linkConn.otdrAZFiber)){
                                fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,true,"N/A");
                                fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,false,"N/A");
                            }else{
                                fiberDetails.updateDefaultValuesForlc(linkConn,lc,false,false,"N/A");
                                fiberDetails.updateDefaultValuesForlc(linkConn,gotZLink,false,true,"N/A");
                            }
                        }
                      //fiberDetails.updateFiberValues(fiberDetails, connDetails);	
                    this.retrieveDataForNextFiber(linkConn, linkConnIndex, error);
                  }
              )
            );
    }catch(e){
        console.error(logPrefix + "Exception: " + e.message );
        console.log(" "+ e.stack );
        //var connDetails = fiberDetails.getConnList();
        //fiberDetails.updateDefaultFiberValues(connDetails, "NA");
        //fiberDetails.updateFiberValues(fiberDetails, connDetails);				
    }	
    }
    return rtnVal;
};

function setCalcSpanLossZALBand(jsonFiberData, jsonFiberData_LBand){
    jsonFiberData[0]['calcSpanLoss_LBand'] = jsonFiberData_LBand[1].calcSpanLoss;
    jsonFiberData[1]['calcSpanLoss_LBand'] = jsonFiberData_LBand[0].calcSpanLoss;
    return jsonFiberData;
};

function setCalcSpanLossAZLBand(jsonFiberData, jsonFiberData_LBand){
    jsonFiberData[0]['calcSpanLoss_LBand'] = jsonFiberData_LBand[0].calcSpanLoss;
    jsonFiberData[1]['calcSpanLoss_LBand'] = jsonFiberData_LBand[1].calcSpanLoss;				
    return jsonFiberData;
};

function getFiberLabelPosition(linkObj, isBiDir){
    var position = .5;
   if(isOLPProtectedConnection && isBiDir && linkObj.azFiberDisplay != undefined){
        if(linkObj.azFiberDisplay === 'A'){position = .3;}
        else if(linkObj.azFiberDisplay === 'B'){position = .7;}				   			
    }		
    return position;
};

function getFiberLabelPositionForOTDRLinks(linkObj, isAZDir, isZADir){
    var position = .5;
    if(linkObj.otdrAZFiber != undefined || linkObj.otdrZAFiber != undefined){
        if(linkObj.otdrAZFiber){
            position = .3;
            if(isZADir){position = .7;}
        }
        else if(linkObj.otdrZAFiber){
            position = .7;
            if(isAZDir){position = .3;}	
        }				   			
    }
    return position;
};


// 配置事件处理 zoomOut zoomIn zoom100 平移 
function configureEventHandling() {
    // on click events for Node/Detailed Node View
    var currentContext = this;

    
    $("#refreshButton").click(function onClickOfRefreshButton () {
        // alert("isPanningSupported "+ isPanningSupported)
        refreshPage();
    }); // end function onClickOfRefreshButton

    $("#zoomOut").click(function onClickOfZoomButton (evt) {
        // alert("isPanningSupported "+ isPanningSupported)
        //commented to add panning to paper
     if(isPanningSupported){
            svgZoomOut();
        }
        else{
            onMouseWheel(evt);
        }
    });
    $("#zoomIn").click(function onClickOfZoomButton (evt) {
        //commented to add panning to paper
        if(isPanningSupported){
            svgZoomIn();
        }
        else{
            onMouseWheel(evt);
        }
    });
    // $("#curRouteButton").click(lang.hitch( currentContext, function onClickOfZoomButton (evt) {
    //     //current route should open End to End Current route Page
    //     var connectionName = encodeURIComponent(this.getConnName());
    //     var title = "&connectionName=" + connectionName;				
    //     var url = this.OtnREST.getUrlForE2ECurrentRoutingDisplayPage(this.getConnId(), null);
    //     window.open(url+title);              
        
    // }));
    // $("#nominalRouteButton").click(lang.hitch( currentContext, function onClickOfZoomButton (evt) {
    //     //nominal route should open End to End routing display Page
    //     var connectionName = encodeURIComponent(this.getConnName());
    //     var title = "&connectionName=" + connectionName;	
    //     var url = this.OtnREST.getUrlForE2ERoutingDisplayPage(this.getConnId(), null);
    //     window.open(url+title);              
        
    // }));
    // $("#wtocmPack").click(lang.hitch( currentContext, function onClickOfZoomButton (evt) {
    //     //commented to add panning to paper		
    //     var wtocmValue = document.getElementById("wtocmPack").value;

    //     if(wtocmValue == 'enablewtocm'){
    //         document.getElementById("wtocmPack").value = "disablewtocm";
    //         this.hideLayoutDisruptingPacks = false;
    //         this.hideLayoutDisruptingLinks = false;				
    //     }else{
    //         document.getElementById("wtocmPack").value = "enablewtocm";
    //         this.hideLayoutDisruptingPacks = true;
    //         this.hideLayoutDisruptingLinks = true;					
    //     }

    //     this.insertPortsToPack();
    //     this.getGraph().clear();
    //     //this.getConnGraph().clear();
    //     this.renderView();
    //     var linkConnList = this.getLcList();
    //     for (var i=0; i<linkConnList.length; i++) {
    //         if(linkConnList[i].isFiberSupported == true ){
    //             //need to look a way to re-sent all request other then pening fiber request ?
    //             //seen AZ link fiber details been updated as ZA fiber !!! 
    //             // so commented to re-write the changes 
    //             if(linkConnList[i].isFiberDataAlreadyRetrieved){
    //                 var links =this.getGraph().getLinks();
    //                 var linkInPaper;
    //                 for(var x = 0; x < links.length; x++){
    //                 var lc = links[x];
    //                 if(lc.attributes.attrs.linkId == linkConnList[i].id){
    //                     linkInPaper = lc;
    //                     break;
    //                     }
    //                 }
    //                 if(linkConnList[i].direction == "CD_BID"){
    //                       if(linkConnList[i].isDefaultFiberValue){
    //                         this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,true,false,"N/A");
    //                       }else{
    //                         this.updateFiberValuesForBiDirLink(linkConnList[i],linkInPaper, linkConnList[i].jsonFiberData, this, linkConnList[i].isResponseFromTo)//need to add valid data here for bid
    //                       }								
    //                 }else if(linkConnList[i].direction == "CD_UNI"){
    //                     if((linkConnList[i].orientation == "LCOT_AZ" && !linkConnList[i].otdrZAFiber) || (linkConnList[i].orientation == "LCOT_ZA" && linkConnList[i].otdrAZFiber))
    //                     {	
    //                         var gotZLink = this.getZEndLinkAssociated(this,linkInPaper,linkConnList[i],linkConnList[i].jsonFiberData,linkConnList[i].isResponseFromTo,linkConnList[i].isDefaultFiberValue);	
    //                         if(linkConnList[i].isDefaultFiberValue){
    //                             this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,false,true,"N/A");
    //                             this.updateDefaultValuesForlc(linkConnList[i],gotZLink,false,false,"N/A");
    //                         }
    //                         else{
    //                             //need to add valid data here az uni
    //                             if(linkConnList[i].isResponseFromTo){
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[0],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[1],this);
    //                             }else{
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[1],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[0],this);
    //                             }
    //                         }									
    //                     //linkConnList[i].isZSide = false;
    //                 }else if((linkConnList[i].orientation == "LCOT_AZ" && linkConnList[i].otdrZAFiber) || (linkConnList[i].orientation == "LCOT_ZA" && !linkConnList[i].otdrAZFiber))
    //                 {	
    //                     var gotZLink = this.getZEndLinkAssociated(this,linkInPaper,linkConnList[i],linkConnList[i].jsonFiberData,linkConnList[i].isResponseFromTo,linkConnList[i].isDefaultFiberValue);	

    //                     if(linkConnList[i].isDefaultFiberValue){
    //                         this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,false,false,"N/A");
    //                         this.updateDefaultValuesForlc(linkConnList[i],gotZLink,false,true,"N/A");
    //                         }
    //                         else{
    //                             //need to add valid data here za uni
    //                             if(! (linkConnList[i].isResponseFromTo)){
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[1],this);
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[0],this);
    //                             }else{
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[0],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[1],this);
    //                             }
    //                         }									
    //                     //linkConnList[i].isZSide = false;
    //                     }
    //                 }
    //                 //linkConnList[i].isFiberDataAlreadyRetrieved = false;
    //                 //linkConnList[i].isFiberDataRetrievalInProgress = false;
    //             }else{
    //                 if(linkConnList[i].isZSide)
    //                     {
    //                         linkConnList[i].isZSide = false;
    //                     }	
    //             }
    //         }
    //     }
    //         // Locate the corresponding graph object (link)
        
        
        
    // }));
    // $("#dcmPack").click(lang.hitch( currentContext, function onClickOfZoomButton (evt) {
    //     //commented to add panning to paper		
    //     var wtocmValue = document.getElementById("dcmPack").value;

    //     if(wtocmValue == 'enabledcm'){
    //         document.getElementById("dcmPack").value = "disabledcm";
    //         this.hideLayoutDisruptingPacks = false;
    //         this.hideLayoutDisruptingLinks = false;				
    //     }else{
    //         document.getElementById("dcmPack").value = "enabledcm";
    //         this.hideLayoutDisruptingPacks = true;
    //         this.hideLayoutDisruptingLinks = true;					
    //     }
    
    //     this.insertPortsToPack();
    //     this.getGraph().clear();
    //     //this.getConnGraph().clear();
    //     this.renderView();
    //     var linkConnList = this.getLcList();
    //     for (var i=0; i<linkConnList.length; i++) {
    //         if(linkConnList[i].isFiberSupported == true ){
    //             //need to look a way to re-sent all request other then pening fiber request ?
    //             //seen AZ link fiber details been updated as ZA fiber !!! 
    //             // so commented to re-write the changes 
    //             if(linkConnList[i].isFiberDataAlreadyRetrieved){
    //                 var links =this.getGraph().getLinks();
    //                 var linkInPaper;
    //                 for(var x = 0; x < links.length; x++){
    //                 var lc = links[x];
    //                 if(lc.attributes.attrs.linkId == linkConnList[i].id){
    //                     linkInPaper = lc;
    //                     break;
    //                     }
    //                 }
    //                 if(linkConnList[i].direction == "CD_BID"){
    //                       if(linkConnList[i].isDefaultFiberValue){
    //                         this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,true,false,"N/A");
    //                       }else{
    //                         this.updateFiberValuesForBiDirLink(linkConnList[i],linkInPaper, linkConnList[i].jsonFiberData, this, linkConnList[i].isResponseFromTo)//need to add valid data here for bid
    //                       }								
    //                 }else if(linkConnList[i].direction == "CD_UNI"){
    //                     if((linkConnList[i].orientation == "LCOT_AZ" && !linkConnList[i].otdrZAFiber) || (linkConnList[i].orientation == "LCOT_ZA" && linkConnList[i].otdrAZFiber))
    //                     {	
    //                         var gotZLink = this.getZEndLinkAssociated(this,linkInPaper,linkConnList[i],linkConnList[i].jsonFiberData,linkConnList[i].isResponseFromTo,linkConnList[i].isDefaultFiberValue);	
    //                         if(linkConnList[i].isDefaultFiberValue){
    //                             this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,false,true,"N/A");
    //                             this.updateDefaultValuesForlc(linkConnList[i],gotZLink,false,false,"N/A");
    //                         }
    //                         else{
    //                             //need to add valid data here az uni
    //                             if(linkConnList[i].isResponseFromTo){
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[0],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[1],this);
    //                             }else{
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[1],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[0],this);
    //                             }
    //                         }									
    //                     //linkConnList[i].isZSide = false;
    //                 }else if((linkConnList[i].orientation == "LCOT_AZ" && linkConnList[i].otdrZAFiber) || (linkConnList[i].orientation == "LCOT_ZA" && !linkConnList[i].otdrAZFiber))
    //                 {	
    //                     var gotZLink = this.getZEndLinkAssociated(this,linkInPaper,linkConnList[i],linkConnList[i].jsonFiberData,linkConnList[i].isResponseFromTo,linkConnList[i].isDefaultFiberValue);	

    //                     if(linkConnList[i].isDefaultFiberValue){
    //                         this.updateDefaultValuesForlc(linkConnList[i],linkInPaper,false,false,"N/A");
    //                         this.updateDefaultValuesForlc(linkConnList[i],gotZLink,false,true,"N/A");
    //                         }
    //                         else{
    //                             //need to add valid data here za uni
    //                             if(! (linkConnList[i].isResponseFromTo)){
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[1],this);
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[0],this);
    //                             }else{
    //                                 this.updateFiberValuesForUniAZLink(linkConnList[i],linkInPaper,linkConnList[i].jsonFiberData[0],this);
    //                                 this.updateFiberValuesForUniZALink(linkConnList[i],gotZLink,linkConnList[i].jsonFiberData[1],this);
    //                             }
    //                         }									
    //                     //linkConnList[i].isZSide = false;
    //                     }
    //                 }
    //                 //linkConnList[i].isFiberDataAlreadyRetrieved = false;
    //                 //linkConnList[i].isFiberDataRetrievalInProgress = false;
    //             }else{
    //                 if(linkConnList[i].isZSide)
    //                     {
    //                         linkConnList[i].isZSide = false;
    //                     }	
    //             }
    //         }
    //     }
    //         // Locate the corresponding graph object (link)			
        
    // }));//Conn object onclick events
    // $("#paper").click(lang.hitch( currentContext, function onClickOfPaper (evt) {
    //     if(evt.target.attributes.port)
    //     { port = evt.target.attributes.port.nodeName;}
    //     else{port = "Ne";}
    //     var cellView = paper.findView(evt.target);
    //     if (cellView) {
    //         console.log(cellView.model);
    //         console.log(cellView.model.id);
    //         //var clientRouteState = this.getConnList()[0].clientRouteState;
    //         if((cellView.model.attributes.type).indexOf("devs.Model")==0){
    //             if(port.indexOf("port") == 0 )
    //             {
    //                 var nodeValue = evt.target.attributes.port.value;
    //                 var count = nodeValue.lastIndexOf('-');
    //                 var char = nodeValue.charAt(count - 1);
    //                 var portId = "";
    //                 if(char == '-'){
    //                     portId = nodeValue.substring(count);
    //                 }else{
    //                     portId = nodeValue.substring(count + 1);
    //                 }
    //             }
    //         }
    //         else if((cellView.model.attributes.type).indexOf("link")== 0){
    //             var link = cellView._V.connection.node.attributes;
    //             var labelText = evt.target.textContent;
    //             var styleValue = '0';
    //             if (link && link.length >= 6){
    //                 styleValue = link[5].value;}
    //             else{
    //                 styleValue = link[4].value;
    //             }
    //             if(styleValue.indexOf("2 2") == 0 ){
    //                 this.initClearMenu();
    //             }else if((evt.target.textContent).trim() == otn_i18nStrings[ThirdPartyIndicator]){
    //                 this.displayIWDetails(evt.target, cellView.model.attributes.attrs);
    //             }else if(labelText.indexOf(otn_i18nStrings["Length"]) == 0 || labelText.indexOf(otn_i18nStrings["Loss"]) == 0){
    //                 this.initClearMenu();
    //             }
    //         }
    //     }
    // })); // end function onClickOfRefreshButton
    $("#zoom100").click(function onClickOfZoomButton (evt) {
            if(isPanningSupported){
                svgZoomReset();
            // if(zoomOutDisplay){
                // document.getElementById("paper").style.transform = 'matrix(1, 0, 0, 1,-510.175, -290.25)';
                svgE2EZoomOut(zoomOutValue);
            // }
        }else{
            onMouseWheel(evt);
        }
    });
    //Enable pan when the mouse button is click and dragged
    if(isPanningSupported){
        svgPanningDragAndDrop();
    }
    return;
        
    var paper = this.getPaper();
   // var connPaper = this.getConnPaper();
    var currentContext = this;

    this.getPaper().$el.on('contextmenu', lang.hitch( currentContext, function onClickOfPaper (evt) {
        evt.stopPropagation(); // Stop bubbling so that the paper does not handle mousedown.
        evt.preventDefault();  // Prevent displaying default browser context menu.

        //	var lang = require("dojo/_base/lang");
        if(evt.target.attributes.port)
        { port = evt.target.attributes.port.nodeName;}
        else{port = "Ne";}
        var cellView = paper.findView(evt.target);
        if (cellView) {
            console.log(cellView.model);
            console.log(cellView.model.id);
            var clientRouteState = "";
            if(this.getConnList()[0]){
                 clientRouteState = this.getConnList()[0].clientRouteState;
            }
           
            if((cellView.model.attributes.type).indexOf("devs.Model")==0){
                if(port.indexOf("port") == 0 && clientRouteState.indexOf("TST_REROUTE") != 0)
                {
                    var nodeValue = evt.target.attributes.port.value;
                    var count = nodeValue.lastIndexOf('-');
                    var char = nodeValue.charAt(count - 1);
                    var portId = "";
                    if(char == '-'){
                        portId = nodeValue.substring(count);
                    }else{
                        portId = nodeValue.substring(count + 1);
                    }
                    //Added to remove loopback parameters from port properties NFMTSW-369935                             
                    var portListItems = this.getPortList();
                    for(var i=0; i < portListItems.length; i++) {
                        if(portListItems[i].portId == portId){
                            delete portListItems[i]["has_loopback"];
                            delete portListItems[i]["supportsFacilityLoopback"];
                            delete portListItems[i]["supportsTerminalLoopback"];
                            delete portListItems[i]["portLoopbackType"];
                        }
                    }
                    this.initPortMenu(evt.target, portId);
                }
                else{
                    if(clientRouteState.indexOf("TST_REROUTE") != 0){
                        this.initPackMenu(evt.target, cellView.model.id);}
                    else{
                        this.initClearMenu();}
                }
            }
            else if((cellView.model.attributes.type).indexOf("devs.Coupled") == 0)	{
                 this.initNeMenu(evt.target, cellView.model.attributes.neId);
            }
            else if((cellView.model.attributes.type).indexOf("link")== 0){
                var link = cellView._V.connection.node.attributes;
                var vendor = (evt.target.textContent).trim();
                var styleValue = '0';
                if (link && link.length >= 6){
                    styleValue = link[5].value;}
                else{
                    styleValue = link[4].value;
                }
                if(styleValue.indexOf("2 2") == 0 || vendor.indexOf(otn_i18nStrings[ThirdPartyIndicator]) == 0 || vendor.indexOf(otn_i18nStrings[fiberIndicator]) == 0 || vendor.indexOf(otn_i18nStrings["Length"]) == 0 || vendor.indexOf(otn_i18nStrings["Loss"]) == 0 ){
                    this.initClearMenu();
                }else
                {
                    if(cellView.model.attributes.attrs.isASONTCC && cellView.model.attributes.attrs.isASONTCC == true){
                        this.initClearMenu();
                    }else{
                        this.initLinkMenu(evt.target, cellView.model.attributes.attrs);}
                }
            }
            else if((cellView.model.attributes.type).indexOf("devs.ImageObj") == 0)	{
                if(cellView.model.attributes.attrs.imageId.id){
                    if(cellView.model.attributes.attrs.imageName.indexOf("PG") == 0)
                    {
                        this.initPGMenu(evt.target, cellView.model.attributes.attrs.imageObjectId);
                    }else{
                        this.initClearMenu();
                    }
                }
                else{
                    if (cellView.model.attributes.attrs.connectionImage){
                        this.initConnectionMenu(evt.target);
                    }else{
                        this.initClearMenu();
                    }
                }
            }
            else{
                if((cellView.model.attributes.type).indexOf("basic.Rect") == 0)	{
                    if((cellView.model.attributes.attrs.connectionBox)){
                        this.initConnectionMenu(evt.target);
                    }else{this.initClearMenu();
                    }
                }else{
                    this.initClearMenu();
                }
            }
            // ... display custom menu, ...
        }else{
            this.initClearMenu();
        }
    }));            

};  // end configureEventHandling()

function refreshPage() {
    //Refresh the page when we receive an event
    isEventOnProcess = true;

    setRefresh( true ); // refresh: true => clear graph
    
    if( getRefresh() ){
        getGraph().clear();
        getPaper().setDimensions($("#paper").width(), $("#paper").height())
    }
    showLoadingTxt();   //show loading
    // return
    var timer = setTimeout(function(){
        createObjectLists()
        // if(zoomOutDisplay){
            svgE2EZoomOut(zoomOutValue);
            svgResetPan();  //重置仪表盘的位置
            // 位置设置失效
            $("#paper svg").children(":first").css('transform', 'matrix(0.8, 0, 0, 0.8, 88.2, 60)!important;')
            
            hideServiceTooltip();    // hide loading
            timer = null;
        // }
    }, 0)
};

function initialZoomOutToViewElements() {
    var graphlements = getGraph().getElements();
    var ht = window.innerHeight-200;
    var wd = window.innerWidth-200;
    for (var count = 0; count < graphlements.length; count++) {
               if(graphlements[count].attributes.type){
                if(graphlements[count].attributes.type === "devs.Coupled"){
                    if(graphlements[count].attributes.position.x < wd && graphlements[count].attributes.position.y < ht){
                        return false;
                    }								                 	
                }							
            }			          
    }
    return true;		           
};