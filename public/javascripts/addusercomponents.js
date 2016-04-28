var AddUser = React.createClass({
	displayName:'AddUser',
	getInitialState: function() {
		return {
			users:[]
		}
	},
	handleChange: function(e) {
		if(e.target.value !== '') {
			$.ajax({
				url:'/users/' + e.target.value,
				success:function(result) {
					this.setState({users:result});
				}.bind(this)
			});
		} else {
			this.setState({users:[]});
		}
	},
	render: function() {
		return (
			<div id='users'>
				<input type='text' onChange={this.handleChange} />
				<UserList data={this.state.users} boardId={this.props.boardId} />
			</div>
		)
	}
});

var UserList = React.createClass({
	displayName:'UserList',
	getInitialState: function() {
		return ({
			currentUsers: []
		})
	},
	componentDidMount: function() {
		$.ajax({
			url:'/boardUsers/' + this.props.boardId,
			success:function(result) {
				console.log(result);
				this.setState({currentUsers:result.users});
			}.bind(this)
		});
	},
	render: function() {
		var boardId = this.props.boardId;
		var users = this.state.currentUsers;

		var addNodes = this.props.data.map(function(element) { 
			if(users.indexOf(element._id) === -1) {
				return (
					<UserAddElement boardId={boardId} username={element.username} key={element._id} />
				)
			}
		});

		// TODO Change addUsers to take username instead of id
		var currentNodes = this.state.currentUsers.map(function(element) {
			return (
				<UserCurrentElement boardId={boardId} username={element} key={element} />
			)
		});

		return (
			<div id='userlist'>
				<h1>Add a User</h1>
				{addNodes}
				<h1>Current Users</h1>
				{currentNodes}
			</div>
		)
	}
});

var UserAddElement = React.createClass({
	displayName:'UserAddElement',
	handleClick:function() {
		$.ajax({
			url: '/addUser/' + this.props.boardId + '/' + this.props.username,
			method:'PUT',
			success:function(result) {
				alert('Successfully added user: ' + this.props.username);
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div className='userElement'>
				<div onClick={this.handleClick} id={this.props.username}>
					{this.props.username}
				</div>
			</div>
		)
	}
});

var UserCurrentElement = React.createClass({
	displayName:'UserCurrentElement',
	handleClick: function() {
		$.ajax({
			url:'/removeUser/' + this.props.boardId + '/' + this.props.username,
			method:'delete',
			success:function() {
				alert('Removed user: ' + this.props.username);
			}.bind(this)
		})
	},
	render:function() {
		return (
			<div className='UserCurrentElement'>
				{this.props.username} <button onClick={this.handleClick}>Remove</button>
			</div>
		)
	}
});

window.AddUser = AddUser;