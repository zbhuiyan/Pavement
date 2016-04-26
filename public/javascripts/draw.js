paper.install(window);
var myCanvas = document.getElementById('myCanvas');
var colorPicked = 'black'; // default color used

var pavement = new PavementWrapper(myCanvas);

var Canvas = React.createClass({

	getInitialState: function() {
		return {tool: this.usePencil(), activeIndex:0, strokeWidth:1};
	},

	componentDidMount: function () {
		this.loadLatestSVG();
		//instantiate the paperScope with the canvas element
		paper.setup('myCanvas');
		this.setupReceiver();
	},

	loadLatestSVG: function () {
		$.ajax({
			url: '/svg/' + this.props.boardId,
			success: function(result) {
				pavement.startProjectFromSVG (result.data);
			}
		});
	}, 

	onMouseDown: function (event) {
		var data = {};
		data.toPoint = event.point;
		this.emitEvent('setPath', data);

	},

	// ***** STATE EVENTS *****

	setStrokeWidth: function(e) {
		this.setState({strokeWidth:e.target.value});
	},

	// ***** EMITTING EVENTS *****

	usePencil: function () {
		this.setState({activeIndex: 0});
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {

			// packing the data
			var data = {};
			data.toPoint = event.point;
			data.strokeColor = colorPicked;
			data.strokeWidth = this.state.strokeWidth;

			// emiting the data
			this.emitEvent('drawPencil', data);
		}.bind(this);

		
	},

	useText: function () {
		this.setState({activeIndex: 7});
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = function(event) {
			// packing the data
			var data = {};
			data.startX = event.point.x;
			data.startY = event.point.y;
			data.strokeColor = colorPicked;
			data.text = prompt("Text!");
			// emitting all the data
			this.emitEvent('drawText', data);
		}.bind(this);
	},

	useCloud: function () {
		this.setState({activeIndex: 1});
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {

			var data = {};
			data.toPoint = event.point;
			data.strokeColor = colorPicked;
			data.strokeWidth = this.state.strokeWidth;

			// emitting the data
			this.emitEvent('drawCloud', data)

		}.bind(this);
	},


	usePrettyCircle: function() {
		this.setState({activeIndex: 3});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		

		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {}

			data.x = event.middlePoint.x;
			data.y = event.middlePoint.y;
			data.radius = event.delta.length/2; //the faster your mouse speed the bigger the circle
			data.color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			// emitting the data
			this.emitEvent('drawPrettyCircle', data);

		}.bind(this);
	},
	
	useCircle: function() {
		this.setState({activeIndex: 2});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			data.x = event.middlePoint.x;
			data.y = event.middlePoint.y;
			data.radius = (data.x-data.y)/2;
			// console.log(data.radius);
			data.color = colorPicked;
			this.emitEvent('drawCircle', data);
		}.bind(this);

	},

	usePrettyRectangle: function() {
		this.setState({activeIndex: 4});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;
			data.color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			// emitting the data
			this.emitEvent('drawPrettyRectangle', data);

		}.bind(this);
		
	},


	usePrettyEllipse: function() {
		this.setState({activeIndex: 5});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;
			data.color = {
						red: Math.random(),
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			// emitting the data
			this.emitEvent('drawPrettyEllipse', data);

		}.bind(this);
		
	},


	useEraser: function() {
		this.setState({activeIndex: 6});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {};
			data.toPoint = event.point;

			// emitting the data
			this.emitEvent('erase', data);
		}.bind(this);
	},

	useSingleCircle: function() {
		this.setState({activeIndex: 8});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			var x1 = event.middlePoint.x;
			var y1 = event.middlePoint.y;
			data.x1 = x1;
			data.y1 = y1;
			data.radius = this.state.strokeWidth;
			data.color = colorPicked;
			
			this.emitEvent('drawSingleCircle', data);
		}.bind(this);
	},

	useSingleRectangle: function() {
		this.setState({activeIndex: 9});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			data.x = event.point.x;
			data.y = event.point.y;
			data.color = colorPicked;
			data.size = this.state.strokeWidth;
			
			this.emitEvent('drawSingleRectangle', data);
		}.bind(this);
	},

	useSingleEllipse: function () {
		this.setState({activeIndex: 10});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			data.x = event.point.x;
			data.y = event.point.y;
			data.color = colorPicked;
			data.size = this.state.strokeWidth;
			
			this.emitEvent('drawSingleEllipse', data);
		}.bind(this);
	},

	clearCanvas: function(){
		this.tool.activate();
		paper.project.clear();
		this.emitEvent('clear', {});
	},

	// editItem: function(){
	// 	this.tool.activate();
	// 	var data = {};

	// 	this.tool.onMouseDown = function(event) {
	// 		data._path = event.item;
	// 		data._path.fullySelected = true;
	// 		data.handle = null;
	// 		var hitOptions = {
	// 			handles:true,
	// 			selected: true,
	// 			// fill:true,
	// 			stroke: true,
	// 			segments: true,
	// 			selectedSegments:true,
	// 			tolerance:200
	// 		};
	// 		var hitResult = data._path.hitTest(event.point, hitOptions);
	// 		if (hitResult) {
	// 			if (hitResult.type == 'handle-in'){
	// 				data.handle = hitResult.segment.handleIn;
	// 			} else {
	// 				data.handle = hitResult.segment.handleOut;
	// 			};
	// 		}
	// 	}
	// 	this.tool.onMouseDrag = function(event){
	// 		if (data.handle){
	// 			data.handle.x += event.delta.x;
	// 			data.handle.y += event.delta.y;
	// 		};
	// 	}

	// 	this.tool.onMouseUp = function(event){
	// 		data._path.fullySelected = false;
	// 	}

	// 	this.emitEvent('editItem', {});
	// },

	move:function(){
		this.tool.activate();

		this.tool.onMouseDown = function(event){
			var data = {};

			data.oldPoint = event.point;
			pavement.matches(data.oldPoint);

			this.emitEvent('select', data);
		}.bind(this);

		this.tool.onMouseDrag = function(event) {
			// I guess I need to do this to stop it from drawing rectangles?
			
		}

		this.tool.onMouseUp = function(event) {
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;

			this.emitEvent('move', data);
		}.bind(this);
	},


	deleteItem: function(){
		this.tool.activate();
		var data = {};

		this.tool.onMouseDown = function(event){
			data._path = event.item;
			data._path.fullySelected = true;
			data._path.remove();
		}

		this.emitEvent('deleteItem', data);




	},


	// ***** ADDITIONAL NON-COLLABORATIVE FUNCTIONALITY *****

	download: function(fileName) {

		this.tool.activate();

		var svg = paper.project.exportSVG({asString:true});
		var a = document.createElement('a');
		a.download = 'mySvg.svg';
		a.type = 'image/svg+xml';
		var blob = new Blob([svg], {"type": "image/svg+xml"});
		a.href = (window.URL || webkitURL).createObjectURL(blob);
		a.click();

	},

	sendSVG: function(){
		var _this = this;
		var myCanvas = document.getElementById('myCanvas');

		$("#upload").on('change',function(){
			_this.tool.activate();

	        var fs = $("#upload")[0].files;	
			var reader = new FileReader(); 

	        reader.onloadend = function (e) {  //called after a read completes
	          var data = {};
	          data.svg = e.target.result;
	          _this.emitEvent('importSVG', data);
	        };  

	        reader.readAsText(fs[0]); 

    	});
		$('#upload').trigger('click');
		
	},


	// ***** RECEIVING FUNCTIONALITY *****

	/*
	pickHexColor takes a hex color in via a js popup prompt and saves it to colorPicked

	When a tool is selected, it pack the color into the data which is then used in the 
	`draw` functions 	
	*/
	pickHexColor: function(){
		this.tool.activate();
		var input = prompt("Please enter a hex color", "#12A8B3");
		if (input != null) {
			colorPicked = input;
		}
	}, 

	// ***** STATIC COLOR FUNCTIONALITY *****

	colorRed: function(){
		this.tool.activate();
		colorPicked = "#FF0000";
	},

	colorBlack: function(){
		this.tool.activate();
		colorPicked = "#000000";
	},

	colorBlue: function(){
		this.tool.activate();
		colorPicked = "#0000FF";
	},

	colorWhite: function(){
		this.tool.activate();
		colorPicked = "#FFFFFF"; 
	},

	// ***** SOCKET FUNCTIONALITY *****

	emitEvent: function(eventName, data) {
		// This passes the event to the server 
		// the server repackages it so that I didn't have to write a bunch of functions that all did the same thing

		data.method = eventName;
		this.props.socket.emit('draw', data);
	},

	setupReceiver: function(data) {
		// These are all of the receiver functions
		this.props.socket.on('setPath', pavement.setPath);
		this.props.socket.on('drawPencil', pavement.drawPencil);
		this.props.socket.on('drawText', pavement.drawText);
		this.props.socket.on('drawCloud', pavement.drawCloud);
		this.props.socket.on('drawCircle', pavement.drawCircle);
		this.props.socket.on('drawPrettyCircle', pavement.drawPrettyCircle);
		this.props.socket.on('drawPrettyRectangle', pavement.drawPrettyRectangle);
		this.props.socket.on('drawPrettyEllipse', pavement.drawPrettyEllipses);
		this.props.socket.on('drawSingleCircle', pavement.drawSingleCircle);
		this.props.socket.on('drawSingleRectangle', pavement.drawSingleRectangle);
		this.props.socket.on('drawSingleEllipse', pavement.drawSingleEllipse);
		this.props.socket.on('erase', pavement.erase);
		this.props.socket.on('clear', pavement.clearProject);
		this.props.socket.on('importSVG', pavement.importSVG);
		this.props.socket.on('deleteItem', pavement.deleteItem);
		this.props.socket.on('select', pavement.select);
		this.props.socket.on('move', pavement.move);
	},

	render: function () {
		return (
			<div id="pavementDiv">
				<div id="toolBarDiv">
					<ul id="toolBar">
						<li><Button setTool={this.usePencil} active={this.state.activeIndex===0} icon={"icon-pencil"} tool={"Pencil"} /></li>
						<li><Button setTool={this.useCloud} active={this.state.activeIndex===1} icon={"icon-cloud"} tool={"Cloud"} /></li>
						<li><Button setTool={this.useCircle} active={this.state.activeIndex===2} tool={"Circle"} /></li>
						<li><Button setTool={this.usePrettyCircle} active={this.state.activeIndex===3} tool={"Pretty Circles"} /></li>
						<li><Button setTool={this.usePrettyRectangle} active={this.state.activeIndex===4} tool={"Pretty Rectangles"} /></li>
						<li><Button setTool={this.usePrettyEllipse} active={this.state.activeIndex===5} tool={"Pretty Ellipses"} /></li>
						<li><Button setTool={this.pickColor} icon={"icon-palette"}  tool={"Color"} /></li>
						<li><Button setTool={this.useEraser} active={this.state.activeIndex===6} icon={"icon-eraser"} tool={"Eraser"} /></li>
						<li><Button setTool={this.useText} active={this.state.activeIndex===7} icon={"icon-language"} tool={"Text"} /></li>
						<li><Button setTool={this.useSingleCircle} active={this.state.activeIndex===8} icon={"icon-record"}/></li>
						<li><Button setTool={this.useSingleRectangle} active={this.state.activeIndex===9} icon={"icon-progress-0"} tool={"Single Rectangle"} /></li>
						<li><Button setTool={this.useSingleEllipse} active={this.state.activeIndex===10} tool={"Single Ellipse"} /></li>
						<li><Button setTool={this.download} icon={'icon-download'} tool={"Download SVG"} /></li>
						<li><Button setTool={this.clearCanvas} tool={"Clear Canvas"} /></li>
						<li><Button input id ="svgFile" type ="file" name = "svgFile" setTool={this.sendSVG} icon={"icon-publish"} tool={'Import SVG'}/></li>
						<li><input id="upload" type="file" name="upload" style={{visibility: 'hidden'}} setTool={this.sendSVG}/><br /></li>
						<li><input type="range" value={this.state.strokeWidth} min="1" max="50" onChange={this.setStrokeWidth}/></li>
						<li><span>Stroke Width: {this.state.strokeWidth}</span></li>
					</ul>
				</div>
				<div id="canvasDiv">
					<canvas id="myCanvas" data-paper-resize></canvas>
				</div>
			</div>
		);
	}

});

window.Canvas = Canvas;