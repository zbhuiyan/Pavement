//this is our parent client-side component

var App = React.createClass({

    render: function () {
        return (
            <div className='app'>
                <ChatBox boardId="56f97f246be8a54a27d8ce0f" url="/messages/56f97f246be8a54a27d8ce0f" />
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);