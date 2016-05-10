/**
 * addusercomponents.js contains the following components:
 * - AddUser
 * -- getPublic
 * -- handleChange
 * - UserList
 * -- handleAdd
 * -- handleRemove
 * - UserAddElement
 * -- handleClick (add users to private boards)
 * - UserCurrentElement (remove users from private boards)
 * -- handleClick
 */

//Add user to the board unless on a public board
// It might be nice to specify what kind of element each of these components are, are they buttons, lists, forms?
var AddUser = React.createClass({
	displayName:'AddUser',
	getInitialState: function() {
		return {
			users:[],
			isPublic:false
		}
	},
	getPublic: function() {
		$.ajax({
			url:'/public/' + this.props.boardId,
			success:function(result) {
				console.log(result);
				this.setState({isPublic:result.isPublic});
			}.bind(this)
		})
	},
	componentDidMount: function() {
		this.getPublic();
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
		if(!this.state.isPublic) {
			return (
				<div id='users'>
					<h1 className='addUser'>Add a User</h1>
					<input type='text' placeholder='username' onChange={this.handleChange} />
					<UserList data={this.state.users} boardId={this.props.boardId} />
				</div>
			)
		} else {
			return (
				<div>
				</div>
			)
		}
	}
});

//List of users on board (unless it's a public board)
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
	handleAdd: function(username) {
		$.ajax({
			url: '/addUser/' + this.props.boardId + '/' + username,
			method:'PUT',
			success:function(result) {
				alert('Successfully added user: ' + username);
				this.setState({currentUsers:result});
			}.bind(this)
		});
	},
	handleRemove: function(username) {
		$.ajax({
			url:'/removeUser/' + this.props.boardId + '/' + username,
			method:'delete',
			success:function(result) {
				alert('Removed user: ' + username);
				this.setState({currentUsers:result});
			}.bind(this)
		})
	},
	render: function() {
		var users = this.state.currentUsers;

        // nice use of fuctional tools (map)
		var addNodes = this.props.data.map(function(element) {
			if(users.indexOf(element.username) === -1) {
				return (
					<UserAddElement boardId={this.props.boardId} username={element.username} key={element._id} handle={this.handleAdd} />
				)
			}
		}.bind(this));


		var currentNodes = this.state.currentUsers.map(function(element) {
			return (
				<UserCurrentElement boardId={this.props.boardId} username={element} key={element} handle={this.handleRemove} />
			)
		}.bind(this));

		return (
			<div id='userlist'>
				{addNodes}
				<h1>Current Users</h1>
				{currentNodes}
			</div>
		)
	}
});


var UserAddElement = React.createClass({
	displayName:'UserAddElement',
	handleClick: function() {
		this.props.handle(this.props.username);
	},
	render: function() {
		return (
			<div className='userElement'>
				<div id={this.props.username}>
					{this.props.username} <button onClick={this.handleClick}>Add</button>
				</div>
			</div>
		)
	}
});

var UserCurrentElement = React.createClass({
	displayName:'UserCurrentElement',
	handleClick: function() {
		this.props.handle(this.props.username);
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
