//TODO No clue why this does not catch errors
async function checkImage(url) {
  try{
    let req = await axios.get(url);
    console.log(req.status)
    return req.status == 200 && req.headers["content-type"].includes("image");
    // if(req.status == 200){
    //   return true;
    // } else{
    //   return false;
    // }
  } catch(e){
    console.log(e);
    return false;
  }
  
}

(async function ($) {
  var form = $("#gameform");
  var titleInput = $("#title");
  var descriptionInput = $("#description");
  var imageInput = $("#image");
  var error = $("#error");
  var addedGameElem = $("#addedgame");
  var imgerror = $("#imgerror");

  form.submit(async function (event) {
    event.preventDefault();
    title = titleInput.val();
    title = title.trim();
    description = descriptionInput.val();
    description = description.trim();
    image = imageInput.val();
    image = image.trim();
    alt = "/public/images/no_image.jpeg";

    
    let imbool = await checkImage(image);
    console.log(imbool)
    if (!image) {
      image = "/public/images/no_image.jpeg";
      imgerror.hide();
    } else if (!imbool) {
      imgerror.html("Image link not valid");
      imgerror.show();
      return;
    } else {
      imgerror.hide();
    }

    if (!title && !description) {
      error.html("Title Input and Description Input is missing");
      error.show();
    } else if (!description) {
      error.html("Description Input is missing");
      error.show();
    } else if (!title) {
      error.html("Title Input is missing");
      error.show();
    } else if (typeof description !== "string" || typeof title !== "string") {
      error.html("Inputs should be strings");
      error.show();
    } else {
      error.hide();
    }

    var requestConfig = {
      method: "POST",
      url: "/gamecatalog/gameform",
      contentType: "application/json",
      data: JSON.stringify({
        title: title,
        description: description,
        image: image,
      }),
    };
    $.ajax(requestConfig).then(function (res) {
      //Checking is reponse has an error
      if (res.error) {
        error.html(res.error);
        error.show();
      } else {
        var addedgametitle = res.addedgame.title;
        var addedgamedesc = res.addedgame.description;
        var addedgameimage = res.addedgame.image;
        const dt = `<dt> ${addedgametitle}  </dt>`;
        const dd = `<dd> Description: ${addedgamedesc}  </dd>`;
        const dd2 = `<dd>  <img src="${addedgameimage}"  width="300" 
        height="300"></img>  </dd>`;
        addedGameElem.append(dt);
        addedGameElem.append(dd);
        addedGameElem.append(dd2);
        addedGameElem.show();
        form[0].reset();
      }
    });
  });
})(window.jQuery);
