if(typeof require !== 'undefined') {
	var paper = require('paper');
}

var PavementWrapper = function(canvas) {
	paper.setup(canvas);

	var paths = {};

	/**
	* Sets new path object given a data package
	* @param {Object} data
	* @return {null}
	*/

	this.setPath = function(data) {
		if(typeof Path !== 'undefined') {
			paths[data.id] = new Path();
		} else {
			paths[data.id] = new paper.Path();
		}
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
	};

	/**
	* Draws a pencil to a predefined path object
	* @param {Object} data
	* @return {null}
	*/

	this.drawPencil = function(data) {
		paths[data.id].strokeColor = data.strokeColor;
		paths[data.id].strokeWidth = data.strokeWidth;
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
	};

	/**
	* Draws an arc between two points on the current path
	* @param {Object} data
	* @return {null}
	*/

	this.drawCloud = function(data) {
		paths[data.id].strokeColor = data.strokeColor;
		paths[data.id].strokeWidth = data.strokeWidth;
		paths[data.id].arcTo({x:data.toPoint[1], y:data.toPoint[2]});
	}

	this.drawSingleCircle = function (data) {

		var x = data.x1;
		var y = data.y1;
		var radius = parseInt(data.radius);
		var color = data.color;

		if(typeof Path !== 'undefined') {
			var circle = new Path.Circle(new Point(x,y), radius);
		    circle.strokeColor = new Color(color);
		    circle.removeOnDrag();
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
		} else {
			var circle = new paper.Path.Circle(new paper.Point(x,y), radius);
		    circle.strokeColor = new paper.Color(color);
		    circle.removeOnDrag();
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    paper.view.draw();
		}
	}


	/**
	* Draws circle based on cursor location 
	* @param {Object} data
	* @return {null}
	*/

	this.drawCircle = function(data) {
		// unpack the data
		var x = data.x;
		var y = data.y;
		var radius = data.radius;
		var color = data.color;

		// create the object
		// var size = new Size(radius);
		if(typeof Path !== 'undefined') {
			var circle = new Path.Circle(new Point(x,y), radius);
		    circle.strokeColor = new Color(color);

		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
		} else {
			var circle = new paper.Path.Circle(new paper.Point(x,y), radius);
		    circle.strokeColor = new paper.Color(color);

		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    paper.view.draw();
		}
	}

	/**
	* Draws circles that are filled with color
	* @param {Object} data
	* @return {null}
	*/

	this.drawPrettyCircle = function(data) {
		// unpack the data
		var x = data.x;
		var y = data.y;
		var radius = data.radius;
		var color = data.color;

		// create the object
		if(typeof Path !== 'undefined') {
			var circle = new Path.Circle(new Point(x, y), radius);
		    circle.fillColor = new Color(color.red, color.green, color.blue, color.alpha);

		    view.draw();
		} else {
			var circle = new paper.Path.Circle(new paper.Point(x, y), radius);
		    circle.fillColor = new paper.Color(color.red, color.green, color.blue, color.alpha);

		    paper.view.draw();
		}
	}

	/**
	* Draws rectangles that are filled with color
	* @param {Object} data
	* @return {null}
	*/

	this.drawPrettyRectangle = function(data) {
		// unpack the data
		var x = data.x;
		var y = data.y;
		var color = data.color;

		// create the object
		if(typeof Path !== 'undefined') {
			var rectangle = new Rectangle(new Point(x, y), new Point(x+60,y+80));
			var path = new Path.Rectangle(rectangle);
		    path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);

		    view.draw();
		} else {
			var rectangle = new paper.Rectangle(new paper.Point(x, y), new paper.Point(x+60,y+80));
			var path = new paper.Path.Rectangle(rectangle);
		    path.fillColor = new paper.Color(color.green, color.red, color.blue, color.alpha);

		    paper.view.draw();
		}
	}

	/**
	* Draws ellipses that are filled with color
	* @param {Object} data
	* @return {null}
	*/

	this.drawPrettyEllipses = function(data) {
		// unpack the data
		var x = data.x;
		var y = data.y;
		var color = data.color;

		// create the object
		if(typeof Path !== 'undefined') {
			var ellipse = new Shape.Ellipse({
				point: [x,y],
				size: [180,60],
				fillColor: new Color(color.green, color.red, color.blue, color.alpha)
			});

			view.draw();
		} else {
			var ellipse = new paper.Shape.Ellipse({
				point: [x,y],
				size: [180,60],
				fillColor: new paper.Color(color.green, color.red, color.blue, color.alpha)
			});

			paper.view.draw();
		}
	}

	/**
	* Erases a point in the path
	* @param {Object} data
	* @return {null}
	*/

	this.erase = function(data) {
		// set up path object
		paths[data.id].strokeWidth = 30;
		paths[data.id].strokeColor = 'black';
		paths[data.id].blendMode = 'destination-out';

		// add the point
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});

		if(typeof Path !== 'undefined') {
			view.draw();
		} else {
			paper.view.draw();
		}
	}

	/**
	* Clears the project
	* @param {null}
	* @return {null}
	*/

	this.clearProject = function() {
		paper.project.clear();
	}

	/**
	* Returns the svg
	* @param {null}
	* @return {String} svg
	*/

	this.exportSVG = function() {
		return paper.project.exportSVG({asString:true});
	}

	/* drawText will add text starting at the point clicked */
	this.drawText = function(data) {
		var input = data.text;
		
		if(typeof Path !== 'undefined') {
			var text = new PointText(new Point (data.startX, data.startY));
		} else {
			var text = new paper.PointText(new paper.Point(data.startX, data.startY));
		}

		text.fillColor = data.strokeColor;
		
		if (input != null) {
			text.content = input;
		}

		if(typeof Path !== 'undefined') {
			view.draw();
		} else {
			paper.view.draw();
		}
		

	}
}

// This will throw an error but work anyway
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = PavementWrapper;
} else {
	window.PavementWrapper = PavementWrapper;
}