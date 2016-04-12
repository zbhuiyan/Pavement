paper.install(window);
var myCanvas = document.getElementById('myCanvas');
var colorPicked = 'black'; // default color used

var pavement = new PavementWrapper(myCanvas);

var Canvas = React.createClass({

	getInitialState: function() {
		return {tool: this.usePencil()};
	},

	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		paper.setup('myCanvas');
		this.setupReceiver();
	},


	onMouseDown: function (event) {
		var data = {};
		data.toPoint = event.point;
		this.emitEvent('setPath', data);

	},

	// ***** EMITTING EVENTS *****

	usePencil: function () {
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			// packing the data
			var data = {};
			data.toPoint = event.point;
			data.strokeColor = colorPicked;
			// emiting the data
			this.emitEvent('drawPencil', data);
		}.bind(this);
		
	},

	useCloud: function () {
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {

			var data = {};
			data.toPoint = event.point;
			data.strokeColor = colorPicked;

			// emitting the data
			this.emitEvent('drawCloud', data)

		}.bind(this);
	},


	usePrettyCircle: function() {
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
	calculateDistance: function(){
		var x1 = firstPoint.x;
		var y1 = firstPoint.y;
		var x2 = endPoint.x;
		var y2 = endPoint.y;

		var distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1), 2)));
		return distance;

	},

	useCircle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			var data = {};
			data.x = event.middlePoint.x;
			data.y = event.middlePoint.y;
			data.radius = (data.x-data.y)/2;
			console.log(data.radius);
			data.color = colorPicked;
			this.emitEvent('drawCircle', data);
		}.bind(this);

	},


	usePrettyRectangle: function() {
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

	clearCanvas: function(){
		this.tool.activate();
		paper.project.clear();
		this.emitEvent('clear', {});
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

	importSVG: function(){
		var _this = this;
		var myCanvas = document.getElementById('myCanvas');

		$("#upload").on('change',function(){
			_this.tool.activate();
			paper.project.clear();
	        var fs = $("#upload")[0].files;	
			console.log(fs[0].name);
			paper.project.clear();
			var reader = new FileReader(); 
	        reader.onloadend = function (e) {  //called after a read completes
	          myCanvas.innerHTML = e.target.result;
	          var svg = myCanvas.querySelector('svg');
	          console.log('svg', svg);
	          project.importSVG(svg);
	          myCanvas.innerHTML = "";
	          _this.emitEvent('importSVG', svg);
	        };  
	        reader.readAsText(fs[0]); 


    	});
		$('#upload').trigger('click');
		
	},


	// ***** RECEIVING FUNCTIONALITY *****

	/*
	pickColor takes a hex color in via a js popup prompt and saves it to colorPicked

	When a tool is selected, it pack the color into the data which is then used in the 
	`draw` functions 	
	*/
	pickColor: function(){
		this.tool.activate();
		var input = prompt("Please enter a hex color", "#12A8B3");
		if (input != null) {
			colorPicked = input;
		}
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
		this.props.socket.on('drawCloud', pavement.drawCloud);
		this.props.socket.on('drawCircle', pavement.drawCircle);
		this.props.socket.on('drawPrettyCircle', pavement.drawPrettyCircle);
		this.props.socket.on('drawPrettyRectangle', pavement.drawPrettyRectangle);
		this.props.socket.on('drawPrettyEllipse', pavement.drawPrettyEllipse);
		this.props.socket.on('erase', pavement.erase);
		this.props.socket.on('clear', pavement.clearProject);
		this.props.socket.on('importSVG', this.importSVG);
	},

	render: function () {
		return (
			<div id="pavementDiv">
				<nav id="toolBar">
					<Button setTool={this.usePencil} tool={"Pencil"}/>
					<Button setTool={this.useCloud} tool={"Cloud"}/>
					<Button setTool={this.useCircle} tool={"Circle"}/>
					<Button setTool={this.usePrettyCircle} tool={"Pretty Circles"}/>
					<Button setTool={this.usePrettyRectangle} tool={"Pretty Rectangles"}/>
					<Button setTool={this.usePrettyEllipse} tool={"Pretty Ellipses"}/>
					<Button setTool={this.pickColor} tool={"Pick Color"}/>
					<Button setTool={this.useEraser} tool={"Erase"}/>
					<Button setTool={this.download} tool={'Download'}/>
					<Button setTool={this.clearCanvas} tool={'Clear Canvas'}/>
					<Button input id ="svgFile" type ="file" name = "svgFile" setTool={this.importSVG} tool={'Import SVG'}/>
					<input id="upload" type="file" name="upload" style={{visibility: 'hidden'}} setTool={this.importSVG}/>
				</nav>
				<div id="canvasDiv">
					<canvas id="myCanvas" data-paper-resize></canvas>
				</div>
			</div>
		);
	}

});

window.Canvas = Canvas;