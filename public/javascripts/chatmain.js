
var App = React.createClass({
	getBoardInformation: function() {
		var windowPathComponents = window.location.pathname.split('/');
		return windowPathComponents[windowPathComponents.length-1];
	},
    render: function () {
    	var boardId = this.getBoardInformation();
        return (
            <div className='app'>
                <ChatBox boardId={boardId} />
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);