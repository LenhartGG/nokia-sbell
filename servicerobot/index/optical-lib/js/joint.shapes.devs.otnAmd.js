/**
 * 
 * returns {}
 */
function jointAmd() {

	joint.dia.FastPaper1 = joint.dia.Paper.extend({
		sortViews : _.noop,
		disableViewSorting : function(){
			this.sortViews = _.noopr;
		},
		enableViewSorting : function(){
			this.sortViews = this.constructor.prototype.sortViews;
			this.sortViews();
		}
	});
	
	joint.dia.FastPaper = joint.dia.Paper.extend({

		sortViews : _.noop,

		beforeRenderViews : function() {

			this.documentFragment = document.createDocumentFragment();
		},

		renderView : function(cell) {
			if ( !this.documentFragment )
				this.beforeRenderViews();
			
			var view = this._views[cell.id] = this.createViewForModel(cell);

			// Keep the document fragment sorted. First goes links and
			// then elements. L-L-L-L-L-E-E-E-E-E-E
			if (cell.isLink()) {
				this.documentFragment.insertBefore(view.el,
						this.documentFragment.firstChild);
			} else {
				this.documentFragment.appendChild(view.el);
			}

			view.paper = this;
			try{
				view.render();
			} catch (e){
				var allowBreakpointHere = true;
				console.log( cell );
				console.error( e.stack );
				//throw e;
			}

			return view;
		},

		asyncBatchAdded : function() {

			if (this.documentFragment.children.length) {
				// Insert the document fragment after last link. i.e. If
				// the viewport is sorted having
				// L1-L2-L3-E1-E2-E3 and the fragment contains L4-E4 we
				// want the viewport stay sorted.
				// -> L1-L2-L3-L4-E4-E1-E2-E3
				// Also note that there in the viewport could be a
				// single element, but never a single link.
				this.viewport.insertBefore(this.documentFragment,
						this.viewport.querySelector('.element'));
				this.documentFragment = document.createDocumentFragment();
			}
		}
	});
    
    var myClass = {};

	myClass.Rect1 = joint.shapes.basic.Generic.extend({

	    markup: '<g class="rotatable"><g class="scalable"><rect1/></g><text/></g>',
	    
	    defaults: joint.util.deepSupplement({  
	    
	        type: 'basic.Rect1',
	        attrs: {
	            'rect1': { fill: 'red', stroke: 'black', 'follow-scale': true, width: 40, height: 40 },
	            'text': { 'font-size': 8, 'ref-x': .5, 'ref-y': .5, ref: 'rect1', 'y-alignment': 'middle', 'x-alignment': 'middle' }
	        }
	        
	    }, joint.shapes.basic.Generic.prototype.defaults)
	});
	
 var svgFile = [
'<?xml version="1.0" encoding="utf-8"?>',
'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
'<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30.083px" height="45.083px" viewBox="0 0 95.083 95.083" enable-background="new 0 0 30.083 45.083" xml:space="preserve">',
'<polyline fill="none" stroke="#000000" stroke-width="4" points="20 170,20 20, 150 70, -130 250 "/>',
'<polyline fill="none" stroke="#000000" stroke-width="4" points="20 96,400 -150 "/>',
'</svg>'
].join('');
    
 
 var svgFile_Triangle = [
'<?xml version="1.0" encoding="utf-8"?>',
'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
'<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30.083px" height="45.083px" viewBox="0 0 210.083 210.083" enable-background="new 0 0 30.083 45.083" xml:space="preserve">','<polyline fill="lightgreen" stroke="#000000" stroke-width="4" points="2 170,2 5,200 85,-190 250 "/>',
'</svg>'
].join('');
     
myClass.TriangleModel = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

	    markup: '<g class="rotatable"><g class="scalable"><image class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
	    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

	    defaults: joint.util.deepSupplement({

	        type: 'devs.Model',
	        size: { width: 1, height: 1 },
	        inPorts: [],
	        outPorts: [],
	        attrs: {
	        	'.inPorts .port .port-body': {'ref-x': 0, 'ref-y': -10},
	        	'.outPorts .port .port-body': {'ref-x': 0, 'ref-y': -10},
	            '.': { magnet: false },
	            '.body': {
	                width: 150, height: 250,  // default, overridden by resetting "size"
	                stroke: '#fff000'
	            },
	         '.port-body': {
	                r: 10,
	                magnet: true,
	                stroke: '#000000'
	            },
	            text: {
	                'pointer-events': 'none'
	            },
	      
             //'.outPorts .port .port-body' : {r:10, 'ref-x': -50, 'ref-y': 0, 'fill': 'none'},
             '.body': {
            	      width: 202,
            	      height: 176,
            	      fill: 'green',
            	      'xlink:href': 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFile_Triangle),
            	      preserveAspectRatio: 'none'
               },
            	    '.label': {
                        text: 'this.NeName',
                        'ref-x': 0,
                        'ref-y': -30,
                        'fill': 'black'
                    },
	            '.inPorts .port-label': { text: 'this.portName', x:-15, dy: 4, fill: 'yellow' },
	            '.outPorts .port-label':{ x: 15, dy: 4, fill: 'red' },
	            circle: {
	                r: 8,
	                magnet: true,
	                magnet: 'passive',
	                stroke: 'black'
	            },
	            '.inPorts text': {
	            	x: -10,
					y: 15,
	                dy: 10,
	                'text-anchor': 'end',
					'font-size':12,
					'fill': 'black'
	            },
	            '.outPorts text': {
	            	x: 10,
					y: 15,
	                dy: 10,
					'font-size':12,
					'fill': 'black'
	            }
	        }

	    }, joint.shapes.basic.Generic.prototype.defaults),

	    // BEGIN:  Make this a common method across all shapes in this class
	    getFormattedPortLabel: function( portNameAndId ){
	    	var formattedName = portNameAndId;
	    	var portId = "noPortID";
	    	var count = portNameAndId.lastIndexOf('-');
	    	var char = portNameAndId.charAt(count - 1);
	    	var portName = "";
			if(char == '-'){
				portName = portNameAndId.substring(0, count - 1);
				portId = portNameAndId.substring( count );
			}else{
				portName = portNameAndId.substring(0, count);
				portId = portNameAndId.substring( count+1 );
			}
			
			// Not sure why we're not replacing both slash and dotted, but that's the way it's been.
			var realPortName = portName.replace("slash", "/");
			realPortName = realPortName.replace("dotted", ".");
			var realNameCount = realPortName.length;

			// How do we want to format?
			var showTruncatedPortLabel = true; 
			var debug_showPortId = false;
			var debug_showPortLabelAndId = false;
			
			if ( debug_showPortId ){
				formattedName = portId;
			}
			else if ( debug_showPortLabelAndId ){
				formattedName = portNameAndId;
			}
			else if( showTruncatedPortLabel && realPortName.length > 13){
				formattedName = "..."+realPortName.substring(realNameCount-10,realNameCount);
			}else{
				formattedName = realPortName;
			}
			
			return formattedName;
	    },
	    // END  :  Make this a common method across all shapes in this class
	    
	    getPortAttrs: function(portName, index, total, selector, type) {

	        var attrs = {};
	        var portClass = 'port' + index;
	        var portSelector = selector + '>.' + portClass;
	        var portLabelSelector = portSelector + '>.port-label';
	        var portBodySelector = portSelector + '>.port-body';
	        var portTextSelector = portSelector + '>text';
	        attrs[portTextSelector] = {
	                text: portName
	            };
	        //attrs[portLabelSelector] = { text: portName };
	        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
	        attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };
	        
	        if(portName)
			{
	        	attrs[portTextSelector]['text'] = ( this.getFormattedPortLabel( portName ) );
			}
	        
	        if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

	        return attrs;
	    }
	}));
	
