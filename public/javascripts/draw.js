var myCanvas = document.getElementById('myCanvas');
paper.install(window);
paper.setup(myCanvas);
var path;
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
		// console.log("pencil");
		this.tool = new Tool();
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			path.add(event.point);
		}
		
	},

	useCloud: function () {
		// this.setState({tool: "Cloud"});
		// this.tool = new Tool();
		this.tool.activate();
		this.tool.minDistance = 20;
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			path.strokeWidth = 5;
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

	useEllipse: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;
		
		this.tool.onMouseDrag = function(event){
			var x = event.point.x;
			var y = event.point.y;
			// var radius = event.delta.length/2; //the further your mouse movement the bigger the circle
			var color = {
						red: Math.random(),
						green: Math.random(),
						blue: Math.random(),
						alpha: ( Math.random() * 0.25 ) + 0.05
						};

			var ellipse = new Shape.Ellipse({
				point: [x,y],
				size: [180,60],
				fillColor: new Color(color.green, color.red, color.blue, color.alpha)
			});
			// var path = new Path.Rectangle(rectangle);
		    // path.fillColor = new Color(color.green, color.red, color.blue, color.alpha);
		    // Refresh the view, so we always get an update, even if the tab is not in focus
		    view.draw();
		}
		
	},
	// setTool: function (tool) {
	// 	tool.activate();
	// },
	useEraser: function() {
		this.tool.activate();
		this.tool.onMouseDown = this.onMouseDown;

		this.tool.onMouseDrag = function(event){
			console.log('eraser is being called')
			path.strokeColor = 'white';
			path.strokeWidth = 30;
			path.add(event.point);
		}
	},

	download: function(fileName) {

		this.tool.activate();
	// 	// this.tool.onMouseDown = this.onMouseDown;

	// 	// if (!fileName){
	// 	// 	fileName = 'paperjs_test.svg'
	// 	// }


		// var link = document.createElement('a');
		// console.log('link', link);
		// fileName = "paperjs_example.svg";
		var svg = paper.project.exportSVG({asString:true});
		// console.log('svg',svg);
		// var url = 'data:image/svg+xmll;utf8,' + encodeURIComponent(paper.project.exportSVG({asString:true}));
		// console.log('url', url);
	// 	this.tool.onKeyUp = function(event){
	// 		if(event.character == "S") { //shift + S
		// link.download = fileName;
		// link.type = 'image/svg+xml';
		// var blob = new Blob([svg], {"type":'image/svg+xml'});
	// 	console.log(blob);
		// link.href = (window.URL || webkitURL).createObjectURL(blob);
	// 	console.log(link.href);
	// 	console.log('trynna save');
		// link.href = url;
		// link.click();

		// saveSvgAsPng(myCanvas, "test.png")


		// var impoRt = importSVG(localhost:3000/d5443215-61c3-455f-9673-90b88557373e, console.log('ya?'));
		
	
		// ctx.fillText('click link below', 15, myCanvas.height/2+35);
		// this.tool.onMouseDown = function(link, canvasId, filename){
		// 	link.href = document.getElementById(canvasId).toDataURL();
			// link.download = filename;
		// }
		// var myCanvas = document.getElementById('myCanvas');
// 
		// var ctx = myCanvas.getContext('2d');

		// console.log('im in download');
		// // var serializer = new XMLSerializer();
	
		// // console.log(svg);
		// myCanvas.toBlob(function(blob){
		// 	saveAs(new Blob([svg],{type:"application/svg+xml"}), "test.svg");
		// })
		// var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
		// var folders = {images: './images'};
		// filesaver = new FileSaver({ folders: folders, safenames: true });
		// filesaver.add('images', ./path/to/file.jpg, 'photo.jpg', function(err, data){
		// 	console.log(data);
		// });
		// var canavas = document.getElementById('c');
		// var cxt = canavas.getContext('2d');
		// var downloadLink = document.getElementById('download-canavas');
		// cxt.fillRect(100, 100,200,200);
		// cxt.clearRect(150,150,100,100);
		// downloadLink.href = canavas.toDataURL();
		// downloadLink.download = "squares.png";
		var a = document.createElement('a');
		a.download = 'mySvg.svg';
		a.type = 'image/svg+xml';
		var blob = new Blob([svg], {"type": "image/svg+xml"});
		a.href = (window.URL || webkitURL).createObjectURL(blob);
		a.click();

	},

				// <a id="download-canvas" href = "#"> Download </a>



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
			</div>
		);
	}

});

window.Canvas = Canvas;