document.addEventListener('DOMContentLoaded', function () {


    // Initialize Bootstrap's collapse functionality for multiple submenus
    var submenuLinks = document.querySelectorAll('a[data-bs-toggle="collapse"]');

    submenuLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-bs-target');
            var targetCollapse = new bootstrap.Collapse(document.getElementById(targetId), {
                toggle: true
            });

            // Close all other submenus
            submenuLinks.forEach(function (otherLink) {
                if (otherLink !== link) {
                    var otherTargetId = otherLink.getAttribute('data-bs-target');
                    var otherCollapse = bootstrap.Collapse.getInstance(document.getElementById(otherTargetId));
                    if (otherCollapse) {
                        otherCollapse.hide();
                        otherLink.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle the arrow for the clicked submenu
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            var arrowIcon = this.querySelector('.arrow-icon');
            arrowIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        });
    });


});