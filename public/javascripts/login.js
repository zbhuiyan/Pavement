//module to handle login, links to /auth/spotify which begins oauth flow on server
var Login = React.createClass({
    render: function(){
        return (
            <div className="contextChild">
            <a href='/auth/spotify'>Login to Spotify</a>
            </div>
        );
    }
});

window.Login = Login;
