var ChatBox = React.createClass({displayName:'ChatBox',
	render:function() {
		return (
			<div className='chatBox'>
				<h1>Chat</h1>
				<ChatList data={this.props.data} />
				<ChatForm />
			</div>
		);
	}
});

var ChatList = React.createClass({displayName:'ChatList',
	render:function() {
		var nodes = this.props.data.map(function(chat) {
			return (
				<ChatMessage author={chat.author} text={chat.text} key={chat.id} />
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
					{this.props.text}
				</h2>
				<h5 className='chatAuthor'>
					-- {this.props.author}
				</h5>
			</div>
		);
	}
});

window.ChatBox = ChatBox;