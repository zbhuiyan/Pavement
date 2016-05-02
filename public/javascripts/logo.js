/**
 * logo.js contains code for the header of the page
 */

var Logo = React.createClass({

	render: function () {
		var logout = (<span></span>);
		var home = (<span></span>);

		if (this.props.isLoggedIn) {
			logout = <a className='mainNav' href='/logout'>Logout</a>;
		}

		if (this.props.homeButton) {
			home = (<a className='mainNav' href='/'>Home</a>);
		}
		return (
			<div className='header'>
				<a className='pavement' href='/'>Pavement</a>
				{logout}
				{home}
			</div>
		);
	}
});

window.Logo = Logo;
