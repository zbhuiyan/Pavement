// ***** All Chat Components *****

var ChatBox = React.createClass({displayName:'ChatBox',
	getInitialState: function() {
		return {
			data:[]
		};
	},
	getOldMessages: function() {
		var url = '../messages/' + this.props.boardId;
		$.ajax({
			url: url,
			dataType:'json',
			cache:false,
			success: function(data) {
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr);
				//console.log('../messages/' + this.state.boardId, status, err.toString());
			}.bind(this)
		});
	},
	setupSocketHandlers: function() {
		this.props.socket.on('send_message', this.handleSocketData);
	},
	handleSocketData: function(payload) {
		this.setState({data:this.state.data.concat([payload])});
	},
	componentDidMount: function() {
		this.getOldMessages();
		this.setupSocketHandlers();
	},
	render:function() {
		return (
			<div className='chatBox'>
				<h1>Chat</h1>
				<ChatList data={this.state.data} />
				<ChatForm socket={this.props.socket} />
			</div>
		);
	}
});

var ChatList = React.createClass({displayName:'ChatList',
	componentDidUpdate: function() {
		var domNode = ReactDOM.findDOMNode(this);
		domNode.scrollTop = domNode.scrollHeight;
	},
	render:function() {
		var nodes = this.props.data.map(function(chat) {
			return (
				<ChatMessage user={chat.user} msg={chat.msg} key={chat._id} />
			);
		});
		return (
			<div className='chatList'>
				{nodes}
			</div>
		);
	}
});

var ChatForm = React.createClass({displayName:'ChatForm',
	getInitialState: function() {
		return {message:''};
	},
	handleMessageChange: function(e) {
		this.setState({message: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();

		this.props.socket.emit('chat', this.state.message);

		this.setState({message:''});
	},
	render:function() {
		return (
			<form className='chatForm' onSubmit={this.handleSubmit} >
				<input type='text' 
				placeholder='message' 
				value={this.state.message}
				onChange={this.handleMessageChange} />

				<input type='submit' value='Send' />
			</form>
		);
	}
});

var ChatMessage = React.createClass({displayName:'ChatMessage',
	render:function() {
		return (
			<div className='chatMessage'>
				<p className='chatAuthor'>{this.props.user}: </p>
				<p className='chatText'> {this.props.msg}</p>
			</div>
		);
	}
});

window.ChatBox = ChatBox;