var Button = React.createClass({
	render: function () {

		var style = this.props.active ? {'background-color': '#aeaeea'} : {null};
		return (
			<a className='toolBarButton' style={style} onClick={this.props.setTool}>{this.props.tool}</a>
		);
	}
});

window.Button = Button;