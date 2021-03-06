/**
 * boardcomponents.js contains the following board list components: 
 * - board components:
 * -- getUser
 * -- getPrivateBoards
 * -- getPublicBoards
 * -- handleBoardSubmit
 * -- handleBoardDelete
 * - board list
 * - board element components: 
 * -- handleClick
 * -- handleDelete
 * - create board form components:
 * -- handleNameChange
 * -- handlePublicChange
 * -- handleSubmit
 */

var BoardListContainer = React.createClass({
	displayName:'BoardListContainer',
	getInitialState: function() {
		return ({
			publicBoards:[],
			privateBoards:[],
			user: ''
		});
	},
	componentWillMount: function() {
		$.ajax({
            url: '/currentUser',
            success: function(data) {
                this.setState({user: data});
            }.bind(this)
        });
	},
	componentDidMount: function() {
		this.getPrivateBoards();
		this.getPublicBoards();
	},

	getUser: function () {
		$.ajax({
			url:'/me',
			dataType:'json',
			cache:false,
			success: function(data) {
				this.setState({user: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log('error occurred');
			}
		});
	},

	getPrivateBoards: function() {
		$.ajax({
			url:'/myBoards',
			dataType:'json',
			cache:false,
			success: function(data) {
				console.log('private boards ', data);
				this.setState({privateBoards:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(this)
		});
	},
	getPublicBoards: function() {
		$.ajax({
			url:'/publicBoards',
			dataType:'json',
			cache:false,
			success: function(data) {
				this.setState({publicBoards:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(this)
		});
	},
	handleBoardSubmit: function (board) {
		var boards;
		if (board.isPublic) {
			console.log(board);
			var boards = this.state.publicBoards;

			$.ajax({
				url: this.props.url,
				type: 'POST',
				data: board,
				success: function (data) {
					var newBoards = boards.concat([data]);
					this.setState({publicBoards: newBoards});
				}.bind(this),
				error: function(xhr, status, err) {
					console.log('sadness :(');
				}

			});

			// var newBoards = boards.concat([board]);
			// this.setState({publicBoards: newBoards});
		} else {
			var boards = this.state.privateBoards;
			$.ajax({
				url: this.props.url,
				type: 'POST',
				data: board,
				success: function (data) {
					var newBoards = boards.concat([data]);
					this.setState({privateBoards: newBoards});
				}.bind(this),
				error: function(xhr, status, err) {
					console.log('sadness :(');
				}

			});
			// var newBoards = boards.concat(board);
			// this.setState({privateBoards: newBoards});
		}
	},

	handleBoardDelete: function (board) {
		var boards;
		console.log(this.state.user);
        $.ajax({
        	url: '/board/' + board.id + '/' + this.state.user.username,
        	type: 'DELETE',
        	success: function (result) {
        		console.log(result);
        		if (board.isPublic) {
        			boards = this.state.publicBoards;
        			var newPublicBoards = boards.filter(function (element) {
        				return !(element._id === board.id && element.owner === this.state.user.username);
        			}.bind(this));
        			this.setState({publicBoards: newPublicBoards});
        		} else {
        			boards = this.state.privateBoards;
        			var newPrivateBoards = boards.filter(function (element) {
        				return !(element._id === board.id && element.owner === this.state.user.username);
        			}.bind(this));
        			this.setState({privateBoards: newPrivateBoards}) 
        		}
        	}.bind(this)

        });
	},

	render:function() {
		return (
			<div className='BoardListContainer'>
				<h1>Create a board</h1>
				<CreateBoardForm onBoardSubmit={this.handleBoardSubmit} />

				<h1>Private Boards</h1>
				<BoardList data={this.state.privateBoards} user={this.state.user} handleBoardDelete={this.handleBoardDelete} />

				<h1>Public Boards</h1>
				<BoardList data={this.state.publicBoards} user={this.state.user} handleBoardDelete={this.handleBoardDelete} />
			</div>
		);
	}
});

var BoardList = React.createClass({
	displayName:'BoardList',
	render:function() {
		var nodes = this.props.data.map(function(board) {
			return (
				<BoardElement owner={board.owner} name={board.name} id={board._id} key={board._id} user={this.props.user} isPublic={board.isPublic} onBoardDelete={this.props.handleBoardDelete} />
			);
		}.bind(this));
		return (
			<div className='BoardList'>
				{nodes}
			</div>
		);
	}
});



var BoardElement = React.createClass({
	displayName:'BoardElement',
	handleClick: function(e) {
		window.location.href = '/draw/' + this.props.id;
	},
	handleDelete: function (e) {
		this.props.onBoardDelete({id:this.props.id, isPublic: this.props.isPublic});
	},

	render:function() {
		var content = (<p></p>);
		if (this.props.owner === this.props.user.username) {
			content = (
				<button onClick={this.handleDelete}>Delete</button>
			);
		}
		// <button onClick={this.handleDelete}>Delete</button>
		return (
			<div className='BoardElement'>
				<span className='boardElement'>{this.props.name}</span>
				<button onClick={this.handleClick}>Join</button>
				{content}
			</div>
		)
	}
});

var CreateBoardForm = React.createClass({
	getInitialState: function () {
		return {
			name: '',
			isPublic: false,
		};
	},

	handleNameChange: function (e) {
		this.setState({name:e.target.value});
	},

	handlePublicChange: function (e) {
		this.setState({isPublic:e.target.checked});
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var name = this.state.name.trim();
		var isPublic = this.state.isPublic;

		if (!name) {
			return;
		}

		this.props.onBoardSubmit({name: name, isPublic: isPublic});
		this.setState({name: '', isPublic: false});
	},

	render: function () {
		return (
			<div className='CreateBoardForm'>
				<form onSubmit={this.handleSubmit}>
					<input type='text'
							placeholder='name'
							name='name'
							value={this.state.name}
							onChange={this.handleNameChange} />
					<span className="publicCheckbox">Public :</span>
					<input type='checkbox'
							name='isPublic'
							value={this.state.isPublic}
							onChange={this.handlePublicChange} />
					<input type='submit'
							value='Create'
							className='submitButton' />
				</form>
			</div>
		);
	}
});

window.BoardListContainer = BoardListContainer;
