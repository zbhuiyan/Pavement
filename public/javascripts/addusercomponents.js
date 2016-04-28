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
		// var currentNodes = this.state.currentUsers.map(function(element) {
		// 	return (
		// 		<UserCurrentElement boardId={boardId} username={element.username} 
		// 	)
		// });

		return (
			<div id='userlist'>
				{addNodes}
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

window.AddUser = AddUser;