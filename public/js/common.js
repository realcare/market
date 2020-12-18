function changeHref(router) {
  location.href = router;
}

function openWindowPop(url, name) {
  setTimeout(() => {
    window.location.reload();
  }, 1000);

  var options =
    'top=10, left=10, width=360, height=600, status=no, menubar=no, toolbar=no, resizable=no';
  window.open(url, name, options);
}

function windowClose() {
  self.close();
}
