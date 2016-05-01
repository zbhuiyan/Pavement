// Module to display name of website

var Logo = React.createClass({
	render: function () {
		var logout = (<p></p>);
		var home = (<span></span>);

		if (this.props.isLoggedIn) {
			logout = <a className='mainNav' href='/logout'>Logout</a>;
		}

		if (this.props.homeButton) {
			home = (<a className='mainNav' href='/'>Home</a>);
		}
		return (
			<div className='header'>
				<span className='pavement'>Pavement</span>
				{logout}
				{home}
			</div>
		);
	}
});

window.Logo = Logo;