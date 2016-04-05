var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var paths = {};
// var DomParser = bundle.require('DomParser');
// var svgString = myCanvas.innerHTML;
var Canvas = React.createClass({
	getInitialState: function() {
		return {tool: this.usePencil()};
	},
	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		// var myCanvas = document.getElementById('myCanvas');
		// paper.install(window);
		// paper.setup(myCanvas);
		// var tool1, tool2;

		paper.setup('myCanvas');
		
		// this.path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}
		this.tool = new Tool();
		this.tool.onMouseDown = onMouseDown;

		this.tool.onMouseDrag = function(event) {
			path.add(event.point);
		}


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

			// emiting the data
			this.emitEvent('drawPencil', data);
		}.bind(this);
		
	},

	useCloud: function () {
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			// packing the data
			var data = {};
			data.toPoint = event.point;

			// emitting the data
			this.emitEvent('drawCloud', data)

		}.bind(this);
	},


	useCircle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		

		this.tool.onMouseDrag = function(event){
			// packing the data
			var data = {}

			data.x = event.middlePoint.x;
			data.y = event.middlePoint.y;
			data.radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			data.color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			// emitting the data
			this.emitEvent('drawCircle', data);

		}.bind(this);
	},

	useRectangle: function() {
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
			this.emitEvent('drawRectangle', data);

		}.bind(this);
		
	},

	useEllipse: function() {
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
			this.emitEvent('drawEllipse', data);
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
		this.tool.activate();
		var svgReader = new FileReader();
		parser = new DOMParser();
		var contentAsObject = parser.parseFromString(svgContent, 'image/svg+xml');
		paper.project.clear();
		paper.project.importSVG(contentAsObject);

		//not yet working, it gives a reference error for DomParser... 

	},


	// ***** RECEIVING FUNCTIONALITY *****

	setPath: function(data) {
		// This function adds to the path drawn by a user
		// This allows for a smoother continuous line

		paths[data.id] = new Path();

		// Add the initial point
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
	},

	drawPencil: function(data) {
		// This function adds a pencil point
		paths[data.id].strokeColor = 'black';
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});

		// this refreshes the view
		view.draw();
	},

	drawCloud: function(data) {
		// This function adds a cloud to the path
		paths[data.id].strokeColor = 'black';
		paths[data.id].strokeWidth = 5;
		paths[data.id].arcTo({x:data.toPoint[1], y:data.toPoint[2]});

		// this refreshes the view
		view.draw();
	},

	drawCircle: function(data) {
		// This function adds a circle, it does not need a user's path

		// unpack the data
		var x = data.x;
		var y = data.y;
		var radius = data.radius;
		var color = data.color;

		// create the object
		var circle = new Path.Circle(new Point(x, y), radius);
	    circle.fillColor = new Color(color.red, color.green, color.blue, color.alpha);
	    
	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    view.draw();
	},

	drawRectangle: function(data) {
		// This function adds a rectangle, it does not need a user's path

		// unpack the data
		var x = data.x;
		var y = data.y;
		var color = data.color;

		// create the object
		var rectangle = new Rectangle(new Point(x, y), new Point(x+60,y+80));
		var path = new Path.Rectangle(rectangle);
	    path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);

	    // refresh the view
	    view.draw();
	},

	drawEllipse: function(data) {
		// This functions adds an ellipse, it does not need a user's path

		// unpack the data
		var x = data.x;
		var y = data.y;
		var color = data.color;

		// create the object
		var ellipse = new Shape.Ellipse({
			point: [x,y],
			size: [180,60],
			fillColor: new Color(color.green, color.red, color.blue, color.alpha)
		});

	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    view.draw();
	},

	erase: function(data) {
		// This function "erases," right now it adds a white line over things
		// It requires a user's path to make a continuous line

		// Adds to the path object
		paths[data.id].strokeWidth = 30;
		paths[data.id].strokeColor = 'white';
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});

		// Refreshes the view
		view.draw();
	},

	receiveClear: function(data) {
		// This function clears the project
		paper.project.clear();
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
		this.props.socket.on('setPath', this.setPath);
		this.props.socket.on('drawPencil', this.drawPencil);
		this.props.socket.on('drawCloud', this.drawCloud);
		this.props.socket.on('drawCircle', this.drawCircle);
		this.props.socket.on('drawRectangle', this.drawRectangle);
		this.props.socket.on('drawEllipse', this.drawEllipse);
		this.props.socket.on('erase', this.erase);
		this.props.socket.on('clear', this.receiveClear);
	},

	render: function () {
		return (
			<div>
				<canvas id="myCanvas" data-paper-resize></canvas>
				<Button setTool={this.usePencil} tool={"Pencil"}/>
				<Button setTool={this.useCloud} tool={"Cloud"}/>
				<Button setTool={this.useCircle} tool={"Circle"}/>
				<Button setTool={this.useRectangle} tool={"Rectangle"}/>
				<Button setTool={this.useEllipse} tool={"Ellipse"}/>
				<Button setTool={this.useEraser} tool={"Erase"}/>
				<Button setTool={this.download} tool={'Download'}/>
				<Button setTool={this.clearCanvas} tool={'Clear Canvas'}/>
				<Button setTool={this.importSVG} tool={'Import SVG'}/>
			</div>
		);
	}

});

window.Canvas = Canvas;