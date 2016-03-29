//this is our parent client-side component
var chatData = [
	{id:1, text:'some random text', author:'andrew'},
	{id:2, text:'other random text', author:'jwei'}
];

var App = React.createClass({

    render: function () {
        return (
            <div className='app'>
                <ChatBox data={chatData} />
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);