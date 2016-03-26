var Canvas = React.createClass({
	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		var myCanvas = document.getElementById('myCanvas');
		paper.install(window);
		paper.setup(myCanvas);
		var tool1, tool2;

		// Draw a circle in the center
		// var width = paper.view.size.width;
		// var height = paper.view.size.height;
		// var circle = new paper.Shape.Circle({
		// 	center: [width / 2, height/2],
		// 	fillColor: 'grey',
		// 	radius: 10
		// });
		paper.setup('myCanvas');
		var path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

		tool1 = new Tool();
		tool1.onMouseDown = onMouseDown;

		tool1.onMouseDrag = function(event) {
			path.add(event.point);
		}

		tool2 = new Tool();
		tool2.minDistance = 20;
		tool2.onMouseDown = onMouseDown;

		tool2.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			path.arcTo(event.point);
		}

		// render
		// paper.view.draw();
	},

	render: function () {
		return (
			<div>
				<a href="#" onclick="tool1.activate();">Lines</a>
    			<a href="#" onclick="tool2.activate();">Clouds</a>
				<canvas id="myCanvas" data-paper-resize></canvas>
			</div>
		);
	}

});

window.Canvas = Canvas;