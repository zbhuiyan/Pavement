/**
 * chatmain.js contains code for rendering the board
 */

var socket = io();
var windowPathComponents = window.location.pathname.split('/');
var boardId = windowPathComponents[windowPathComponents.length-1];

$.ajax({
	url:'/me',
	dataType:'json',
	cache:false,
	success: function(data) {
		socket.emit('setup', {
			boardId:boardId,
			userId:data.username
		});
	},
	error: function(xhr, status, err) {
		console.log('error occurred');
	}
});

var App = React.createClass({
    render: function () {
    	var loggedIn = true;
    	var homeButton = true;
        return (
            <div className='app'>
                <Logo isLoggedIn={loggedIn} homeButton={homeButton} />
                <div>
                	<Canvas socket={socket} boardId={this.props.boardId} />
	                <ChatBox socket={socket} boardId={this.props.boardId} />
                    <AddUser boardId={this.props.boardId} />
                </div>
            </div>
        )
    }
});

ReactDOM.render(
  <App boardId={boardId} />,
  document.getElementById('content')
);
