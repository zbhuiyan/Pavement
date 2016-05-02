// ***** Toolbar Button Class *****
var Button = React.createClass({
	render: function () {

		var style = this.props.active ? {'background-color': '#aeaeea'} : {null};
		var className = 'toolBarButton';
		var name = '';
		if (this.props.icon) {
			className += ' ' + this.props.icon;
		} else {
			name = this.props.tool;
		}
		return (
			<a className={className} style={style} onClick={this.props.setTool} title={this.props.tool}>{name}</a>
		);
	}
});

window.Button = Button;