myClass.ImageObj = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><image/></g><a><text/></a></g>',

    defaults:  joint.util.deepSupplement({  
        type: 'devs.ImageObj',      
        size: {'width': 1, 'height': 1}, //set it by using element.resize(width,height) option where ever required
        attrs: {
			 '.': {
                magnet: false
            },
            text: {                
                'ref': 'image',
                'fill': 'black'
            },            
            image: {},
            imageName: {},
            imageId: {}
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

myClass.OTN = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><rect class="body"/><text class="label"/></g>',
    portMarkup: '<circle class="port-body"/>',
    portLabelMarkup: '<text class="port-label"/>',
    defaults: _.defaultsDeep({

        type: 'devs.Model',
        inPorts: [],
        outPorts: [],
        size: {
            width: 80,
            height: 80
        },
        attrs: {
             '.': {
                magnet: true
            },
			polygon: {
				points: '0,0 50,0 50,100 0,100 0,0',
				//points: '0,0 ' + this.size.width + ",0 " + this.size.width +","+ this.size.height +" 0,"+ this.size.height + " 0,0" ,
			},
			rect: {
				rx: 1,
				ry: 1,
				//fill: 'white',
				fill: {
                                  type: 'linearGradient',
                                  stops: [
                                      { offset: '0%', color: 'lightgray' },
                                      { offset: '50%', color: 'lightgray' }
                                  ],
                                  attrs:  { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}
                              },
				//filter: { name: 'dropShadow', args: { dx: 5, dy:5, blur: 3, color: '#000000' } },
                width: 80,
                height: 80,
                stroke: 'white',
				'stroke-width': 2
            },
            '.label': {
                 text: 'this.NeName',
                'ref-x': .2,
                'ref-y': -32,
                'fill': 'black'
            },
			text: {
                 fill: 'black',
                 'pointer-events': 'none'
             }
        },
        ports: {
            groups: {
                'in': {
                    position: {
                        name: 'left'
                    },
                    attrs: {
						   '.port-label': {
							'fill': 'black'
                        },
                        '.port-body': {
                            stroke: '#000',
                            r: 9,
                            magnet: 'passive'						
                        }
                    },
					label: {
                        position: {
                            name: 'left',
                            args: {
								x: -10,
								y: 15,
								dy: 10,
								'text-anchor': 'end',
								'font-size':13,
								'fill': 'black'
                            }
                        }
                    },
                },
                'out': {
                    position: {
                        name: 'right'                        	
                    },
                    attrs: {
                        '.port-label': {
						'fill': 'black'
                        },
                        '.port-body': {
                            stroke: '#000',
                            r: 9,
                            magnet: 'passive'
                        }
                    },
					label: {
                        position: {
                            name: 'right',									
                            args: {
								x: 10,
								y: 15,
								dy: 10,
								'font-size':13,
								'fill': 'black'								
                            }
                        }
                    }
                }
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),
	 // BEGIN:  Make this a common method across all shapes in this class
	    getFormattedPortLabel: function( portNameAndId ){
	    	var formattedName = portNameAndId;
	    	var portId = "noPortID";
	    	var count = portNameAndId.lastIndexOf('-');
	    	var char = portNameAndId.charAt(count - 1);
	    	var portName = "";
			if(char == '-'){
				portName = portNameAndId.substring(0, count - 1);
				portId = portNameAndId.substring( count );
			}else{
				portName = portNameAndId.substring(0, count);
				portId = portNameAndId.substring( count+1 );
			}
			
			// Not sure why we're not replacing both slash and dotted, but that's the way it's been.
			var realPortName = portName.replace("slash", "/");
			realPortName = realPortName.replace("dotted", ".");
			var realNameCount = realPortName.length;

			// How do we want to format?
			var showTruncatedPortLabel = true; 
			var debug_showPortId = false;
			var debug_showPortLabelAndId = false;
			
			if ( debug_showPortId ){
				formattedName = portId;
			}
			else if ( debug_showPortLabelAndId ){
				formattedName = portNameAndId;
			}
			else if( showTruncatedPortLabel && realPortName.length > 19){
				formattedName = "..."+realPortName.substring(realNameCount-16,realNameCount);
			}else{
				formattedName = realPortName;
			}
			
			return formattedName;
	    },

    initialize: function() {

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        this.on('change:inPorts change:outPorts', this.updatePortItems, this);
        this.updatePortItems();
    },

    updatePortItems: function(model, changed, opt) {

        // Make sure all ports are unique.
        var inPorts = _.uniq(this.get('inPorts'));
        var outPorts = _.difference(_.uniq(this.get('outPorts')), inPorts);

        var inPortItems = this.createPortItems('in', inPorts);
        var outPortItems = this.createPortItems('out', outPorts);

        this.prop('ports/items', inPortItems.concat(outPortItems), _.extend({ rewrite: true }, opt));
    },

    createPortItem: function(group, port) {
		//port = this.getFormattedPortLabel( port );
		//debugger;
        return {
            id: port,
            group: group,
            attrs: {
                '.port-label': {
					'pointer-events': 'none',
                    text: this.getFormattedPortLabel( port )
                }
            }
        };
    },

    createPortItems: function(group, ports) {

        return _.map(ports, _.bind(this.createPortItem, this, group));
    },

    _addGroupPort: function(port, group, opt) {

        var ports = this.get(group);
        return this.set(group, _.isArray(ports) ? ports.concat(port) : [port], opt);
    },

    addOutPort: function(port, opt) {

        return this._addGroupPort(port, 'outPorts', opt);
    },

    addInPort: function(port, opt) {

        return this._addGroupPort(port, 'inPorts', opt);
    },

    _removeGroupPort: function(port, group, opt) {

        return this.set(group, _.without(this.get(group), port), opt);
    },

    removeOutPort: function(port, opt) {

        return this._removeGroupPort(port, 'outPorts', opt);
    },

    removeInPort: function(port, opt) {

        return this._removeGroupPort(port, 'inPorts', opt);
    },

    _changeGroup: function(group, properties, opt) {
        
        return this.prop('ports/groups/' + group, _.isObject(properties) ? properties : {}, opt);
    },
    
    changeInGroup: function(properties, opt) {

        return this._changeGroup('in', properties, opt);
    },

    changeOutGroup: function(properties, opt) {

        return this._changeGroup('out', properties, opt);
    }
});

myClass.OTN_old = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port<%= id %>"><circle/><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'devs.Model',
        size: {
            width: 1,
            height: 1
        },

        inPorts: [],
        outPorts: [],

        /*attrs: {
            '.': {
                magnet: false
            },
            rect: {
				rx: 10,
				ry: 10,
				fill: '#BDBDBD',
                width: 250,
                height: 150,
                stroke: 'black'
            },
            circle: {
                r: 10,
                magnet: true,
                stroke: 'black'
            },
            text: {
                fill: 'black',
                'pointer-events': 'none'
            },
            '.label': {
                text: 'Model',
                'ref-x': .1,
                'ref-y': .6
            },
            '.inPorts text': {
                x: 0,
                dy: 10,
                'text-anchor': 'end'
            },
            '.outPorts text': {
                x: 0,
                dy: -25,
                'text-anchor': 'end'
            },
            '.ioPorts text': {
                x: 0,
                dy: 45,
                'text-anchor': 'end'
            }
        }*/
		attrs: {
            '.': {
                magnet: false
            },
            rect: {
				rx: 10,
				ry: 10,
				//fill: 'white',
				fill: {
                                  type: 'linearGradient',
                                  stops: [
                                      { offset: '0%', color: 'white' },
                                      { offset: '50%', color: 'Gray' }
                                  ],
                                  attrs:  { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}
                              },
				filter: { name: 'dropShadow', args: { dx: 5, dy:5, blur: 3, color: '#000000' } },
                width: 150,
                height: 250,
                stroke: '#00FF00',
				'stroke-width': 6
            },
            circle: {
                r: 10,
                magnet: true,
                magnet: 'passive',
                stroke: 'black'
            },
            text: {
                fill: 'black',
                'pointer-events': 'none',
                'font-size':13,
                'fill': 'black'
            },
            '.label': {
                text: 'this.NeName',
                'ref-x': .2,
                'ref-y': -32,
                'fill': 'black'
            },
            '.inPorts text': {
            	x: -10,
				y: 15,
                dy: 10,
                'text-anchor': 'end',
				'font-size':13,
				'fill': 'black'
            },
            '.outPorts text': {
            	x: 10,
				y: 15,
                dy: 10,
				'font-size':13,
				'fill': 'black'
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults),
    
    // BEGIN:  Make this a common method across all shapes in this class
    getFormattedPortLabel: function( portNameAndId ){
    	var formattedName = portNameAndId;
    	var portId = "noPortID";
    	var count = portNameAndId.lastIndexOf('-');
    	var char = portNameAndId.charAt(count - 1);
    	var portName = "";
		if(char == '-'){
			portName = portNameAndId.substring(0, count - 1);
			portId = portNameAndId.substring( count );
		}else{
			portName = portNameAndId.substring(0, count);
			portId = portNameAndId.substring( count+1 );
		}
		
		// Not sure why we're not replacing both slash and dotted, but that's the way it's been.
		var realPortName = portName.replace("slash", "/");
		realPortName = portName.replace("dotted", ".");
		var realNameCount = realPortName.length;

		// How do we want to format?
		var showTruncatedPortLabel = true; 
		var debug_showPortId = false;
		var debug_showPortLabelAndId = false;
		
		if ( debug_showPortId ){
			formattedName = portId;
		}
		else if ( debug_showPortLabelAndId ){
			formattedName = portNameAndId;
		}
		else if( showTruncatedPortLabel && realPortName.length > 13){
			formattedName = "..."+realPortName.substring(realNameCount-10,realNameCount);
		}else{
			formattedName = realPortName;
		}
		
		return formattedName;
    },
    // END  :  Make this a common method across all shapes in this class
    
    getPortAttrs: function(portName, index, total, selector, type) {

        /*var attrs = {};

        var portClass = 'port' + index;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>text';
        var portCircleSelector = portSelector + '>circle';

        attrs[portTextSelector] = {
            text: portName
        };
        attrs[portCircleSelector] = {
            port: {
                id: portName || _.uniqueId(type),
                type: type
            }
        };
        attrs[portSelector] = {
            ref: 'rect',
            'ref-x': (index + 0.5) * (1 / total)
        };

        if (selector === '.outPorts') {
            attrs[portSelector]['ref-dy'] = 0;
        }

        return attrs;*/
		var attrs = {};

        var portClass = 'port' + index;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>text';
        var portCircleSelector = portSelector + '>circle';

        attrs[portTextSelector] = {
            text: portName
        };
        attrs[portCircleSelector] = {
            port: {
                id: portName || _.uniqueId(type),
                type: type
            }
        };
        attrs[portSelector] = {
            ref: 'rect',
            'ref-y': (index + 0.5) * (1 / total)
        };
        if(portName)
		{
			attrs[portTextSelector]['text'] = ( this.getFormattedPortLabel( portName ) );
		}
        if (selector === '.outPorts') {
            attrs[portSelector]['ref-dx'] = 0;
        }

        return attrs;
    }
}));


//working partially need to check that same
myClass.GenericModel = joint.shapes.devs.Model.extend({

    markup: '<g class="rotatable"><g class="scalable"><path class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><path class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'devs.GenericModel',
        size: {
            width: 100,
            height: 100
        },

        inPorts: ['in','in1'],
        outPorts: ['out','out1'],
        attrs: {
                '.port-body': {
                    r: 10,
                    magnet: true,
                    stroke: '#000000'
                },
               '.inPorts circle': {r:10, fill: 'red' },
                '.outPorts circle': { fill: 'blue' },
                image: { 'xlink:href': '/images/rout6.gif', width: 70, height: 50, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'x-alignment': 'middle', 'y-alignment': 'middle' }
            }
    }, joint.shapes.devs.Model.prototype.defaults)
});

