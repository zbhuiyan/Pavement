//module to display the currently logged in user using their profile photo from spotify and their name
var DisplayUser = React.createClass({
    render: function () {
        return (
            <div className="contextChild">
            <div className="contextPic"><img className="proPic" src={this.props.user.photos[0]} /></div>
            <h1 className="contextWelcome">
                <span>Welcome {this.props.user.displayName}</span>
                <br/>
                <span>to Spotweather!</span>
            </h1>
            </div>
            );
    }
});

window.DisplayUser = DisplayUser;