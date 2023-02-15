
document.addEventListener('DOMContentLoaded',  () => {
  var current = location.pathname.split('/')[1];
    if (current === "") return;
    var menuItems = document.querySelectorAll('nav a');
    for (var i = 0, len = menuItems.length; i < len; i++) {
        if (menuItems[i].getAttribute("href").indexOf(current) !== -1) {
            menuItems[i].className += "is-active";
        }
    }
});


function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}



