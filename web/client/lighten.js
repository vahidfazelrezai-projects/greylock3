window.onload = function() {
    console.log("smh");
}

PARSE_URL = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

window.onclick = function(e){
    e.preventDefault();
    returnBase = function(parts) {
        ret = "";
        if (parts[1] !== undefined) {
            ret += parts[1] + ":" + parts[2];
        }
        ret += parts[3];
        if (parts[4] !== undefined) {
            ret += ':' + parts[4];
        } 
        return ret;
    }

    e = e || event;
    var link = findParent('a', e.target || e.srcElement);
    if (link){
        if (link.href.indexOf("#") > -1) {
            return;
        }

        e.preventDefault();
        base = window.location.hostname;

        // base is the current host of the servicce
        parts = PARSE_URL.exec(window.location.href);
        base = returnBase(parts);
        console.log("HI5");

        // currentHost is the base of the actual host
        targetLocation = parts[5];
        parts = PARSE_URL.exec(targetLocation);
        currentHost = returnBase(parts);

        // targetHost is the base of the target link
        parts = PARSE_URL.exec(link);
        targetHost = returnBase(parts);
        targetPath = parts[5];

        if (parts[6] !== undefined) {
            targetPath += "?" + parts[6];
        }
        if (parts[7] !== undefined) {
            targetPath += "#" + parts[7];
        }

        if (targetHost === base) {
            newLocation = base + "/" + currentHost + "/" + targetPath;
        } else {
            newLocation = base + "/" + link.href;
        }

        window.location.href = newLocation;
    }
}

//find first parent with tagName [tagname]
function findParent(tagname,el){
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()){
        return el;
    }
    while (el = el.parentNode){
        if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()){
            return el;
        }
    }
    return null;
}
