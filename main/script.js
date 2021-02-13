$(document).ready(function () {

  $('#select').on('change', function () {
    var selectValor = $(this).val();
    $('#content').children('div').hide();
    if (document.getElementById(selectValor).style.display === 'none') {
      document.getElementById(selectValor).style.display = 'grid';
      document.getElementById('content').style.display = 'grid';
      $('#content').show();
    }
    else {
      document.getElementById(selectValor).style.display = 'none';
    }

  });


});

function setSrc(src) {
  document.getElementById('player').src=src;
  document.refresh();
}
function setSrc(src,leg) {
  document.getElementById('player').src=src;
  document.getElementById('legenda').src=leg;
  document.refresh();
}