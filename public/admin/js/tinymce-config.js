const { plugin } = require("mongoose");

tinymce.init({
  selector: 'textarea.textarea-mce',
  plugins: "image"
});