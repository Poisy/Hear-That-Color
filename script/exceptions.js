// Handles exception on the Page


/** Check if the page is runned without a http[s] server and redirect user to
 * exception.html page*/
function CheckProtocol() {
    var protocol = window.location.protocol;

    if (!(protocol == "http:" || protocol == "https:")) {
        window.location.href = "./exception.html";
    }
}

CheckProtocol();