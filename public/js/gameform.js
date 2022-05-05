(function ($) {
  var form = $("#gameform");
  var titleInput = $("#title");
  var descriptionInput = $("#description");
  var error = $("#error");
  var addedGameElem = $("#addedgame");

  form.submit(function (event) {
    event.preventDefault();
    title = titleInput.val();
    title = title.trim();
    

    description = descriptionInput.val();
    description = description.trim();
    if (!title && !description) {
      error.html("Title Input and Description Input is missing")
      error.show();
    }
    else if (!description) {
      error.html("Description Input is missing")
      error.show();
    }
    else if(!title){
      error.html("Title Input is missing")
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
      }),
    };
    $.ajax(requestConfig).then(function (res) {
      //Checking is reponse has an error
      if(res.error){
        error.html(res.error);
        error.show();
      }else{
        var addedgametitle = res.addedgame.title;
        var addedgamedesc = res.addedgame.description;
        const dt = `<dt> ${addedgametitle}  </dt>`;
        const dd = `<dd> Description: ${addedgamedesc}  </dd>`;
        addedGameElem.append(dt);
        addedGameElem.append(dd);
        addedGameElem.show();
        form[0].reset();
      }
      });
  });
})(window.jQuery);
