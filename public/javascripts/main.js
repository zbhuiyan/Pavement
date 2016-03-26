//this is our parent client-side component
var App = React.createClass({

    render: function () {
        return (
            <div className='app'>
                <Logo />
                <Canvas />
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);