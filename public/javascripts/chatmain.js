var windowPathComponents = window.location.pathname.split('/');
var boardId = windowPathComponents[windowPathComponents.length-1];

var App = React.createClass({
    render: function () {
        return (
            <div className='app'>
                <ChatBox boardId={this.props.boardId} />
            </div>
        )
    }
});

ReactDOM.render(
  <App boardId={boardId} />,
  document.getElementById('content')
);