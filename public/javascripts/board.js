var BoardApp = React.createClass({
	render: function() {
		return (
			<div className='BoardApp'>
				<BoardListContainer />
			</div>
		)
	}
});

ReactDOM.render(
	<BoardApp />,
	document.getElementById('content')
);