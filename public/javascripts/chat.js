var socket = io();

var ChatBox = React.createClass({displayName:'ChatBox',
	getInitialState: function() {
		return {data:[]};
	},
	getOldMessages: function() {
		$.ajax({
			url: this.props.url,
			dataType:'json',
			cache:false,
			success: function(data) {
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	sendSetupToSocket: function() {
		$.ajax({
			url:'/me',
			dataType:'json',
			cache:false,
			success: function(data) {
				socket.emit('setup', {
					boardId:this.props.boardId,
					userId:data.username
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log('error occurred');
			}.bind(this)
		});
	},
	setupSocketHandlers: function() {
		socket.on('send_message', this.handleSocketData);
	},
	handleSocketData: function(payload) {
		this.setState({data:this.state.data.concat([payload])});
	},
	componentDidMount: function() {
		this.getOldMessages();
		this.sendSetupToSocket();
		this.setupSocketHandlers();
	},
	render:function() {
		return (
			<div className='chatBox'>
				<h1>Chat</h1>
				<ChatList data={this.state.data} />
				<ChatForm />
			</div>
		);
	}
});

var ChatList = React.createClass({displayName:'ChatList',
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

		socket.emit('chat', this.state.message);

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
				<h2 className='chatText'>
					{this.props.msg}
				</h2>
				<h5 className='chatAuthor'>
					-- {this.props.user}
				</h5>
			</div>
		);
	}
});

window.ChatBox = ChatBox;