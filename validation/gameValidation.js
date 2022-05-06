const axios = require("axios");


const checkImage = async function checkImage(url) {
    try{
      let req = await axios.head(url);
      console.log(req.status)
      return req.status == 200 && req.headers["content-type"].includes("image");
    } catch(e){
      console.log(e);
      return false;
    }
    
  }

const checkTitle = async function checkTitle(title){
    if (!title) {
        throw "Title not provided";
      }
    
      if (typeof title !== "string") {
        throw "Description not string";
      }
    
      title = title.trim();
    
      if (title.length <= 0) {
        throw "Description Cannot be an empty string";
      }
}

const checkDescription = async function checkDescription(description){
    if (!description) {
        throw "Description not provided";
      }
    
      if (typeof description !== "string") {
        throw "Description not string";
      }
    
      description = description.trim();
    
      if (description.length <= 0) {
        throw "Description cannot be an empty string";
      }
}