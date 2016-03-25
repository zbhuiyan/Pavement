//module to display name of website
var Logo = React.createClass({
	render: function () {
		return (
			<div className='header'>
				<img className='icon-light-up sun' src={this.props.src} height="40"/>
				<span className='spotweather'> Spotweather</span>
				<span className='logoutButton'>{logout}</span>
			</div>
		);
	}
});

window.Logo = Logo;