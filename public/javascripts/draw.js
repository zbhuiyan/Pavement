var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var path;
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
	},

	usePencil: function () {
		// this.setState({tool: "Pencil"});
		console.log("pencil");
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			console.log('tool 1 onMouseDrag');
			path.add(event.point);
		}
		
	},

	useCloud: function () {
		// this.setState({tool: "Cloud"});
		console.log('tool 2 called');
		// this.tool = new Tool();
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			console.log('on onMouseDrag');
			path.arcTo(event.point);
		}
	},
	// setTool: function (tool) {
	// 	tool.activate();
	// },

	render: function () {
		return (
			<div>
				<canvas id="myCanvas" data-paper-resize></canvas>
				<Button setTool={this.usePencil} tool={"Pencil"}/>
				<Button setTool={this.useCloud} tool={"Cloud"}/>
			</div>
		);
	}

});

window.Canvas = Canvas;