//this is our parent client-side component

var App = React.createClass({

    render: function () {
        return (
            <div className='app'>
                Some stuff will go here
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);