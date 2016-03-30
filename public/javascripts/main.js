//this is our parent client-side component
var chatData = [
	{id:1, text:'some random text', author:'andrew'},
	{id:2, text:'other random text', author:'jwei'}
];

var App = React.createClass({

    render: function () {
        return (
            <div className='app'>
                <ChatBox url="/messages/56f97f246be8a54a27d8ce0f" />
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);