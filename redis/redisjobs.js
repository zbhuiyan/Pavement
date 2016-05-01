var socketHelper = require('../functions/sockethelper.js');
var pavementWrapper = require('../public/javascripts/pavementpaper.js');
var paper = require('paper');

module.exports = {
	"saveState": {
		perform: function(room, callback) {
			socketHelper.getEdits(room, function(data) {
				if (data.length > 0) {
					socketHelper.getSvg(room, function(svgdata) {
						var canvas = new paper.Canvas(1000, 1000);
						var wrapper = new pavementWrapper(canvas);

						if(svgdata !== undefined && svgdata.data !== undefined) {
							wrapper.startProjectFromSVG(svgdata.data);
						}

						for(var index = 0; index < data.length; index++) {
							var editData = data[index].data;

							wrapper.applyEdit(editData);
						}

						socketHelper.addSvg(room, wrapper.exportSVG(), function() {
							if (svgdata !== undefined &&svgdata._id !== undefined) {
								socketHelper.removeSvg(svgdata._id);
							}
							for(var index = 0; index < data.length; index++) {
								socketHelper.removeEdit(data[index]._id);
							}

							console.log('finished removing edits');
						});
						callback(null, 'replaced SVG');
					});
				} else {
					callback(null, 'no edits to apply');
				}
			});
		}
	}
}