myClass.GenericModelView = joint.shapes.devs.ModelView;

myClass.Pack = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><rect class="body"/><text class="label"/></g>',
    portMarkup: '<circle class="port-body"/>',
    portLabelMarkup: '<text class="port-label"/>',
    defaults: _.defaultsDeep({
		color: 'red',
		type : 'devs.Model',
		size : {
			width : 1,
			height : 1
		},
		inPorts : [],
		outPorts : [],
		attrs : {
			'.' : {
				magnet : true
			},
			polygon: {
				points: '0,0 50,0 50,100 0,100 0,0',
				//points: '0,0 ' + this.size.width + ",0 " + this.size.width +","+ this.size.height +" 0,"+ this.size.height + " 0,0" ,
			},
			rect : {
				rx : 1,
				ry : 1,
				// fill:
				// 'white',
				fill : {
					type : 'linearGradient',
					stops : [
						{
							offset : '0%',
							color : 'white'
						},
						{
							offset : '50%',
							color : 'white'
						} ],
					attrs : {
						x1 : '0%',
						y1 : '0%',
						x2 : '0%',
						y2 : '100%'
					}
				},
//				filter : {
//					name : 'dropShadow',
//					args : {
//						dx : 5,
//						dy : 5,
//						blur : 3,
//						color : '#000000'
//					}
//				},
				width : 150,
				height : 250,
				stroke : 'white',
				'stroke-width' : 1
			},
			circle : {
				r : 8,
				dx : -100,
				magnet : true,
				magnet : 'passive',
				stroke : 'black'
			},
			text : {
				fill : 'black',
				'pointer-events' : 'none',
				'font-size' : 13,
				'fill' : 'black'
			},
			'.label' : {
				text : 'this.NeName',
				'font-size' : 12,
				'ref-x' : 0,
				'ref-y' : -25,
				'fill' : 'black'
			}
		},
        ports: {
            groups: {
                'in': {
                    position: {
                        name: 'left'
                    },
                    attrs: {
						   '.port-label': {
							'fill': 'black'
                        },
                        '.port-body': {
                            stroke: '#000',
                            r: 7,
                            magnet: 'passive'
                        }
                    },
					label: {
                        position: {
                            name: 'left',
                            args: {
								x: -10,
								y: 15,
								dy: 10,
								'text-anchor': 'end',
								'font-size':13,
								'fill': 'black'
                            }
                        }
                    },
                },
                'out': {
                    position: {
                        name: 'right'                        	
                    },
                    attrs: {
                        '.port-label': {
						'fill': 'black'
                        },
                        '.port-body': {
                            stroke: '#000',
                            r: 7
                            //magnet: passive
                        }
                    },
					label: {
                        position: {
                            name: 'right',									
                            args: {
								x: 10,
								y: 15,
								dy: 10,
								'font-size':13,
								'fill': 'black'								
                            }
                        }
                    }
                }
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

		renderView : function() {
		console.error("cell:",this);
		this.attr({rect:{fill: {
			type : 'linearGradient',
			stops : [
					{offset : '00%', color : 'white'},
					{offset : '50%', color : this.color}
				],
			attrs : {x1 : '0%', y1 : '0%', x2 : '0%', y2 : '100%'}
			}}});
		
		joint.shapes.basic.Generic.prototype.renderView.apply(this, arguments);
//		this.paper.$el.prepend(this.$box);
//		this.updateBox();
		return this;
	},
	 // BEGIN:  Make this a common method across all shapes in this class
	    getFormattedPortLabel: function( portNameAndId ){
	    	var formattedName = portNameAndId;
	    	var portId = "noPortID";
	    	var count = portNameAndId.lastIndexOf('-');
	    	var char = portNameAndId.charAt(count - 1);
	    	var portName = "";
			if(char == '-'){
				portName = portNameAndId.substring(0, count - 1);
				portId = portNameAndId.substring( count );
			}else{
				portName = portNameAndId.substring(0, count);
				portId = portNameAndId.substring( count+1 );
			}
			
			// Not sure why we're not replacing both slash and dotted, but that's the way it's been.
			var realPortName = portName.replace("slash", "/");
			realPortName = realPortName.replace("dotted", ".");
			var realNameCount = realPortName.length;

			// How do we want to format?
			var showTruncatedPortLabel = true; 
			var debug_showPortId = false;
			var debug_showPortLabelAndId = false;
			
			if ( debug_showPortId ){
				formattedName = portId;
			}
			else if ( debug_showPortLabelAndId ){
				formattedName = portNameAndId;
			}
			else if( showTruncatedPortLabel && realPortName.length > 13){
				formattedName = "..."+realPortName.substring(realNameCount-10,realNameCount);
			}else{
				formattedName = realPortName;
			}
			
			return formattedName;
	    },

    initialize: function() {

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        this.on('change:inPorts change:outPorts', this.updatePortItems, this);
        this.updatePortItems();
    },

    updatePortItems: function(model, changed, opt) {

        // Make sure all ports are unique.
        var inPorts = _.uniq(this.get('inPorts'));
        var outPorts = _.difference(_.uniq(this.get('outPorts')), inPorts);

        var inPortItems = this.createPortItems('in', inPorts);
        var outPortItems = this.createPortItems('out', outPorts);

        this.prop('ports/items', inPortItems.concat(outPortItems), _.extend({ rewrite: true }, opt));
    },

    createPortItem: function(group, port) {
		//port = this.getFormattedPortLabel( port );
		//debugger;
        return {
            id: port,
            group: group,
            attrs: {
				interactive: false,
                '.port-label': {
                    text: this.getFormattedPortLabel( port )
                }
            }
        };
    },

    createPortItems: function(group, ports) {

        return _.map(ports, _.bind(this.createPortItem, this, group));
    },

    _addGroupPort: function(port, group, opt) {

        var ports = this.get(group);
        return this.set(group, _.isArray(ports) ? ports.concat(port) : [port], opt);
    },

    addOutPort: function(port, opt) {

        return this._addGroupPort(port, 'outPorts', opt);
    },

    addInPort: function(port, opt) {

        return this._addGroupPort(port, 'inPorts', opt);
    },

    _removeGroupPort: function(port, group, opt) {

        return this.set(group, _.without(this.get(group), port), opt);
    },

    removeOutPort: function(port, opt) {

        return this._removeGroupPort(port, 'outPorts', opt);
    },

    removeInPort: function(port, opt) {

        return this._removeGroupPort(port, 'inPorts', opt);
    },

    _changeGroup: function(group, properties, opt) {
        
        return this.prop('ports/groups/' + group, _.isObject(properties) ? properties : {}, opt);
    },
    
    changeInGroup: function(properties, opt) {

        return this._changeGroup('in', properties, opt);
    },

    changeOutGroup: function(properties, opt) {

        return this._changeGroup('out', properties, opt);
    }
});

myClass.Pack_old = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

	//markup: '<g class="rotatable"><g class="scalable"><rect/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
	markup: '<g class="scalable"><rect/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/>',
	portMarkup: '<g class="port<%= id %>"><circle/><text/></g>',

	defaults: joint.util.deepSupplement({	
		color: 'red',
		type : 'devs.Model',
		size : {
			width : 1,
			height : 1
		},
		inPorts : [],
		outPorts : [],
		attrs : {
			'.' : {
				magnet : false
			},
			polygon: {
				points: '0,0 50,0 50,100 0,100 0,0',
				//points: '0,0 ' + this.size.width + ",0 " + this.size.width +","+ this.size.height +" 0,"+ this.size.height + " 0,0" ,
			},
			rect : {
				rx : 1,
				ry : 1,
				// fill:
				// 'white',
				fill : {
					type : 'linearGradient',
					stops : [
						{
							offset : '0%',
							color : 'white'
						},
						{
							offset : '50%',
							color : 'white'
						} ],
					attrs : {
						x1 : '0%',
						y1 : '0%',
						x2 : '0%',
						y2 : '100%'
					}
				},
//				filter : {
//					name : 'dropShadow',
//					args : {
//						dx : 5,
//						dy : 5,
//						blur : 3,
//						color : '#000000'
//					}
//				},
				width : 150,
				height : 250,
				stroke : 'white',
				'stroke-width' : 1
			},
			circle : {
				r : 8,
				dx : -100,
				magnet : true,
				magnet : 'passive',
				stroke : 'black'
			},
			text : {
				fill : 'black',
				'pointer-events' : 'none',
				'font-size' : 13,
				'fill' : 'black'
			},
			'.label' : {
				text : 'this.NeName',
				'font-size' : 12,
				'ref-x' : 0,
				'ref-y' : -25,
				'fill' : 'black'
			},
			'.inPorts text' : {
				x : -10,
				y : 15,
				dy : 10,
				'text-anchor' : 'end',
				'font-size' : 12,
				'fill' : 'black'
			},
			'.outPorts text' : {
				x : 10,
				y : 15,
				dy : 10,
				'font-size' : 12,
				'fill' : 'black'
			}
		}

	},
	joint.shapes.basic.Generic.prototype.defaults),

	renderView : function() {
console.error("cell:",this);
		this.attr({rect:{fill: {
			type : 'linearGradient',
			stops : [
					{offset : '00%', color : 'white'},
					{offset : '50%', color : this.color}
				],
			attrs : {x1 : '0%', y1 : '0%', x2 : '0%', y2 : '100%'}
			}}});
		
		joint.shapes.basic.Generic.prototype.renderView.apply(this, arguments);
//		this.paper.$el.prepend(this.$box);
//		this.updateBox();
		return this;
	},

	// BEGIN:  Make this a common method across all shapes in this class
	getFormattedPortLabel: function( portNameAndId ){
		var formattedName = portNameAndId;
		var portId = "noPortID";
		var count = portNameAndId.lastIndexOf('-');
		var char = portNameAndId.charAt(count - 1);
		var portName = "";
		if(char == '-'){
			portName = portNameAndId.substring(0, count - 1);
			portId = portNameAndId.substring( count );
		}else{
			portName = portNameAndId.substring(0, count);
			portId = portNameAndId.substring( count+1 );
		}
		
		// Not sure why we're not replacing both slash and dotted, but that's the way it's been.
		var realPortName = portName.replace("slash", "/");
		realPortName = portName.replace("dotted", ".");
		var realNameCount = realPortName.length;

		// How do we want to format?
		var showTruncatedPortLabel = true; 
		var debug_showPortId = false;
		var debug_showPortLabelAndId = false;
		
		if ( debug_showPortId ){
			formattedName = portId;
		}
		else if ( debug_showPortLabelAndId ){
			formattedName = portNameAndId;
		}
		else if( showTruncatedPortLabel && realPortName.length > 13){
			formattedName = "..."+realPortName.substring(realNameCount-10,realNameCount);
		}else{
			formattedName = realPortName;
		}
		
		return formattedName;
	},
	// END  :  Make this a common method across all shapes in this class
	
	getPortAttrs: function(portName, index, total, selector, type) {
	
		var attrs = {};
	
		var portClass = 'port' + index;
		var portSelector = selector + '>.' + portClass;
		var portTextSelector = portSelector + '>text';
		var portCircleSelector = portSelector + '>circle';

		attrs[portTextSelector] = {
			text : portName
		};
		attrs[portCircleSelector] = {
			port : {
				id : portName || _.uniqueId(type),
				type : type
			}
		};
		attrs[portSelector] = {
			ref : 'rect',
			'ref-y' : (index + 0.5) * (1 / total)
		};
		if (portName) {
			attrs[portTextSelector]['text'] = (this.getFormattedPortLabel(portName));
		}
		if (selector === '.outPorts') {
			attrs[portSelector]['ref-dx'] = 0;
		}

		return attrs;
	}
}));



