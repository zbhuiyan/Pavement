var Canvas = React.createClass({
	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		var myCanvas = document.getElementById('myCanvas');
		paper.install(window);
		paper.setup(myCanvas);
		var tool1, tool2;
		paper.setup('myCanvas');
		
		var path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

	// 	tool1 = new Tool();
	// 	tool1.onMouseDown = onMouseDown;

	// 	tool1.onMouseDrag = function(event) {
	// 		path.add(event.point);
	// 	}

	// 	tool2 = new Tool();
	// 	tool2.minDistance = 20;
	// 	tool2.onMouseDown = onMouseDown;

	// 	tool2.onMouseDrag = function(event) {
	// 		// Use the arcTo command to draw cloudy lines
	// 		path.arcTo(event.point);
	// 	}
		tool2.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			path.arcTo(event.point);
			// var radius = event.delta.length/2;
			// var circle = new Path.Circle(event.middlePoint, radius);
			// circle.fillColor = 'black';
		}

	// 	// render
	// 	// paper.view.draw();
	// },
	// setTool: function (tool) {
	// 	tool.activate();
	// }

	render: function () {
		return (
			<div>
				<canvas id="myCanvas" data-paper-resize></canvas>
			</div>
		);
	}

});

window.Canvas = Canvas;