// ***** Drawing Stuff *****

// active indicies for which toolbar button has been selected
var ACTIVE_INDEX = {
		PENCIL: 0,
		CLOUD: 1,
		CIRCLE: 2,
		RECTANGLE: 3,
		ELLIPSE: 4,
		ERASER: 5,
		TEXT: 6,
		PRETTY_CIRCLE: 7,
		PRETTY_RECTANGLE: 8,
		PRETTY_ELLIPSE: 9,
		COOL_CIRCLE: 10,
		SELECT: 11
};

paper.install(window);
var myCanvas = document.getElementById('myCanvas');
var colorPicked = 'black'; // default color used

var pavement = new PavementWrapper(myCanvas);

var Canvas = React.createClass({

	getInitialState: function() {
		return {tool: this.usePencil(), activeIndex:ACTIVE_INDEX.PENCIL, strokeWidth:1};
	},

	componentDidMount: function () {
		this.loadLatestSVG();
		//instantiate the paperScope with the canvas element
		paper.setup('myCanvas');
		this.setupReceiver();
	},

	componentWillUpdate: function() {
		this.shouldSendDeselect = this.state.activeIndex === ACTIVE_INDEX.SELECT;
	},

	componentDidUpdate: function() {
		if(this.state.activeIndex !== ACTIVE_INDEX.SELECT && this.shouldSendDeselect) {
			this.emitEvent('deselect', {});
		}
	},

	loadLatestSVG: function () {
		$.ajax({
			url: '/svg/' + this.props.boardId,
			success: function(result) {
				pavement.startProjectFromSVG(result.data, this.getLatestEdits());
			}.bind(this)
		});
	},

	getLatestEdits: function() {
		$.ajax({
			url: '/edits/' + this.props.boardId,
			success: function(result) {
				console.log(result);
				for(var index = 0; index < result.length; index++) {
					pavement.applyEdit(result[index].data);
				}
			}.bind(this)
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
		this.setState({activeIndex: ACTIVE_INDEX.PENCIL});
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {

			// packing the data
			var data = {};
			data.toPoint = event.point;
			data.strokeColor = colorPicked;
			data.strokeWidth = this.state.strokeWidth;

			// emitting the data
			this.emitEvent('drawPencil', data);
		}.bind(this);

		this.tool.onMouseUp = function(event) {};
	},

	useText: function () {
		this.setState({activeIndex: ACTIVE_INDEX.TEXT});
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

		this.tool.onMouseUp = function(event) {};
	},

	useCloud: function () {
		this.setState({activeIndex: ACTIVE_INDEX.CLOUD});
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

		this.tool.onMouseUp = function(event) {};
	},


	usePrettyCircle: function() {
		this.setState({activeIndex: ACTIVE_INDEX.PRETTY_CIRCLE});
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

		this.tool.onMouseUp = function(event) {};
	},
	
	useCircle: function() {
		this.setState({activeIndex: ACTIVE_INDEX.COOL_CIRCLE});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			data.x = event.middlePoint.x;
			data.y = event.middlePoint.y;
			data.radius = (data.x-data.y)/2;
			data.color = colorPicked;
			this.emitEvent('drawCircle', data);
		}.bind(this);

		this.tool.onMouseUp = function(event) {};
	},

	usePrettyRectangle: function() {
		this.setState({activeIndex: ACTIVE_INDEX.PRETTY_RECTANGLE});
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
		
		this.tool.onMouseUp = function(event) {};
	},


	usePrettyEllipse: function() {
		this.setState({activeIndex: ACTIVE_INDEX.PRETTY_ELLIPSE});
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

		this.tool.onMouseUp = function(event) {};
	},


	useEraser: function() {
		this.setState({activeIndex: ACTIVE_INDEX.ERASER});
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {};
			data.toPoint = event.point;

			// emitting the data
			this.emitEvent('erase', data);
		}.bind(this);

		this.tool.onMouseUp = function(event) {};
	},

	useSingleCircle: function() {
		this.setState({activeIndex: ACTIVE_INDEX.CIRCLE});
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

		this.tool.onMouseUp = function(event) {};
	},

	useSingleRectangle: function() {
		this.setState({activeIndex: ACTIVE_INDEX.RECTANGLE});
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

		this.tool.onMouseUp = function(event) {};
	},

	useSingleEllipse: function () {
		this.setState({activeIndex: ACTIVE_INDEX.ELLIPSE});
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

		this.tool.onMouseUp = function(event) {};
	},

	clearCanvas: function(){
		this.tool.activate();
		paper.project.clear();
		this.emitEvent('clear', {});
	},


	select: function() {
		this.setState({activeIndex:ACTIVE_INDEX.SELECT});
		this.tool.activate();

		this.tool.onMouseDown = function(event){
			var data = {};

			data.oldPoint = event.point;

			this.emitEvent('select', data);
		}.bind(this);

		this.tool.onKeyDown = function(event) {
			if(this.state.activeIndex === 11 && event.key === 'delete') {
				this.emitEvent('deleteItem', {});
			}
		}.bind(this);

		this.tool.onMouseDrag = function(event) {};
		this.tool.onMouseUp = function(event) {
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;

			this.emitEvent('move', data);
		}.bind(this);
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
		this.props.socket.on('deselect', pavement.deselect);
	},

	render: function () {
		return (
			<div id="pavementDiv">
				<div id="toolBarDiv">
					<ul id="toolBar">
						<li><Button setTool={this.usePencil} active={this.state.activeIndex===ACTIVE_INDEX.PENCIL} icon={"icon-pencil"} tool={"Pencil"} /></li>
						<li><Button setTool={this.useCloud} active={this.state.activeIndex===ACTIVE_INDEX.CLOUD} icon={"icon-cloud"} tool={"Cloud"} /></li>
						<li><Button setTool={this.useSingleCircle} active={this.state.activeIndex===ACTIVE_INDEX.CIRCLE} icon={"icon-record"}/></li>
						<li><Button setTool={this.useSingleRectangle} active={this.state.activeIndex===ACTIVE_INDEX.RECTANGLE} icon={"icon-progress-0"} tool={"Single Rectangle"} /></li>
						<li><Button setTool={this.useSingleEllipse} active={this.state.activeIndex===ACTIVE_INDEX.ELLIPSE} tool={"Single Ellipse"} /></li>
						<li><Button setTool={this.useEraser} active={this.state.activeIndex===ACTIVE_INDEX.ERASER} icon={"icon-eraser"} tool={"Eraser"} /></li>
						<li><Button setTool={this.useText} active={this.state.activeIndex===ACTIVE_INDEX.TEXT} icon={"icon-language"} tool={"Text"} /></li>
						<li><Button setTool={this.usePrettyCircle} active={this.state.activeIndex===ACTIVE_INDEX.PRETTY_CIRCLE} tool={"Pretty Circles"} /></li>
						<li><Button setTool={this.usePrettyRectangle} active={this.state.activeIndex===ACTIVE_INDEX.PRETTY_RECTANGLE} tool={"Pretty Rectangles"} /></li>
						<li><Button setTool={this.usePrettyEllipse} active={this.state.activeIndex===ACTIVE_INDEX.PRETTY_ELLIPSE} tool={"Pretty Ellipses"} /></li>
						<li><Button setTool={this.useCircle} active={this.state.activeIndex===ACTIVE_INDEX.COOL_CIRCLE} tool={"Circle"} /></li>
						<li><Button setTool={this.pickHexColor} icon={"icon-palette"}  tool={"Color"} /></li>
						<li><Button setTool={this.select} active={this.state.activeIndex===ACTIVE_INDEX.SELECT} tool={'Select & Move'} /></li>
						<li><Button setTool={this.colorBlack} tool={"Black"} /></li>
						<li><Button setTool={this.colorBlue} tool={"Blue"} /></li>
						<li><Button setTool={this.colorRed} tool={"Red"} /></li>
						<li><Button setTool={this.colorWhite} tool={"White"} /></li>	
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