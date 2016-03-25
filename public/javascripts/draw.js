var canvas = new fabric.Canvas('canvas');

var rect = new fabric.Rect({
	top: 100,
	left: 100,
	width: 50,
	height: 60,
	fill: 'blue'

});

canvas.add(rect);

canvas.on('mouse:down', function(option){
	console.log(option);
	if (typeof option.target != "undefined") {
		return;
	} else{
		var startY = option.e.offsetY,
			startX = option.e.offsetX;
		console.log(startX, startY);

		var rect2 = new fabric.Rect({
			top: startY,
			left: startX,
			width: 0,
			height: 0,
			fill: 'transparent',
			stroke: 'red',
			strokewidth: 4
		});
		canvas.add(rect2);
		console.log(" added rect to canvas");

		canvas.on('mouse:move', function (option){
			var e = option.e;
			rect2.set('width', e.offsetX - e.offsetY); //width 
			rect2.set('height', e.offsetY - e.offsetX);
			rect2.saveState();
		});
	}
});
canvas.on('mouse:up', function(){
	canvas.off('mouse:move');
});