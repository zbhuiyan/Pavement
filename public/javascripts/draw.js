var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var path;
// var DomParser = bundle.require('DomParser');
// var svgString = myCanvas.innerHTML;
var Canvas = React.createClass({
	getInitialState: function() {
		return {tool: this.usePencil(), lastPoint:[0, 0]};
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

		// tool2 = new Tool();
		// tool2.minDistance = 20;
		// tool2.onMouseDown = onMouseDown;

		// tool2.onMouseDrag = function(event) {
		// 	// Use the arcTo command to draw cloudy lines
		// 	this.path.arcTo(event.point);
		// }
		// tool2.onMouseDrag = function(event) {
		// 	// Use the arcTo command to draw cloudy lines
		// 	this.path.arcTo(event.point);
		// 	var radius = event.delta.length/2;
		// 	var circle = new Path.Circle(event.middlePoint, radius);
		// 	circle.fillColor = 'black';
		// }

		// render
		// paper.view.draw();
	},

	onMouseDown: function (event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
			this.setState({lastPoint:event.point});
	},

	usePencil: function () {
		// this.setState({tool: "Pencil"});
		// console.log("pencil");
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			var data = {};
			data.toPoint = event.point;
			data.lastPoint = this.state.lastPoint;

			this.setState({lastPoint:event.point});

			this.emitEvent('drawPencil', data);

			//path.add(event.point);
		}.bind(this);
		
	},

	useCloud: function () {
		// this.setState({tool: "Cloud"});
		// this.tool = new Tool();
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines;
			// path.strokeWidth = 5;
			// path.arcTo(event.point);

			// console.log(event.point);

			var data = {};
			data.toPoint = event.point;
			data.lastPoint = this.state.lastPoint;

			this.setState({lastPoint:event.point});

			this.emitEvent('drawCloud', data)

		}.bind(this);
	},


	useCircle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		

		this.tool.onMouseDrag = function(event){
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

			this.emitEvent('drawCircle', data);

		}.bind(this);
	},

	useRectangle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;
			// var radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			data.color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			this.emitEvent('drawRectangle', data);

		}.bind(this);
		
	},

	useEllipse: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			var data = {};

			data.x = event.point.x;
			data.y = event.point.y;
			// var radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			data.color = {
						red: Math.random(),
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			this.emitEvent('drawEllipse', data);

			// var ellipse = new Shape.Ellipse({
			// 	point: [x,y],
			// 	size: [180,60],
			// 	fillColor: new Color(color.green, color.red, color.blue, color.alpha)
			// });
			// // var path = new Path.Rectangle(rectangle);
		 //    // path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);
		 //    // Refresh the view, so we always get an update, even if the tab is not in focus
		 //    view.draw();
		}.bind(this);
		
	},
	// setTool: function (tool) {
	// 	tool.activate();
	// },
	useEraser: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			//console.log('eraser is being called')
			// path.strokeColor = 'white';
			// path.strokeWidth = 30;
			// path.add(event.point);

			var data = {};
			data.lastPoint = this.state.lastPoint;
			data.toPoint = event.point;

			this.emitEvent('erase', data);

			this.setState({lastPoint:event.point});
		}.bind(this);
	},

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

	clearCanvas: function(){

		this.tool.activate();
		paper.project.clear();
	},


	drawCircle: function(data) {
		var x = data.x;
		var y = data.y;
		var radius = data.radius;
		var color = data.color;

		var circle = new Path.Circle(new Point(x, y), radius);
	    circle.fillColor = new Color(color.red, color.green, color.blue, color.alpha);
	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    view.draw();
	},

	drawRectangle: function(data) {
		var x = data.x;
		var y = data.y;
		var color = data.color;

		var rectangle = new Rectangle(new Point(x, y), new Point(x+60,y+80));
		var path = new Path.Rectangle(rectangle);
	    path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);

	    view.draw();
	},

	drawEllipse: function(data) {
		var x = data.x;
		var y = data.y;
		var color = data.color;

		var ellipse = new Shape.Ellipse({
			point: [x,y],
			size: [180,60],
			fillColor: new Color(color.green, color.red, color.blue, color.alpha)
		});
		// var path = new Path.Rectangle(rectangle);
	    // path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);
	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    view.draw();
	},

	drawCloud: function(data) {
		var path = new Path();
		path.strokeColor = 'black';
		path.strokeWidth = 5;
		path.add({x:data.lastPoint[1], y:data.lastPoint[2]});
		path.arcTo({x:data.toPoint[1], y:data.toPoint[2]});

		// console.log(path);

		view.draw();
	},

	drawPencil: function(data) {
		var path = new Path();
		path.strokeColor = 'black';
		path.add({x:data.lastPoint[1], y:data.lastPoint[2]});
		path.add({x:data.toPoint[1], y:data.toPoint[2]});

		// console.log(path);

		view.draw();
	},

	erase: function(data) {
		var path = new Path();
		path.strokeColor = 'white';
		path.strokeWidth = 30;
		path.add({x:data.lastPoint[1], y:data.lastPoint[2]});
		path.add({x:data.toPoint[1], y:data.toPoint[2]});

		view.draw();
	},

	emitEvent: function(eventName, data) {
		data.method = eventName;
		this.props.socket.emit('draw', data);
	},

	setupReceiver: function(data) {
		this.props.socket.on('drawCircle', this.drawCircle);
		this.props.socket.on('drawRectangle', this.drawRectangle);
		this.props.socket.on('drawEllipse', this.drawEllipse);
		this.props.socket.on('drawCloud', this.drawCloud);
		this.props.socket.on('drawPencil', this.drawPencil);
		this.props.socket.on('erase', this.erase);
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