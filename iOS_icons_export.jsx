/**
 * Created by Manuel Gonzalez Villegas on 24/4/16.
 * Copyright © 2016 Manuel Gonzalez Villegas. All rights reserved.
 */

var iconSizesMap = [
	{"name": "Itunes",				"size": 1024},
	{"name": "Icon-Small",			"size": 29	},
	{"name": "Icon-Small@2x",		"size": 58	},
	{"name": "Icon-Small@3x",		"size": 87	},
	{"name": "Icon-Small-40",		"size": 40	},
 	{"name": "Icon-Small-40@2x",	"size": 80	},
	{"name": "Icon-Small-40@3x",	"size": 120	},
	{"name": "Icon-Small-50",		"size": 50	},
	{"name": "Icon-Small-50@2x",	"size": 100	},
	{"name": "Icon",				"size": 57	},
	{"name": "Icon@2x",				"size": 114	},
	{"name": "Icon-60@2x",			"size": 120	},
	{"name": "Icon-60@3x",			"size": 180	},
	{"name": "Icon-72",				"size": 72	},
	{"name": "Icon-72@2x",			"size": 144	},
	{"name": "Icon-76",				"size": 76	},
	{"name": "Icon-76@2x",			"size": 152	},
	{"name": "Icon-83.5@2x",		"size": 167	}
];

/**
* Never use else. This is the reason to use multiple return
*/
function validateFile(doc) {
	if (doc.width != doc.height) {
		doc.close(SaveOptions.DONOTSAVECHANGES);
		alert("Image has to be square");

		return false;
	}
	
	if (doc.width < 1024) {
		doc.close(SaveOptions.DONOTSAVECHANGES);
		alert("The selected image should be square and equals or bigger than 1024x1024");

		return false;
	}

	return true;
}

/**
* We'll save the images for PNG-24
* See: http://jongware.mit.edu/pscs5js_html/psjscs5/pc_ExportOptionsSaveForWeb.html
*/
function getExportOptions() {
	var exportOptions = new ExportOptionsSaveForWeb();
	exportOptions.format = SaveDocumentType.PNG;
	exportOptions.PNG8 = false;
	exportOptions.transparency = true;
	exportOptions.interlaced = false;
	exportOptions.quality = 100;

	return exportOptions;
}

/**
* Iterate the map iconSizesMap to generate each icon size and store it on choosed destination folder
*/
function generateIcons(doc, destinationFolder) {
	// To restore to the initial state after each resize
	var initialState = doc.activeHistoryState;

	var icon;
	for (i = 0; i < iconSizesMap.length; i++) {
		// Get current icon
		icon = iconSizesMap[i];

		// Use method BICUBICSHARPER
		// Resample see: http://jongware.mit.edu/pscs5js_html/psjscs5/pe_ResampleMethod.html
		// Resize see: http://jongware.mit.edu/pscs5js_html/psjscs5/pc_Document.html#resizeImage
		doc.resizeImage(icon.size, icon.size, null, ResampleMethod.BICUBICSHARPER);

		var fileName = icon.name + ".png";

		// Save the icon
		doc.exportDocument(new File(destinationFolder + "/" + fileName), ExportType.SAVEFORWEB, getExportOptions());
		// History back to initialState
		doc.activeHistoryState = initialState;
	}
}

function main() {
	var fileRef = File.openDialog("Choose the image base (1024x1024)", "Image File:*.psd;*.png;*.jpg", false);
	if (fileRef == null) {
		alert("You exit the script");

		return;
	}

	var doc = app.open(fileRef)

	if (!validateFile(doc)) {

		return;
	}

	// Display a dialog to choose the destination folder
	var destinationFolder = Folder.selectDialog("Choose the destination folder");
	if (destinationFolder == null) {
		doc.close(SaveOptions.DONOTSAVECHANGES);
		alert("You exit the script");
		
		return;
	}

	// Mark the units to pixels
	app.preferences.rulerUnits = Units.PIXELS;

	// Remove metadata
	doc.info = null;

	// To restore to the initial state after each resize
	generateIcons(doc, destinationFolder);

	doc.close(SaveOptions.DONOTSAVECHANGES);
	alert("iOS Icons were created successfully!");
}

main();
