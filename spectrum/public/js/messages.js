function scrollDown() {
  var focusBottom = document.getElementById("adobewordpress");
  focusBottom.scrollTop = focusBottom.scrollHeight;
}

$("input").keypress(function(event) {
  if (event.which == 13) {
    event.preventDefault();
    $('form.chat input[type="submit"]').click();
  }
});
$('form.chat input[type="submit"]').click(function(event) {
  event.preventDefault();
  var message = $('form.chat input[type="text"]').val();
  if ($('form.chat input[type="text"]').val()) {
    var d = new Date();
    var clock = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var currentDate =
      (('' + day).length < 2 ? '0' : '') + day + '.' +
      (('' + month).length < 2 ? '0' : '') + month + '.' +
      d.getFullYear() + '&nbsp;&nbsp;' + clock;
    $('form.chat div.messages').append('<div class="message"><div class="myMessage"><p>' + message + '</p><date>' + currentDate + '</date></div></div>');
    setTimeout(function() {
      $('form.chat > span').addClass('spinner');
    }, 100);
    setTimeout(function() {
      $('form.chat > span').removeClass('spinner');
    }, 2000);
  }
  $('form.chat input[type="text"]').val('');
  scrollDown();
});

/* DEMO */
if(parent==top) {
  $('a.article').show();
}