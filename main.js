function jumpToSiteCenter() {
    jumpToImage(0);
}

// 0 is center; -1 .. -x is left, 1 .. x is right. everything is relative to center
function jumpToImage(imagePositionToJumpTo) {

    // getBoundingClientRect /2 gets the center of the view port, window.innerwidth /2 get the center of the website
    const centerImageMiddleX = (document.body.getBoundingClientRect().width / 2) - (window.innerWidth / 2);
    const imageWidth = document.getElementById('center').offsetWidth;

    // goto center of site + (width of an image * number of image to go to).
    // Ends up in the center of the image you want to go to
    let xToJumpTo = centerImageMiddleX + (imageWidth * imagePositionToJumpTo);
    window.scroll(xToJumpTo ,0);
}

// Get image to jump to from URL
function jumpToImageInURL() {
    let urlParams = getUrlParams();
    let imageToJumpTo = urlParams.get('image');
    jumpToImage(imageToJumpTo);
}

function getUrlParams() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    return urlParams;
}

function urlContainsImage() {
    let urlParams = getUrlParams();
    if (urlParams.has('image')) {
        return true
    }
    else { return false; }
}


function jumpToAdjacentImage(stringForwardsOrBackwards) {
    let nextImageCenterX;
    // get current image
    let currentImage = getImageClosestToViewportCenter();
    let currentImageCenterX = currentImage.x + (currentImage.offsetWidth / 2);
    // add the width of an image to the center coordinates of the current image
    // Goes to the center of the next image
    if (stringForwardsOrBackwards == "forwards") {
        nextImageCenterX = currentImageCenterX + currentImage.offsetWidth;
    }
    else if (stringForwardsOrBackwards == "backwards") {
        nextImageCenterX = currentImageCenterX - currentImage.offsetWidth;
    }
    else {
        console.log("Attempting to jump to invalid direction in jumpToAdjacentImage()");
        nextImageCenterX = 0;
    }

    // window.scroll scrolls the left edge of the screen to the given coordinate
    // By subtracting half of the screen width, we don't scroll the center of the target image to the left side of the
    // screen, but to the middle of the screen.
    let xToJumpTo = nextImageCenterX - (window.innerWidth / 2);
    window.scroll(xToJumpTo, 0);
}

function getImageClosestToViewportCenter() {
    // Get x of top left of screen
    let screenTopLeftX = document.body.getBoundingClientRect().x;
    let centerOfScreenX = (window.innerWidth / 2);
    let centerOfScreenY = (window.innerHeight / 2);
    return document.elementFromPoint(centerOfScreenX , centerOfScreenY);
}

function jumpToSiteExtremeEnd(stringStartOrEnd) {
    let xToJumpTo;
    if (stringStartOrEnd == "start") {
        xToJumpTo = 0;
    }
    else if (stringStartOrEnd == "end") {
        // Sets x to width of entire website. Results in jumping to end of website
        xToJumpTo = document.body.getBoundingClientRect().width;
    }
    else {
        console.log("Invalid site extreme end to jump to! Jumping to start");
        xToJumpTo = 0;
    }

    window.scroll(xToJumpTo, 0);
}



function getImagesFromGitHub() {
    // Get the three row elements
    const leftRow = document.getElementById("left");
    const centerRow = document.getElementById("center");
    const rightRow = document.getElementById("right");

    // Get the pictures and meta-info from github repo
    $.get("https://api.github.com/repositories/306748771/contents/images", function (data) {
        for (let picture in data) {
            // picture is a key. Get whole object at key in array
            let pictureObject = data[picture];

            // Creating element to display picture
            let pictureElement = document.createElement("IMG");
            pictureElement.classList.add("verticalSlice");
            pictureElement.setAttribute("src", pictureObject.download_url);

            let pictureContainerElement = document.createElement("DIV");
            pictureContainerElement.classList.add("pictureContainer");
            pictureContainerElement.appendChild(pictureElement);

            // Append image to a row depending on the row provided in the image name
            if (pictureObject.name.includes("left")) {
                document.getElementById("left").appendChild(pictureContainerElement);
            }
            else if (pictureObject.name.includes("right")) {
                document.getElementById("right").appendChild(pictureContainerElement);
            }
            // If not left or right row, append to center. Should only be one element!
            else {
                document.getElementById("center").appendChild(pictureContainerElement);
            }

        }
    });
}

// Resizes screen to fit content (PC needs to take horizontal scrollbar into account
function resizeScreenToFitContent() {
    // Only on desktop: Change height to fit with scrollbar
    // Set max height to the height of the window you can see so there's no vertical overflow, minus the scrollbar,
    // minus 16 px: by default, body has 8px margin on top and bottom. innerHeight doesnt account for these,
    // minus (16 + 1) px: one pixel added by rowContainer, don't know how to remove
    // If mobile: Set height to entire window, ignore bar

    let rowContainer = document.getElementById("rowContainer");
    if (screen.width >= 992){
        rowContainer.style.height = (window.innerHeight - 17) + "px";
    }
    else {
        rowContainer.style.height = window.innerHeight + "px";
    }
}

function initiateSiteButtons() {
    /// Button onclick function to go to center of website
    document.getElementById('gotoCenterImage').addEventListener('click', jumpToSiteCenter);

    // next and previous buttons
    document.getElementById('gotoNextImage').addEventListener('click', function () {
        jumpToAdjacentImage("forwards")
    });

    document.getElementById('gotoPreviousImage').addEventListener('click', function () {
        jumpToAdjacentImage("backwards")
    });

    // Go to an end of the site buttons
    document.getElementById('gotoFirstImage').addEventListener('click', function () {
        jumpToSiteExtremeEnd("start");
    });

    document.getElementById('gotoLastImage').addEventListener('click', function () {
        jumpToSiteExtremeEnd("end");
    });
}

function jumpToCenterOrImageInURL() {
    // Jump to center of website content.
    // Delay is neccesary; on page refresh, browsers tend to reset the scroll bar to the top of the page.
    // This resets any scrolling we try to do before the browser is finished.

    //setTimeout(jumpToSiteCenter, 300);

    if (urlContainsImage()) {
        setTimeout(jumpToImageInURL, 300);
    }
    else {
        setTimeout(jumpToSiteCenter, 300);
    }

}

// Main function
$(document).ready(function(){

    resizeScreenToFitContent();
    getImagesFromGitHub();
    initiateSiteButtons();
    jumpToCenterOrImageInURL();

});

