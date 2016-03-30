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


	useCircle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		

		this.tool.onMouseDrag = function(event){
			var x = event.middlePoint.x;
			var y = event.middlePoint.y;
			var radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			var color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			var circle = new Path.Circle(new Point(x, y), radius);
		    circle.fillColor = new Color(color.red, color.green, color.blue, color.alpha);
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
		}
	},

	useRectangle: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			var x = event.point.x;
			var y = event.point.y;
			// var radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			var color = {
						red: 0,
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			var rectangle = new Rectangle(new Point(x, y), new Point(x+60,y+80));
			var path = new Path.Rectangle(rectangle);
		    path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
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
				<Button setTool={this.useCircle} tool={"Circle"}/>
				<Button setTool={this.useRectangle} tool={"Rectangle"}/>
				
			</div>
		);
	}

});

window.Canvas = Canvas;