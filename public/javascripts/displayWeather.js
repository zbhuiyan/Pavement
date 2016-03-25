//module to display the weather and the toggle for the user to get a playlist that either matches the weather or is the opposite
var DisplayWeather = React.createClass({
    render: function () {
        if (this.props.weather){    //it takes a while for forecastio to get the weather so we need to show the loading state
            var display = this.props.weather;
            var toggleButton = (
                <div>
                <p className='toggleContext'>If you're unhappy with the current weather, use this toggle and we'll get you</p> 
                <p className='toggleContext'>a playlist designed to make you feel the opposite of what it is like outside.</p>
                <span className="toggle">
                    <div className={this.props.toggleState}>    //initial state is untoggled which means we match the current weather, change the class for styling
                    <button onClick={this.props.onToggleClick}></button>
                    </div>
                </span>
                </div>
                );
        } else {    //if this.props.weather is false, then we show loading..., we also don't want to show the toggle button until the weather has loaded the first time
            var display = "Loading...";
        }
        return (
            <div className="contextChild">
            <h1 className='get-weather'>The weather where you are right now is: {display}</h1>
            {toggleButton}
            </div>
        );
    }
});

window.DisplayWeather = DisplayWeather;