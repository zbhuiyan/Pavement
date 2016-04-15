//this is our parent client-side component

var App = React.createClass({

	getInitialState: function () {
		return {user: false};
	},

	componentWillMount: function () {
		//check if the user is logged in or not by making a get request to /user
        $.ajax({
            url: '/currentUser',
            success: function(data) {
                // if (data !== null) {
                	console.log('user:');
                	console.log(data);
                    this.setState({user: data});    //store the user and begin getting the weather
                // }
            }.bind(this)
        });
    },

    render: function () {
        var loggedIn = false;
        if (this.state.user) {
        	var content = (
        		<BoardListContainer url='/board/add'/>
        	);
            loggedIn = true;
        } else {
        	var content = (
        		<FormViewControl />
        	);
        }
        return (
            <div className='app'>
            	<Logo isLoggedIn={loggedIn}/>
                {content}
            </div>
        )
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);