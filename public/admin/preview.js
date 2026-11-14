/*
 * Live preview for the site editor. Each page's preview pane embeds
 * /edit-preview/ (pages/edit-preview.tsx), which renders the unsaved content
 * with the real page components and site styles. This script sends it the
 * content whenever a field changes. Loaded after decap-cms.js.
 */
(function () {
    var CMS = window.CMS;
    var h = window.h;
    var createClass = window.createClass;
    var ORIGIN = window.location.origin;
    var UPLOADS = '/images/uploads/';

    // Photos uploaded but not yet published only exist in the browser, so swap
    // their paths for the editor's temporary links.
    function resolveImages(value, getAsset) {
        if (typeof value === 'string') {
            if (value.indexOf(UPLOADS) !== 0) return value;
            var asset = getAsset(value);
            return asset ? String(asset) : value;
        }
        if (Array.isArray(value)) {
            return value.map(function (v) {
                return resolveImages(v, getAsset);
            });
        }
        if (value && typeof value === 'object') {
            var out = {};
            Object.keys(value).forEach(function (k) {
                out[k] = resolveImages(value[k], getAsset);
            });
            return out;
        }
        return value;
    }

    function pagePreview(page) {
        return createClass({
            componentDidMount: function () {
                var self = this;
                // The embedded page asks for content once it has loaded.
                this.onMessage = function (e) {
                    if (
                        e.data &&
                        e.data.type === 'pawblem-preview-ready' &&
                        self.frame &&
                        e.source === self.frame.contentWindow
                    ) {
                        self.send();
                    }
                };
                this.host = this.frame.ownerDocument.defaultView;
                this.host.addEventListener('message', this.onMessage);
            },
            componentDidUpdate: function () {
                this.send();
            },
            componentWillUnmount: function () {
                this.host.removeEventListener('message', this.onMessage);
            },
            send: function () {
                if (!this.frame || !this.frame.contentWindow) return;
                var data = this.props.entry.get('data');
                this.frame.contentWindow.postMessage(
                    {
                        type: 'pawblem-preview',
                        page: page,
                        data: resolveImages(
                            data ? data.toJS() : {},
                            this.props.getAsset
                        ),
                    },
                    ORIGIN
                );
            },
            render: function () {
                var self = this;
                return h('iframe', {
                    src: '/edit-preview/',
                    title: 'Preview',
                    ref: function (el) {
                        self.frame = el;
                    },
                    style: {
                        border: 0,
                        width: '100%',
                        height: '100vh',
                        display: 'block',
                    },
                });
            },
        });
    }

    CMS.registerPreviewStyle(
        'html, body { margin: 0; padding: 0; overflow: hidden; }',
        { raw: true }
    );
    [
        'home',
        'services',
        'rates',
        'about',
        'faq',
        'request',
        'closed-notice',
    ].forEach(function (page) {
        CMS.registerPreviewTemplate(page, pagePreview(page));
    });
})();
