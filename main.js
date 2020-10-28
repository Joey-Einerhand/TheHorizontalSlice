function handlePictures(objectInData) {
    let textToConcat = objectInData.name;
    textToConcat = textToConcat.concat(" ");
    return textToConcat;
}



$(document).ready(function(){
    // Only on desktop:
    // Set max height to the height of the window you can see so there's no vertical overflow, minus the scrollbar,
    // minus 16 px: by default, body has 8px margin on top and bottom. innerHeight doesnt account for these,
    // minus (16 + 1) px: one pixel added by rowContainer, don't know how to remove
    // If mobile: Set height to entire window, ignore bar

    let rowContainer = document.getElementById("rowContainer");
    if (screen.width >= 992){
        rowContainer.style.maxHeight = (window.innerHeight - 17) + "px";
    }
    else {
        rowContainer.style.maxHeight = window.innerHeight + "px";
    }

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

            // Append image to a row depending on the row provided in the image name
            if (pictureObject.name.includes("left")) {
                document.getElementById("left").appendChild(pictureElement);
            }
            else if (pictureObject.name.includes("right")) {
                document.getElementById("right").appendChild(pictureElement);
            }
            // If not left or right row, append to center. Should only be 1-3 elements max!
            else {
                document.getElementById("center").appendChild(pictureElement);
            }

        }
    });


});

