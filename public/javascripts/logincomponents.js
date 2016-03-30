var FormViewControl = React.createClass({
	displayName:'FormViewControl',
	getInitialState: function() {
		userId:'',
		username:'',
		password:''
	},
	handleUsernameChange: function(e) {
		this.setState({username:e.target.value});
	},
	handlePasswordChange: function(e) {
		this.setState({password:e.target.value});
	},
	handleSignUp: function() {
		// TODO handle signup
	},
	handleSignIn: function() {
		// TODO handle signin
	},
	render: function() {
		if(userId === '') {
			return (
				<div className='FormViewControl'>
					<h1>Sign Up</h1>
					<form>
						<input type='text'
								placeholder='Desired Username'
								onChange={this.handleUsernameChange} /><br />

						<input type='password'
								placeholder='Password'
								onChange={this.handlePasswordChange} /><br />

						// TODO: combine signup and signin
						<button onClick={this.handleSignUp}>Sign Up</button>
						<button onClick={this.handleSignIn}>Sign In</button>
					</form>
				</div>
			)
		} else {
			return (
				<div className='FormViewControl'>
					<BoardList />
				</div>
			)
		}
	}
});