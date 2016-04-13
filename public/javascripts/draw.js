var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var colorPicked = 'black'; // default color used
var paths = {};


var Canvas = React.createClass({

	getInitialState: function() {
		return {tool: this.usePencil(), activeIndex: 0};
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
		this.setState({activeIndex: 0});
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
		this.setState({activeIndex: 1});
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
	calculateDistance: function(){
		var x1 = firstPoint.x;
		var y1 = firstPoint.y;
		var x2 = endPoint.x;
		var y2 = endPoint.y;

		var distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1), 2)));
		return distance;

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
			console.log(data.radius);
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

	drawPrettyCircle: function(data) {
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
	drawCircle: function(data) {
		// This function adds a circle, it does not need a user's path

		// unpack the data
		var x = data.x;
		var y = data.y;
		var radius = data.radius;
		var color = data.color;

		// create the object
		// var size = new Size(radius);
		var circle = new Path.Circle(new Point(x,y), radius);
	    circle.strokeColor = new Color(color);
	    
	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    view.draw();
	},


	drawPrettyRectangle: function(data) {
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


	drawPrettyEllipse: function(data) {
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

		// set up path object
		paths[data.id].strokeWidth = 30;
		paths[data.id].strokeColor = 'black';
		paths[data.id].blendMode = 'destination-out';

		// add the point
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
		this.props.socket.on('drawPrettyCircle', this.drawPrettyCircle);
		this.props.socket.on('drawPrettyRectangle', this.drawPrettyRectangle);
		this.props.socket.on('drawPrettyEllipse', this.drawPrettyEllipse);
		this.props.socket.on('erase', this.erase);
		this.props.socket.on('clear', this.receiveClear);
		this.props.socket.on('importSVG', this.importSVG);
		this.props.socket.on('drawCircle', this.drawCircle);
	},

	render: function () {
		return (
			<div id="pavementDiv">
				<div id="toolBarDiv">
					<nav id="toolBar">
						<Button setTool={this.usePencil} active={this.state.activeIndex===0} tool={"Pencil"}/>
						<Button setTool={this.useCloud} active={this.state.activeIndex===1} tool={"Cloud"}/>
						<Button setTool={this.useCircle} active={this.state.activeIndex===2} tool={"Circle"}/>
						<Button setTool={this.usePrettyCircle} active={this.state.activeIndex===3} tool={"Pretty Circles"}/>
						<Button setTool={this.usePrettyRectangle} active={this.state.activeIndex===4} tool={"Pretty Rectangles"}/>
						<Button setTool={this.usePrettyEllipse} active={this.state.activeIndex===5} tool={"Pretty Ellipses"}/>
						<Button setTool={this.pickColor} tool={"Pick Color"}/>
						<Button setTool={this.useEraser} active={this.state.activeIndex===6} tool={"Erase"}/>
						<Button setTool={this.download} tool={'Download'}/>
						<Button setTool={this.clearCanvas} tool={'Clear Canvas'}/>
						<Button input id ="svgFile" type ="file" name = "svgFile" setTool={this.importSVG} tool={'Import SVG'}/>
						<input id="upload" type="file" name="upload" style={{visibility: 'hidden'}} setTool={this.importSVG}/>
					</nav>
				</div>
				<div id="canvasDiv">
					<canvas id="myCanvas" data-paper-resize></canvas>
				</div>
			</div>
		);
	}

});

window.Canvas = Canvas;