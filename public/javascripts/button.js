var Button = React.createClass({
	render: function () {
		return (
			<button onClick={this.props.setTool}>{this.props.tool}</button>
		);
	}
});

window.Button = Button;