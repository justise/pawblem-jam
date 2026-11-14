/*
 * Adds a "Dashboard" link to the site editor's top bar (next to Contents and
 * Media) that opens the billing / client dashboard in a new tab. Decap has no
 * API for custom header links, so this copies an existing header link once
 * Decap has drawn the header. Selectors match Decap 3.17.3's emotion class
 * labels; recheck them when upgrading Decap.
 *
 * The dashboard is an Apps Script web app with access "Only myself", so it
 * only opens when signed in to Google as pawblemsolved@gmail.com. Its URL is
 * the Dashboard deployment's /exec URL (Sheet menu: Pawblem Solved → Open
 * dashboard link).
 */
(function () {
    var DASHBOARD_URL =
        'https://script.google.com/macros/s/AKfycbykHOXttG2FhUEs1cl-azYsNtXVW72lZfiiS41A15mvo1GOTAbp9t-uGyca6udGRmj6/exec';
    var MARK = 'data-pawblem-dashboard';

    function addLink() {
        var list = document.querySelector("ul[class*='AppHeaderNavList']");
        if (!list || list.querySelector('[' + MARK + ']')) return;
        var source = list.querySelector("a[class*='AppHeaderNavLink']");
        if (!source) return;

        var item = source.closest('li').cloneNode(true);
        var link = item.querySelector('a');
        link.setAttribute(MARK, '');
        link.className = source.className
            .split(' ')
            .filter(function (c) {
                return c !== 'header-link-active';
            })
            .join(' ');
        link.removeAttribute('aria-current');
        link.href = DASHBOARD_URL;
        link.target = '_blank';
        link.rel = 'noopener';
        // Keep the icon, swap the label.
        var label = Array.prototype.find.call(link.childNodes, function (n) {
            return n.nodeType === 3 && n.textContent.trim();
        });
        if (label) label.textContent = 'Dashboard';
        else link.appendChild(document.createTextNode('Dashboard'));
        // React Router would otherwise treat the click as in-app navigation.
        link.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        list.appendChild(item);
    }

    new MutationObserver(addLink).observe(document.body, {
        childList: true,
        subtree: true,
    });
    addLink();
})();
