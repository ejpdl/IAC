document.addEventListener('DOMContentLoaded', function () {
  var sidebarCollapse = document.getElementById('sidebarCollapse');
  var sidebar = document.getElementById('sidebar');

  sidebarCollapse.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });

});