myClass.smallNode_old = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port<%= id %>"><circle/><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'devs.Model',
        size: {
            width: 1,
            height: 1
        },

        inPorts: [],
        outPorts: [],

        attrs: {
            '.': {
                magnet: false
            },
            rect: {
                width: 0,
                height: 0,
                stroke: 'black'
            },
            circle: {
                r: 5,
                magnet: true,
                magnet: 'passive',
                stroke: 'black'
            },
             text: {
                 fill: 'black',
                 'pointer-events': 'none'
             },
            '.inPorts text': {
            	x: -10,
				y: 15,
                dy: 10,
                'text-anchor': 'end',
				'font-size':13,
				'fill': 'black'
            },
            '.outPorts text': {
            	x: 10,
				y: 15,
                dy: 10,
				'font-size':13,
				'fill': 'black'
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults),

    getPortAttrs: function(portName, index, total, selector, type) {

        var attrs = {};

        var portClass = 'port' + index;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>text';
        var portCircleSelector = portSelector + '>circle';

        // attrs[portTextSelector] = {
        //     text: portName
        // };
        attrs[portCircleSelector] = {
            port: {
                id: portName || _.uniqueId(type),
                type: type
            }
        };
        attrs[portSelector] = {
            ref: 'rect',
            'ref-y': (index + 0.5) * (1 / total)
        };

        if (selector === '.outPorts') {
            attrs[portSelector]['ref-dx'] = 0;
        }

        return attrs;
    }
}));

