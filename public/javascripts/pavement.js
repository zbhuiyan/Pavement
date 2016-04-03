var Pavement = React.createClass({
	componentDidMount: function () {
		//instatiate the paperScope with the canvas element
		var myCanvas = document.getElementById('myCanvas');
		paper.install(window);
		paper.setup(myCanvas);
		paper.setup('myCanvas');
		this.path = new Path();
	},
	getInitialState: function(){
        return {tool: "Pencil"};
    },

    onMouseDown: function (event) {
			this.path = new Path();
			this.path.strokeColor = 'black';
			this.path.add(event.point);
	},

	usePencil: function () {
		this.setState({tool: "Pencil"});
		var tool1 = new Tool();
		tool1.onMouseDown = this.onMouseDown;

		tool1.onMouseDrag = function(event) {
			this.path.add(event.point);
		}
	},

	useCloud: function () {
		this.setState({tool: "Cloud"});
		var tool2 = new Tool();
		tool2.minDistance = 20;
		tool2.onMouseDown = onMouseDown;

		tool2.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			this.path.arcTo(event.point);
		}
	},

	render: function () {
		return (
			<div>
				<Canvas />
				<Button setTool={this.usePencil} tool={"Pencil"}/>
				<Button setTool={this.useCloud} tool={"Cloud"}/>
			</div>
		);
	}
});

window.Pavement = Pavement;