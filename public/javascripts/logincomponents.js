var FormViewControl = React.createClass({
	displayName:'FormViewControl',
	render: function() {
		return (
			<div className='FormViewControl'>
				<h1>Sign Up</h1>
				<SignUpForm />

				<h1>Sign In</h1>
				<SignInForm />
			</div>
		)
	}
});

var SignUpForm = React.createClass({
	displayName:'SignUpForm',
	getInitialState: function() {
		return {
			username:'',
			password:''
		};
	},
	handleUsernameChange: function(e) {
		this.setState({username:e.target.value});
	},
	handlePasswordChange: function(e) {
		this.setState({password:e.target.value});
	},
	render: function() {
		return (
			<div className='SignUpForm'>
				<form method='POST' action='/signup'>
					<input type='text'
							placeholder='desired username'
							name='username'
							value={this.state.username}
							onChange={this.handleUsernameChange} /><br />

					<input type='password'
							placeholder='password'
							name='password'
							value={this.state.password}
							onChange={this.handlePasswordChange} /><br />

					<input type='submit'
							value='Sign Up'
							className='submitButton' />
				</form>
			</div>
		)
	}
});

var SignInForm = React.createClass({
	displayName:'SignInForm',
	getInitialState: function() {
		return {
			username:'',
			password:''
		};
	},
	handleUsernameChange: function(e) {
		this.setState({username:e.target.value});
	},
	handlePasswordChange: function(e) {
		this.setState({password:e.target.value});
	},
	render: function() {
		return (
			<div className='SignInForm'>
				<form method='POST' action='login' onSubmit={this.handleSubmit}>
					<input type='text'
							placeholder='username'
							name='username'
							value={this.state.username}
							onChange={this.handleUsernameChange} /><br />

					<input type='password'
							placeholder='password'
							name='password'
							value={this.state.password}
							onChange={this.handlePasswordChange} /><br />

					<input type='submit'
							value='Sign In'
							className='submitButton' />
				</form>
			</div>
		)
	}
});

window.FormViewControl = FormViewControl;