myClass.smallNode = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><rect class="body"/><text class="label"/></g>',
    portMarkup: '<circle class="port-body"/>',
    portLabelMarkup: '<text class="port-label"/>',
    defaults: _.defaultsDeep({

        type: 'devs.Model',
        inPorts: [],
        outPorts: [],
        size: {
            width: 80,
            height: 80
        },
        attrs: {
           '.': {
                magnet: true
            },
            rect: {
                width: 0,
                height: 0,
                stroke: 'black'
            },
            circle: {
                r: 5,
                magnet: true,
                magnet: 'passive',
                stroke: 'black'
            },
             text: {
                 fill: 'black',
                 'pointer-events': 'none'
             }
        },
        ports: {
            groups: {
                'in': {
                    position: {
                        name: 'left'
                    },
                    attrs: {
                        '.port-label': {
                            fill: '#000'
                        },
                        '.port-body': {
                            fill: '#fff',
                            stroke: '#000',
                            r: 5,
                            magnet: 'passive'
                        }
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                               // y: 10
                            }
                        }
                    }
                },
                'out': {
                    position: {
                        name: 'right'
                    },
                    attrs: {
                        '.port-label': {
                            fill: '#000'
                        },
                        '.port-body': {
                            fill: '#fff',
                            stroke: '#000',
                            r: 5,
                            magnet: 'passive'
                        }
                    }
                }
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        this.on('change:inPorts change:outPorts', this.updatePortItems, this);
        this.updatePortItems();
    },

    updatePortItems: function(model, changed, opt) {

        // Make sure all ports are unique.
        var inPorts = _.uniq(this.get('inPorts'));
        var outPorts = _.difference(_.uniq(this.get('outPorts')), inPorts);

        var inPortItems = this.createPortItems('in', inPorts);
        var outPortItems = this.createPortItems('out', outPorts);

        this.prop('ports/items', inPortItems.concat(outPortItems), _.extend({ rewrite: true }, opt));
    },

    createPortItem: function(group, port) {

        return {
            id: port,
            group: group,
            attrs: {
                '.port-label': {
                  //  text: port
                }
            }
        };
    },

    createPortItems: function(group, ports) {

        return _.map(ports, _.bind(this.createPortItem, this, group));
    },

    _addGroupPort: function(port, group, opt) {

        var ports = this.get(group);
        return this.set(group, _.isArray(ports) ? ports.concat(port) : [port], opt);
    },

    addOutPort: function(port, opt) {

        return this._addGroupPort(port, 'outPorts', opt);
    },

    addInPort: function(port, opt) {

        return this._addGroupPort(port, 'inPorts', opt);
    },

    _removeGroupPort: function(port, group, opt) {

        return this.set(group, _.without(this.get(group), port), opt);
    },

    removeOutPort: function(port, opt) {

        return this._removeGroupPort(port, 'outPorts', opt);
    },

    removeInPort: function(port, opt) {

        return this._removeGroupPort(port, 'inPorts', opt);
    },

    _changeGroup: function(group, properties, opt) {
        
        return this.prop('ports/groups/' + group, _.isObject(properties) ? properties : {}, opt);
    },
    
    changeInGroup: function(properties, opt) {

        return this._changeGroup('in', properties, opt);
    },

    changeOutGroup: function(properties, opt) {

        return this._changeGroup('out', properties, opt);
    }
});

return myClass;
};

