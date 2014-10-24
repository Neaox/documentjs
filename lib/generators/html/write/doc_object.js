var deepExtendWithoutBody = require("./deep_extend_without_body"),
	_ = require("lodash"),
	filename = require("./filename"),
	Q = require('q'),
	fs = require("fs"),
	writeFile = Q.denodeify(fs.writeFile),
	path = require("path");

/**
 * @function documentjs.generators.html.write.docObject
 * @parent documentjs.generators.html.write.methods
 * 
 * Writes out a [documentjs.process.docObject docObject]. 
 * 
 * @signature `.write.docObject(docObject, renderer, options, setCurrentDocObjectForHelpers)`
 * 
 * @param {documentjs.process.docObject} docObject The doc object to be written out.
 * 
 * @param {documentjs.generators.html.types.renderer} renderer A function that renders
 * the output.
 * 
 * @param {Object} options Configuration options.
 * 
 * @option {String} dest The folder name this file will be written to. The 
 * filename is determined from the docObject's name.
 * 
 * @param {function(documentjs.process.docObject)} setCurrentDocObjectForHelpers
 * 
 * @return {Promise} A promise that resolves when the file has been written out.
 */
module.exports = function(docObject, renderer, options, setCurrentDocObjectForHelpers){
	
	var out = path.join(options.dest, filename(docObject, options) );
	
	// merge the current DocObject with the configuration
	var opts = _.extend({}, options, options.pageConfig);
	delete opts.pageConfig;
	var data = _.extend({}, opts, docObject),
		rendered;
	
	if(options.debug) {
		console.log('OUT: ' + path.relative(process.cwd(),out) );
	}
	

	data.docObjectString = JSON.stringify(deepExtendWithoutBody(data));
	
	
	// render the content
	setCurrentDocObjectForHelpers(data);
	
	if(data.renderer) {
		rendered = data.renderer(data, renderer);
	} else {
		rendered = renderer(data);
	}
	
	return writeFile(out, rendered);

	
};