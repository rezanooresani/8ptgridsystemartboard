var onRun = function(context) {
	//Setup 
	var sketch = require('sketch')	
	var Document = require('sketch/dom').Document
	var document = require('sketch/dom').getSelectedDocument()
	var UI = require('sketch/ui') 
	var page = document.selectedPage
	var pagelayers = page.layers	

	//Load JSON
	var path = context.plugin.urlForResourceNamed("grids.json").path()
	var objJSON = JSON.parse( NSString.stringWithContentsOfFile( path ) ); 
	//Selection of JSON obj
	var obj = objJSON.Artboard

	var window = createWindow(context,obj);
  	var alert = window[0];
	var response = alert.runModal()

	if(response == "1000"){
	var choice = flipDropdown.indexOfSelectedItem();
	
	
	//Define reference position and size
	var refX = 0 
	var refY = 0
	var padding = 0
	var refWidth = 0
	var index = 0

	//If there is artboard
	//Refer to end of artboard as a point
	if(pagelayers.length > 0){

		for(var i = 0; i < pagelayers.length; i++){
			//Check the outermost artboard for placement of new artboard
			if(pagelayers[i].frame.x >= refX){				
				//Get the position
				refX = pagelayers[i].frame.x				
				//Get the index
				index = i
			}
		}
		//Add padding
		padding = 100
		//Get the Y position
		refY = pagelayers[index].frame.y
		//Get the width
		refWidth = pagelayers[index].frame.width
	}

	//Initialise artboard
	var art = MSArtboardGroup.new()
	var artboardFrame = art.frame()
	art.setName(obj[choice].name)
	//Setting the width and height
	artboardFrame.setWidth(obj[choice].frame.width)
	artboardFrame.setHeight(obj[choice].frame.height)

	//Setting the position of x and y
	artboardFrame.setX(refX + refWidth + padding)
	artboardFrame.setY(refY)

	//Setting the layout
	art.layout = MSDefaultLayoutGrid.defaultLayout()
	var layoutGrid = art.layout()
	layoutGrid.setGuttersOutside(obj[choice].grid.guttersOutside)
	layoutGrid.determineAppropriateColumnWidth =false
	layoutGrid.setTotalWidth(obj[choice].grid.totalWidth)
	layoutGrid.setNumberOfColumns(obj[choice].grid.numberOfColumns)
	layoutGrid.setColumnWidth(obj[choice].grid.columnWidth)
	layoutGrid.setGutterWidth(obj[choice].grid.gutterWidth)
	layoutGrid.setHorizontalOffset((artboardFrame.width()-obj[choice].grid.totalWidth)/2)

	//Insert to document
	context.document.currentPage().addLayer(art)

	//Center the screen
	document.centerOnLayer(art)
	UI.message('Artboard added!')
}
};

function createWindow(context,obj) {
	// Setup the window
	var alert = COSAlertWindow.new();
	alert.setMessageText("Select your artboard")
	alert.addButtonWithTitle("Ok");
	alert.addButtonWithTitle("Cancel");
	var objJSON = obj


  // Create the main view
  var viewWidth = 400;
  var viewHeight = 70;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  // Create label
var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 33, (viewWidth - 30), 35));


// Configure labels
infoLabel.setStringValue("Please select your desired artboard");
infoLabel.setSelectable(false);
infoLabel.setEditable(false);
infoLabel.setBezeled(false);
infoLabel.setDrawsBackground(false);


  // Create dropdown
  flipDropdown = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 60, (viewWidth / 2) + 10, 22));

  // Configure dropdown
  for(var j = 0 ; j < objJSON.length ; j++){
  	[flipDropdown addItemWithTitle:objJSON[j].name];
  }
  
  

  //Display labels
  view.addSubview(flipDropdown);
  view.addSubview(infoLabel);

  // Show the dialog
return [alert]
}

