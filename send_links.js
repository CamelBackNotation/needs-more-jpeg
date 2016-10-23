// The popup injects this script into all frames in the active tab.
var links = [].slice.apply(document.getElementsByClassName('_5pcr'));
var nulls = [];
var counter = 0;
links = links.map(function(element) {
  var src = element.children[0].getElementsByClassName('_4-eo')[0];
  if (src != null && src != []) {
      var fbShareBar = element.children[1].getElementsByClassName('_42nr')[0];
      if (fbShareBar.children.length < 4) {
          var a = document.createElement('span');
          var b = document.createElement('p');
          b.innerText = "shitpost_"+counter;
          a.appendChild(b);
          fbShareBar.appendChild(a);
          counter++;
      }
      else {
          var c = fbShareBar.children[3].getElementsByTagName('p')[0];
          c.innerText = "shitpost_"+counter;
          counter++;
      }
      return src.getElementsByTagName('img')[0].src;
  }
  return null;
});
links = links.filter(function(e) {
    return e !==null
});
chrome.runtime.sendMessage(links);
