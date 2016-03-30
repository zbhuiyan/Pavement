var Pavement = React.createClass({

	usePencil: function () {
		this.setState{tool: "Pencil"};
		var tool1 = new Tool();
		tool1.onMouseDown = onMouseDown;

		tool1.onMouseDrag = function(event) {
			path.add(event.point);
		}
	},

	useCloud: function () {
		this.setState{tool: "Cloud"};
		var tool2 = new Tool();
		tool2.minDistance = 20;
		tool2.onMouseDown = onMouseDown;

		tool2.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			path.arcTo(event.point);
		}
	},

	render: function () {
		return (
			<div>
				<Canvas />
				<Button setTool={this.usePencil} this.tool={/>
				<Button />
			</div>
		);
	}
});

window.Pavement = Pavement;