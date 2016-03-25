//module to display the playlist we have found for the user depending on the weather
var DisplayPlaylist = React.createClass({
    rawMarkup: function() { //copied from the react tutorial, used to render the description of the playlists, should be fine since this input is provided by spotify
        var rawMarkup = marked(this.props.playlist.description.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },
    render: function () {
        if (this.props.playlist){   //displays the picture of the playlist and the description, adds a spotify launch button which opens the web player in a new tab
            var display = (
                <div>
                <h1>The playlist we have found for this weather is</h1>
                <img src={this.props.playlist.images[0].url}/>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
                <a href={this.props.playlist.external_urls.spotify} target="_blank">Launch Spotify</a>
                </div>
                ); 
        } else {    //display an empty div if our weather hasn't loaded yet and so our playlist hasn't loaded yet
            var display = (<div id="playlistButtonLoading"></div>);
        }
        return (
            <div className="contextChild">{display}</div>   
            );
    }
});

window.DisplayPlaylist = DisplayPlaylist;