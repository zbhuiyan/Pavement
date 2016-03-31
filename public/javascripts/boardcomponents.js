var BoardListContainer = React.createClass({
	displayName:'BoardListContainer',
	getInitialState: function() {
		return ({
			publicBoards:[],
			privateBoards:[]
		});
	},
	componentDidMount: function() {
		this.getPrivateBoards();
		this.getPublicBoards();
	},
	getPrivateBoards: function() {
		$.ajax({
			url:'/myBoards',
			dataType:'json',
			cache:false,
			success: function(data) {
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
				console.log(data);
				this.setState({publicBoards:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr);
			}.bind(this)
		});
	},
	render:function() {
		return (
			<div className='BoardListContainer'>
				<h1>Boards You Are A Part Of</h1>
				<BoardList data={this.state.privateBoards} />

				<h1>Public Boards</h1>
				<BoardList data={this.state.publicBoards} />
			</div>
		);
	}
});

var BoardList = React.createClass({
	displayName:'BoardList',
	render:function() {
		var nodes = this.props.data.map(function(board) {
			return (
				<BoardElement owner={board.owner} name={board.name} id={board._id} key={board._id} />
			);
		});
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
	render:function() {
		return (
			<div className='BoardElement'>
				<h3>{this.props.name}</h3>
				<h6>Created by {this.props.owner}</h6>
				<button onClick={this.handleClick}>Join</button>
			</div>
		)
	}
});

window.BoardListContainer = BoardListContainer;