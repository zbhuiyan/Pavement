var socket = io();

var windowPathComponents = window.location.pathname.split('/');
var boardId = windowPathComponents[windowPathComponents.length-1];

var App = React.createClass({
	componentDidMount: function() {
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
    render: function () {
        return (
            <div className='app'>
                <ChatBox socket={socket} boardId={this.props.boardId} />
            </div>
        )
    }
});

ReactDOM.render(
  <App boardId={boardId} />,
  document.getElementById('content')
);