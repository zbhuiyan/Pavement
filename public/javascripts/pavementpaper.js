if(typeof require !== 'undefined') {
	var paper = require('paper');
}

var PavementWrapper = function(canvas) {
	paper.setup(canvas);

	var paths = {};
	var moveObjects = {}

	/**
	* Takes an edit object and applies the appropriate function to the current workspace
	* @param {Object} edit
	* @return {null}
	*/
	this.applyEdit = function(edit) {
		if(edit.method === 'setPath') {
			this.setPath(edit);
		}
		else if(edit.method === 'drawPencil') {
			this.drawPencil(edit);
		}
		else if(edit.method === 'drawCloud') {
			this.drawCloud(edit);
		}
		else if(edit.method === 'drawSingleCircle') {
			this.drawSingleCircle(edit);
		}
		else if(edit.method === 'drawSingleRectangle') {
			this.drawSingleRectangle(edit);
		}
		else if(edit.method === 'drawSingleEllipse') {
			this.drawSingleEllipse(edit);
		}
		else if(edit.method === 'drawCircle') {
			this.drawCircle(edit);
		}
		else if(edit.method === 'drawPrettyCircle') {
			this.drawPrettyCircle(edit);
		}
		else if(edit.method === 'drawPrettyRectangle') {
			this.drawPrettyRectangle(edit);
		}
		else if(edit.method === 'erase') {
			this.erase(edit);
		}
		else if(edit.method === 'clear') {
			this.clearProject(edit);
		}
		else if(edit.method === 'drawText') {
			this.drawText(edit);
		}
		else if(edit.method === 'importSVG') {
			this.importSVG(edit);
		} 
		else if(edit.method === 'select') {
			this.select(edit);
		} 
		else if(edit.method === 'move') {
			this.move(edit);
		}
		else if(edit.method === 'deleteItem') {
			this.deleteItem(edit);
		}
	}.bind(this);

	/**
	* Takes in svg and applies it to the current project
	* @param {String} svg
	* @return {null}
	*/

	this.startProjectFromSVG = function(svg) {
		paper.project.importSVG(svg);
		paper.view.draw();
	}

	/**
	* Sets new path object given a data package
	* @param {Object} data
	* @return {null}
	*/

	this.setPath = function(data) {
		paths[data.id] = new paper.Path();
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
	};

	/**
	* Draws a pencil to a predefined path object
	* @param {Object} data
	* @return {null}
	*/

	this.drawPencil = function(data) {
		if(paths[data.id] === undefined) {
			paths[data.id] = new paper.Path();
		}

		paths[data.id].strokeColor = data.strokeColor;
		paths[data.id].strokeWidth = data.strokeWidth;
		paths[data.id].add({x:data.toPoint[1], y:data.toPoint[2]});
		paper.view.draw();
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
		paper.view.draw();
	}

	/**
	* Draws a circle at the cursor location on click
	* @param {Object} data
	* @return {null}
	*/

	this.drawSingleCircle = function (data) {

		var x = data.x1;
		var y = data.y1;
		var radius = parseInt(data.radius);
		var color = data.color;

		var circle = new paper.Path.Circle(new paper.Point(x,y), radius);
	    circle.strokeColor = new paper.Color(color);
	    circle.removeOnDrag();
	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    paper.view.draw();
	}

	/**
	* Draws a rectangle at the cursor location on click
	* @param {Object} data
	* @return {null}
	*/

	this.drawSingleRectangle = function (data) {

		var x = data.x;
		var y = data.y;
		var color = data.color;
		var size = parseInt(data.size);

		if(typeof Path !== 'undefined') {
			var rectangle = new Rectangle(new Point(x, y), new Point(x + size,y + size*2));
			var path = new Path.Rectangle(rectangle);
		    path.strokeColor = new Color(color);
		    path.removeOnDrag();
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
		} else {
			var rectangle = new paper.Rectangle(new paper.Point(x, y), new paper.Point(x + size,y + size*2));
			var path = new paper.Path.Rectangle(rectangle);
		    path.strokeColor = new paper.Color(color);
		    path.removeOnDrag();
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    paper.view.draw();
		}
	}

	/**
	* Draws an ellipse at the cursor location on click
	* @param {Object} data
	* @return {null}
	*/

	this.drawSingleEllipse = function (data) {
		var x = data.x;
		var y = data.y;
		var color = data.color;
		var size = parseInt(data.size);

		// create the object
		if(typeof Path !== 'undefined') {
			var ellipse = new Shape.Ellipse({
				point: [x,y],
				size: [size*2,size],
				fillColor: color
			});
			ellipse.removeOnDrag();
			view.draw();
		} else {
			var ellipse = new paper.Shape.Ellipse({
				point: [x,y],
				size: [size*2,size],
				fillColor: color
			});
			ellipse.removeOnDrag();
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
		var circle = new paper.Path.Circle(new paper.Point(x,y), radius);
	    circle.strokeColor = new paper.Color(color);

	    // Refresh the view, so we always get an update, even if the tab is not in focus
	    paper.view.draw();
		
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
		var circle = new paper.Path.Circle(new paper.Point(x, y), radius);
	    circle.fillColor = new paper.Color(color.red, color.green, color.blue, color.alpha);

	    paper.view.draw();
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
		var rectangle = new paper.Rectangle(new paper.Point(x, y), new paper.Point(x+60,y+80));
		var path = new paper.Path.Rectangle(rectangle);
	    path.fillColor = new paper.Color(color.green, color.red, color.blue, color.alpha);

	    paper.view.draw();
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
		var ellipse = new paper.Shape.Ellipse({
			point: [x,y],
			size: [180,60],
			fillColor: new paper.Color(color.green, color.red, color.blue, color.alpha)
		});

		paper.view.draw();
	}

	/**
	* Edits segments of an item
	* @param {Object} data
	* @return {null}
	*/
	// this.editItem = function(data){
	// 	paper.view.draw();
	// }


	/**
	* Deleted item
	* @param {Object} data
	* @return {null}
	*/
	this.deleteItem = function(data){
		if(moveObjects[data.id] !== undefined) {
			moveObjects[data.id].remove();
		}
		paper.view.draw();
	}

	/**
	* Selects an item
	* @param {Object} data
	* @return {null}
	*/
	this.select = function(data){
		var matches = this.matches({x:data.oldPoint[1], y:data.oldPoint[2]});

		// deselect previous move object and select new one
		if(moveObjects[data.id] !== undefined) {
			moveObjects[data.id].selected = false;
			moveObjects[data.id] = undefined;
		}

		moveObjects[data.id] = this.findPathMatches(matches);
		moveObjects[data.id].selected = true;

		paper.view.draw();


	}.bind(this)

	/**
	* Moves an object to another point
	* @param {Object} data
	* @return {null}
	*/
	this.move = function(data) {
		if(moveObjects[data.id] !== undefined) {
			moveObjects[data.id].position = new paper.Point(data.x, data.y);
		}

		paper.view.draw();
	}

	this.deselect = function(data) {
		if(moveObjects[data.id] !== undefined) {
			moveObjects[data.id].selected = false;
			moveObjects[data.id] = undefined;
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

		paper.view.draw();
	}

	/**
	* Clears the project
	* @param {null}
	* @return {null}
	*/

	this.clearProject = function() {
		paper.project.clear();
		paper.view.draw();
	}

	/**
	* Returns the svg
	* @param {null}
	* @return {String} svg
	*/

	this.exportSVG = function() {
		return paper.project.exportSVG({asString:true});
	}

	/* 
	* Adds text starting at the point clicked
	* @param {Object} data
	* @return {null}
	*/

	this.drawText = function(data) {
		var input = data.text;
		var text = new paper.PointText(new paper.Point(data.startX, data.startY));

		text.fillColor = data.strokeColor;
		
		if (input != null) {
			text.content = input;
		}
			
		paper.view.draw();
	}
	
	/*
	* Adds an svg to the project
	* @param {Object} data
	* @return {null}
	*/

	this.importSVG = function(data) {
		paper.project.clear();

		paper.project.importSVG(data.svg);
		paper.view.draw();
	}

	/**
	* Finds all of the objects near a certain point where the mouse clicked
	* @param {paper.Point} point
	* @return {Array} list of objects
	*/
	this.matches = function(point) {
		var matchRectangle = new paper.Path.Rectangle(new paper.Point(point.x, point.y), new paper.Point(point.x+5, point.y+5));
		return paper.project.getItems({overlapping: matchRectangle.bounds});
	}

	/**
	* Finds the first Path element from a list of matches or returns the first match
	* @param {Array} matches
	* @return {paper.Path} matches[index]
	*/
	this.findPathMatches = function(matches) {
		for(var index = 0; index < matches.length; index++) {
			if(matches[index].children === undefined) {
				return matches[index];
			}
		}

		if(matches.length > 1) {
			return matches[1]
		}

		return matches[0];
	}
}

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = PavementWrapper;
} else {
	window.PavementWrapper = PavementWrapper;
}