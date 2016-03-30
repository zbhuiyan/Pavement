var ChatBox = React.createClass({displayName:'ChatBox',
	getInitialState: function() {
		return {data:[]};
	},
	componentDidMount: function() {
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
	render:function() {
		return React.createElement('div', {className:'chatForm'},
			'This is a chat form');
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