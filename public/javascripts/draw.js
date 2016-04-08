var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var colorPicked = 'black'; // default color used
var paths = {};


var Canvas = React.createClass({

	getInitialState: function() {
		return {tool: this.usePencil()};
	},

	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		paper.setup('myCanvas');
		
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = colorPicked;
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


	useCircle: function() {
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
	        };  
	        reader.readAsText(fs[0]); 
    	});
		$('#upload').trigger('click');
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
		paths[data.id].strokeColor = data.strokeColor;
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
		view.draw(); // this refreshes the view
	},

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

	drawCloud: function(data) {
		// This function adds a cloud to the path
		paths[data.id].strokeColor = data.strokeColor;
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
		view.draw(); // Refreshes the view
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
				<Button setTool={this.pickColor} tool={"Pick Color"}/>
				<Button setTool={this.download} tool={'Download'}/>
				<Button setTool={this.clearCanvas} tool={'Clear Canvas'}/>
				<Button input id ="svgFile" type ="file" name = "svgFile" setTool={this.importSVG} tool={'Import SVG'}/>
				<input id="upload" type="file" name="upload" style={{visibility: 'hidden'}} setTool={this.importSVG}/>
			
			</div>
		);
	}

});

window.Canvas = Canvas;