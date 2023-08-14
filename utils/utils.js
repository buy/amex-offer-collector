function getDate(text) {
  return text.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
}
