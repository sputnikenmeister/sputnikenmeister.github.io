!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s;
}({
    1: [ function(require, module, exports) {
        !function(global, undefined) {
            "use strict";
            var factory = function(window) {
                if ("object" != typeof window.document) throw new Error("Cookies.js requires a `window` with a `document` object");
                var Cookies = function(key, value, options) {
                    return 1 === arguments.length ? Cookies.get(key) : Cookies.set(key, value, options);
                };
                return Cookies._document = window.document, Cookies._cacheKeyPrefix = "cookey.", 
                Cookies.defaults = {
                    path: "/",
                    secure: !1
                }, Cookies.get = function(key) {
                    return Cookies._cachedDocumentCookie !== Cookies._document.cookie && Cookies._renewCache(), 
                    Cookies._cache[Cookies._cacheKeyPrefix + key];
                }, Cookies.set = function(key, value, options) {
                    return options = Cookies._getExtendedOptions(options), options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires), 
                    Cookies._document.cookie = Cookies._generateCookieString(key, value, options), Cookies;
                }, Cookies.expire = function(key, options) {
                    return Cookies.set(key, undefined, options);
                }, Cookies._getExtendedOptions = function(options) {
                    return {
                        path: options && options.path || Cookies.defaults.path,
                        domain: options && options.domain || Cookies.defaults.domain,
                        expires: options && options.expires || Cookies.defaults.expires,
                        secure: options && options.secure !== undefined ? options.secure : Cookies.defaults.secure
                    };
                }, Cookies._isValidDate = function(date) {
                    return "[object Date]" === Object.prototype.toString.call(date) && !isNaN(date.getTime());
                }, Cookies._getExpiresDate = function(expires, now) {
                    switch (now = now || new Date(), typeof expires) {
                      case "number":
                        expires = new Date(now.getTime() + 1e3 * expires);
                        break;

                      case "string":
                        expires = new Date(expires);
                    }
                    if (expires && !Cookies._isValidDate(expires)) throw new Error("`expires` parameter cannot be converted to a valid Date instance");
                    return expires;
                }, Cookies._generateCookieString = function(key, value, options) {
                    key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent), key = key.replace(/\(/g, "%28").replace(/\)/g, "%29"), 
                    value = (value + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent), options = options || {};
                    var cookieString = key + "=" + value;
                    return cookieString += options.path ? ";path=" + options.path : "", cookieString += options.domain ? ";domain=" + options.domain : "", 
                    cookieString += options.expires ? ";expires=" + options.expires.toUTCString() : "", 
                    cookieString += options.secure ? ";secure" : "";
                }, Cookies._getCacheFromString = function(documentCookie) {
                    for (var cookieCache = {}, cookiesArray = documentCookie ? documentCookie.split("; ") : [], i = 0; i < cookiesArray.length; i++) {
                        var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);
                        cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined && (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value);
                    }
                    return cookieCache;
                }, Cookies._getKeyValuePairFromCookieString = function(cookieString) {
                    var separatorIndex = cookieString.indexOf("=");
                    return separatorIndex = 0 > separatorIndex ? cookieString.length : separatorIndex, 
                    {
                        key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
                        value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
                    };
                }, Cookies._renewCache = function() {
                    Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie), Cookies._cachedDocumentCookie = Cookies._document.cookie;
                }, Cookies._areEnabled = function() {
                    var testKey = "cookies.js", areEnabled = "1" === Cookies.set(testKey, 1).get(testKey);
                    return Cookies.expire(testKey), areEnabled;
                }, Cookies.enabled = Cookies._areEnabled(), Cookies;
            }, cookiesExport = "object" == typeof global.document ? factory(global) : factory;
            "function" == typeof define && define.amd ? define(function() {
                return cookiesExport;
            }) : "object" == typeof exports ? ("object" == typeof module && "object" == typeof module.exports && (exports = module.exports = cookiesExport), 
            exports.Cookies = cookiesExport) : global.Cookies = cookiesExport;
        }("undefined" == typeof window ? this : window);
    }, {} ],
    2: [ function(require) {
        var _ = require("underscore"), $ = require("jquery"), Backbone = require("backbone");
        window.jQuery = Backbone.$ = $, require("hammerjs"), require("jquery.transit"), 
        require("jquery-color"), require("backbone.babysitter"), require("Backbone.Mutators"), 
        $(document).ready(function() {
            "use strict";
            var AppView = require("./view/AppView");
            !function() {
                var typeList = require("./model/collection/TypeList"), keywordList = require("./model/collection/KeywordList"), bundleList = require("./model/collection/BundleList");
                if (window.bootstrap) {
                    var types, keywords, bundles, images;
                    types = window.bootstrap["types-all"], keywords = window.bootstrap["keywords-all"], 
                    bundles = window.bootstrap["bundles-all"], images = window.bootstrap["images-all"];
                    var imagesByBundle = _.groupBy(images, "bId");
                    _.each(bundles, function(bo, bi) {
                        bo.tIds = [], bo.images = imagesByBundle[bo.id], _.each(keywords, function(ko) {
                            0 === bi && (ko.bIds = []), _.contains(bo.kIds, ko.id) && (ko.bIds.push(bo.id), 
                            _.contains(bo.tIds, ko.tId) || bo.tIds.push(ko.tId));
                        });
                    }), typeList.reset(types), keywordList.reset(keywords), bundleList.reset(bundles), 
                    delete window.bootstrap;
                }
            }(), window.app = new AppView();
        });
    }, {
        "./model/collection/BundleList": 8,
        "./model/collection/KeywordList": 9,
        "./model/collection/TypeList": 10,
        "./view/AppView": 21,
        "Backbone.Mutators": "Backbone.Mutators",
        backbone: "backbone",
        "backbone.babysitter": "backbone.babysitter",
        hammerjs: "hammerjs",
        jquery: "jquery",
        "jquery-color": "jquery-color",
        "jquery.transit": "jquery.transit",
        underscore: "underscore"
    } ],
    3: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), $ = Backbone.$, Color = $.Color, Styles = ($.Deferred, 
        require("../utils/Styles")), traceArgs = require("../utils/debug/traceArgs"), stripTags = require("../utils/strings/stripTags"), bundles = (require("../model/collection/TypeList"), 
        require("../model/collection/KeywordList"), require("../model/collection/BundleList")), Controller = Backbone.Router.extend({
            routes: {
                "bundles/:bundleHandle(/:imageIndex)": "toBundleItem",
                bundles: "toBundleList",
                "": function() {
                    this.navigate("bundles", {
                        trigger: !0,
                        replace: !0
                    });
                }
            },
            initialize: function() {
                this.listenToOnce(bundles, "all", this.routeInitialized);
                var bundleTracer = traceArgs("Bundles 	", "info"), imageTracer = traceArgs("Images  	", "info"), routeTracer = traceArgs("Router  	", "info"), appTracer = traceArgs("App     	", "info");
                this.listenTo(this, "route", routeTracer), this.listenTo(Backbone, "all", appTracer), 
                this.listenTo(bundles, {
                    all: bundleTracer,
                    "select:one": function(bundle) {
                        this.listenTo(bundle.get("images"), "all", imageTracer);
                    },
                    "deselect:one": function(bundle) {
                        this.stopListening(bundle.get("images"), "all", imageTracer);
                    }
                });
            },
            selectImage: function(image) {
                var bundle = image.get("bundle");
                this._changeSelection(bundle, image), this._updateLocation();
            },
            deselectImage: function() {
                var bundle = bundles.selected;
                this._changeSelection(bundle), this._updateLocation();
            },
            selectBundle: function(bundle) {
                this._changeSelection(bundle), this._updateLocation();
            },
            deselectBundle: function() {
                this._changeSelection(), this._updateLocation();
            },
            _updateLocation: function() {
                var bundle, imageIndex, location;
                location = "bundles", bundle = bundles.selected, bundle && (location += "/" + bundle.get("handle"), 
                imageIndex = bundle.get("images").selectedIndex, imageIndex >= 0 && (location += "/" + imageIndex)), 
                this.navigate(location, {
                    trigger: !1
                });
            },
            toBundleItem: function(bundleHandle, imageIndex) {
                var bundle, image;
                if (bundle = bundles.findWhere({
                    handle: bundleHandle
                }), !bundle) throw new Error('Cannot find bundle with handle "' + bundleHandle + '"');
                if (imageIndex && (image = bundle.get("images").at(imageIndex), !image)) throw new Error("No image at index " + imageIndex + ' bundle with handle "' + bundleHandle + '"');
                this._changeSelection(bundle, image);
            },
            toBundleList: function() {
                this._changeSelection();
            },
            _changeSelection: function(bundle, image) {
                _.isUndefined(bundle) ? (bundles.selected && bundles.selected.get("images").deselect(), 
                bundles.deselect()) : (bundles.select(bundle), _.isUndefined(image) ? bundle.get("images").deselect() : bundle.get("images").select(image));
            },
            _onBundleSelectOne: function(bundle) {
                document.title = "Portfolio – " + stripTags(bundle.get("name"));
            },
            _onBundleSelectNone: function() {
                document.title = "Portfolio";
            },
            routeInitialized: function() {
                this.initializeBrowserTitle(), this.initializeBundleStyles(), this.inilializeHandlers3();
            },
            inilializeHandlers: function() {
                var $body = Backbone.$("body"), handlers = {
                    "select:one": function() {
                        $body.removeClass("bundle-list").addClass("bundle-item");
                    },
                    "select:none": function() {
                        $body.removeClass("bundle-item").addClass("bundle-list");
                    }
                };
                this.listenTo(bundles, handlers), bundles.selected ? handlers["select:one"].call(this, bundles.selected) : handlers["select:none"].call(this);
            },
            inilializeHandlers2: function() {
                var $body = Backbone.$("body"), lastBundle = null, lastImage = null, handlers = {};
                handlers.image = {
                    "select:one": function(image) {
                        null === lastImage && ($body.removeClass("image-list"), $body.addClass("image-item")), 
                        lastImage = image;
                    },
                    "select:none": function() {
                        lastImage && $body.removeClass("image-item"), $body.addClass("image-list"), lastImage = null;
                    }
                }, handlers.bundle = {
                    "select:one": function(bundle) {
                        var images = bundle.get("images");
                        lastBundle ? this.stopListening(lastBundle.get("images"), handlers.image) : $body.removeClass("bundle-list").addClass("bundle-item"), 
                        this.listenTo(images, handlers.image), images.selected ? handlers.image["select:one"].call(this, images.selected) : handlers.image["select:none"].call(this), 
                        lastBundle = bundle;
                    },
                    "select:none": function() {
                        lastBundle && this.stopListening(lastBundle.get("images"), handlers.image), $body.removeClass("bundle-item").addClass("bundle-list"), 
                        lastBundle = null;
                    }
                }, this.listenTo(bundles, handlers.bundle), bundles.selected ? handlers.bundle["select:one"].call(this, bundles.selected) : handlers.bundle["select:none"].call(this);
            },
            inilializeHandlers3: function() {
                var withBundle, withoutBundle, withImage, withoutImage, toClassName = function(prefix, val) {
                    return (val ? "with-" : "without-") + prefix;
                }, $body = Backbone.$("body"), images = null;
                withImage = function() {
                    $body.removeClass(toClassName("image", !1)).addClass(toClassName("image", !0)), 
                    this.listenToOnce(images, "select:none", withoutImage);
                }, withoutImage = function() {
                    $body.removeClass(toClassName("image", !0)).addClass(toClassName("image", !1)), 
                    this.listenToOnce(images, "select:one", withImage);
                }, withBundle = function() {
                    $body.removeClass(toClassName("bundle", !1)).addClass(toClassName("bundle", !0)), 
                    this.listenToOnce(bundles, "select:none", withoutBundle);
                }, withoutBundle = function() {
                    $body.removeClass(toClassName("bundle", !0)).addClass(toClassName("bundle", !1)), 
                    this.listenToOnce(bundles, "select:one", withBundle);
                };
                var bundleHandlers = {
                    "select:one": function(bundle) {
                        images = bundle.get("images"), (images.selected ? withImage : withoutImage).call(this);
                    },
                    "deselect:one": function(bundle) {
                        images = bundle.get("images"), this.stopListening(images, "select:none", withoutImage), 
                        this.stopListening(images, "select:one", withImage), images = null;
                    }
                };
                this.listenTo(bundles, bundleHandlers), bundles.selected ? (withBundle.call(this), 
                images = bundles.selected.get("images"), images.selected ? withImage.call(this) : withoutImage.call(this)) : withoutBundle.call(this);
            },
            initializeBrowserTitle: function() {
                var handlers = {
                    "select:one": function(bundle) {
                        document.title = "Portfolio – " + stripTags(bundle.get("name"));
                    },
                    "select:none": function() {
                        document.title = "Portfolio";
                    }
                };
                this.listenTo(bundles, handlers), bundles.selected ? handlers["select:one"].call(this, bundles.selected) : handlers["select:none"].call(this);
            },
            initializeBundleStyles: function() {
                var fgColor, bgColor, bgLum, fgLum, bgDefault, fgDefault, attrs, styles, toBodyClass = function(bundle) {
                    return "bundle-" + bundle.id;
                };
                bgDefault = Styles.getCSSProperty("body", "background-color"), fgDefault = Styles.getCSSProperty("body", "color"), 
                bundles.each(function(bundle) {
                    attrs = bundle.get("attrs"), bodySelector = "body." + toBodyClass(bundle), carouselSelector = ".carousel." + bundle.get("handle"), 
                    bgColor = new Color(attrs["background-color"] || bgDefault), fgColor = new Color(attrs.color || fgDefault), 
                    bgLum = bgColor.lightness(), fgLum = fgColor.lightness(), styles = _.pick(attrs, [ "background-color", "background", "color" ]), 
                    styles["-webkit-font-smoothing"] = fgLum > bgLum ? "antialiased" : "auto", Styles.createCSSRule(bodySelector, styles), 
                    styles = {
                        "border-color": fgColor.lightness(.3 * fgLum + .7 * bgLum).toHexString(),
                        color: fgColor.lightness(.5 * fgLum + .5 * bgLum).toHexString()
                    }, Styles.createCSSRule(bodySelector + " .mutable-faded", styles), styles = _.pick(attrs, [ "box-shadow", "border", "border-radius", "background-color" ]), 
                    Styles.createCSSRule(carouselSelector + " > .image-item img", styles), styles = {
                        "background-color": bgColor.lightness(.075 * fgLum + .925 * bgLum).toHexString(),
                        "border-color": bgColor.lightness(.125 * fgLum + .875 * bgLum).toHexString(),
                        color: bgColor.lightness(.05 * fgLum + .95 * bgLum).toHexString()
                    }, Styles.createCSSRule(carouselSelector + " > .image-item .placeholder", styles);
                });
                var $body = Backbone.$("body"), handlers = {
                    "deselect:one": function(bundle) {
                        $body.removeClass(toBodyClass(bundle));
                    },
                    "select:one": function(bundle) {
                        $body.addClass(toBodyClass(bundle));
                    }
                };
                this.listenTo(bundles, handlers), bundles.selected && handlers["select:one"].call(this, bundles.selected);
            }
        });
        module.exports = new Controller();
    }, {
        "../model/collection/BundleList": 8,
        "../model/collection/KeywordList": 9,
        "../model/collection/TypeList": 10,
        "../utils/Styles": 15,
        "../utils/debug/traceArgs": 16,
        "../utils/strings/stripTags": 20,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    4: [ function(require, module) {
        var txDuration = .35, txDelayInterval = .033;
        module.exports = {
            TRANSITION_DURATION: 1e3 * txDuration,
            TRANSITION_DELAY_INTERVAL: 1e3 * txDelayInterval,
            TRANSITION_DELAY: 1e3 * (txDuration + txDelayInterval),
            HORIZONTAL_STEP: 20,
            APP_ROOT: window.approot
        };
    }, {} ],
    5: [ function(require, module) {
        var _ = require("underscore"), View = (require("backbone"), require("./View")), DeferredRenderView = View.extend({
            constructor: function() {
                _.bindAll(this, "applyRender"), View.apply(this, arguments);
            },
            requestRender: function(key, value) {
                _.isUndefined(this._renderRequestId) && (this._renderRequestId = window.requestAnimationFrame(this.applyRender), 
                this._renderJobs = {}), key && (this._renderJobs[key] = value ? value : !0);
            },
            renderNow: function() {
                _.isNumber(this._renderRequestId) && window.cancelAnimationFrame(this._renderRequestId), 
                this.applyRender();
            },
            validateRender: function(key) {
                _.isFunction(this._renderJobs[key]) && (this._renderJobs[key].call(), delete this._renderJobs[key]);
            },
            applyRender: function() {
                this.renderLater(), delete this._renderRequestId;
            },
            renderLater: function() {}
        });
        module.exports = DeferredRenderView;
    }, {
        "./View": 7,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    6: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), SelectableList = Backbone.Collection.extend({
            initialize: function(models, options) {
                options = _.defaults({}, options, {
                    initialSelection: "none",
                    silentInitial: !0
                }), this.initialSelection = options.initialSelection, this.initialOptions = {
                    silent: options.silentInitial
                };
            },
            reset: function(models) {
                this.deselect(this.initialOptions), Backbone.Collection.prototype.reset.apply(this, arguments), 
                "first" == this.initialSelection && this.length && this.select(models[0], this.initialOptions);
            },
            select: function(newModel, options) {
                if (this.selected !== newModel) {
                    var oldModel = this.selected, triggerEvents = !(options && options.silent);
                    oldModel && (_.isFunction(oldModel.deselect) ? oldModel.deselect(options) : triggerEvents && (oldModel.selected = void 0, 
                    oldModel.trigger("deselected")), triggerEvents && this.trigger("deselect:one", oldModel)), 
                    this.selected = newModel, this.selectedIndex = this.indexOf(newModel), newModel ? (_.isFunction(newModel.select) ? newModel.select(options) : triggerEvents && (newModel.selected = !0, 
                    newModel.trigger("selected")), triggerEvents && this.trigger("select:one", newModel)) : triggerEvents && this.trigger("select:none", newModel);
                }
            },
            deselect: function(options) {
                this.select(null, options);
            },
            selectAt: function(index, options) {
                (0 > index || index >= this.length) && new RangeError("index is out of bounds"), 
                this.select(this.at(index), options);
            },
            hasFollowing: function(model) {
                return model || (model = this.selected), this.indexOf(model) < this.length - 1;
            },
            following: function(model) {
                return model || (model = this.selected), this.hasFollowing(model) ? this.at(this.indexOf(model) + 1) : null;
            },
            followingOrFirst: function(model) {
                return model || (model = this.selected), this.at((this.indexOf(model) + 1) % this.length);
            },
            hasPreceding: function(model) {
                return model || (model = this.selected), this.indexOf(model) > 0;
            },
            preceding: function(model) {
                return model || (model = this.selected), this.hasPreceding(model) ? this.at(this.indexOf(model) - 1) : null;
            },
            precedingOrLast: function(model) {
                model || (model = this.selected);
                var index = this.indexOf(model) - 1;
                return this.at(index > -1 ? index : this.length - 1);
            }
        });
        module.exports = SelectableList;
    }, {
        backbone: "backbone",
        underscore: "underscore"
    } ],
    7: [ function(require, module) {
        var Backbone = require("backbone"), _ = require("underscore"), _viewsByCid = {}, View = Backbone.View.extend({
            constructor: function(options) {
                options && options.className && this.className && (options.className += " " + _.result(this, "className")), 
                Backbone.View.apply(this, arguments), _viewsByCid[this.cid] = this;
            },
            remove: function() {
                return this.trigger("view:remove", this), delete _viewsByCid[this.cid], Backbone.View.prototype.remove.apply(this, arguments);
            },
            setElement: function() {
                return this.el ? (Backbone.View.prototype.setElement.apply(this, arguments), this.$el.addClass(_.result(this, "className"))) : Backbone.View.prototype.setElement.apply(this, arguments), 
                this;
            }
        }, {
            findByElement: function(element) {
                for (var cid in _viewsByCid) if (_viewsByCid[cid].el === element) return _viewsByCid[cid];
                return void 0;
            }
        });
        module.exports = View;
    }, {
        backbone: "backbone",
        underscore: "underscore"
    } ],
    8: [ function(require, module) {
        var SelectableList = require("../../helper/SelectableList"), BundleItem = require("../item/BundleItem"), BundleList = SelectableList.extend({
            model: BundleItem,
            url: "/json/bundles/"
        });
        module.exports = new BundleList(void 0, {
            comparator: "completed"
        });
    }, {
        "../../helper/SelectableList": 6,
        "../item/BundleItem": 11
    } ],
    9: [ function(require, module) {
        var SelectableList = require("../../helper/SelectableList"), KeywordItem = require("../item/KeywordItem"), KeywordList = SelectableList.extend({
            model: KeywordItem
        });
        module.exports = new KeywordList();
    }, {
        "../../helper/SelectableList": 6,
        "../item/KeywordItem": 13
    } ],
    10: [ function(require, module) {
        var Backbone = require("backbone"), TypeItem = require("../item/TypeItem"), TypeList = Backbone.Collection.extend({
            model: TypeItem
        });
        module.exports = new TypeList();
    }, {
        "../item/TypeItem": 14,
        backbone: "backbone"
    } ],
    11: [ function(require, module) {
        var Backbone = require("backbone"), _ = require("underscore"), stripTags = require("../../utils/strings/stripTags"), parseSymAttrs = require("../../utils/strings/parseSymAttrs"), SelectableList = require("../../helper/SelectableList"), ImageItem = require("../item/ImageItem");
        module.exports = Backbone.Model.extend({
            defaults: {
                name: "",
                handle: "",
                desc: "",
                completed: 0,
                attrs: {},
                kIds: [],
                excluded: !1
            },
            mutators: {
                text: function() {
                    return stripTags(this.get("desc"));
                },
                images: {
                    set: function(key, value, options, set) {
                        _.each(value, function(o) {
                            o.bundle = this;
                        }, this), set(key, new SelectableList(value, {
                            model: ImageItem,
                            comparator: "o"
                        }), options);
                    }
                },
                attrs: {
                    set: function(key, value, options, set) {
                        if (_.isArray(value)) {
                            var attrs = {};
                            _.each(value, function(s) {
                                var i = s.indexOf(":");
                                i > 0 && (attrs[s.substring(0, i)] = parseSymAttrs(s.substring(i + 1)));
                            }), set(key, attrs, options);
                        } else set(key, value, options);
                    }
                }
            },
            initialize: function() {},
            parse: function(resp) {
                return resp;
            },
            selector: function() {
                return "#" + this.domId();
            },
            domId: function() {
                return "b" + this.id;
            },
            toString: function() {
                return this.id;
            }
        });
    }, {
        "../../helper/SelectableList": 6,
        "../../utils/strings/parseSymAttrs": 19,
        "../../utils/strings/stripTags": 20,
        "../item/ImageItem": 12,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    12: [ function(require, module) {
        {
            var Backbone = require("backbone"), _ = require("underscore"), stripTags = require("../../utils/strings/stripTags"), parseSymAttrs = require("../../utils/strings/parseSymAttrs"), imageUrlTemplates = {
                original: _.template(window.approot + "workspace/uploads/<%= f %>"),
                "constrain-width": _.template(window.approot + "image/1/<%= width %>/0/uploads/<%= f %>"),
                "constrain-height": _.template(window.approot + "image/1/0/<%= height %>/uploads/<%= f %>")
            };
            _.template("i<%= id %>-caption");
        }
        module.exports = Backbone.Model.extend({
            defaults: {
                bId: 0,
                o: 0,
                f: "",
                w: 0,
                h: 0,
                desc: "<p><em>No description</em></p>",
                attrs: []
            },
            mutators: {
                name: function() {
                    return this.get("text") || this.get("f");
                },
                handle: function() {
                    return this.get("f");
                },
                text: function() {
                    return stripTags(this.get("desc"));
                },
                attrs: {
                    set: function(key, value, options, set) {
                        if (_.isArray(value)) {
                            var attrs = {};
                            _.each(value, function(attr) {
                                var idx = attr.indexOf(":");
                                idx > 0 ? attrs[attr.substring(0, idx)] = parseSymAttrs(attr.substring(idx + 1)) : attrs[attr] = "";
                            }), set(key, attrs, options);
                        } else set(key, value, options);
                    }
                }
            },
            initialize: function() {
                _.once(_.bind(this.getImageUrl, this)), _.once(_.bind(this.selector, this));
            },
            getImageUrl: function() {
                return imageUrlTemplates.original(this.attributes);
            },
            selector: function() {
                return "#" + this.domId();
            },
            domId: function() {
                return "i" + this.id;
            },
            toString: function() {
                return this.id;
            }
        });
    }, {
        "../../utils/strings/parseSymAttrs": 19,
        "../../utils/strings/stripTags": 20,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    13: [ function(require, module) {
        var Backbone = require("backbone");
        module.exports = Backbone.Model.extend({
            defaults: {
                name: "",
                handle: "",
                attrs: [],
                tId: 0,
                excluded: !1
            },
            selector: function() {
                return "#" + this.domId();
            },
            domId: function() {
                return "k" + this.id;
            },
            toString: function() {
                return this.id;
            }
        });
    }, {
        backbone: "backbone"
    } ],
    14: [ function(require, module) {
        var Backbone = require("backbone");
        module.exports = Backbone.Model.extend({
            defaults: {
                name: "",
                handle: "",
                attrs: [],
                excluded: !1
            },
            selector: function() {
                return "#" + this.domId();
            },
            domId: function() {
                return "t" + this.id;
            },
            toString: function() {
                return this.id;
            }
        });
    }, {
        backbone: "backbone"
    } ],
    15: [ function(require, module) {
        var jQuery = require("jquery"), _ = require("underscore"), _rules = {}, _aliases = {}, _initialValues = {}, refreshCSSRule = function(selector) {
            _.isEmpty(selector) || (_aliases.hasOwnProperty(selector) && (selector = _aliases[selector]), 
            _rules[selector] = _.findWhere(document.styleSheets[0].cssRules, {
                selectorText: selector
            }));
        }, getCSSRule = function(selector) {
            return _.isEmpty(selector) ? void 0 : (_aliases.hasOwnProperty(selector) && (selector = _aliases[selector]), 
            _rules.hasOwnProperty(selector) || (_rules[selector] = _.findWhere(document.styleSheets[0].cssRules, {
                selectorText: selector
            })), _rules[selector]);
        }, getCSSProperty = function(selector, propName) {
            try {
                return getCSSRule(selector).style[jQuery.camelCase(propName)];
            } catch (e) {
                return "";
            }
        }, setCSSProperty = function(selector, propName, value) {
            var name = jQuery.camelCase(propName), key = selector + "$$" + propName, rule = getCSSRule(selector);
            _initialValues.hasOwnProperty(key) || (_initialValues[key] = rule.style[name]), 
            rule.style[name] = _.isEmpty(value) ? _initialValues[key] : value;
        }, createCSSRule = function(selector, style) {
            var cssText = "";
            for (var prop in style) cssText += prop + ":" + style[prop] + ";";
            var sheet = document.styleSheets[0];
            sheet.insertRule(selector + "{" + cssText + "}", sheet.cssRules.length);
        };
        module.exports = {
            getCSSRule: getCSSRule,
            createCSSRule: createCSSRule,
            getCSSProperty: getCSSProperty,
            setCSSProperty: setCSSProperty,
            refreshCSSRule: refreshCSSRule
        };
    }, {
        jquery: "jquery",
        underscore: "underscore"
    } ],
    16: [ function(require, module) {
        module.exports = function(label, level) {
            switch (level) {
              case "error":
                return function() {
                    console.error(label, arguments);
                };

              case "warn":
                return function() {
                    console.warn(label, arguments);
                };

              case "info":
                return function() {
                    console.info(label, arguments);
                };

              default:
                return function() {
                    console.log(label, arguments);
                };
            }
        };
    }, {} ],
    17: [ function(require, module) {
        var _ = require("underscore"), Deferred = require("jquery").Deferred;
        module.exports = function(image, url, context) {
            var deferred = new Deferred();
            return context || (context = image), image.onload = function(ev) {
                deferred.notifyWith(context, [ 1, image ]), deferred.resolveWith(context, [ url, image, ev ]);
            }, image.onerror = function(ev) {
                deferred.rejectWith(context, [ Error("Error ocurred while loading image from " + url), image, ev ]);
            }, image.onabort = function(ev) {
                deferred.rejectWith(context, [ "Aborted loading image from " + url, image, ev ]);
            }, deferred.always(function() {
                image.onload = image.onerror = image.onabort = void 0;
            }), _.defer(function() {
                image.src = url, deferred.notifyWith(context, [ 0, image ]);
            }), deferred.promise();
        };
    }, {
        jquery: "jquery",
        underscore: "underscore"
    } ],
    18: [ function(require, module) {
        var Deferred = require("jquery").Deferred;
        module.exports = function(url) {
            var deferred = new Deferred(), request = new XMLHttpRequest();
            return request.open("GET", url, !0), request.responseType = "arraybuffer", request.onload = function(ev) {
                200 == request.status ? deferred.resolve(window.URL.createObjectURL(new Blob([ request.response ])), request, ev) : deferred.reject(Error("Image didn't load successfully; error code:" + request.statusText), request, ev);
            }, request.onerror = function(ev) {
                deferred.reject(Error("There was a network error."), request, ev);
            }, request.onprogress = function(ev) {
                deferred.notify(ev.loaded / ev.total, request, ev);
            }, request.onabort = request.ontimeout = request.onerror, request.onloadstart = request.onloadend = request.onprogress, 
            _.defer(_.bind(request.send, request)), deferred.promise();
        };
    }, {
        jquery: "jquery"
    } ],
    19: [ function(require, module) {
        module.exports = function(s) {
            return s.replace(/(\,|\;)/g, function(m) {
                return "," == m ? ";" : ",";
            });
        };
    }, {} ],
    20: [ function(require, module) {
        module.exports = function(s) {
            return s.replace(/<[^>]+>/g, "");
        };
    }, {} ],
    21: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), NavigationView = require("./NavigationView"), ContentView = require("./ContentView"), FooterView = require("./FooterView"), bundles = require("../model/collection/BundleList"), AppView = (require("../control/Controller"), 
        Backbone.View.extend({
            el: "body",
            initialize: function() {
                this.navigationView = new NavigationView({
                    el: "#navigation"
                }), this.contentView = new ContentView({
                    el: "#content"
                }), this.footerView = new FooterView({
                    el: "#footer"
                }), this.debugToolbar = new DebugToolbar({
                    el: "#debug-toolbar"
                }), Backbone.history.start({
                    pushState: !1,
                    hashChange: !0
                }), this.navigationView.render();
                var $body = this.$el, onViewportResize = function() {
                    $body.addClass("skip-transitions"), _.defer(function() {
                        $body.removeClass("skip-transitions");
                    });
                };
                Backbone.$(window).on("orientationchange resize", onViewportResize);
                var afterInitialize = function() {
                    $body.removeClass("app-initial").addClass("app-ready");
                };
                _.defer(afterInitialize);
            }
        }));
        module.exports = AppView;
        var Cookies = require("cookies-js"), DebugToolbar = Backbone.View.extend({
            initialize: function() {
                Cookies.defaults = {
                    domain: String(window.location).match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1]
                };
                var backendEl = this.$("#edit-backend");
                this.listenTo(bundles, {
                    "select:one": function(bundle) {
                        backendEl.text("Edit Bundle"), backendEl.attr("href", approot + "symphony/publish/bundles/edit/" + bundle.id);
                    },
                    "select:none": function() {
                        backendEl.text("Edit List"), backendEl.attr("href", approot + "symphony/publish/bundles/");
                    }
                });
                var container = Backbone.$("#container");
                this.initializeToggle("debug-grid", this.$("#show-grid"), container), this.initializeToggle("debug-blocks", this.$("#show-blocks"), container);
            },
            initializeToggle: function(name, toggleEl, targetEl) {
                toggleEl.on("click", function() {
                    targetEl.toggleClass(name), Cookies.set(name, targetEl.hasClass(name) ? "true" : "");
                }), Cookies.get(name) && targetEl.addClass(name);
            }
        });
    }, {
        "../control/Controller": 3,
        "../model/collection/BundleList": 8,
        "./ContentView": 22,
        "./FooterView": 23,
        "./NavigationView": 24,
        backbone: "backbone",
        "cookies-js": 1,
        underscore: "underscore"
    } ],
    22: [ function(require, module) {
        var _ = require("underscore"), controller = (require("hammerjs"), require("backbone"), 
        require("../control/Controller")), bundles = require("../model/collection/BundleList"), Globals = require("../control/Globals"), View = require("../helper/View"), Carousel = require("./component/Carousel"), CollectionStack = (require("./component/SelectableListView"), 
        require("./component/CollectionStack")), ImageRenderer = require("./render/ImageRenderer"), CarouselEmptyRenderer = (require("./render/DotNavigationRenderer"), 
        require("./render/CarouselEmptyRenderer")), bundleDescTemplate = require("./template/CollectionStack.Bundle.tpl"), imageDescTemplate = require("./template/CollectionStack.Image.tpl"), ContentView = View.extend({
            initialize: function() {
                _.bindAll(this, "_onPan"), this.children = [], this.container = document.createElement("div"), 
                this.container.id = "content-detail", this.$el.append(this.container), this.listenTo(bundles, {
                    "select:one": function(bundle) {
                        this.createChildren(bundle, !1);
                    },
                    "deselect:one": function(bundle) {
                        this.removeChildren(bundle, !1);
                    }
                }), bundles.selected && this.createChildren(bundles.selected, !0);
            },
            remove: function() {
                bundles.selected && this.removeChildren(bundles.selected, !0), this.hammer.destroy(), 
                this.$el.remove(this.container), View.prototype.remove.apply(this, arguments);
            },
            createChildren: function(bundle, skipAnimation) {
                var images = bundle.get("images");
                this.createImageCarousel(images, bundle), this.createLabelCarousel(images), skipAnimation || _.each(this.children, function(child) {
                    child.$el.css({
                        opacity: 0
                    }).delay(3 * Globals.TRANSITION_DELAY).transit({
                        opacity: 1
                    }, Globals.TRANSITION_DURATION);
                });
            },
            _onPan: function(ev) {
                console.log(ev.type, ev.target);
            },
            removeChildren: function(bundle, skipAnimation) {
                var images = bundle.get("images");
                this.stopListening(images), _.each(this.children, function(child) {
                    controller.stopListening(child), skipAnimation ? child.remove() : child.$el.css({
                        position: "absolute"
                    }).transit({
                        opacity: 0
                    }, Globals.TRANSITION_DURATION).queue(function(next) {
                        child.remove(), next();
                    });
                }), this.children.length = 0;
            },
            createImageCarousel: function(images, bundle) {
                return view = new Carousel({
                    className: "image-carousel " + bundle.get("handle"),
                    collection: images,
                    renderer: ImageRenderer,
                    emptyRenderer: CarouselEmptyRenderer.extend({
                        model: bundle,
                        template: bundleDescTemplate
                    })
                }), view.render().$el.appendTo(this.el), controller.listenTo(view, {
                    "view:select:one": controller.selectImage,
                    "view:select:none": controller.deselectImage
                }), this.children[this.children.length] = view;
            },
            createLabelCarousel: function(images) {
                return view = new Carousel({
                    className: "label-carousel",
                    collection: images,
                    gap: Globals.HORIZONTAL_STEP
                }), view.render().$el.appendTo(this.el), controller.listenTo(view, {
                    "view:select:one": controller.selectImage,
                    "view:select:none": controller.deselectImage
                }), this.children[this.children.length] = view;
            },
            createImageDetail: function(images) {
                var view = new CollectionStack({
                    collection: images,
                    template: imageDescTemplate,
                    className: "image-detail"
                });
                return view.render().$el.appendTo(this.container), this.children[this.children.length] = view;
            }
        });
        module.exports = ContentView;
    }, {
        "../control/Controller": 3,
        "../control/Globals": 4,
        "../helper/View": 7,
        "../model/collection/BundleList": 8,
        "./component/Carousel": 25,
        "./component/CollectionStack": 27,
        "./component/SelectableListView": 30,
        "./render/CarouselEmptyRenderer": 32,
        "./render/DotNavigationRenderer": 34,
        "./render/ImageRenderer": 35,
        "./template/CollectionStack.Bundle.tpl": 38,
        "./template/CollectionStack.Image.tpl": 39,
        backbone: "backbone",
        hammerjs: "hammerjs",
        underscore: "underscore"
    } ],
    23: [ function(require, module) {
        var View = (require("underscore"), require("backbone"), require("../helper/View")), FooterView = View.extend({
            className: "footer mutable-faded",
            initialize: function() {}
        });
        module.exports = FooterView;
    }, {
        "../helper/View": 7,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    24: [ function(require, module) {
        var bundles = (require("backbone"), require("../model/collection/BundleList")), keywords = require("../model/collection/KeywordList"), types = require("../model/collection/TypeList"), controller = require("../control/Controller"), View = require("../helper/View"), FilterableListView = require("./component/FilterableListView"), GroupingListView = require("./component/GroupingListView"), CollectionPager = require("./component/CollectionPager"), bundlePagerTemplate = (require("./component/Carousel"), 
        require("./template/CollectionPager.Bundle.tpl"));
        module.exports = View.extend({
            className: "navigation",
            events: {
                "click #site-name a": "onSitenameClick"
            },
            initialize: function() {
                this.bundlePager = new CollectionPager({
                    id: "bundle-pager",
                    className: "folio mutable-faded",
                    collection: bundles,
                    template: bundlePagerTemplate,
                    labelAttribute: "name"
                }), this.bundlePager.render().$el.appendTo(this.el), controller.listenTo(this.bundlePager, {
                    "view:select:one": controller.selectBundle,
                    "view:select:none": controller.deselectBundle
                }), this.bundlesView = new FilterableListView({
                    el: "#bundle-list",
                    collection: bundles,
                    filterBy: keywords.selected,
                    filterKey: "bIds"
                }), controller.listenTo(this.bundlesView, {
                    "view:select:one": controller.selectBundle,
                    "view:select:none": controller.deselectBundle
                }), this.keywordsView = new GroupingListView({
                    el: "#keyword-list",
                    collection: keywords,
                    filterBy: bundles.selected,
                    filterKey: "kIds",
                    groupings: {
                        collection: types,
                        key: "tIds"
                    },
                    collapsed: !0
                }), this.listenTo(bundles, {
                    "select:one": this.onSelectOne,
                    "select:none": this.onSelectNone
                });
            },
            render: function() {
                return bundles.selected ? this.onSelectOne() : this.onSelectNone(), this;
            },
            remove: function() {
                View.prototype.remove.apply(this, arguments);
            },
            onSelectOne: function() {
                this.keywordsView.filterBy(bundles.selected), this.bundlesView.setCollapsed(!0);
            },
            onSelectNone: function() {
                this.keywordsView.filterBy(null), this.bundlesView.setCollapsed(!1);
            },
            onSitenameClick: function(ev) {
                ev.isDefaultPrevented() || ev.preventDefault(), controller.deselectBundle();
            }
        });
    }, {
        "../control/Controller": 3,
        "../helper/View": 7,
        "../model/collection/BundleList": 8,
        "../model/collection/KeywordList": 9,
        "../model/collection/TypeList": 10,
        "./component/Carousel": 25,
        "./component/CollectionPager": 26,
        "./component/FilterableListView": 28,
        "./component/GroupingListView": 29,
        "./template/CollectionPager.Bundle.tpl": 36,
        backbone: "backbone"
    } ],
    25: [ function(require, module) {
        var _ = require("underscore"), Hammer = require("hammerjs"), Backbone = require("backbone"), Container = require("backbone.babysitter"), DeferredRenderView = (require("../../helper/View"), 
        require("../../helper/DeferredRenderView")), CarouselDefaultRenderer = require("../render/CarouselDefaultRenderer"), CarouselEmptyRenderer = require("../render/CarouselEmptyRenderer"), ANIMATED = !1, IMMEDIATE = !0, Carousel = DeferredRenderView.extend({
            tagName: "div",
            className: "carousel skip-transitions",
            selectThreshold: 30,
            panThreshold: 15,
            direction: Hammer.DIRECTION_HORIZONTAL,
            renderer: CarouselDefaultRenderer,
            emptyRenderer: CarouselEmptyRenderer,
            initialize: function(options) {
                this.children = new Container(), _.isNumber(options.gap) && (this.gap = options.gap), 
                options.renderer && (this.renderer = options.renderer), options.emptyRenderer && (this.emptyRenderer = options.emptyRenderer), 
                options.direction === Hammer.DIRECTION_VERTICAL && (this.direction = Hammer.DIRECTION_VERTICAL);
                var hammerEl = Backbone.$(document.createElement("div")).addClass("pan-area").appendTo(this.el)[0];
                options.hammer ? (console.log(this.cid, "using external hammer"), this.hammer = options.hammer) : (this.hammer = new Hammer.Manager(hammerEl), 
                this.hammer.add(new Hammer.Pan({
                    direction: this.direction,
                    threshold: this.panThreshold
                })), this._hammerIsLocal = !0), _.bindAll(this, "_onPan"), this.hammer.on("panstart panmove panend pancancel", this._onPan), 
                _.bindAll(this, "_onResize"), Backbone.$(window).on("orientationchange resize", this._onResize), 
                this.listenTo(this.collection, {
                    reset: this._onCollectionReset,
                    "select:one": this._onSelectOne,
                    "select:none": this._onSelectNone,
                    "deselect:one": this._onDeselectOne
                });
            },
            remove: function() {
                Backbone.$(window).off("orientationchange resize", this._onResize), this.hammer.off("panstart panmove panend pancancel", this._onPan), 
                this._hammerIsLocal && this.hammer.destroy(), this.removeChildren(), DeferredRenderView.prototype.remove.apply(this);
            },
            _onPan: function(ev) {
                switch (ev.type) {
                  case "panstart":
                    return this._onPanStart(ev);

                  case "panmove":
                    return this._onPanMove(ev);

                  case "panend":
                    return this._onPanEnd(ev);

                  case "pancancel":
                    return this._onPanCancel(ev);
                }
            },
            _onPanStart: function(ev) {
                this.$el.addClass("panning"), this.panning = !0, this.thresholdOffset = this.getEventDelta(ev) < 0 ? this.panThreshold : -this.panThreshold;
            },
            _onPanMove: function(ev) {
                var delta = this.getEventDelta(ev) + this.thresholdOffset, indexDelta = 0 > delta ? 1 : -1, dirChanged = this.indexDelta != indexDelta;
                dirChanged && (this.indexDelta = indexDelta, this.candidateChild && (this.candidateChild.$el.removeClass("candidate"), 
                delete this.candidateChild)), this.isOutOfBounds(delta) ? delta *= .2 : dirChanged && (this.candidateModel = this.collection.at(this.collection.selectedIndex + indexDelta), 
                this.candidateChild = this.candidateModel ? this.children.findByModel(this.candidateModel) : this.emptyChild, 
                this.candidateChild.$el.addClass("candidate")), this.scrollByNow(delta, IMMEDIATE);
            },
            _onPanCancel: function() {
                this.scrollByLater(0, ANIMATED), this.cleanupAfterPan();
            },
            _onPanEnd: function(ev) {
                var delta = this.getEventDelta(ev) + this.thresholdOffset;
                if (Math.abs(delta) > this.selectThreshold && !this.isOutOfBounds(delta)) {
                    {
                        this.candidateModel;
                    }
                    this.candidateModel ? this.trigger("view:select:one", this.candidateModel) : this.trigger("view:select:none");
                } else this.scrollByLater(0, ANIMATED);
                this.cleanupAfterPan();
            },
            getEventDelta: function(ev) {
                var delta = this.direction & Hammer.DIRECTION_HORIZONTAL ? ev.deltaX : ev.deltaY;
                return delta;
            },
            cleanupAfterPan: function() {
                this.candidateChild && this.candidateChild.$el.removeClass("candidate"), this.$el.removeClass("panning"), 
                this.panning = !1, delete this.candidateChild, delete this.candidateModel, delete this.indexDelta, 
                delete this.thresholdOffset;
            },
            isOutOfBounds: function(delta) {
                return -1 == this.collection.selectedIndex && delta > 0 || this.collection.selectedIndex == this.collection.length - 1 && 0 > delta;
            },
            _onCollectionReset: function() {
                this._resetPending = !0, this.render();
            },
            _onDeselectOne: function(model) {
                var child = this.children.findByModel(model);
                child && child.$el.removeClass("selected");
            },
            _onSelectOne: function(model) {
                var child = this.children.findByModel(model);
                child && (child.$el.addClass("selected"), this.scrollByNow(0, ANIMATED));
            },
            _onSelectNone: function() {
                this.emptyChild && (this.selectEmptyChildView(), this.scrollByNow(0, ANIMATED));
            },
            render: function() {
                return this.el.parentElement ? (this.createChildrenNow(), this.scrollByNow(0, IMMEDIATE)) : (this.createChildrenLater(), 
                this.scrollByLater(0, IMMEDIATE)), this;
            },
            renderLater: function() {
                this.validateRender("createChildren"), this.validateRender("scrollBy"), this.skipTransitions = !1;
            },
            selectEmptyChildView: function() {
                this.emptyChild.$el.addClass("selected"), this.listenToOnce(this.collection, "select:one", function() {
                    this.emptyChild.$el.removeClass("selected");
                });
            },
            createEmptyChildView: function() {
                var child = new this.emptyRenderer({});
                return this.emptyChild = child, child.$el.on("mouseup", _.bind(function(ev) {
                    ev.isDefaultPrevented() || this.panning || -1 == this.collection.selectedIndex || this.trigger("view:select:none");
                }, this)), -1 == this.collection.selectedIndex && this.selectEmptyChildView(), child;
            },
            removeEmptyChildView: function() {
                this.emptyChild ? (this.emptyChild.remove(), delete this.emptyChild) : console.warn("Carousel.removeEmptyChildView called while emptyChild is undefined");
            },
            createChildView: function(item) {
                var child = new this.renderer({
                    model: item
                });
                return this.children.add(child), child.$el.on("mouseup", _.bind(function(ev) {
                    ev.isDefaultPrevented() || this.panning || this.collection.selected === item || this.trigger("view:select:one", item);
                }, this)), item.selected && child.$el.addClass("selected"), child;
            },
            removeChildView: function(view) {
                return this.children.remove(view), view.remove(), view;
            },
            _createChildren: function() {
                var buffer;
                this._resetPending && (this.removeChildren(), this._resetPending = !1), this.collection.length && (buffer = document.createDocumentFragment(), 
                buffer.appendChild(this.createEmptyChildView().el), this.collection.each(function(item, index) {
                    buffer.appendChild(this.createChildView(item, index).el);
                }, this), this.$el.prepend(buffer)), this.measure();
            },
            createChildrenNow: function() {
                this._createChildren();
            },
            createChildrenLater: function() {
                this.requestRender("createChildren", _.bind(this._createChildren, this));
            },
            removeChildren: function() {
                this.removeEmptyChildView(), this.children.each(this.removeChildView, this);
            },
            _childSizes: {},
            _onResize: function() {
                this.measure(), this.scrollByNow(0, IMMEDIATE);
            },
            measure: function() {
                var size, pos = 0, maxAcross = 0, maxSize = 0, measure = function(child) {
                    size = this.measureChild(child.render()), size.pos = pos, pos += size.outer + (this.gap || Math.min(size.before, size.after)), 
                    maxAcross = Math.max(maxAcross, size.across), maxSize = Math.max(maxSize, size.outer);
                };
                measure.call(this, this.emptyChild), maxAcross = maxSize = 0, this.children.each(measure, this), 
                this.containerSize = this.el[this.dirProp("offsetWidth", "offsetHeight")], this.selectThreshold = Math.min(this.selectThreshold, .1 * this.containerSize), 
                this.$el.css(this.dirProp("minHeight", "minWidth"), maxAcross > 0 ? maxAcross : "");
            },
            measureChild: function(child) {
                var sizes = {}, childEl = child.el, contentEl = child.$(".sizing")[0];
                return sizes.outer = childEl[this.dirProp("offsetWidth", "offsetHeight")], sizes.across = childEl[this.dirProp("offsetHeight", "offsetWidth")], 
                contentEl ? (sizes.inner = contentEl[this.dirProp("offsetWidth", "offsetHeight")], 
                sizes.before = contentEl[this.dirProp("offsetLeft", "offsetTop")], sizes.after = sizes.outer - (sizes.inner + sizes.before)) : (sizes.inner = sizes.outer, 
                sizes.before = 0, sizes.after = 0), this._childSizes[child.cid] = sizes;
            },
            scrollByLater: function(delta, skipTransitions) {
                _.isBoolean(skipTransitions) && (this.skipTransitions = this.skipTransitions || skipTransitions), 
                this.requestRender("scrollBy", _.bind(this._scrollBy, this, delta));
            },
            scrollByNow: function(delta, skipTransitions) {
                this._scrollBy(delta, _.isBoolean(skipTransitions) ? skipTransitions : this.skipTransitions);
            },
            _scrollBy: function(delta, skipTransitions) {
                var sChild, sSizes, sizes, pos;
                skipTransitions ? this.$el.addClass("skip-transitions") : this.$el.removeClass("skip-transitions"), 
                sChild = this.collection.selected ? this.children.findByModel(this.collection.selected) : this.emptyChild, 
                sSizes = this._childSizes[sChild.cid];
                var scroll = function(child) {
                    sizes = this._childSizes[child.cid], pos = this._getScrollOffset(sizes, sSizes, delta);
                    var val = this._getTransformValue(pos);
                    child.el.style.webkitTransform = val, child.el.style.mozTransform = val, child.el.style.transform = val;
                };
                scroll.call(this, this.emptyChild), this.children.each(scroll, this);
            },
            _getTransformValue: function(pos) {
                return this.dirProp("translate3d(" + pos + "px,0,0)", "translate3d(0," + pos + "px,0)");
            },
            _getScrollOffset: function(s, ss, delta) {
                var pos = s.pos - ss.pos + delta, offset = 0;
                return 0 > pos ? offset += Math.abs(pos) < s.outer ? -s.after / s.outer * pos : s.after : pos >= 0 && (offset -= Math.abs(pos) < s.outer ? s.before / s.outer * pos : s.before), 
                pos + offset;
            },
            dirProp: function(hProp, vProp) {
                return this.direction & Hammer.DIRECTION_HORIZONTAL ? hProp : vProp;
            }
        }, {
            DIRECTION_VERTICAL: Hammer.DIRECTION_VERTICAL,
            DIRECTION_HORIZONTAL: Hammer.DIRECTION_HORIZONTAL
        });
        module.exports = Carousel;
    }, {
        "../../helper/DeferredRenderView": 5,
        "../../helper/View": 7,
        "../render/CarouselDefaultRenderer": 31,
        "../render/CarouselEmptyRenderer": 32,
        backbone: "backbone",
        "backbone.babysitter": "backbone.babysitter",
        hammerjs: "hammerjs",
        underscore: "underscore"
    } ],
    26: [ function(require, module) {
        var View = (require("underscore"), require("backbone"), require("../../helper/View")), viewTemplate = require("../template/CollectionPager.tpl");
        module.exports = View.extend({
            tagName: "div",
            className: "pager",
            template: viewTemplate,
            labelAttribute: "name",
            events: {
                "click .preceding-button": function(ev) {
                    ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("view:select:one", this.collection.precedingOrLast());
                },
                "click .following-button": function(ev) {
                    ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("view:select:one", this.collection.followingOrFirst());
                },
                "click .close-button": function(ev) {
                    ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("view:select:none");
                }
            },
            initialize: function(options) {
                options.template && (this.template = options.template), options.labelAttribute && (this.labelAttribute = options.labelAttribute), 
                this.listenTo(this.collection, "select:one select:none", this.render), this.listenTo(this.collection, "reset", this.render);
            },
            render: function() {
                if (this.collection.length > 1 && this.collection.selected) {
                    var preceding = this.collection.precedingOrLast(), following = this.collection.followingOrFirst();
                    this.$el.html(this.template({
                        preceding_label: this.getLabel(preceding),
                        preceding_href: preceding.get("handle"),
                        following_label: this.getLabel(following),
                        following_href: following.get("handle"),
                        close_label: "Close",
                        close_href: "close"
                    }));
                } else this.$el.empty();
                return this;
            },
            getLabel: function(model) {
                return model.has(this.labelAttribute) ? model.get(this.labelAttribute) : model.toString();
            }
        });
    }, {
        "../../helper/View": 7,
        "../template/CollectionPager.tpl": 37,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    27: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), View = require("../../helper/View"), viewTemplate = require("../template/CollectionStack.tpl");
        module.exports = View.extend({
            tagName: "div",
            className: "item-detail",
            template: viewTemplate,
            initialize: function(options) {
                _.bindAll(this, "deferredRender"), options.template && (this.template = options.template), 
                this.listenTo(this.collection, "reset", this.onCollectionReset), this.listenTo(this.collection, "deselect:one", this.unsetModel), 
                this.listenTo(this.collection, "select:one", this.setModel), this.skipTransitions = !0, 
                this._model = this.collection.selected, this._model && (this._model = this.collection.selected, 
                this.listenTo(this._model, "change", this.requestRender));
            },
            onCollectionReset: function() {
                this.skipTransitions = !0;
            },
            unsetModel: function(model) {
                this._model && this._model === model && (this._model = null, this.stopListening(model), 
                this.requestRender());
            },
            setModel: function(model) {
                model && model !== this._model && (this._model = model, this.listenTo(model, "change", this.requestRender), 
                this.requestRender());
            },
            requestRender: function() {
                this.renderPending || (this.renderPending = !0, _.defer(this.deferredRender));
            },
            deferredRender: function() {
                this.render(), this.renderPending = !1;
            },
            render: function() {
                if (this.skipTransitions) this.$content && (this.$el.removeAttr("style"), this.$content.clearQueue().remove()), 
                this._model && (this.$content = this.$createContentElement(this._model), this.$content.appendTo(this.$el)), 
                this.skipTransitions = !1; else {
                    if (this.$content) {
                        var contentRect = _.extend({
                            width: this.$el.innerWidth(),
                            minHeight: this.$el.innerHeight(),
                            position: "absolute",
                            display: "block"
                        }, this.$content.position());
                        this.$el.css({
                            minWidth: this.$el.outerWidth,
                            minHeight: this.$el.outerHeight
                        }), this.$content.clearQueue().css(contentRect).transit({
                            opacity: 0
                        }, 300).promise().always(function($this) {
                            $this.parent().removeAttr("style"), $this.remove();
                        }), delete this.$content;
                    }
                    this._model && (this.$content = this.$createContentElement(this._model), this.$content.css({
                        opacity: 0
                    }).delay(700).appendTo(this.$el).transit({
                        opacity: 1
                    }, 300));
                }
                return this.skipTransitions && (this.skipTransitions = !1), this;
            },
            $createContentElement: function(item) {
                return Backbone.$(this._createContentElement(item));
            },
            _createContentElement: function(item) {
                var elt = document.createElement("div");
                return elt.innerHTML = this.template(item.attributes), 1 == elt.childElementCount ? elt.children[0] : elt;
            }
        });
    }, {
        "../../helper/View": 7,
        "../template/CollectionStack.tpl": 40,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    28: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), Container = require("backbone.babysitter"), DeferredRenderView = require("../../helper/DeferredRenderView"), FilterableListView = DeferredRenderView.extend({
            tagName: "ul",
            className: "list selectable filterable skip-transitions",
            initialize: function(options) {
                this.children = new Container(), this.renderer = options.renderer || FilterableListView.FilterableRenderer, 
                this.itemIds = this.collection.pluck("id"), this.filterKey = options.filterKey, 
                this.filterBy(options.filterBy), this.setSelection(this.collection.selected), this.setCollapsed(_.isBoolean(options.collapsed) ? options.collapsed : !1), 
                this.skipTransitions = !0, this.collection.each(this.assignChildView, this), _.bindAll(this, "_onResize"), 
                Backbone.$(window).on("orientationchange resize", this._onResize), this.listenTo(this.collection, {
                    "select:one": this.setSelection,
                    "select:none": this.setSelection
                });
            },
            remove: function() {
                Backbone.$(window).off("orientationchange resize", this._onResize), DeferredRenderView.prototype.remove.apply(this);
            },
            _onResize: function() {
                this._renderLayout();
            },
            render: function() {
                return this;
            },
            renderLater: function() {
                this.skipTransitions && this.$el.addClass("skip-transitions"), _.defer(_.bind(function() {
                    this.skipTransitions = !1, this.$el.removeClass("skip-transitions");
                }, this)), this.validateRender("collapsed"), this.validateRender("selection"), this.validateRender("filterBy"), 
                this._renderLayout();
            },
            _renderLayout: function() {
                var pos, tx;
                elt = this.el.firstElementChild, pos = elt.clientTop;
                do tx = "translate3d(" + elt.clientLeft + "px," + pos + "px,0)", elt.style.position = "absolute", 
                elt.style.webkitTransform = tx, elt.style.mozTransform = tx, elt.style.transform = tx, 
                pos += elt.clientHeight; while (elt = elt.nextElementSibling);
                this.el.style.minHeight = pos + "px";
            },
            assignChildView: function(item) {
                var view = new this.renderer({
                    model: item,
                    el: item.selector()
                });
                return this.children.add(view, item.id), this.listenTo(view, "renderer:click", this.onChildClick), 
                view;
            },
            onChildClick: function(item) {
                this.collection.selected !== item ? this.trigger("view:select:one", item) : this.trigger("view:select:none");
            },
            _collapsed: void 0,
            setCollapsed: function(collapsed, force) {
                (force || collapsed !== this._collapsed) && (this._collapsed = collapsed, this.requestRender("collapsed", _.bind(this.renderCollapsed, this, collapsed)));
            },
            getCollapsed: function() {
                return this._collapsed;
            },
            renderCollapsed: function(collapsed) {
                collapsed ? this.$el.addClass("collapsed") : this.$el.removeClass("collapsed");
            },
            _selectedItem: void 0,
            setSelection: function(item, force) {
                if (force || item !== this._selectedItem) {
                    var oldVal = this._selectedItem;
                    this._selectedItem = item, this.requestRender("selection", _.bind(this.renderSelection, this, item, oldVal));
                }
            },
            renderSelection: function(newItem, oldItem) {
                newItem && this.children.findByModel(newItem).$el.addClass("selected"), oldItem && this.children.findByModel(oldItem).$el.removeClass("selected");
            },
            _filter: void 0,
            filterBy: function(filter, force) {
                if (force || filter !== this._filter) {
                    var oldVal = this._filter;
                    this._filter = filter, this.requestRender("filterBy", _.bind(this.renderFilterBy, this, filter, oldVal));
                }
            },
            renderFilterBy: function(newVal, oldVal) {
                var newIds, oldIds;
                newVal && (newIds = newVal.get(this.filterKey)), oldVal && (oldIds = oldVal.get(this.filterKey)), 
                this.renderFiltersById(newIds, oldIds);
            },
            renderFiltersById: function(newIds, oldIds) {
                var newIncludes, newExcludes;
                newIds && (newExcludes = _.difference(oldIds || this.itemIds, newIds), _.each(newExcludes, function(id) {
                    this.children.findByCustom(id).$el.addClass("excluded");
                }, this)), oldIds && (newIncludes = _.difference(newIds || this.itemIds, oldIds), 
                _.each(newIncludes, function(id) {
                    this.children.findByCustom(id).$el.removeClass("excluded");
                }, this));
            }
        }, {
            FilterableRenderer: Backbone.View.extend({
                events: {
                    click: function(ev) {
                        ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("renderer:click", this.model);
                    }
                }
            })
        });
        module.exports = FilterableListView;
    }, {
        "../../helper/DeferredRenderView": 5,
        backbone: "backbone",
        "backbone.babysitter": "backbone.babysitter",
        underscore: "underscore"
    } ],
    29: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), Container = require("backbone.babysitter"), FilterableListView = require("./FilterableListView"), GroupingListView = FilterableListView.extend({
            tagName: "dl",
            className: "grouped",
            initialize: function(options) {
                FilterableListView.prototype.initialize.apply(this, arguments), options.groupings && (this.groupingKey = options.groupings.key, 
                this.groupingCollection = options.groupings.collection, this.groupingChildren = new Container(), 
                this.groupingRenderer = options.groupings.renderer || GroupingListView.GroupingRenderer, 
                this.groupingCollection.each(this.assignGroupingView, this));
            },
            renderFilterBy: function(newAssoc) {
                FilterableListView.prototype.renderFilterBy.apply(this, arguments);
                var groupIds;
                newAssoc && (groupIds = newAssoc.get(this.groupingKey)), this.renderChildrenGroups(groupIds);
            },
            renderChildrenGroups: function(modelIds) {
                modelIds ? this.groupingCollection.each(function(model) {
                    _.contains(modelIds, model.id) ? this.groupingChildren.findByModel(model).$el.removeClass("excluded") : this.groupingChildren.findByModel(model).$el.addClass("excluded");
                }, this) : this.groupingChildren.each(function(view) {
                    view.$el.removeClass("excluded");
                });
            },
            assignGroupingView: function(item) {
                var view = new this.groupingRenderer({
                    model: item,
                    el: item.selector()
                });
                return this.groupingChildren.add(view, item.id), view;
            }
        }, {
            GroupingRenderer: Backbone.View.extend({
                tagName: "dt",
                className: "list-group"
            })
        });
        module.exports = GroupingListView;
    }, {
        "./FilterableListView": 28,
        backbone: "backbone",
        "backbone.babysitter": "backbone.babysitter",
        underscore: "underscore"
    } ],
    30: [ function(require, module) {
        var Container = (require("underscore"), require("backbone"), require("backbone.babysitter")), View = require("../../helper/View"), DefaultSelectableRenderer = require("../render/DefaultSelectableRenderer"), SelectableListView = View.extend({
            tagName: "ul",
            className: "list selectable",
            renderer: DefaultSelectableRenderer,
            initialize: function(options) {
                options.renderer && (this.renderer = options.renderer), this.listenTo(this.collection, "add remove reset", this.render), 
                this.children = new Container();
            },
            render: function() {
                var eltBuffer, view;
                return this.removeChildren(), this.$el.empty(), this.collection.length && (eltBuffer = document.createDocumentFragment(), 
                view = this.createNullView(), eltBuffer.appendChild(view.render().el), this.collection.each(function(model, index) {
                    view = this.createChildView(model, index), eltBuffer.appendChild(view.render().el);
                }, this), this.$el.append(eltBuffer)), this;
            },
            createChildView: function(model) {
                var view = new this.renderer({
                    model: model
                });
                return this.children.add(view), this.listenTo(view, "renderer:click", this.onChildViewClick), 
                view;
            },
            removeChildren: function() {
                this.children.each(this.removeChildView, this);
            },
            removeChildView: function(view) {
                return this.stopListening(view), this.children.remove(view), view.remove(), view;
            },
            onChildViewClick: function(item) {
                this.collection.selected !== item && this.trigger("view:select:one", item);
            },
            createNullView: function() {
                var view = new SelectableListView.NullRenderer({
                    collection: this.collection
                });
                return this.children.add(view), this.listenTo(view, "renderer:click", function() {
                    this.trigger("view:select:none");
                }), view;
            }
        }, {
            NullRenderer: View.extend({
                tagName: "li",
                className: "list-item null-item",
                events: {
                    click: function(ev) {
                        ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("renderer:click", this.model);
                    }
                },
                initialize: function() {
                    var handler = function() {
                        this.$el.addClass("selected"), this.listenToOnce(this.collection, "select:one", function() {
                            this.$el.removeClass("selected");
                        });
                    };
                    this.listenTo(this.collection, "select:none", handler), this.collection.selected || handler.call(this);
                },
                render: function() {
                    return this.$el.html('<a href="#clear"><b> </b></a>'), this;
                }
            })
        });
        module.exports = SelectableListView;
    }, {
        "../../helper/View": 7,
        "../render/DefaultSelectableRenderer": 33,
        backbone: "backbone",
        "backbone.babysitter": "backbone.babysitter",
        underscore: "underscore"
    } ],
    31: [ function(require, module) {
        {
            var _ = require("underscore"), View = (require("backbone"), require("../../helper/View"));
            require("../../utils/Styles");
        }
        module.exports = View.extend({
            tagName: "div",
            className: "carousel-item default-carousel-item",
            template: _.template('<div class="placeholder content sizing"><%= name %></div>'),
            events: {
                "dragstart img": function(ev) {
                    ev.preventDefault();
                }
            },
            initialize: function() {
                this.$el.html(this.template(this.model.toJSON()));
            }
        });
    }, {
        "../../helper/View": 7,
        "../../utils/Styles": 15,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    32: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), View = require("../../helper/View");
        module.exports = View.extend({
            className: "carousel-item empty-item",
            model: Backbone.Model,
            template: _.template('<div class="content sizing"><%= name %></div>'),
            render: function() {
                return this.$el.html(this.template(this.model.attributes)), this;
            }
        });
    }, {
        "../../helper/View": 7,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    33: [ function(require, module) {
        var Backbone = (require("underscore"), require("backbone")), viewTemplate = require("../template/DefaultSelectableRenderer.tpl"), DefaultSelectableRenderer = Backbone.View.extend({
            tagName: "li",
            className: "list-item",
            template: viewTemplate,
            events: {
                click: "onClick"
            },
            initialize: function() {
                this.listenTo(this.model, {
                    selected: function() {
                        this.$el.addClass("selected");
                    },
                    deselected: function() {
                        this.$el.removeClass("selected");
                    }
                }), this.model.selected && this.$el.addClass("selected");
            },
            render: function() {
                return this.$el.html(this.template({
                    href: this.model.cid,
                    name: this.model.get("name")
                })), this;
            },
            onClick: function(ev) {
                ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("renderer:click", this.model);
            }
        });
        module.exports = DefaultSelectableRenderer;
    }, {
        "../template/DefaultSelectableRenderer.tpl": 41,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    34: [ function(require, module) {
        var Backbone = (require("underscore"), require("backbone")), viewTemplate = require("../template/DotNavigationRenderer.tpl"), DotNavigationRenderer = Backbone.View.extend({
            tagName: "li",
            className: "list-item",
            template: viewTemplate,
            events: {
                click: function(ev) {
                    ev.isDefaultPrevented() || ev.preventDefault(), this.trigger("renderer:click", this.model);
                }
            },
            initialize: function() {
                this.listenTo(this.model, "selected", function() {
                    this.$el.addClass("selected");
                }), this.listenTo(this.model, "deselected", function() {
                    this.$el.removeClass("selected");
                });
            },
            render: function() {
                return this.$el.html(this.template({
                    href: this.model.cid,
                    name: this.model.get("name")
                })), this.model.selected ? this.$el.addClass("selected") : this.$el.removeClass("selected"), 
                this;
            }
        });
        module.exports = DotNavigationRenderer;
    }, {
        "../template/DotNavigationRenderer.tpl": 42,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    35: [ function(require, module) {
        var _ = require("underscore"), Backbone = require("backbone"), Globals = require("../../control/Globals"), ImageItem = require("../../model/item/ImageItem"), loadImage = (require("../../utils/Styles"), 
        require("../../utils/strings/stripTags"), require("../../utils/net/loadImage")), viewTemplate = (require("../../utils/net/loadImageXHR"), 
        require("../template/ImageRenderer.tpl"));
        module.exports = Backbone.View.extend({
            tagName: "div",
            className: "carousel-item image-item idle",
            model: ImageItem,
            template: viewTemplate,
            initialize: function() {
                this._loadImage = _.once(_.bind(this._loadImage, this)), this.createChildren(), 
                this.addSiblingListeners();
            },
            createChildren: function() {
                this.$el.html(this.template(this.model.toJSON())), this.$placeholder = this.$(".placeholder"), 
                this.placeholder = this.$placeholder[0], this.$image = this.$("img"), this.image = this.$image[0];
            },
            remove: function() {
                return this.image.onload = this.image.onerror = this.image.onabort = void 0, Backbone.View.prototype.remove.apply(this, arguments);
            },
            render: function() {
                var w = this.$placeholder.outerWidth(), h = Math.round(w / this.model.get("w") * this.model.get("h"));
                return this.$image.attr({
                    width: w,
                    height: h
                }).css(this.$placeholder.position()), this.$el.css("height", h), this;
            },
            addSiblingListeners: function() {
                var owner = this.model.collection, m = owner.indexOf(this.model), check = function(n) {
                    return m === n || m + 1 === n || m - 1 === n;
                };
                check(owner.selectedIndex) ? this._loadImage() : this.listenTo(owner, "select:one select:none", function() {
                    check(owner.selectedIndex) && (this.stopListening(owner), this._loadImage());
                });
            },
            _loadImage: function() {
                this.$el.removeClass("idle").addClass("pending"), _.delay(function(context) {
                    loadImage(context.image, context.model.getImageUrl(), context).then(function(url, source, ev) {
                        this.$el.removeClass("pending").addClass("done"), console.info("ImageRenderer.onLoad: " + this.model.get("f"), ev);
                    }, function(err) {
                        this.$el.removeClass("pending").addClass("error"), console.error("ImageRenderer.onError: " + err.message, arguments);
                    });
                }, Globals.TRANSITION_DELAY, this);
            }
        });
    }, {
        "../../control/Globals": 4,
        "../../model/item/ImageItem": 12,
        "../../utils/Styles": 15,
        "../../utils/net/loadImage": 17,
        "../../utils/net/loadImageXHR": 18,
        "../../utils/strings/stripTags": 20,
        "../template/ImageRenderer.tpl": 43,
        backbone: "backbone",
        underscore: "underscore"
    } ],
    36: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<a class="preceding-button button" href="#' + (null == (__t = preceding_href) ? "" : __t) + '">' + (null == (__t = preceding_label) ? "" : __t) + '</a>\n<a class="following-button button" href="#' + (null == (__t = following_href) ? "" : __t) + '">' + (null == (__t = following_label) ? "" : __t) + "</a>\n";
            return __p;
        };
    }, {} ],
    37: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<a class="preceding-button button" href="#' + (null == (__t = preceding_href) ? "" : __t) + '">' + (null == (__t = preceding_label) ? "" : __t) + '</a>\n<a class="following-button button" href="#' + (null == (__t = following_href) ? "" : __t) + '">' + (null == (__t = following_label) ? "" : __t) + '</a>\n<a class="close-button button" href="#' + (null == (__t = close_href) ? "" : __t) + '">' + (null == (__t = close_label) ? "" : __t) + "</a>\n";
            return __p;
        };
    }, {} ],
    38: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<div class="content sizing description">' + (null == (__t = desc) ? "" : __t) + "</div>\n";
            return __p;
        };
    }, {} ],
    39: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<div id="desc_i' + (null == (__t = id) ? "" : __t) + '" class="description">' + (null == (__t = desc) ? "" : __t) + "</div>\n";
            return __p;
        };
    }, {} ],
    40: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<h2 class="name">' + (null == (__t = name) ? "" : __t) + '</h2>\n<p class="completed meta pubDate">' + (null == (__t = completed) ? "" : __t) + '</p>\n<div id="desc_' + (null == (__t = id) ? "" : __t) + '" class="description">' + (null == (__t = desc) ? "" : __t) + "</div>\n";
            return __p;
        };
    }, {} ],
    41: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<a href="#' + (null == (__t = href) ? "" : __t) + '"><span class="label">' + (null == (__t = name) ? "" : __t) + "</span></a>\n";
            return __p;
        };
    }, {} ],
    42: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<span class="label">' + (null == (__t = name) ? "" : __t) + '</span><a href="#' + (null == (__t = href) ? "" : __t) + '"><b> </b></a>\n';
            return __p;
        };
    }, {} ],
    43: [ function(require, module, exports) {
        module.exports = function(obj) {
            {
                var __t, __p = "";
                Array.prototype.join;
            }
            with (obj || {}) __p += '<div class="placeholder sizing"></div>\n<img class="content" alt="' + (null == (__t = name) ? "" : __t) + '" longdesc="#caption-' + (null == (__t = id) ? "" : __t) + '" />\n';
            return __p;
        };
    }, {} ]
}, {}, [ 2 ]);
//# sourceMappingURL=folio-client.js.map