

var pTags = document.getElementsByTagName('p');
for (var p = 0; p < pTags.length; p++) {
  pTags[p].style.zIndex = 100000;
  pTags[p].style.position = 'relative';
  
}


// colors to display
var color1_;
var color2_;
// set number of columns you want to be displayed
var colNum;
chrome.storage.sync.get('over_color1', function(data) {
  color1_ = data.over_color1;
  chrome.storage.sync.get('over_color2', function(result) {
      color2_ = result.over_color2;
      chrome.storage.sync.get('cols', function(cdata) {
        colNum = cdata.cols;
        main();
      });
    });
  });


function generatePartitions(parentDiv, length) {
  Divs = [];
  currentDiv = [];
  Divs.push(currentDiv);
  for (var i = 0; i < length; i++) {
    if (parentDiv[i].nodeName === "P") {
      currentDiv.push(parentDiv[i]);
    } else {
      if (currentDiv.length > 0) {
        currentDiv = [];
        Divs.push(currentDiv);
      }
    }
  }
  return Divs;
}


function main(){
  divs = generatePartitions(document.getElementById("mw-content-text").firstChild.childNodes, document.getElementById("mw-content-text").firstChild.childNodes.length);

  var cols = [].slice.call(document.getElementsByClassName("column"));

  if(cols.length > 0) {
    cols.forEach(function(elem){
      elem.style.opacity = 0.7;
    });
    exit();
  }

  nodes = [];
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].length !== 0) {
      var node = divs[i][0].parentNode.insertBefore(document.createElement('div'), divs[i][0]);

      var overlaysDiv = document.createElement('div');
      overlaysDiv.classList.add('overlays');
      node.prepend(overlaysDiv);
      height = 0;
      divs[i].forEach(function(element) {
        height = height + element.clientHeight
      });

      console.log(height)

      //var paragraphHeight = node.clientHeight;

      nodeChildren = node.children

      console.log(nodeChildren);

      // for (var i = 0; i < nodeChildren.length; i++) {
      //     console.log(nodeChildren.item(i)); //second console output
      // }


      // add properties to div


      overlaysDiv.style.position = 'absolute';
      overlaysDiv.style.display = 'grid';
      overlaysDiv.style.gridTemplateColumns = `repeat(${colNum}, 1fr)`
      overlaysDiv.style.gridTemplateRows = '1fr';
      overlaysDiv.style.width = '100%';
      overlaysDiv.style.height = (height+20) + "px";


      // for each colNum, create col
      for (var j = 0; j < colNum; j++) {
        // create a column item
        var colDiv = document.createElement("div");
        colDiv.classList.add("column");
        // alternate all even columns with color
        if (j % 2 === 0) {
          if (j % 4 === 0) {
            colDiv.style.backgroundColor = color1_;
            colDiv.style.opacity = 1;
          } else {
            colDiv.style.backgroundColor = color2_;
            colDiv.style.opacity = 1;
          }
        }
        // assign grid index to div
        colDiv.style.gridColumn = `${j + 1};`;
        colDiv.style.gridRow = "1";
        // append to display div
        overlaysDiv.appendChild(colDiv);
      }




      divs[i].forEach(function(element) {
        var e = element.parentNode.removeChild(element);
        node.appendChild(e);
      });
      nodes.push(node);
    };
  };

  nodes.forEach(function(element){
    console.log(element)
  });

}

