// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// This extension demonstrates using OCR to combat stupid Facebook user habits that annoy me personally.

var allLinks = [];
var visibleLinks = [];
// Display all visible links.
function showLinks() {
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var col1 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = false;
    checkbox.type = 'radio';
    checkbox.id = 'radio'+i;
    checkbox.name = 'radio';
    // I love radio
    col0.appendChild(checkbox);
    col1.innerText = "shitpost_"+i;
    col1.style.whiteSpace = 'nowrap';
    col1.onClick = function() {
        checkbox.checked = !checkbox.checked;
    }
    row.appendChild(col0);
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}
function showImageSource() {
    if (visibleLinks.length > 0) {
      for (var i = visibleLinks.length - 1; i >= 0; i--) {
        if (document.getElementById('radio'+i).checked) {
            document.getElementById('imgSource').textContent = 'processing...';
            console.log(visibleLinks[i]);
            let image = new Image();
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            image.onload = function() {
                console.log("RUNNING OCRAD");
                var ocradText = OCRAD(image);
                console.log(ocradText);
                document.getElementById('imgSource').textContent = ocradText;
            }
            function onResponse() {
                var blob = new Blob([xhr.response], {type: 'image/jpeg'});
                var url = (window.URL || window.webkitURL).createObjectURL(blob);
                image.src = url;
            }
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener("load", onResponse);
            xhr.open('GET', visibleLinks[i]);
            xhr.send();
        }
      }
    }
}
// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.runtime.onMessage.addListener(function(links) {
  for (var index in links) {
    allLinks.push(links[index]);
  }
  visibleLinks = allLinks;
  showLinks();
});
// Set up event handlers and inject send_links.js into all frames in the active
// tab.
window.onload = function() {
  document.getElementById('download1').onclick = showImageSource;
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_links.js', allFrames: true});
    });
  });
};


document.addEventListener("scroll", setTimeout(showImageSource, 5000));
