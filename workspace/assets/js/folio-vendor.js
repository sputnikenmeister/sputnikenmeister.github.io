require = function e(t, n, r) {
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
    "Backbone.Mutators": [ function(require, module, exports) {
        !function(root, factory, undef) {
            "use strict";
            "object" == typeof exports ? module.exports = factory(require("underscore"), require("backbone")) : "function" == typeof define && define.amd ? define([ "underscore", "backbone" ], function(_, Backbone) {
                return _ = _ === undef ? root._ : _, Backbone = Backbone === undef ? root.Backbone : Backbone, 
                root.returnExportsGlobal = factory(_, Backbone, root);
            }) : root.returnExportsGlobal = factory(root._, root.Backbone);
        }(this, function(_, Backbone, root, undef) {
            "use strict";
            Backbone = Backbone === undef ? root.Backbone : Backbone, _ = _ === undef ? root._ : _;
            var Mutator = function() {}, oldGet = Backbone.Model.prototype.get, oldSet = Backbone.Model.prototype.set, oldToJson = Backbone.Model.prototype.toJSON;
            return Mutator.prototype.mutators = {}, Mutator.prototype.get = function(attr) {
                var isMutator = this.mutators !== undef;
                return isMutator === !0 && _.isFunction(this.mutators[attr]) === !0 ? this.mutators[attr].call(this) : isMutator === !0 && _.isObject(this.mutators[attr]) === !0 && _.isFunction(this.mutators[attr].get) === !0 ? this.mutators[attr].get.call(this) : oldGet.call(this, attr);
            }, Mutator.prototype.set = function(key, value, options) {
                var isMutator = this.mutators !== undef, ret = null, attrs = null;
                return ret = oldSet.call(this, key, value, options), _.isObject(key) || null === key ? (attrs = key, 
                options = value) : (attrs = {}, attrs[key] = value), isMutator === !0 && _.isObject(this.mutators[key]) === !0 && (_.isFunction(this.mutators[key].set) === !0 ? ret = this.mutators[key].set.call(this, key, attrs[key], options, _.bind(oldSet, this)) : _.isFunction(this.mutators[key]) && (ret = this.mutators[key].call(this, key, attrs[key], options, _.bind(oldSet, this)))), 
                isMutator === !0 && _.isObject(attrs) && _.each(attrs, _.bind(function(attr, attrKey) {
                    if (_.isObject(this.mutators[attrKey]) === !0) {
                        var meth = this.mutators[attrKey];
                        _.isFunction(meth.set) && (meth = meth.set), _.isFunction(meth) && ((options === undef || _.isObject(options) === !0 && options.silent !== !0 && options.mutators !== undef && options.mutators.silent !== !0) && this.trigger("mutators:set:" + attrKey), 
                        meth.call(this, attrKey, attr, options, _.bind(oldSet, this)));
                    }
                }, this)), ret;
            }, Mutator.prototype.toJSON = function(options) {
                var isSaving, isTransient, attr = oldToJson.call(this);
                return _.each(this.mutators, _.bind(function(mutator, name) {
                    _.isObject(this.mutators[name]) === !0 && _.isFunction(this.mutators[name].get) ? (isSaving = _.has(options || {}, "emulateHTTP"), 
                    isTransient = this.mutators[name].transient, isSaving && isTransient || (attr[name] = _.bind(this.mutators[name].get, this)())) : _.isFunction(this.mutators[name]) && (attr[name] = _.bind(this.mutators[name], this)());
                }, this)), attr;
            }, Mutator.prototype.escape = function(attr) {
                var val = this.get(attr);
                return _.escape(null == val ? "" : "" + val);
            }, _.extend(Backbone.Model.prototype, Mutator.prototype), Backbone.Mutators = Mutator, 
            Mutator;
        });
    }, {
        backbone: "backbone",
        underscore: "underscore"
    } ],
    "backbone.babysitter": [ function(require, module, exports) {
        !function(root, factory) {
            if ("function" == typeof define && define.amd) define([ "backbone", "underscore" ], function(Backbone, _) {
                return factory(Backbone, _);
            }); else if ("undefined" != typeof exports) {
                var Backbone = require("backbone"), _ = require("underscore");
                module.exports = factory(Backbone, _);
            } else factory(root.Backbone, root._);
        }(this, function(Backbone, _) {
            "use strict";
            var previousChildViewContainer = Backbone.ChildViewContainer;
            return Backbone.ChildViewContainer = function(Backbone, _) {
                var Container = function(views) {
                    this._views = {}, this._indexByModel = {}, this._indexByCustom = {}, this._updateLength(), 
                    _.each(views, this.add, this);
                };
                _.extend(Container.prototype, {
                    add: function(view, customIndex) {
                        var viewCid = view.cid;
                        return this._views[viewCid] = view, view.model && (this._indexByModel[view.model.cid] = viewCid), 
                        customIndex && (this._indexByCustom[customIndex] = viewCid), this._updateLength(), 
                        this;
                    },
                    findByModel: function(model) {
                        return this.findByModelCid(model.cid);
                    },
                    findByModelCid: function(modelCid) {
                        var viewCid = this._indexByModel[modelCid];
                        return this.findByCid(viewCid);
                    },
                    findByCustom: function(index) {
                        var viewCid = this._indexByCustom[index];
                        return this.findByCid(viewCid);
                    },
                    findByIndex: function(index) {
                        return _.values(this._views)[index];
                    },
                    findByCid: function(cid) {
                        return this._views[cid];
                    },
                    remove: function(view) {
                        var viewCid = view.cid;
                        return view.model && delete this._indexByModel[view.model.cid], _.any(this._indexByCustom, function(cid, key) {
                            return cid === viewCid ? (delete this._indexByCustom[key], !0) : void 0;
                        }, this), delete this._views[viewCid], this._updateLength(), this;
                    },
                    call: function(method) {
                        this.apply(method, _.tail(arguments));
                    },
                    apply: function(method, args) {
                        _.each(this._views, function(view) {
                            _.isFunction(view[method]) && view[method].apply(view, args || []);
                        });
                    },
                    _updateLength: function() {
                        this.length = _.size(this._views);
                    }
                });
                var methods = [ "forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck" ];
                return _.each(methods, function(method) {
                    Container.prototype[method] = function() {
                        var views = _.values(this._views), args = [ views ].concat(_.toArray(arguments));
                        return _[method].apply(_, args);
                    };
                }), Container;
            }(Backbone, _), Backbone.ChildViewContainer.VERSION = "0.1.5", Backbone.ChildViewContainer.noConflict = function() {
                return Backbone.ChildViewContainer = previousChildViewContainer, this;
            }, Backbone.ChildViewContainer;
        });
    }, {
        backbone: "backbone",
        underscore: "underscore"
    } ],
    backbone: [ function(require, module, exports) {
        !function(root, factory) {
            if ("function" == typeof define && define.amd) define([ "underscore", "jquery", "exports" ], function(_, $, exports) {
                root.Backbone = factory(root, exports, _, $);
            }); else if ("undefined" != typeof exports) {
                var _ = require("underscore");
                factory(root, exports, _);
            } else root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
        }(this, function(root, Backbone, _, $) {
            {
                var previousBackbone = root.Backbone, array = [], slice = (array.push, array.slice);
                array.splice;
            }
            Backbone.VERSION = "1.1.2", Backbone.$ = $, Backbone.noConflict = function() {
                return root.Backbone = previousBackbone, this;
            }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
            var Events = Backbone.Events = {
                on: function(name, callback, context) {
                    if (!eventsApi(this, "on", name, [ callback, context ]) || !callback) return this;
                    this._events || (this._events = {});
                    var events = this._events[name] || (this._events[name] = []);
                    return events.push({
                        callback: callback,
                        context: context,
                        ctx: context || this
                    }), this;
                },
                once: function(name, callback, context) {
                    if (!eventsApi(this, "once", name, [ callback, context ]) || !callback) return this;
                    var self = this, once = _.once(function() {
                        self.off(name, once), callback.apply(this, arguments);
                    });
                    return once._callback = callback, this.on(name, once, context);
                },
                off: function(name, callback, context) {
                    var retain, ev, events, names, i, l, j, k;
                    if (!this._events || !eventsApi(this, "off", name, [ callback, context ])) return this;
                    if (!name && !callback && !context) return this._events = void 0, this;
                    for (names = name ? [ name ] : _.keys(this._events), i = 0, l = names.length; l > i; i++) if (name = names[i], 
                    events = this._events[name]) {
                        if (this._events[name] = retain = [], callback || context) for (j = 0, k = events.length; k > j; j++) ev = events[j], 
                        (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                        retain.length || delete this._events[name];
                    }
                    return this;
                },
                trigger: function(name) {
                    if (!this._events) return this;
                    var args = slice.call(arguments, 1);
                    if (!eventsApi(this, "trigger", name, args)) return this;
                    var events = this._events[name], allEvents = this._events.all;
                    return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), 
                    this;
                },
                stopListening: function(obj, name, callback) {
                    var listeningTo = this._listeningTo;
                    if (!listeningTo) return this;
                    var remove = !name && !callback;
                    callback || "object" != typeof name || (callback = this), obj && ((listeningTo = {})[obj._listenId] = obj);
                    for (var id in listeningTo) obj = listeningTo[id], obj.off(name, callback, this), 
                    (remove || _.isEmpty(obj._events)) && delete this._listeningTo[id];
                    return this;
                }
            }, eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
                if (!name) return !0;
                if ("object" == typeof name) {
                    for (var key in name) obj[action].apply(obj, [ key, name[key] ].concat(rest));
                    return !1;
                }
                if (eventSplitter.test(name)) {
                    for (var names = name.split(eventSplitter), i = 0, l = names.length; l > i; i++) obj[action].apply(obj, [ names[i] ].concat(rest));
                    return !1;
                }
                return !0;
            }, triggerEvents = function(events, args) {
                var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
                switch (args.length) {
                  case 0:
                    for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx);
                    return;

                  case 1:
                    for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1);
                    return;

                  case 2:
                    for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2);
                    return;

                  case 3:
                    for (;++i < l; ) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                    return;

                  default:
                    for (;++i < l; ) (ev = events[i]).callback.apply(ev.ctx, args);
                    return;
                }
            }, listenMethods = {
                listenTo: "on",
                listenToOnce: "once"
            };
            _.each(listenMethods, function(implementation, method) {
                Events[method] = function(obj, name, callback) {
                    var listeningTo = this._listeningTo || (this._listeningTo = {}), id = obj._listenId || (obj._listenId = _.uniqueId("l"));
                    return listeningTo[id] = obj, callback || "object" != typeof name || (callback = this), 
                    obj[implementation](name, callback, this), this;
                };
            }), Events.bind = Events.on, Events.unbind = Events.off, _.extend(Backbone, Events);
            var Model = Backbone.Model = function(attributes, options) {
                var attrs = attributes || {};
                options || (options = {}), this.cid = _.uniqueId("c"), this.attributes = {}, options.collection && (this.collection = options.collection), 
                options.parse && (attrs = this.parse(attrs, options) || {}), attrs = _.defaults({}, attrs, _.result(this, "defaults")), 
                this.set(attrs, options), this.changed = {}, this.initialize.apply(this, arguments);
            };
            _.extend(Model.prototype, Events, {
                changed: null,
                validationError: null,
                idAttribute: "id",
                initialize: function() {},
                toJSON: function() {
                    return _.clone(this.attributes);
                },
                sync: function() {
                    return Backbone.sync.apply(this, arguments);
                },
                get: function(attr) {
                    return this.attributes[attr];
                },
                escape: function(attr) {
                    return _.escape(this.get(attr));
                },
                has: function(attr) {
                    return null != this.get(attr);
                },
                set: function(key, val, options) {
                    var attr, attrs, unset, changes, silent, changing, prev, current;
                    if (null == key) return this;
                    if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, 
                    options || (options = {}), !this._validate(attrs, options)) return !1;
                    unset = options.unset, silent = options.silent, changes = [], changing = this._changing, 
                    this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), 
                    this.changed = {}), current = this.attributes, prev = this._previousAttributes, 
                    this.idAttribute in attrs && (this.id = attrs[this.idAttribute]);
                    for (attr in attrs) val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), 
                    _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, 
                    unset ? delete current[attr] : current[attr] = val;
                    if (!silent) {
                        changes.length && (this._pending = options);
                        for (var i = 0, l = changes.length; l > i; i++) this.trigger("change:" + changes[i], this, current[changes[i]], options);
                    }
                    if (changing) return this;
                    if (!silent) for (;this._pending; ) options = this._pending, this._pending = !1, 
                    this.trigger("change", this, options);
                    return this._pending = !1, this._changing = !1, this;
                },
                unset: function(attr, options) {
                    return this.set(attr, void 0, _.extend({}, options, {
                        unset: !0
                    }));
                },
                clear: function(options) {
                    var attrs = {};
                    for (var key in this.attributes) attrs[key] = void 0;
                    return this.set(attrs, _.extend({}, options, {
                        unset: !0
                    }));
                },
                hasChanged: function(attr) {
                    return null == attr ? !_.isEmpty(this.changed) : _.has(this.changed, attr);
                },
                changedAttributes: function(diff) {
                    if (!diff) return this.hasChanged() ? _.clone(this.changed) : !1;
                    var val, changed = !1, old = this._changing ? this._previousAttributes : this.attributes;
                    for (var attr in diff) _.isEqual(old[attr], val = diff[attr]) || ((changed || (changed = {}))[attr] = val);
                    return changed;
                },
                previous: function(attr) {
                    return null != attr && this._previousAttributes ? this._previousAttributes[attr] : null;
                },
                previousAttributes: function() {
                    return _.clone(this._previousAttributes);
                },
                fetch: function(options) {
                    options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                    var model = this, success = options.success;
                    return options.success = function(resp) {
                        return model.set(model.parse(resp, options), options) ? (success && success(model, resp, options), 
                        void model.trigger("sync", model, resp, options)) : !1;
                    }, wrapError(this, options), this.sync("read", this, options);
                },
                save: function(key, val, options) {
                    var attrs, method, xhr, attributes = this.attributes;
                    if (null == key || "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, 
                    options = _.extend({
                        validate: !0
                    }, options), attrs && !options.wait) {
                        if (!this.set(attrs, options)) return !1;
                    } else if (!this._validate(attrs, options)) return !1;
                    attrs && options.wait && (this.attributes = _.extend({}, attributes, attrs)), void 0 === options.parse && (options.parse = !0);
                    var model = this, success = options.success;
                    return options.success = function(resp) {
                        model.attributes = attributes;
                        var serverAttrs = model.parse(resp, options);
                        return options.wait && (serverAttrs = _.extend(attrs || {}, serverAttrs)), _.isObject(serverAttrs) && !model.set(serverAttrs, options) ? !1 : (success && success(model, resp, options), 
                        void model.trigger("sync", model, resp, options));
                    }, wrapError(this, options), method = this.isNew() ? "create" : options.patch ? "patch" : "update", 
                    "patch" === method && (options.attrs = attrs), xhr = this.sync(method, this, options), 
                    attrs && options.wait && (this.attributes = attributes), xhr;
                },
                destroy: function(options) {
                    options = options ? _.clone(options) : {};
                    var model = this, success = options.success, destroy = function() {
                        model.trigger("destroy", model, model.collection, options);
                    };
                    if (options.success = function(resp) {
                        (options.wait || model.isNew()) && destroy(), success && success(model, resp, options), 
                        model.isNew() || model.trigger("sync", model, resp, options);
                    }, this.isNew()) return options.success(), !1;
                    wrapError(this, options);
                    var xhr = this.sync("delete", this, options);
                    return options.wait || destroy(), xhr;
                },
                url: function() {
                    var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
                    return this.isNew() ? base : base.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id);
                },
                parse: function(resp) {
                    return resp;
                },
                clone: function() {
                    return new this.constructor(this.attributes);
                },
                isNew: function() {
                    return !this.has(this.idAttribute);
                },
                isValid: function(options) {
                    return this._validate({}, _.extend(options || {}, {
                        validate: !0
                    }));
                },
                _validate: function(attrs, options) {
                    if (!options.validate || !this.validate) return !0;
                    attrs = _.extend({}, this.attributes, attrs);
                    var error = this.validationError = this.validate(attrs, options) || null;
                    return error ? (this.trigger("invalid", this, error, _.extend(options, {
                        validationError: error
                    })), !1) : !0;
                }
            });
            var modelMethods = [ "keys", "values", "pairs", "invert", "pick", "omit" ];
            _.each(modelMethods, function(method) {
                Model.prototype[method] = function() {
                    var args = slice.call(arguments);
                    return args.unshift(this.attributes), _[method].apply(_, args);
                };
            });
            var Collection = Backbone.Collection = function(models, options) {
                options || (options = {}), options.model && (this.model = options.model), void 0 !== options.comparator && (this.comparator = options.comparator), 
                this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, _.extend({
                    silent: !0
                }, options));
            }, setOptions = {
                add: !0,
                remove: !0,
                merge: !0
            }, addOptions = {
                add: !0,
                remove: !1
            };
            _.extend(Collection.prototype, Events, {
                model: Model,
                initialize: function() {},
                toJSON: function(options) {
                    return this.map(function(model) {
                        return model.toJSON(options);
                    });
                },
                sync: function() {
                    return Backbone.sync.apply(this, arguments);
                },
                add: function(models, options) {
                    return this.set(models, _.extend({
                        merge: !1
                    }, options, addOptions));
                },
                remove: function(models, options) {
                    var singular = !_.isArray(models);
                    models = singular ? [ models ] : _.clone(models), options || (options = {});
                    var i, l, index, model;
                    for (i = 0, l = models.length; l > i; i++) model = models[i] = this.get(models[i]), 
                    model && (delete this._byId[model.id], delete this._byId[model.cid], index = this.indexOf(model), 
                    this.models.splice(index, 1), this.length--, options.silent || (options.index = index, 
                    model.trigger("remove", model, this, options)), this._removeReference(model, options));
                    return singular ? models[0] : models;
                },
                set: function(models, options) {
                    options = _.defaults({}, options, setOptions), options.parse && (models = this.parse(models, options));
                    var singular = !_.isArray(models);
                    models = singular ? models ? [ models ] : [] : _.clone(models);
                    var i, l, id, model, attrs, existing, sort, at = options.at, targetModel = this.model, sortable = this.comparator && null == at && options.sort !== !1, sortAttr = _.isString(this.comparator) ? this.comparator : null, toAdd = [], toRemove = [], modelMap = {}, add = options.add, merge = options.merge, remove = options.remove, order = !sortable && add && remove ? [] : !1;
                    for (i = 0, l = models.length; l > i; i++) {
                        if (attrs = models[i] || {}, id = attrs instanceof Model ? model = attrs : attrs[targetModel.prototype.idAttribute || "id"], 
                        existing = this.get(id)) remove && (modelMap[existing.cid] = !0), merge && (attrs = attrs === model ? model.attributes : attrs, 
                        options.parse && (attrs = existing.parse(attrs, options)), existing.set(attrs, options), 
                        sortable && !sort && existing.hasChanged(sortAttr) && (sort = !0)), models[i] = existing; else if (add) {
                            if (model = models[i] = this._prepareModel(attrs, options), !model) continue;
                            toAdd.push(model), this._addReference(model, options);
                        }
                        model = existing || model, !order || !model.isNew() && modelMap[model.id] || order.push(model), 
                        modelMap[model.id] = !0;
                    }
                    if (remove) {
                        for (i = 0, l = this.length; l > i; ++i) modelMap[(model = this.models[i]).cid] || toRemove.push(model);
                        toRemove.length && this.remove(toRemove, options);
                    }
                    if (toAdd.length || order && order.length) if (sortable && (sort = !0), this.length += toAdd.length, 
                    null != at) for (i = 0, l = toAdd.length; l > i; i++) this.models.splice(at + i, 0, toAdd[i]); else {
                        order && (this.models.length = 0);
                        var orderedModels = order || toAdd;
                        for (i = 0, l = orderedModels.length; l > i; i++) this.models.push(orderedModels[i]);
                    }
                    if (sort && this.sort({
                        silent: !0
                    }), !options.silent) {
                        for (i = 0, l = toAdd.length; l > i; i++) (model = toAdd[i]).trigger("add", model, this, options);
                        (sort || order && order.length) && this.trigger("sort", this, options);
                    }
                    return singular ? models[0] : models;
                },
                reset: function(models, options) {
                    options || (options = {});
                    for (var i = 0, l = this.models.length; l > i; i++) this._removeReference(this.models[i], options);
                    return options.previousModels = this.models, this._reset(), models = this.add(models, _.extend({
                        silent: !0
                    }, options)), options.silent || this.trigger("reset", this, options), models;
                },
                push: function(model, options) {
                    return this.add(model, _.extend({
                        at: this.length
                    }, options));
                },
                pop: function(options) {
                    var model = this.at(this.length - 1);
                    return this.remove(model, options), model;
                },
                unshift: function(model, options) {
                    return this.add(model, _.extend({
                        at: 0
                    }, options));
                },
                shift: function(options) {
                    var model = this.at(0);
                    return this.remove(model, options), model;
                },
                slice: function() {
                    return slice.apply(this.models, arguments);
                },
                get: function(obj) {
                    return null == obj ? void 0 : this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
                },
                at: function(index) {
                    return this.models[index];
                },
                where: function(attrs, first) {
                    return _.isEmpty(attrs) ? first ? void 0 : [] : this[first ? "find" : "filter"](function(model) {
                        for (var key in attrs) if (attrs[key] !== model.get(key)) return !1;
                        return !0;
                    });
                },
                findWhere: function(attrs) {
                    return this.where(attrs, !0);
                },
                sort: function(options) {
                    if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
                    return options || (options = {}), _.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(_.bind(this.comparator, this)), 
                    options.silent || this.trigger("sort", this, options), this;
                },
                pluck: function(attr) {
                    return _.invoke(this.models, "get", attr);
                },
                fetch: function(options) {
                    options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                    var success = options.success, collection = this;
                    return options.success = function(resp) {
                        var method = options.reset ? "reset" : "set";
                        collection[method](resp, options), success && success(collection, resp, options), 
                        collection.trigger("sync", collection, resp, options);
                    }, wrapError(this, options), this.sync("read", this, options);
                },
                create: function(model, options) {
                    if (options = options ? _.clone(options) : {}, !(model = this._prepareModel(model, options))) return !1;
                    options.wait || this.add(model, options);
                    var collection = this, success = options.success;
                    return options.success = function(model, resp) {
                        options.wait && collection.add(model, options), success && success(model, resp, options);
                    }, model.save(null, options), model;
                },
                parse: function(resp) {
                    return resp;
                },
                clone: function() {
                    return new this.constructor(this.models);
                },
                _reset: function() {
                    this.length = 0, this.models = [], this._byId = {};
                },
                _prepareModel: function(attrs, options) {
                    if (attrs instanceof Model) return attrs;
                    options = options ? _.clone(options) : {}, options.collection = this;
                    var model = new this.model(attrs, options);
                    return model.validationError ? (this.trigger("invalid", this, model.validationError, options), 
                    !1) : model;
                },
                _addReference: function(model) {
                    this._byId[model.cid] = model, null != model.id && (this._byId[model.id] = model), 
                    model.collection || (model.collection = this), model.on("all", this._onModelEvent, this);
                },
                _removeReference: function(model) {
                    this === model.collection && delete model.collection, model.off("all", this._onModelEvent, this);
                },
                _onModelEvent: function(event, model, collection, options) {
                    ("add" !== event && "remove" !== event || collection === this) && ("destroy" === event && this.remove(model, options), 
                    model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], 
                    null != model.id && (this._byId[model.id] = model)), this.trigger.apply(this, arguments));
                }
            });
            var methods = [ "forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample" ];
            _.each(methods, function(method) {
                Collection.prototype[method] = function() {
                    var args = slice.call(arguments);
                    return args.unshift(this.models), _[method].apply(_, args);
                };
            });
            var attributeMethods = [ "groupBy", "countBy", "sortBy", "indexBy" ];
            _.each(attributeMethods, function(method) {
                Collection.prototype[method] = function(value, context) {
                    var iterator = _.isFunction(value) ? value : function(model) {
                        return model.get(value);
                    };
                    return _[method](this.models, iterator, context);
                };
            });
            var View = Backbone.View = function(options) {
                this.cid = _.uniqueId("view"), options || (options = {}), _.extend(this, _.pick(options, viewOptions)), 
                this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
            }, delegateEventSplitter = /^(\S+)\s*(.*)$/, viewOptions = [ "model", "collection", "el", "id", "attributes", "className", "tagName", "events" ];
            _.extend(View.prototype, Events, {
                tagName: "div",
                $: function(selector) {
                    return this.$el.find(selector);
                },
                initialize: function() {},
                render: function() {
                    return this;
                },
                remove: function() {
                    return this.$el.remove(), this.stopListening(), this;
                },
                setElement: function(element, delegate) {
                    return this.$el && this.undelegateEvents(), this.$el = element instanceof Backbone.$ ? element : Backbone.$(element), 
                    this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this;
                },
                delegateEvents: function(events) {
                    if (!events && !(events = _.result(this, "events"))) return this;
                    this.undelegateEvents();
                    for (var key in events) {
                        var method = events[key];
                        if (_.isFunction(method) || (method = this[events[key]]), method) {
                            var match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2];
                            method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, "" === selector ? this.$el.on(eventName, method) : this.$el.on(eventName, selector, method);
                        }
                    }
                    return this;
                },
                undelegateEvents: function() {
                    return this.$el.off(".delegateEvents" + this.cid), this;
                },
                _ensureElement: function() {
                    if (this.el) this.setElement(_.result(this, "el"), !1); else {
                        var attrs = _.extend({}, _.result(this, "attributes"));
                        this.id && (attrs.id = _.result(this, "id")), this.className && (attrs["class"] = _.result(this, "className"));
                        var $el = Backbone.$("<" + _.result(this, "tagName") + ">").attr(attrs);
                        this.setElement($el, !1);
                    }
                }
            }), Backbone.sync = function(method, model, options) {
                var type = methodMap[method];
                _.defaults(options || (options = {}), {
                    emulateHTTP: Backbone.emulateHTTP,
                    emulateJSON: Backbone.emulateJSON
                });
                var params = {
                    type: type,
                    dataType: "json"
                };
                if (options.url || (params.url = _.result(model, "url") || urlError()), null != options.data || !model || "create" !== method && "update" !== method && "patch" !== method || (params.contentType = "application/json", 
                params.data = JSON.stringify(options.attrs || model.toJSON(options))), options.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", 
                params.data = params.data ? {
                    model: params.data
                } : {}), options.emulateHTTP && ("PUT" === type || "DELETE" === type || "PATCH" === type)) {
                    params.type = "POST", options.emulateJSON && (params.data._method = type);
                    var beforeSend = options.beforeSend;
                    options.beforeSend = function(xhr) {
                        return xhr.setRequestHeader("X-HTTP-Method-Override", type), beforeSend ? beforeSend.apply(this, arguments) : void 0;
                    };
                }
                "GET" === params.type || options.emulateJSON || (params.processData = !1), "PATCH" === params.type && noXhrPatch && (params.xhr = function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                });
                var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
                return model.trigger("request", model, xhr, options), xhr;
            };
            var noXhrPatch = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && new XMLHttpRequest().dispatchEvent), methodMap = {
                create: "POST",
                update: "PUT",
                patch: "PATCH",
                "delete": "DELETE",
                read: "GET"
            };
            Backbone.ajax = function() {
                return Backbone.$.ajax.apply(Backbone.$, arguments);
            };
            var Router = Backbone.Router = function(options) {
                options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), 
                this.initialize.apply(this, arguments);
            }, optionalParam = /\((.*?)\)/g, namedParam = /(\(\?)?:\w+/g, splatParam = /\*\w+/g, escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
            _.extend(Router.prototype, Events, {
                initialize: function() {},
                route: function(route, name, callback) {
                    _.isRegExp(route) || (route = this._routeToRegExp(route)), _.isFunction(name) && (callback = name, 
                    name = ""), callback || (callback = this[name]);
                    var router = this;
                    return Backbone.history.route(route, function(fragment) {
                        var args = router._extractParameters(route, fragment);
                        router.execute(callback, args), router.trigger.apply(router, [ "route:" + name ].concat(args)), 
                        router.trigger("route", name, args), Backbone.history.trigger("route", router, name, args);
                    }), this;
                },
                execute: function(callback, args) {
                    callback && callback.apply(this, args);
                },
                navigate: function(fragment, options) {
                    return Backbone.history.navigate(fragment, options), this;
                },
                _bindRoutes: function() {
                    if (this.routes) {
                        this.routes = _.result(this, "routes");
                        for (var route, routes = _.keys(this.routes); null != (route = routes.pop()); ) this.route(route, this.routes[route]);
                    }
                },
                _routeToRegExp: function(route) {
                    return route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
                        return optional ? match : "([^/?]+)";
                    }).replace(splatParam, "([^?]*?)"), new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
                },
                _extractParameters: function(route, fragment) {
                    var params = route.exec(fragment).slice(1);
                    return _.map(params, function(param, i) {
                        return i === params.length - 1 ? param || null : param ? decodeURIComponent(param) : null;
                    });
                }
            });
            var History = Backbone.History = function() {
                this.handlers = [], _.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, 
                this.history = window.history);
            }, routeStripper = /^[#\/]|\s+$/g, rootStripper = /^\/+|\/+$/g, isExplorer = /msie [\w.]+/, trailingSlash = /\/$/, pathStripper = /#.*$/;
            History.started = !1, _.extend(History.prototype, Events, {
                interval: 50,
                atRoot: function() {
                    return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root;
                },
                getHash: function(window) {
                    var match = (window || this).location.href.match(/#(.*)$/);
                    return match ? match[1] : "";
                },
                getFragment: function(fragment, forcePushState) {
                    if (null == fragment) if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                        fragment = decodeURI(this.location.pathname + this.location.search);
                        var root = this.root.replace(trailingSlash, "");
                        fragment.indexOf(root) || (fragment = fragment.slice(root.length));
                    } else fragment = this.getHash();
                    return fragment.replace(routeStripper, "");
                },
                start: function(options) {
                    if (History.started) throw new Error("Backbone.history has already been started");
                    History.started = !0, this.options = _.extend({
                        root: "/"
                    }, this.options, options), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, 
                    this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                    var fragment = this.getFragment(), docMode = document.documentMode, oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || 7 >= docMode);
                    if (this.root = ("/" + this.root + "/").replace(rootStripper, "/"), oldIE && this._wantsHashChange) {
                        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
                        this.iframe = frame.hide().appendTo("body")[0].contentWindow, this.navigate(fragment);
                    }
                    this._hasPushState ? Backbone.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? Backbone.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), 
                    this.fragment = fragment;
                    var loc = this.location;
                    if (this._wantsHashChange && this._wantsPushState) {
                        if (!this._hasPushState && !this.atRoot()) return this.fragment = this.getFragment(null, !0), 
                        this.location.replace(this.root + "#" + this.fragment), !0;
                        this._hasPushState && this.atRoot() && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), 
                        this.history.replaceState({}, document.title, this.root + this.fragment));
                    }
                    return this.options.silent ? void 0 : this.loadUrl();
                },
                stop: function() {
                    Backbone.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), 
                    this._checkUrlInterval && clearInterval(this._checkUrlInterval), History.started = !1;
                },
                route: function(route, callback) {
                    this.handlers.unshift({
                        route: route,
                        callback: callback
                    });
                },
                checkUrl: function() {
                    var current = this.getFragment();
                    return current === this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe))), 
                    current === this.fragment ? !1 : (this.iframe && this.navigate(current), void this.loadUrl());
                },
                loadUrl: function(fragment) {
                    return fragment = this.fragment = this.getFragment(fragment), _.any(this.handlers, function(handler) {
                        return handler.route.test(fragment) ? (handler.callback(fragment), !0) : void 0;
                    });
                },
                navigate: function(fragment, options) {
                    if (!History.started) return !1;
                    options && options !== !0 || (options = {
                        trigger: !!options
                    });
                    var url = this.root + (fragment = this.getFragment(fragment || ""));
                    if (fragment = fragment.replace(pathStripper, ""), this.fragment !== fragment) {
                        if (this.fragment = fragment, "" === fragment && "/" !== url && (url = url.slice(0, -1)), 
                        this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url); else {
                            if (!this._wantsHashChange) return this.location.assign(url);
                            this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), 
                            this._updateHash(this.iframe.location, fragment, options.replace));
                        }
                        return options.trigger ? this.loadUrl(fragment) : void 0;
                    }
                },
                _updateHash: function(location, fragment, replace) {
                    if (replace) {
                        var href = location.href.replace(/(javascript:|#).*$/, "");
                        location.replace(href + "#" + fragment);
                    } else location.hash = "#" + fragment;
                }
            }), Backbone.history = new History();
            var extend = function(protoProps, staticProps) {
                var child, parent = this;
                child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function() {
                    return parent.apply(this, arguments);
                }, _.extend(child, parent, staticProps);
                var Surrogate = function() {
                    this.constructor = child;
                };
                return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(), 
                protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype, 
                child;
            };
            Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
            var urlError = function() {
                throw new Error('A "url" property or function must be specified');
            }, wrapError = function(model, options) {
                var error = options.error;
                options.error = function(resp) {
                    error && error(model, resp, options), model.trigger("error", model, resp, options);
                };
            };
            return Backbone;
        });
    }, {
        underscore: "underscore"
    } ],
    hammerjs: [ function(require, module) {
        !function(window, document, exportName, undefined) {
            "use strict";
            function setTimeoutContext(fn, timeout, context) {
                return setTimeout(bindFn(fn, context), timeout);
            }
            function invokeArrayArg(arg, fn, context) {
                return Array.isArray(arg) ? (each(arg, context[fn], context), !0) : !1;
            }
            function each(obj, iterator, context) {
                var i;
                if (obj) if (obj.forEach) obj.forEach(iterator, context); else if (obj.length !== undefined) for (i = 0; i < obj.length; ) iterator.call(context, obj[i], i, obj), 
                i++; else for (i in obj) obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
            function extend(dest, src, merge) {
                for (var keys = Object.keys(src), i = 0; i < keys.length; ) (!merge || merge && dest[keys[i]] === undefined) && (dest[keys[i]] = src[keys[i]]), 
                i++;
                return dest;
            }
            function merge(dest, src) {
                return extend(dest, src, !0);
            }
            function inherit(child, base, properties) {
                var childP, baseP = base.prototype;
                childP = child.prototype = Object.create(baseP), childP.constructor = child, childP._super = baseP, 
                properties && extend(childP, properties);
            }
            function bindFn(fn, context) {
                return function() {
                    return fn.apply(context, arguments);
                };
            }
            function boolOrFn(val, args) {
                return typeof val == TYPE_FUNCTION ? val.apply(args ? args[0] || undefined : undefined, args) : val;
            }
            function ifUndefined(val1, val2) {
                return val1 === undefined ? val2 : val1;
            }
            function addEventListeners(target, types, handler) {
                each(splitStr(types), function(type) {
                    target.addEventListener(type, handler, !1);
                });
            }
            function removeEventListeners(target, types, handler) {
                each(splitStr(types), function(type) {
                    target.removeEventListener(type, handler, !1);
                });
            }
            function hasParent(node, parent) {
                for (;node; ) {
                    if (node == parent) return !0;
                    node = node.parentNode;
                }
                return !1;
            }
            function inStr(str, find) {
                return str.indexOf(find) > -1;
            }
            function splitStr(str) {
                return str.trim().split(/\s+/g);
            }
            function inArray(src, find, findByKey) {
                if (src.indexOf && !findByKey) return src.indexOf(find);
                for (var i = 0; i < src.length; ) {
                    if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) return i;
                    i++;
                }
                return -1;
            }
            function toArray(obj) {
                return Array.prototype.slice.call(obj, 0);
            }
            function uniqueArray(src, key, sort) {
                for (var results = [], values = [], i = 0; i < src.length; ) {
                    var val = key ? src[i][key] : src[i];
                    inArray(values, val) < 0 && results.push(src[i]), values[i] = val, i++;
                }
                return sort && (results = key ? results.sort(function(a, b) {
                    return a[key] > b[key];
                }) : results.sort()), results;
            }
            function prefixed(obj, property) {
                for (var prefix, prop, camelProp = property[0].toUpperCase() + property.slice(1), i = 0; i < VENDOR_PREFIXES.length; ) {
                    if (prefix = VENDOR_PREFIXES[i], prop = prefix ? prefix + camelProp : property, 
                    prop in obj) return prop;
                    i++;
                }
                return undefined;
            }
            function uniqueId() {
                return _uniqueId++;
            }
            function getWindowForElement(element) {
                var doc = element.ownerDocument;
                return doc.defaultView || doc.parentWindow;
            }
            function Input(manager, callback) {
                var self = this;
                this.manager = manager, this.callback = callback, this.element = manager.element, 
                this.target = manager.options.inputTarget, this.domHandler = function(ev) {
                    boolOrFn(manager.options.enable, [ manager ]) && self.handler(ev);
                }, this.init();
            }
            function createInputInstance(manager) {
                var Type, inputClass = manager.options.inputClass;
                return new (Type = inputClass ? inputClass : SUPPORT_POINTER_EVENTS ? PointerEventInput : SUPPORT_ONLY_TOUCH ? TouchInput : SUPPORT_TOUCH ? TouchMouseInput : MouseInput)(manager, inputHandler);
            }
            function inputHandler(manager, eventType, input) {
                var pointersLen = input.pointers.length, changedPointersLen = input.changedPointers.length, isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0, isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
                input.isFirst = !!isFirst, input.isFinal = !!isFinal, isFirst && (manager.session = {}), 
                input.eventType = eventType, computeInputData(manager, input), manager.emit("hammer.input", input), 
                manager.recognize(input), manager.session.prevInput = input;
            }
            function computeInputData(manager, input) {
                var session = manager.session, pointers = input.pointers, pointersLength = pointers.length;
                session.firstInput || (session.firstInput = simpleCloneInputData(input)), pointersLength > 1 && !session.firstMultiple ? session.firstMultiple = simpleCloneInputData(input) : 1 === pointersLength && (session.firstMultiple = !1);
                var firstInput = session.firstInput, firstMultiple = session.firstMultiple, offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center, center = input.center = getCenter(pointers);
                input.timeStamp = now(), input.deltaTime = input.timeStamp - firstInput.timeStamp, 
                input.angle = getAngle(offsetCenter, center), input.distance = getDistance(offsetCenter, center), 
                computeDeltaXY(session, input), input.offsetDirection = getDirection(input.deltaX, input.deltaY), 
                input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1, input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0, 
                computeIntervalInputData(session, input);
                var target = manager.element;
                hasParent(input.srcEvent.target, target) && (target = input.srcEvent.target), input.target = target;
            }
            function computeDeltaXY(session, input) {
                var center = input.center, offset = session.offsetDelta || {}, prevDelta = session.prevDelta || {}, prevInput = session.prevInput || {};
                (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) && (prevDelta = session.prevDelta = {
                    x: prevInput.deltaX || 0,
                    y: prevInput.deltaY || 0
                }, offset = session.offsetDelta = {
                    x: center.x,
                    y: center.y
                }), input.deltaX = prevDelta.x + (center.x - offset.x), input.deltaY = prevDelta.y + (center.y - offset.y);
            }
            function computeIntervalInputData(session, input) {
                var velocity, velocityX, velocityY, direction, last = session.lastInterval || input, deltaTime = input.timeStamp - last.timeStamp;
                if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
                    var deltaX = last.deltaX - input.deltaX, deltaY = last.deltaY - input.deltaY, v = getVelocity(deltaTime, deltaX, deltaY);
                    velocityX = v.x, velocityY = v.y, velocity = abs(v.x) > abs(v.y) ? v.x : v.y, direction = getDirection(deltaX, deltaY), 
                    session.lastInterval = input;
                } else velocity = last.velocity, velocityX = last.velocityX, velocityY = last.velocityY, 
                direction = last.direction;
                input.velocity = velocity, input.velocityX = velocityX, input.velocityY = velocityY, 
                input.direction = direction;
            }
            function simpleCloneInputData(input) {
                for (var pointers = [], i = 0; i < input.pointers.length; ) pointers[i] = {
                    clientX: round(input.pointers[i].clientX),
                    clientY: round(input.pointers[i].clientY)
                }, i++;
                return {
                    timeStamp: now(),
                    pointers: pointers,
                    center: getCenter(pointers),
                    deltaX: input.deltaX,
                    deltaY: input.deltaY
                };
            }
            function getCenter(pointers) {
                var pointersLength = pointers.length;
                if (1 === pointersLength) return {
                    x: round(pointers[0].clientX),
                    y: round(pointers[0].clientY)
                };
                for (var x = 0, y = 0, i = 0; pointersLength > i; ) x += pointers[i].clientX, y += pointers[i].clientY, 
                i++;
                return {
                    x: round(x / pointersLength),
                    y: round(y / pointersLength)
                };
            }
            function getVelocity(deltaTime, x, y) {
                return {
                    x: x / deltaTime || 0,
                    y: y / deltaTime || 0
                };
            }
            function getDirection(x, y) {
                return x === y ? DIRECTION_NONE : abs(x) >= abs(y) ? x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT : y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
            }
            function getDistance(p1, p2, props) {
                props || (props = PROPS_XY);
                var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
                return Math.sqrt(x * x + y * y);
            }
            function getAngle(p1, p2, props) {
                props || (props = PROPS_XY);
                var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
                return 180 * Math.atan2(y, x) / Math.PI;
            }
            function getRotation(start, end) {
                return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
            }
            function getScale(start, end) {
                return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
            }
            function MouseInput() {
                this.evEl = MOUSE_ELEMENT_EVENTS, this.evWin = MOUSE_WINDOW_EVENTS, this.allow = !0, 
                this.pressed = !1, Input.apply(this, arguments);
            }
            function PointerEventInput() {
                this.evEl = POINTER_ELEMENT_EVENTS, this.evWin = POINTER_WINDOW_EVENTS, Input.apply(this, arguments), 
                this.store = this.manager.session.pointerEvents = [];
            }
            function SingleTouchInput() {
                this.evTarget = SINGLE_TOUCH_TARGET_EVENTS, this.evWin = SINGLE_TOUCH_WINDOW_EVENTS, 
                this.started = !1, Input.apply(this, arguments);
            }
            function normalizeSingleTouches(ev, type) {
                var all = toArray(ev.touches), changed = toArray(ev.changedTouches);
                return type & (INPUT_END | INPUT_CANCEL) && (all = uniqueArray(all.concat(changed), "identifier", !0)), 
                [ all, changed ];
            }
            function TouchInput() {
                this.evTarget = TOUCH_TARGET_EVENTS, this.targetIds = {}, Input.apply(this, arguments);
            }
            function getTouches(ev, type) {
                var allTouches = toArray(ev.touches), targetIds = this.targetIds;
                if (type & (INPUT_START | INPUT_MOVE) && 1 === allTouches.length) return targetIds[allTouches[0].identifier] = !0, 
                [ allTouches, allTouches ];
                var i, targetTouches, changedTouches = toArray(ev.changedTouches), changedTargetTouches = [], target = this.target;
                if (targetTouches = allTouches.filter(function(touch) {
                    return hasParent(touch.target, target);
                }), type === INPUT_START) for (i = 0; i < targetTouches.length; ) targetIds[targetTouches[i].identifier] = !0, 
                i++;
                for (i = 0; i < changedTouches.length; ) targetIds[changedTouches[i].identifier] && changedTargetTouches.push(changedTouches[i]), 
                type & (INPUT_END | INPUT_CANCEL) && delete targetIds[changedTouches[i].identifier], 
                i++;
                return changedTargetTouches.length ? [ uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", !0), changedTargetTouches ] : void 0;
            }
            function TouchMouseInput() {
                Input.apply(this, arguments);
                var handler = bindFn(this.handler, this);
                this.touch = new TouchInput(this.manager, handler), this.mouse = new MouseInput(this.manager, handler);
            }
            function TouchAction(manager, value) {
                this.manager = manager, this.set(value);
            }
            function cleanTouchActions(actions) {
                if (inStr(actions, TOUCH_ACTION_NONE)) return TOUCH_ACTION_NONE;
                var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X), hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
                return hasPanX && hasPanY ? TOUCH_ACTION_PAN_X + " " + TOUCH_ACTION_PAN_Y : hasPanX || hasPanY ? hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y : inStr(actions, TOUCH_ACTION_MANIPULATION) ? TOUCH_ACTION_MANIPULATION : TOUCH_ACTION_AUTO;
            }
            function Recognizer(options) {
                this.id = uniqueId(), this.manager = null, this.options = merge(options || {}, this.defaults), 
                this.options.enable = ifUndefined(this.options.enable, !0), this.state = STATE_POSSIBLE, 
                this.simultaneous = {}, this.requireFail = [];
            }
            function stateStr(state) {
                return state & STATE_CANCELLED ? "cancel" : state & STATE_ENDED ? "end" : state & STATE_CHANGED ? "move" : state & STATE_BEGAN ? "start" : "";
            }
            function directionStr(direction) {
                return direction == DIRECTION_DOWN ? "down" : direction == DIRECTION_UP ? "up" : direction == DIRECTION_LEFT ? "left" : direction == DIRECTION_RIGHT ? "right" : "";
            }
            function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
                var manager = recognizer.manager;
                return manager ? manager.get(otherRecognizer) : otherRecognizer;
            }
            function AttrRecognizer() {
                Recognizer.apply(this, arguments);
            }
            function PanRecognizer() {
                AttrRecognizer.apply(this, arguments), this.pX = null, this.pY = null;
            }
            function PinchRecognizer() {
                AttrRecognizer.apply(this, arguments);
            }
            function PressRecognizer() {
                Recognizer.apply(this, arguments), this._timer = null, this._input = null;
            }
            function RotateRecognizer() {
                AttrRecognizer.apply(this, arguments);
            }
            function SwipeRecognizer() {
                AttrRecognizer.apply(this, arguments);
            }
            function TapRecognizer() {
                Recognizer.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, 
                this._input = null, this.count = 0;
            }
            function Hammer(element, options) {
                return options = options || {}, options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset), 
                new Manager(element, options);
            }
            function Manager(element, options) {
                options = options || {}, this.options = merge(options, Hammer.defaults), this.options.inputTarget = this.options.inputTarget || element, 
                this.handlers = {}, this.session = {}, this.recognizers = [], this.element = element, 
                this.input = createInputInstance(this), this.touchAction = new TouchAction(this, this.options.touchAction), 
                toggleCssProps(this, !0), each(options.recognizers, function(item) {
                    var recognizer = this.add(new item[0](item[1]));
                    item[2] && recognizer.recognizeWith(item[2]), item[3] && recognizer.requireFailure(item[3]);
                }, this);
            }
            function toggleCssProps(manager, add) {
                var element = manager.element;
                each(manager.options.cssProps, function(value, name) {
                    element.style[prefixed(element.style, name)] = add ? value : "";
                });
            }
            function triggerDomEvent(event, data) {
                var gestureEvent = document.createEvent("Event");
                gestureEvent.initEvent(event, !0, !0), gestureEvent.gesture = data, data.target.dispatchEvent(gestureEvent);
            }
            var VENDOR_PREFIXES = [ "", "webkit", "moz", "MS", "ms", "o" ], TEST_ELEMENT = document.createElement("div"), TYPE_FUNCTION = "function", round = Math.round, abs = Math.abs, now = Date.now, _uniqueId = 1, MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, SUPPORT_TOUCH = "ontouchstart" in window, SUPPORT_POINTER_EVENTS = prefixed(window, "PointerEvent") !== undefined, SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent), INPUT_TYPE_TOUCH = "touch", INPUT_TYPE_PEN = "pen", INPUT_TYPE_MOUSE = "mouse", INPUT_TYPE_KINECT = "kinect", COMPUTE_INTERVAL = 25, INPUT_START = 1, INPUT_MOVE = 2, INPUT_END = 4, INPUT_CANCEL = 8, DIRECTION_NONE = 1, DIRECTION_LEFT = 2, DIRECTION_RIGHT = 4, DIRECTION_UP = 8, DIRECTION_DOWN = 16, DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT, DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN, DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL, PROPS_XY = [ "x", "y" ], PROPS_CLIENT_XY = [ "clientX", "clientY" ];
            Input.prototype = {
                handler: function() {},
                init: function() {
                    this.evEl && addEventListeners(this.element, this.evEl, this.domHandler), this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler), 
                    this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
                },
                destroy: function() {
                    this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler), this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler), 
                    this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
                }
            };
            var MOUSE_INPUT_MAP = {
                mousedown: INPUT_START,
                mousemove: INPUT_MOVE,
                mouseup: INPUT_END
            }, MOUSE_ELEMENT_EVENTS = "mousedown", MOUSE_WINDOW_EVENTS = "mousemove mouseup";
            inherit(MouseInput, Input, {
                handler: function(ev) {
                    var eventType = MOUSE_INPUT_MAP[ev.type];
                    eventType & INPUT_START && 0 === ev.button && (this.pressed = !0), eventType & INPUT_MOVE && 1 !== ev.which && (eventType = INPUT_END), 
                    this.pressed && this.allow && (eventType & INPUT_END && (this.pressed = !1), this.callback(this.manager, eventType, {
                        pointers: [ ev ],
                        changedPointers: [ ev ],
                        pointerType: INPUT_TYPE_MOUSE,
                        srcEvent: ev
                    }));
                }
            });
            var POINTER_INPUT_MAP = {
                pointerdown: INPUT_START,
                pointermove: INPUT_MOVE,
                pointerup: INPUT_END,
                pointercancel: INPUT_CANCEL,
                pointerout: INPUT_CANCEL
            }, IE10_POINTER_TYPE_ENUM = {
                2: INPUT_TYPE_TOUCH,
                3: INPUT_TYPE_PEN,
                4: INPUT_TYPE_MOUSE,
                5: INPUT_TYPE_KINECT
            }, POINTER_ELEMENT_EVENTS = "pointerdown", POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
            window.MSPointerEvent && (POINTER_ELEMENT_EVENTS = "MSPointerDown", POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel"), 
            inherit(PointerEventInput, Input, {
                handler: function(ev) {
                    var store = this.store, removePointer = !1, eventTypeNormalized = ev.type.toLowerCase().replace("ms", ""), eventType = POINTER_INPUT_MAP[eventTypeNormalized], pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType, isTouch = pointerType == INPUT_TYPE_TOUCH, storeIndex = inArray(store, ev.pointerId, "pointerId");
                    eventType & INPUT_START && (0 === ev.button || isTouch) ? 0 > storeIndex && (store.push(ev), 
                    storeIndex = store.length - 1) : eventType & (INPUT_END | INPUT_CANCEL) && (removePointer = !0), 
                    0 > storeIndex || (store[storeIndex] = ev, this.callback(this.manager, eventType, {
                        pointers: store,
                        changedPointers: [ ev ],
                        pointerType: pointerType,
                        srcEvent: ev
                    }), removePointer && store.splice(storeIndex, 1));
                }
            });
            var SINGLE_TOUCH_INPUT_MAP = {
                touchstart: INPUT_START,
                touchmove: INPUT_MOVE,
                touchend: INPUT_END,
                touchcancel: INPUT_CANCEL
            }, SINGLE_TOUCH_TARGET_EVENTS = "touchstart", SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
            inherit(SingleTouchInput, Input, {
                handler: function(ev) {
                    var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
                    if (type === INPUT_START && (this.started = !0), this.started) {
                        var touches = normalizeSingleTouches.call(this, ev, type);
                        type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0 && (this.started = !1), 
                        this.callback(this.manager, type, {
                            pointers: touches[0],
                            changedPointers: touches[1],
                            pointerType: INPUT_TYPE_TOUCH,
                            srcEvent: ev
                        });
                    }
                }
            });
            var TOUCH_INPUT_MAP = {
                touchstart: INPUT_START,
                touchmove: INPUT_MOVE,
                touchend: INPUT_END,
                touchcancel: INPUT_CANCEL
            }, TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
            inherit(TouchInput, Input, {
                handler: function(ev) {
                    var type = TOUCH_INPUT_MAP[ev.type], touches = getTouches.call(this, ev, type);
                    touches && this.callback(this.manager, type, {
                        pointers: touches[0],
                        changedPointers: touches[1],
                        pointerType: INPUT_TYPE_TOUCH,
                        srcEvent: ev
                    });
                }
            }), inherit(TouchMouseInput, Input, {
                handler: function(manager, inputEvent, inputData) {
                    var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH, isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
                    if (isTouch) this.mouse.allow = !1; else if (isMouse && !this.mouse.allow) return;
                    inputEvent & (INPUT_END | INPUT_CANCEL) && (this.mouse.allow = !0), this.callback(manager, inputEvent, inputData);
                },
                destroy: function() {
                    this.touch.destroy(), this.mouse.destroy();
                }
            });
            var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction"), NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined, TOUCH_ACTION_COMPUTE = "compute", TOUCH_ACTION_AUTO = "auto", TOUCH_ACTION_MANIPULATION = "manipulation", TOUCH_ACTION_NONE = "none", TOUCH_ACTION_PAN_X = "pan-x", TOUCH_ACTION_PAN_Y = "pan-y";
            TouchAction.prototype = {
                set: function(value) {
                    value == TOUCH_ACTION_COMPUTE && (value = this.compute()), NATIVE_TOUCH_ACTION && (this.manager.element.style[PREFIXED_TOUCH_ACTION] = value), 
                    this.actions = value.toLowerCase().trim();
                },
                update: function() {
                    this.set(this.manager.options.touchAction);
                },
                compute: function() {
                    var actions = [];
                    return each(this.manager.recognizers, function(recognizer) {
                        boolOrFn(recognizer.options.enable, [ recognizer ]) && (actions = actions.concat(recognizer.getTouchAction()));
                    }), cleanTouchActions(actions.join(" "));
                },
                preventDefaults: function(input) {
                    if (!NATIVE_TOUCH_ACTION) {
                        var srcEvent = input.srcEvent, direction = input.offsetDirection;
                        if (this.manager.session.prevented) return void srcEvent.preventDefault();
                        var actions = this.actions, hasNone = inStr(actions, TOUCH_ACTION_NONE), hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y), hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
                        return hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL ? this.preventSrc(srcEvent) : void 0;
                    }
                },
                preventSrc: function(srcEvent) {
                    this.manager.session.prevented = !0, srcEvent.preventDefault();
                }
            };
            var STATE_POSSIBLE = 1, STATE_BEGAN = 2, STATE_CHANGED = 4, STATE_ENDED = 8, STATE_RECOGNIZED = STATE_ENDED, STATE_CANCELLED = 16, STATE_FAILED = 32;
            Recognizer.prototype = {
                defaults: {},
                set: function(options) {
                    return extend(this.options, options), this.manager && this.manager.touchAction.update(), 
                    this;
                },
                recognizeWith: function(otherRecognizer) {
                    if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) return this;
                    var simultaneous = this.simultaneous;
                    return otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), simultaneous[otherRecognizer.id] || (simultaneous[otherRecognizer.id] = otherRecognizer, 
                    otherRecognizer.recognizeWith(this)), this;
                },
                dropRecognizeWith: function(otherRecognizer) {
                    return invokeArrayArg(otherRecognizer, "dropRecognizeWith", this) ? this : (otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), 
                    delete this.simultaneous[otherRecognizer.id], this);
                },
                requireFailure: function(otherRecognizer) {
                    if (invokeArrayArg(otherRecognizer, "requireFailure", this)) return this;
                    var requireFail = this.requireFail;
                    return otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), -1 === inArray(requireFail, otherRecognizer) && (requireFail.push(otherRecognizer), 
                    otherRecognizer.requireFailure(this)), this;
                },
                dropRequireFailure: function(otherRecognizer) {
                    if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) return this;
                    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
                    var index = inArray(this.requireFail, otherRecognizer);
                    return index > -1 && this.requireFail.splice(index, 1), this;
                },
                hasRequireFailures: function() {
                    return this.requireFail.length > 0;
                },
                canRecognizeWith: function(otherRecognizer) {
                    return !!this.simultaneous[otherRecognizer.id];
                },
                emit: function(input) {
                    function emit(withState) {
                        self.manager.emit(self.options.event + (withState ? stateStr(state) : ""), input);
                    }
                    var self = this, state = this.state;
                    STATE_ENDED > state && emit(!0), emit(), state >= STATE_ENDED && emit(!0);
                },
                tryEmit: function(input) {
                    return this.canEmit() ? this.emit(input) : void (this.state = STATE_FAILED);
                },
                canEmit: function() {
                    for (var i = 0; i < this.requireFail.length; ) {
                        if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) return !1;
                        i++;
                    }
                    return !0;
                },
                recognize: function(inputData) {
                    var inputDataClone = extend({}, inputData);
                    return boolOrFn(this.options.enable, [ this, inputDataClone ]) ? (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED) && (this.state = STATE_POSSIBLE), 
                    this.state = this.process(inputDataClone), void (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED) && this.tryEmit(inputDataClone))) : (this.reset(), 
                    void (this.state = STATE_FAILED));
                },
                process: function() {},
                getTouchAction: function() {},
                reset: function() {}
            }, inherit(AttrRecognizer, Recognizer, {
                defaults: {
                    pointers: 1
                },
                attrTest: function(input) {
                    var optionPointers = this.options.pointers;
                    return 0 === optionPointers || input.pointers.length === optionPointers;
                },
                process: function(input) {
                    var state = this.state, eventType = input.eventType, isRecognized = state & (STATE_BEGAN | STATE_CHANGED), isValid = this.attrTest(input);
                    return isRecognized && (eventType & INPUT_CANCEL || !isValid) ? state | STATE_CANCELLED : isRecognized || isValid ? eventType & INPUT_END ? state | STATE_ENDED : state & STATE_BEGAN ? state | STATE_CHANGED : STATE_BEGAN : STATE_FAILED;
                }
            }), inherit(PanRecognizer, AttrRecognizer, {
                defaults: {
                    event: "pan",
                    threshold: 10,
                    pointers: 1,
                    direction: DIRECTION_ALL
                },
                getTouchAction: function() {
                    var direction = this.options.direction, actions = [];
                    return direction & DIRECTION_HORIZONTAL && actions.push(TOUCH_ACTION_PAN_Y), direction & DIRECTION_VERTICAL && actions.push(TOUCH_ACTION_PAN_X), 
                    actions;
                },
                directionTest: function(input) {
                    var options = this.options, hasMoved = !0, distance = input.distance, direction = input.direction, x = input.deltaX, y = input.deltaY;
                    return direction & options.direction || (options.direction & DIRECTION_HORIZONTAL ? (direction = 0 === x ? DIRECTION_NONE : 0 > x ? DIRECTION_LEFT : DIRECTION_RIGHT, 
                    hasMoved = x != this.pX, distance = Math.abs(input.deltaX)) : (direction = 0 === y ? DIRECTION_NONE : 0 > y ? DIRECTION_UP : DIRECTION_DOWN, 
                    hasMoved = y != this.pY, distance = Math.abs(input.deltaY))), input.direction = direction, 
                    hasMoved && distance > options.threshold && direction & options.direction;
                },
                attrTest: function(input) {
                    return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
                },
                emit: function(input) {
                    this.pX = input.deltaX, this.pY = input.deltaY;
                    var direction = directionStr(input.direction);
                    direction && this.manager.emit(this.options.event + direction, input), this._super.emit.call(this, input);
                }
            }), inherit(PinchRecognizer, AttrRecognizer, {
                defaults: {
                    event: "pinch",
                    threshold: 0,
                    pointers: 2
                },
                getTouchAction: function() {
                    return [ TOUCH_ACTION_NONE ];
                },
                attrTest: function(input) {
                    return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
                },
                emit: function(input) {
                    if (this._super.emit.call(this, input), 1 !== input.scale) {
                        var inOut = input.scale < 1 ? "in" : "out";
                        this.manager.emit(this.options.event + inOut, input);
                    }
                }
            }), inherit(PressRecognizer, Recognizer, {
                defaults: {
                    event: "press",
                    pointers: 1,
                    time: 500,
                    threshold: 5
                },
                getTouchAction: function() {
                    return [ TOUCH_ACTION_AUTO ];
                },
                process: function(input) {
                    var options = this.options, validPointers = input.pointers.length === options.pointers, validMovement = input.distance < options.threshold, validTime = input.deltaTime > options.time;
                    if (this._input = input, !validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) this.reset(); else if (input.eventType & INPUT_START) this.reset(), 
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED, this.tryEmit();
                    }, options.time, this); else if (input.eventType & INPUT_END) return STATE_RECOGNIZED;
                    return STATE_FAILED;
                },
                reset: function() {
                    clearTimeout(this._timer);
                },
                emit: function(input) {
                    this.state === STATE_RECOGNIZED && (input && input.eventType & INPUT_END ? this.manager.emit(this.options.event + "up", input) : (this._input.timeStamp = now(), 
                    this.manager.emit(this.options.event, this._input)));
                }
            }), inherit(RotateRecognizer, AttrRecognizer, {
                defaults: {
                    event: "rotate",
                    threshold: 0,
                    pointers: 2
                },
                getTouchAction: function() {
                    return [ TOUCH_ACTION_NONE ];
                },
                attrTest: function(input) {
                    return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
                }
            }), inherit(SwipeRecognizer, AttrRecognizer, {
                defaults: {
                    event: "swipe",
                    threshold: 10,
                    velocity: .65,
                    direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
                    pointers: 1
                },
                getTouchAction: function() {
                    return PanRecognizer.prototype.getTouchAction.call(this);
                },
                attrTest: function(input) {
                    var velocity, direction = this.options.direction;
                    return direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL) ? velocity = input.velocity : direction & DIRECTION_HORIZONTAL ? velocity = input.velocityX : direction & DIRECTION_VERTICAL && (velocity = input.velocityY), 
                    this._super.attrTest.call(this, input) && direction & input.direction && input.distance > this.options.threshold && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
                },
                emit: function(input) {
                    var direction = directionStr(input.direction);
                    direction && this.manager.emit(this.options.event + direction, input), this.manager.emit(this.options.event, input);
                }
            }), inherit(TapRecognizer, Recognizer, {
                defaults: {
                    event: "tap",
                    pointers: 1,
                    taps: 1,
                    interval: 300,
                    time: 250,
                    threshold: 2,
                    posThreshold: 10
                },
                getTouchAction: function() {
                    return [ TOUCH_ACTION_MANIPULATION ];
                },
                process: function(input) {
                    var options = this.options, validPointers = input.pointers.length === options.pointers, validMovement = input.distance < options.threshold, validTouchTime = input.deltaTime < options.time;
                    if (this.reset(), input.eventType & INPUT_START && 0 === this.count) return this.failTimeout();
                    if (validMovement && validTouchTime && validPointers) {
                        if (input.eventType != INPUT_END) return this.failTimeout();
                        var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : !0, validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
                        this.pTime = input.timeStamp, this.pCenter = input.center, validMultiTap && validInterval ? this.count += 1 : this.count = 1, 
                        this._input = input;
                        var tapCount = this.count % options.taps;
                        if (0 === tapCount) return this.hasRequireFailures() ? (this._timer = setTimeoutContext(function() {
                            this.state = STATE_RECOGNIZED, this.tryEmit();
                        }, options.interval, this), STATE_BEGAN) : STATE_RECOGNIZED;
                    }
                    return STATE_FAILED;
                },
                failTimeout: function() {
                    return this._timer = setTimeoutContext(function() {
                        this.state = STATE_FAILED;
                    }, this.options.interval, this), STATE_FAILED;
                },
                reset: function() {
                    clearTimeout(this._timer);
                },
                emit: function() {
                    this.state == STATE_RECOGNIZED && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
                }
            }), Hammer.VERSION = "2.0.4", Hammer.defaults = {
                domEvents: !1,
                touchAction: TOUCH_ACTION_COMPUTE,
                enable: !0,
                inputTarget: null,
                inputClass: null,
                preset: [ [ RotateRecognizer, {
                    enable: !1
                } ], [ PinchRecognizer, {
                    enable: !1
                }, [ "rotate" ] ], [ SwipeRecognizer, {
                    direction: DIRECTION_HORIZONTAL
                } ], [ PanRecognizer, {
                    direction: DIRECTION_HORIZONTAL
                }, [ "swipe" ] ], [ TapRecognizer ], [ TapRecognizer, {
                    event: "doubletap",
                    taps: 2
                }, [ "tap" ] ], [ PressRecognizer ] ],
                cssProps: {
                    userSelect: "none",
                    touchSelect: "none",
                    touchCallout: "none",
                    contentZooming: "none",
                    userDrag: "none",
                    tapHighlightColor: "rgba(0,0,0,0)"
                }
            };
            var STOP = 1, FORCED_STOP = 2;
            Manager.prototype = {
                set: function(options) {
                    return extend(this.options, options), options.touchAction && this.touchAction.update(), 
                    options.inputTarget && (this.input.destroy(), this.input.target = options.inputTarget, 
                    this.input.init()), this;
                },
                stop: function(force) {
                    this.session.stopped = force ? FORCED_STOP : STOP;
                },
                recognize: function(inputData) {
                    var session = this.session;
                    if (!session.stopped) {
                        this.touchAction.preventDefaults(inputData);
                        var recognizer, recognizers = this.recognizers, curRecognizer = session.curRecognizer;
                        (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) && (curRecognizer = session.curRecognizer = null);
                        for (var i = 0; i < recognizers.length; ) recognizer = recognizers[i], session.stopped === FORCED_STOP || curRecognizer && recognizer != curRecognizer && !recognizer.canRecognizeWith(curRecognizer) ? recognizer.reset() : recognizer.recognize(inputData), 
                        !curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED) && (curRecognizer = session.curRecognizer = recognizer), 
                        i++;
                    }
                },
                get: function(recognizer) {
                    if (recognizer instanceof Recognizer) return recognizer;
                    for (var recognizers = this.recognizers, i = 0; i < recognizers.length; i++) if (recognizers[i].options.event == recognizer) return recognizers[i];
                    return null;
                },
                add: function(recognizer) {
                    if (invokeArrayArg(recognizer, "add", this)) return this;
                    var existing = this.get(recognizer.options.event);
                    return existing && this.remove(existing), this.recognizers.push(recognizer), recognizer.manager = this, 
                    this.touchAction.update(), recognizer;
                },
                remove: function(recognizer) {
                    if (invokeArrayArg(recognizer, "remove", this)) return this;
                    var recognizers = this.recognizers;
                    return recognizer = this.get(recognizer), recognizers.splice(inArray(recognizers, recognizer), 1), 
                    this.touchAction.update(), this;
                },
                on: function(events, handler) {
                    var handlers = this.handlers;
                    return each(splitStr(events), function(event) {
                        handlers[event] = handlers[event] || [], handlers[event].push(handler);
                    }), this;
                },
                off: function(events, handler) {
                    var handlers = this.handlers;
                    return each(splitStr(events), function(event) {
                        handler ? handlers[event].splice(inArray(handlers[event], handler), 1) : delete handlers[event];
                    }), this;
                },
                emit: function(event, data) {
                    this.options.domEvents && triggerDomEvent(event, data);
                    var handlers = this.handlers[event] && this.handlers[event].slice();
                    if (handlers && handlers.length) {
                        data.type = event, data.preventDefault = function() {
                            data.srcEvent.preventDefault();
                        };
                        for (var i = 0; i < handlers.length; ) handlers[i](data), i++;
                    }
                },
                destroy: function() {
                    this.element && toggleCssProps(this, !1), this.handlers = {}, this.session = {}, 
                    this.input.destroy(), this.element = null;
                }
            }, extend(Hammer, {
                INPUT_START: INPUT_START,
                INPUT_MOVE: INPUT_MOVE,
                INPUT_END: INPUT_END,
                INPUT_CANCEL: INPUT_CANCEL,
                STATE_POSSIBLE: STATE_POSSIBLE,
                STATE_BEGAN: STATE_BEGAN,
                STATE_CHANGED: STATE_CHANGED,
                STATE_ENDED: STATE_ENDED,
                STATE_RECOGNIZED: STATE_RECOGNIZED,
                STATE_CANCELLED: STATE_CANCELLED,
                STATE_FAILED: STATE_FAILED,
                DIRECTION_NONE: DIRECTION_NONE,
                DIRECTION_LEFT: DIRECTION_LEFT,
                DIRECTION_RIGHT: DIRECTION_RIGHT,
                DIRECTION_UP: DIRECTION_UP,
                DIRECTION_DOWN: DIRECTION_DOWN,
                DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
                DIRECTION_VERTICAL: DIRECTION_VERTICAL,
                DIRECTION_ALL: DIRECTION_ALL,
                Manager: Manager,
                Input: Input,
                TouchAction: TouchAction,
                TouchInput: TouchInput,
                MouseInput: MouseInput,
                PointerEventInput: PointerEventInput,
                TouchMouseInput: TouchMouseInput,
                SingleTouchInput: SingleTouchInput,
                Recognizer: Recognizer,
                AttrRecognizer: AttrRecognizer,
                Tap: TapRecognizer,
                Pan: PanRecognizer,
                Swipe: SwipeRecognizer,
                Pinch: PinchRecognizer,
                Rotate: RotateRecognizer,
                Press: PressRecognizer,
                on: addEventListeners,
                off: removeEventListeners,
                each: each,
                merge: merge,
                extend: extend,
                inherit: inherit,
                bindFn: bindFn,
                prefixed: prefixed
            }), typeof define == TYPE_FUNCTION && define.amd ? define(function() {
                return Hammer;
            }) : "undefined" != typeof module && module.exports ? module.exports = Hammer : window[exportName] = Hammer;
        }(window, document, "Hammer");
    }, {} ],
    "jquery-color": [ function() {
        !function(jQuery, undefined) {
            function clamp(value, prop, allowEmpty) {
                var type = propTypes[prop.type] || {};
                return null == value ? allowEmpty || !prop.def ? null : prop.def : (value = type.floor ? ~~value : parseFloat(value), 
                isNaN(value) ? prop.def : type.mod ? (value + type.mod) % type.mod : 0 > value ? 0 : type.max < value ? type.max : value);
            }
            function stringParse(string) {
                var inst = color(), rgba = inst._rgba = [];
                return string = string.toLowerCase(), each(stringParsers, function(i, parser) {
                    var parsed, match = parser.re.exec(string), values = match && parser.parse(match), spaceName = parser.space || "rgba";
                    return values ? (parsed = inst[spaceName](values), inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache], 
                    rgba = inst._rgba = parsed._rgba, !1) : void 0;
                }), rgba.length ? ("0,0,0,0" === rgba.join() && jQuery.extend(rgba, colors.transparent), 
                inst) : colors[string];
            }
            function hue2rgb(p, q, h) {
                return h = (h + 1) % 1, 1 > 6 * h ? p + (q - p) * h * 6 : 1 > 2 * h ? q : 2 > 3 * h ? p + (q - p) * (2 / 3 - h) * 6 : p;
            }
            var colors, stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor", rplusequals = /^([\-+])=\s*(\d+\.?\d*)/, stringParsers = [ {
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [ execResult[1], execResult[2], execResult[3], execResult[4] ];
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(execResult) {
                    return [ 2.55 * execResult[1], 2.55 * execResult[2], 2.55 * execResult[3], execResult[4] ];
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                parse: function(execResult) {
                    return [ parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16) ];
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function(execResult) {
                    return [ parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16) ];
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function(execResult) {
                    return [ execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4] ];
                }
            } ], color = jQuery.Color = function(color, green, blue, alpha) {
                return new jQuery.Color.fn.parse(color, green, blue, alpha);
            }, spaces = {
                rgba: {
                    props: {
                        red: {
                            idx: 0,
                            type: "byte"
                        },
                        green: {
                            idx: 1,
                            type: "byte"
                        },
                        blue: {
                            idx: 2,
                            type: "byte"
                        }
                    }
                },
                hsla: {
                    props: {
                        hue: {
                            idx: 0,
                            type: "degrees"
                        },
                        saturation: {
                            idx: 1,
                            type: "percent"
                        },
                        lightness: {
                            idx: 2,
                            type: "percent"
                        }
                    }
                }
            }, propTypes = {
                "byte": {
                    floor: !0,
                    max: 255
                },
                percent: {
                    max: 1
                },
                degrees: {
                    mod: 360,
                    floor: !0
                }
            }, support = color.support = {}, supportElem = jQuery("<p>")[0], each = jQuery.each;
            supportElem.style.cssText = "background-color:rgba(1,1,1,.5)", support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1, 
            each(spaces, function(spaceName, space) {
                space.cache = "_" + spaceName, space.props.alpha = {
                    idx: 3,
                    type: "percent",
                    def: 1
                };
            }), color.fn = jQuery.extend(color.prototype, {
                parse: function(red, green, blue, alpha) {
                    if (red === undefined) return this._rgba = [ null, null, null, null ], this;
                    (red.jquery || red.nodeType) && (red = jQuery(red).css(green), green = undefined);
                    var inst = this, type = jQuery.type(red), rgba = this._rgba = [];
                    return green !== undefined && (red = [ red, green, blue, alpha ], type = "array"), 
                    "string" === type ? this.parse(stringParse(red) || colors._default) : "array" === type ? (each(spaces.rgba.props, function(key, prop) {
                        rgba[prop.idx] = clamp(red[prop.idx], prop);
                    }), this) : "object" === type ? (red instanceof color ? each(spaces, function(spaceName, space) {
                        red[space.cache] && (inst[space.cache] = red[space.cache].slice());
                    }) : each(spaces, function(spaceName, space) {
                        var cache = space.cache;
                        each(space.props, function(key, prop) {
                            if (!inst[cache] && space.to) {
                                if ("alpha" === key || null == red[key]) return;
                                inst[cache] = space.to(inst._rgba);
                            }
                            inst[cache][prop.idx] = clamp(red[key], prop, !0);
                        }), inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0 && (inst[cache][3] = 1, 
                        space.from && (inst._rgba = space.from(inst[cache])));
                    }), this) : void 0;
                },
                is: function(compare) {
                    var is = color(compare), same = !0, inst = this;
                    return each(spaces, function(_, space) {
                        var localCache, isCache = is[space.cache];
                        return isCache && (localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [], 
                        each(space.props, function(_, prop) {
                            return null != isCache[prop.idx] ? same = isCache[prop.idx] === localCache[prop.idx] : void 0;
                        })), same;
                    }), same;
                },
                _space: function() {
                    var used = [], inst = this;
                    return each(spaces, function(spaceName, space) {
                        inst[space.cache] && used.push(spaceName);
                    }), used.pop();
                },
                transition: function(other, distance) {
                    var end = color(other), spaceName = end._space(), space = spaces[spaceName], startColor = 0 === this.alpha() ? color("transparent") : this, start = startColor[space.cache] || space.to(startColor._rgba), result = start.slice();
                    return end = end[space.cache], each(space.props, function(key, prop) {
                        var index = prop.idx, startValue = start[index], endValue = end[index], type = propTypes[prop.type] || {};
                        null !== endValue && (null === startValue ? result[index] = endValue : (type.mod && (endValue - startValue > type.mod / 2 ? startValue += type.mod : startValue - endValue > type.mod / 2 && (startValue -= type.mod)), 
                        result[index] = clamp((endValue - startValue) * distance + startValue, prop)));
                    }), this[spaceName](result);
                },
                blend: function(opaque) {
                    if (1 === this._rgba[3]) return this;
                    var rgb = this._rgba.slice(), a = rgb.pop(), blend = color(opaque)._rgba;
                    return color(jQuery.map(rgb, function(v, i) {
                        return (1 - a) * blend[i] + a * v;
                    }));
                },
                toRgbaString: function() {
                    var prefix = "rgba(", rgba = jQuery.map(this._rgba, function(v, i) {
                        return null == v ? i > 2 ? 1 : 0 : v;
                    });
                    return 1 === rgba[3] && (rgba.pop(), prefix = "rgb("), prefix + rgba.join() + ")";
                },
                toHslaString: function() {
                    var prefix = "hsla(", hsla = jQuery.map(this.hsla(), function(v, i) {
                        return null == v && (v = i > 2 ? 1 : 0), i && 3 > i && (v = Math.round(100 * v) + "%"), 
                        v;
                    });
                    return 1 === hsla[3] && (hsla.pop(), prefix = "hsl("), prefix + hsla.join() + ")";
                },
                toHexString: function(includeAlpha) {
                    var rgba = this._rgba.slice(), alpha = rgba.pop();
                    return includeAlpha && rgba.push(~~(255 * alpha)), "#" + jQuery.map(rgba, function(v) {
                        return v = (v || 0).toString(16), 1 === v.length ? "0" + v : v;
                    }).join("");
                },
                toString: function() {
                    return 0 === this._rgba[3] ? "transparent" : this.toRgbaString();
                }
            }), color.fn.parse.prototype = color.fn, spaces.hsla.to = function(rgba) {
                if (null == rgba[0] || null == rgba[1] || null == rgba[2]) return [ null, null, null, rgba[3] ];
                var h, s, r = rgba[0] / 255, g = rgba[1] / 255, b = rgba[2] / 255, a = rgba[3], max = Math.max(r, g, b), min = Math.min(r, g, b), diff = max - min, add = max + min, l = .5 * add;
                return h = min === max ? 0 : r === max ? 60 * (g - b) / diff + 360 : g === max ? 60 * (b - r) / diff + 120 : 60 * (r - g) / diff + 240, 
                s = 0 === diff ? 0 : .5 >= l ? diff / add : diff / (2 - add), [ Math.round(h) % 360, s, l, null == a ? 1 : a ];
            }, spaces.hsla.from = function(hsla) {
                if (null == hsla[0] || null == hsla[1] || null == hsla[2]) return [ null, null, null, hsla[3] ];
                var h = hsla[0] / 360, s = hsla[1], l = hsla[2], a = hsla[3], q = .5 >= l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
                return [ Math.round(255 * hue2rgb(p, q, h + 1 / 3)), Math.round(255 * hue2rgb(p, q, h)), Math.round(255 * hue2rgb(p, q, h - 1 / 3)), a ];
            }, each(spaces, function(spaceName, space) {
                var props = space.props, cache = space.cache, to = space.to, from = space.from;
                color.fn[spaceName] = function(value) {
                    if (to && !this[cache] && (this[cache] = to(this._rgba)), value === undefined) return this[cache].slice();
                    var ret, type = jQuery.type(value), arr = "array" === type || "object" === type ? value : arguments, local = this[cache].slice();
                    return each(props, function(key, prop) {
                        var val = arr["object" === type ? key : prop.idx];
                        null == val && (val = local[prop.idx]), local[prop.idx] = clamp(val, prop);
                    }), from ? (ret = color(from(local)), ret[cache] = local, ret) : color(local);
                }, each(props, function(key, prop) {
                    color.fn[key] || (color.fn[key] = function(value) {
                        var match, vtype = jQuery.type(value), fn = "alpha" === key ? this._hsla ? "hsla" : "rgba" : spaceName, local = this[fn](), cur = local[prop.idx];
                        return "undefined" === vtype ? cur : ("function" === vtype && (value = value.call(this, cur), 
                        vtype = jQuery.type(value)), null == value && prop.empty ? this : ("string" === vtype && (match = rplusequals.exec(value), 
                        match && (value = cur + parseFloat(match[2]) * ("+" === match[1] ? 1 : -1))), local[prop.idx] = value, 
                        this[fn](local)));
                    });
                });
            }), color.hook = function(hook) {
                var hooks = hook.split(" ");
                each(hooks, function(i, hook) {
                    jQuery.cssHooks[hook] = {
                        set: function(elem, value) {
                            var parsed, curElem, backgroundColor = "";
                            if ("transparent" !== value && ("string" !== jQuery.type(value) || (parsed = stringParse(value)))) {
                                if (value = color(parsed || value), !support.rgba && 1 !== value._rgba[3]) {
                                    for (curElem = "backgroundColor" === hook ? elem.parentNode : elem; ("" === backgroundColor || "transparent" === backgroundColor) && curElem && curElem.style; ) try {
                                        backgroundColor = jQuery.css(curElem, "backgroundColor"), curElem = curElem.parentNode;
                                    } catch (e) {}
                                    value = value.blend(backgroundColor && "transparent" !== backgroundColor ? backgroundColor : "_default");
                                }
                                value = value.toRgbaString();
                            }
                            try {
                                elem.style[hook] = value;
                            } catch (e) {}
                        }
                    }, jQuery.fx.step[hook] = function(fx) {
                        fx.colorInit || (fx.start = color(fx.elem, hook), fx.end = color(fx.end), fx.colorInit = !0), 
                        jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
                    };
                });
            }, color.hook(stepHooks), jQuery.cssHooks.borderColor = {
                expand: function(value) {
                    var expanded = {};
                    return each([ "Top", "Right", "Bottom", "Left" ], function(i, part) {
                        expanded["border" + part + "Color"] = value;
                    }), expanded;
                }
            }, colors = jQuery.Color.names = {
                aqua: "#00ffff",
                black: "#000000",
                blue: "#0000ff",
                fuchsia: "#ff00ff",
                gray: "#808080",
                green: "#008000",
                lime: "#00ff00",
                maroon: "#800000",
                navy: "#000080",
                olive: "#808000",
                purple: "#800080",
                red: "#ff0000",
                silver: "#c0c0c0",
                teal: "#008080",
                white: "#ffffff",
                yellow: "#ffff00",
                transparent: [ null, null, null, 0 ],
                _default: "#ffffff"
            };
        }(jQuery);
    }, {} ],
    "jquery.transit": [ function(require, module, exports) {
        !function(root, factory) {
            "function" == typeof define && define.amd ? define([ "jquery" ], factory) : "object" == typeof exports ? module.exports = factory(require("jquery")) : factory(root.jQuery);
        }(this, function($) {
            function getVendorPropertyName(prop) {
                if (prop in div.style) return prop;
                for (var prefixes = [ "Moz", "Webkit", "O", "ms" ], prop_ = prop.charAt(0).toUpperCase() + prop.substr(1), i = 0; i < prefixes.length; ++i) {
                    var vendorProp = prefixes[i] + prop_;
                    if (vendorProp in div.style) return vendorProp;
                }
            }
            function checkTransform3dSupport() {
                return div.style[support.transform] = "", div.style[support.transform] = "rotateY(90deg)", 
                "" !== div.style[support.transform];
            }
            function Transform(str) {
                return "string" == typeof str && this.parse(str), this;
            }
            function callOrQueue(self, queue, fn) {
                queue === !0 ? self.queue(fn) : queue ? self.queue(queue, fn) : self.each(function() {
                    fn.call(this);
                });
            }
            function getProperties(props) {
                var re = [];
                return $.each(props, function(key) {
                    key = $.camelCase(key), key = $.transit.propertyMap[key] || $.cssProps[key] || key, 
                    key = uncamel(key), support[key] && (key = uncamel(support[key])), -1 === $.inArray(key, re) && re.push(key);
                }), re;
            }
            function getTransition(properties, duration, easing, delay) {
                var props = getProperties(properties);
                $.cssEase[easing] && (easing = $.cssEase[easing]);
                var attribs = "" + toMS(duration) + " " + easing;
                parseInt(delay, 10) > 0 && (attribs += " " + toMS(delay));
                var transitions = [];
                return $.each(props, function(i, name) {
                    transitions.push(name + " " + attribs);
                }), transitions.join(", ");
            }
            function registerCssHook(prop, isPixels) {
                isPixels || ($.cssNumber[prop] = !0), $.transit.propertyMap[prop] = support.transform, 
                $.cssHooks[prop] = {
                    get: function(elem) {
                        var t = $(elem).css("transit:transform");
                        return t.get(prop);
                    },
                    set: function(elem, value) {
                        var t = $(elem).css("transit:transform");
                        t.setFromString(prop, value), $(elem).css({
                            "transit:transform": t
                        });
                    }
                };
            }
            function uncamel(str) {
                return str.replace(/([A-Z])/g, function(letter) {
                    return "-" + letter.toLowerCase();
                });
            }
            function unit(i, units) {
                return "string" != typeof i || i.match(/^[\-0-9\.]+$/) ? "" + i + units : i;
            }
            function toMS(duration) {
                var i = duration;
                return "string" != typeof i || i.match(/^[\-0-9\.]+/) || (i = $.fx.speeds[i] || $.fx.speeds._default), 
                unit(i, "ms");
            }
            $.transit = {
                version: "0.9.12",
                propertyMap: {
                    marginLeft: "margin",
                    marginRight: "margin",
                    marginBottom: "margin",
                    marginTop: "margin",
                    paddingLeft: "padding",
                    paddingRight: "padding",
                    paddingBottom: "padding",
                    paddingTop: "padding"
                },
                enabled: !0,
                useTransitionEnd: !1
            };
            var div = document.createElement("div"), support = {}, isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
            support.transition = getVendorPropertyName("transition"), support.transitionDelay = getVendorPropertyName("transitionDelay"), 
            support.transform = getVendorPropertyName("transform"), support.transformOrigin = getVendorPropertyName("transformOrigin"), 
            support.filter = getVendorPropertyName("Filter"), support.transform3d = checkTransform3dSupport();
            var eventNames = {
                transition: "transitionend",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "MSTransitionEnd"
            }, transitionEnd = support.transitionEnd = eventNames[support.transition] || null;
            for (var key in support) support.hasOwnProperty(key) && "undefined" == typeof $.support[key] && ($.support[key] = support[key]);
            return div = null, $.cssEase = {
                _default: "ease",
                "in": "ease-in",
                out: "ease-out",
                "in-out": "ease-in-out",
                snap: "cubic-bezier(0,1,.5,1)",
                easeInCubic: "cubic-bezier(.550,.055,.675,.190)",
                easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                easeInOutExpo: "cubic-bezier(1,0,0,1)",
                easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                easeInSine: "cubic-bezier(.47,0,.745,.715)",
                easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
            }, $.cssHooks["transit:transform"] = {
                get: function(elem) {
                    return $(elem).data("transform") || new Transform();
                },
                set: function(elem, v) {
                    var value = v;
                    value instanceof Transform || (value = new Transform(value)), elem.style[support.transform] = "WebkitTransform" !== support.transform || isChrome ? value.toString() : value.toString(!0), 
                    $(elem).data("transform", value);
                }
            }, $.cssHooks.transform = {
                set: $.cssHooks["transit:transform"].set
            }, $.cssHooks.filter = {
                get: function(elem) {
                    return elem.style[support.filter];
                },
                set: function(elem, value) {
                    elem.style[support.filter] = value;
                }
            }, $.fn.jquery < "1.8" && ($.cssHooks.transformOrigin = {
                get: function(elem) {
                    return elem.style[support.transformOrigin];
                },
                set: function(elem, value) {
                    elem.style[support.transformOrigin] = value;
                }
            }, $.cssHooks.transition = {
                get: function(elem) {
                    return elem.style[support.transition];
                },
                set: function(elem, value) {
                    elem.style[support.transition] = value;
                }
            }), registerCssHook("scale"), registerCssHook("scaleX"), registerCssHook("scaleY"), 
            registerCssHook("translate"), registerCssHook("rotate"), registerCssHook("rotateX"), 
            registerCssHook("rotateY"), registerCssHook("rotate3d"), registerCssHook("perspective"), 
            registerCssHook("skewX"), registerCssHook("skewY"), registerCssHook("x", !0), registerCssHook("y", !0), 
            Transform.prototype = {
                setFromString: function(prop, val) {
                    var args = "string" == typeof val ? val.split(",") : val.constructor === Array ? val : [ val ];
                    args.unshift(prop), Transform.prototype.set.apply(this, args);
                },
                set: function(prop) {
                    var args = Array.prototype.slice.apply(arguments, [ 1 ]);
                    this.setter[prop] ? this.setter[prop].apply(this, args) : this[prop] = args.join(",");
                },
                get: function(prop) {
                    return this.getter[prop] ? this.getter[prop].apply(this) : this[prop] || 0;
                },
                setter: {
                    rotate: function(theta) {
                        this.rotate = unit(theta, "deg");
                    },
                    rotateX: function(theta) {
                        this.rotateX = unit(theta, "deg");
                    },
                    rotateY: function(theta) {
                        this.rotateY = unit(theta, "deg");
                    },
                    scale: function(x, y) {
                        void 0 === y && (y = x), this.scale = x + "," + y;
                    },
                    skewX: function(x) {
                        this.skewX = unit(x, "deg");
                    },
                    skewY: function(y) {
                        this.skewY = unit(y, "deg");
                    },
                    perspective: function(dist) {
                        this.perspective = unit(dist, "px");
                    },
                    x: function(x) {
                        this.set("translate", x, null);
                    },
                    y: function(y) {
                        this.set("translate", null, y);
                    },
                    translate: function(x, y) {
                        void 0 === this._translateX && (this._translateX = 0), void 0 === this._translateY && (this._translateY = 0), 
                        null !== x && void 0 !== x && (this._translateX = unit(x, "px")), null !== y && void 0 !== y && (this._translateY = unit(y, "px")), 
                        this.translate = this._translateX + "," + this._translateY;
                    }
                },
                getter: {
                    x: function() {
                        return this._translateX || 0;
                    },
                    y: function() {
                        return this._translateY || 0;
                    },
                    scale: function() {
                        var s = (this.scale || "1,1").split(",");
                        return s[0] && (s[0] = parseFloat(s[0])), s[1] && (s[1] = parseFloat(s[1])), s[0] === s[1] ? s[0] : s;
                    },
                    rotate3d: function() {
                        for (var s = (this.rotate3d || "0,0,0,0deg").split(","), i = 0; 3 >= i; ++i) s[i] && (s[i] = parseFloat(s[i]));
                        return s[3] && (s[3] = unit(s[3], "deg")), s;
                    }
                },
                parse: function(str) {
                    var self = this;
                    str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                        self.setFromString(prop, val);
                    });
                },
                toString: function(use3d) {
                    var re = [];
                    for (var i in this) if (this.hasOwnProperty(i)) {
                        if (!support.transform3d && ("rotateX" === i || "rotateY" === i || "perspective" === i || "transformOrigin" === i)) continue;
                        "_" !== i[0] && re.push(use3d && "scale" === i ? i + "3d(" + this[i] + ",1)" : use3d && "translate" === i ? i + "3d(" + this[i] + ",0)" : i + "(" + this[i] + ")");
                    }
                    return re.join(" ");
                }
            }, $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
                var self = this, delay = 0, queue = !0, theseProperties = $.extend(!0, {}, properties);
                "function" == typeof duration && (callback = duration, duration = void 0), "object" == typeof duration && (easing = duration.easing, 
                delay = duration.delay || 0, queue = "undefined" == typeof duration.queue ? !0 : duration.queue, 
                callback = duration.complete, duration = duration.duration), "function" == typeof easing && (callback = easing, 
                easing = void 0), "undefined" != typeof theseProperties.easing && (easing = theseProperties.easing, 
                delete theseProperties.easing), "undefined" != typeof theseProperties.duration && (duration = theseProperties.duration, 
                delete theseProperties.duration), "undefined" != typeof theseProperties.complete && (callback = theseProperties.complete, 
                delete theseProperties.complete), "undefined" != typeof theseProperties.queue && (queue = theseProperties.queue, 
                delete theseProperties.queue), "undefined" != typeof theseProperties.delay && (delay = theseProperties.delay, 
                delete theseProperties.delay), "undefined" == typeof duration && (duration = $.fx.speeds._default), 
                "undefined" == typeof easing && (easing = $.cssEase._default), duration = toMS(duration);
                var transitionValue = getTransition(theseProperties, duration, easing, delay), work = $.transit.enabled && support.transition, i = work ? parseInt(duration, 10) + parseInt(delay, 10) : 0;
                if (0 === i) {
                    var fn = function(next) {
                        self.css(theseProperties), callback && callback.apply(self), next && next();
                    };
                    return callOrQueue(self, queue, fn), self;
                }
                var oldTransitions = {}, run = function(nextCall) {
                    var bound = !1, cb = function() {
                        bound && self.unbind(transitionEnd, cb), i > 0 && self.each(function() {
                            this.style[support.transition] = oldTransitions[this] || null;
                        }), "function" == typeof callback && callback.apply(self), "function" == typeof nextCall && nextCall();
                    };
                    i > 0 && transitionEnd && $.transit.useTransitionEnd ? (bound = !0, self.bind(transitionEnd, cb)) : window.setTimeout(cb, i), 
                    self.each(function() {
                        i > 0 && (this.style[support.transition] = transitionValue), $(this).css(theseProperties);
                    });
                }, deferredRun = function(next) {
                    this.offsetWidth, run(next);
                };
                return callOrQueue(self, queue, deferredRun), this;
            }, $.transit.getTransitionValue = getTransition, $;
        });
    }, {
        jquery: "jquery"
    } ],
    jquery: [ function(require, module) {
        !function(global, factory) {
            "object" == typeof module && "object" == typeof module.exports ? module.exports = global.document ? factory(global, !0) : function(w) {
                if (!w.document) throw new Error("jQuery requires a window with a document");
                return factory(w);
            } : factory(global);
        }("undefined" != typeof window ? window : this, function(window, noGlobal) {
            function isArraylike(obj) {
                var length = obj.length, type = jQuery.type(obj);
                return "function" === type || jQuery.isWindow(obj) ? !1 : 1 === obj.nodeType && length ? !0 : "array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj;
            }
            function winnow(elements, qualifier, not) {
                if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
                    return !!qualifier.call(elem, i, elem) !== not;
                });
                if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
                    return elem === qualifier !== not;
                });
                if ("string" == typeof qualifier) {
                    if (risSimple.test(qualifier)) return jQuery.filter(qualifier, elements, not);
                    qualifier = jQuery.filter(qualifier, elements);
                }
                return jQuery.grep(elements, function(elem) {
                    return indexOf.call(qualifier, elem) >= 0 !== not;
                });
            }
            function sibling(cur, dir) {
                for (;(cur = cur[dir]) && 1 !== cur.nodeType; ) ;
                return cur;
            }
            function createOptions(options) {
                var object = optionsCache[options] = {};
                return jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
                    object[flag] = !0;
                }), object;
            }
            function completed() {
                document.removeEventListener("DOMContentLoaded", completed, !1), window.removeEventListener("load", completed, !1), 
                jQuery.ready();
            }
            function Data() {
                Object.defineProperty(this.cache = {}, 0, {
                    get: function() {
                        return {};
                    }
                }), this.expando = jQuery.expando + Math.random();
            }
            function dataAttr(elem, key, data) {
                var name;
                if (void 0 === data && 1 === elem.nodeType) if (name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase(), 
                data = elem.getAttribute(name), "string" == typeof data) {
                    try {
                        data = "true" === data ? !0 : "false" === data ? !1 : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                    } catch (e) {}
                    data_user.set(elem, key, data);
                } else data = void 0;
                return data;
            }
            function returnTrue() {
                return !0;
            }
            function returnFalse() {
                return !1;
            }
            function safeActiveElement() {
                try {
                    return document.activeElement;
                } catch (err) {}
            }
            function manipulationTarget(elem, content) {
                return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
            }
            function disableScript(elem) {
                return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem;
            }
            function restoreScript(elem) {
                var match = rscriptTypeMasked.exec(elem.type);
                return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
            }
            function setGlobalEval(elems, refElements) {
                for (var i = 0, l = elems.length; l > i; i++) data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"));
            }
            function cloneCopyEvent(src, dest) {
                var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
                if (1 === dest.nodeType) {
                    if (data_priv.hasData(src) && (pdataOld = data_priv.access(src), pdataCur = data_priv.set(dest, pdataOld), 
                    events = pdataOld.events)) {
                        delete pdataCur.handle, pdataCur.events = {};
                        for (type in events) for (i = 0, l = events[type].length; l > i; i++) jQuery.event.add(dest, type, events[type][i]);
                    }
                    data_user.hasData(src) && (udataOld = data_user.access(src), udataCur = jQuery.extend({}, udataOld), 
                    data_user.set(dest, udataCur));
                }
            }
            function getAll(context, tag) {
                var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
                return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([ context ], ret) : ret;
            }
            function fixInput(src, dest) {
                var nodeName = dest.nodeName.toLowerCase();
                "input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue);
            }
            function actualDisplay(name, doc) {
                var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], "display");
                return elem.detach(), display;
            }
            function defaultDisplay(nodeName) {
                var doc = document, display = elemdisplay[nodeName];
                return display || (display = actualDisplay(nodeName, doc), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement), 
                doc = iframe[0].contentDocument, doc.write(), doc.close(), display = actualDisplay(nodeName, doc), 
                iframe.detach()), elemdisplay[nodeName] = display), display;
            }
            function curCSS(elem, name, computed) {
                var width, minWidth, maxWidth, ret, style = elem.style;
                return computed = computed || getStyles(elem), computed && (ret = computed.getPropertyValue(name) || computed[name]), 
                computed && ("" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), 
                rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, 
                maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, 
                ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), 
                void 0 !== ret ? ret + "" : ret;
            }
            function addGetHookIf(conditionFn, hookFn) {
                return {
                    get: function() {
                        return conditionFn() ? void delete this.get : (this.get = hookFn).apply(this, arguments);
                    }
                };
            }
            function vendorPropName(style, name) {
                if (name in style) return name;
                for (var capName = name[0].toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length; i--; ) if (name = cssPrefixes[i] + capName, 
                name in style) return name;
                return origName;
            }
            function setPositiveNumber(elem, value, subtract) {
                var matches = rnumsplit.exec(value);
                return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
            }
            function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
                for (var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name ? 1 : 0, val = 0; 4 > i; i += 2) "margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), 
                isBorderBox ? ("content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), 
                "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), 
                "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
                return val;
            }
            function getWidthOrHeight(elem, name, extra) {
                var valueIsBorderBox = !0, val = "width" === name ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
                if (0 >= val || null == val) {
                    if (val = curCSS(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), 
                    rnumnonpx.test(val)) return val;
                    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]), 
                    val = parseFloat(val) || 0;
                }
                return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
            }
            function showHide(elements, show) {
                for (var display, elem, hidden, values = [], index = 0, length = elements.length; length > index; index++) elem = elements[index], 
                elem.style && (values[index] = data_priv.get(elem, "olddisplay"), display = elem.style.display, 
                show ? (values[index] || "none" !== display || (elem.style.display = ""), "" === elem.style.display && isHidden(elem) && (values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName)))) : (hidden = isHidden(elem), 
                "none" === display && hidden || data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
                for (index = 0; length > index; index++) elem = elements[index], elem.style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
                return elements;
            }
            function Tween(elem, options, prop, end, easing) {
                return new Tween.prototype.init(elem, options, prop, end, easing);
            }
            function createFxNow() {
                return setTimeout(function() {
                    fxNow = void 0;
                }), fxNow = jQuery.now();
            }
            function genFx(type, includeWidth) {
                var which, i = 0, attrs = {
                    height: type
                };
                for (includeWidth = includeWidth ? 1 : 0; 4 > i; i += 2 - includeWidth) which = cssExpand[i], 
                attrs["margin" + which] = attrs["padding" + which] = type;
                return includeWidth && (attrs.opacity = attrs.width = type), attrs;
            }
            function createTween(value, prop, animation) {
                for (var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length; length > index; index++) if (tween = collection[index].call(animation, prop, value)) return tween;
            }
            function defaultPrefilter(elem, props, opts) {
                var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = data_priv.get(elem, "fxshow");
                opts.queue || (hooks = jQuery._queueHooks(elem, "fx"), null == hooks.unqueued && (hooks.unqueued = 0, 
                oldfire = hooks.empty.fire, hooks.empty.fire = function() {
                    hooks.unqueued || oldfire();
                }), hooks.unqueued++, anim.always(function() {
                    anim.always(function() {
                        hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
                    });
                })), 1 === elem.nodeType && ("height" in props || "width" in props) && (opts.overflow = [ style.overflow, style.overflowX, style.overflowY ], 
                display = jQuery.css(elem, "display"), checkDisplay = "none" === display ? data_priv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display, 
                "inline" === checkDisplay && "none" === jQuery.css(elem, "float") && (style.display = "inline-block")), 
                opts.overflow && (style.overflow = "hidden", anim.always(function() {
                    style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
                }));
                for (prop in props) if (value = props[prop], rfxtypes.exec(value)) {
                    if (delete props[prop], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) {
                        if ("show" !== value || !dataShow || void 0 === dataShow[prop]) continue;
                        hidden = !0;
                    }
                    orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
                } else display = void 0;
                if (jQuery.isEmptyObject(orig)) "inline" === ("none" === display ? defaultDisplay(elem.nodeName) : display) && (style.display = display); else {
                    dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = data_priv.access(elem, "fxshow", {}), 
                    toggle && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : anim.done(function() {
                        jQuery(elem).hide();
                    }), anim.done(function() {
                        var prop;
                        data_priv.remove(elem, "fxshow");
                        for (prop in orig) jQuery.style(elem, prop, orig[prop]);
                    });
                    for (prop in orig) tween = createTween(hidden ? dataShow[prop] : 0, prop, anim), 
                    prop in dataShow || (dataShow[prop] = tween.start, hidden && (tween.end = tween.start, 
                    tween.start = "width" === prop || "height" === prop ? 1 : 0));
                }
            }
            function propFilter(props, specialEasing) {
                var index, name, easing, value, hooks;
                for (index in props) if (name = jQuery.camelCase(index), easing = specialEasing[name], 
                value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), 
                index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name], 
                hooks && "expand" in hooks) {
                    value = hooks.expand(value), delete props[name];
                    for (index in value) index in props || (props[index] = value[index], specialEasing[index] = easing);
                } else specialEasing[name] = easing;
            }
            function Animation(elem, properties, options) {
                var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
                    delete tick.elem;
                }), tick = function() {
                    if (stopped) return !1;
                    for (var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length; length > index; index++) animation.tweens[index].run(percent);
                    return deferred.notifyWith(elem, [ animation, percent, remaining ]), 1 > percent && length ? remaining : (deferred.resolveWith(elem, [ animation ]), 
                    !1);
                }, animation = deferred.promise({
                    elem: elem,
                    props: jQuery.extend({}, properties),
                    opts: jQuery.extend(!0, {
                        specialEasing: {}
                    }, options),
                    originalProperties: properties,
                    originalOptions: options,
                    startTime: fxNow || createFxNow(),
                    duration: options.duration,
                    tweens: [],
                    createTween: function(prop, end) {
                        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                        return animation.tweens.push(tween), tween;
                    },
                    stop: function(gotoEnd) {
                        var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                        if (stopped) return this;
                        for (stopped = !0; length > index; index++) animation.tweens[index].run(1);
                        return gotoEnd ? deferred.resolveWith(elem, [ animation, gotoEnd ]) : deferred.rejectWith(elem, [ animation, gotoEnd ]), 
                        this;
                    }
                }), props = animation.props;
                for (propFilter(props, animation.opts.specialEasing); length > index; index++) if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) return result;
                return jQuery.map(props, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), 
                jQuery.fx.timer(jQuery.extend(tick, {
                    elem: elem,
                    anim: animation,
                    queue: animation.opts.queue
                })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
            }
            function addToPrefiltersOrTransports(structure) {
                return function(dataTypeExpression, func) {
                    "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
                    var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
                    if (jQuery.isFunction(func)) for (;dataType = dataTypes[i++]; ) "+" === dataType[0] ? (dataType = dataType.slice(1) || "*", 
                    (structure[dataType] = structure[dataType] || []).unshift(func)) : (structure[dataType] = structure[dataType] || []).push(func);
                };
            }
            function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
                function inspect(dataType) {
                    var selected;
                    return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                        return "string" != typeof dataTypeOrTransport || seekingTransport || inspected[dataTypeOrTransport] ? seekingTransport ? !(selected = dataTypeOrTransport) : void 0 : (options.dataTypes.unshift(dataTypeOrTransport), 
                        inspect(dataTypeOrTransport), !1);
                    }), selected;
                }
                var inspected = {}, seekingTransport = structure === transports;
                return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
            }
            function ajaxExtend(target, src) {
                var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
                for (key in src) void 0 !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
                return deep && jQuery.extend(!0, target, deep), target;
            }
            function ajaxHandleResponses(s, jqXHR, responses) {
                for (var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes; "*" === dataTypes[0]; ) dataTypes.shift(), 
                void 0 === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
                if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
                if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
                    for (type in responses) {
                        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                            finalDataType = type;
                            break;
                        }
                        firstDataType || (firstDataType = type);
                    }
                    finalDataType = finalDataType || firstDataType;
                }
                return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), 
                responses[finalDataType]) : void 0;
            }
            function ajaxConvert(s, response, jqXHR, isSuccess) {
                var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
                if (dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
                for (current = dataTypes.shift(); current; ) if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), 
                !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), 
                prev = current, current = dataTypes.shift()) if ("*" === current) current = prev; else if ("*" !== prev && prev !== current) {
                    if (conv = converters[prev + " " + current] || converters["* " + current], !conv) for (conv2 in converters) if (tmp = conv2.split(" "), 
                    tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                        conv === !0 ? conv = converters[conv2] : converters[conv2] !== !0 && (current = tmp[0], 
                        dataTypes.unshift(tmp[1]));
                        break;
                    }
                    if (conv !== !0) if (conv && s["throws"]) response = conv(response); else try {
                        response = conv(response);
                    } catch (e) {
                        return {
                            state: "parsererror",
                            error: conv ? e : "No conversion from " + prev + " to " + current
                        };
                    }
                }
                return {
                    state: "success",
                    data: response
                };
            }
            function buildParams(prefix, obj, traditional, add) {
                var name;
                if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
                    traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
                }); else if (traditional || "object" !== jQuery.type(obj)) add(prefix, obj); else for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
            function getWindow(elem) {
                return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType && elem.defaultView;
            }
            var arr = [], slice = arr.slice, concat = arr.concat, push = arr.push, indexOf = arr.indexOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, support = {}, document = window.document, version = "2.1.1", jQuery = function(selector, context) {
                return new jQuery.fn.init(selector, context);
            }, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function(all, letter) {
                return letter.toUpperCase();
            };
            jQuery.fn = jQuery.prototype = {
                jquery: version,
                constructor: jQuery,
                selector: "",
                length: 0,
                toArray: function() {
                    return slice.call(this);
                },
                get: function(num) {
                    return null != num ? 0 > num ? this[num + this.length] : this[num] : slice.call(this);
                },
                pushStack: function(elems) {
                    var ret = jQuery.merge(this.constructor(), elems);
                    return ret.prevObject = this, ret.context = this.context, ret;
                },
                each: function(callback, args) {
                    return jQuery.each(this, callback, args);
                },
                map: function(callback) {
                    return this.pushStack(jQuery.map(this, function(elem, i) {
                        return callback.call(elem, i, elem);
                    }));
                },
                slice: function() {
                    return this.pushStack(slice.apply(this, arguments));
                },
                first: function() {
                    return this.eq(0);
                },
                last: function() {
                    return this.eq(-1);
                },
                eq: function(i) {
                    var len = this.length, j = +i + (0 > i ? len : 0);
                    return this.pushStack(j >= 0 && len > j ? [ this[j] ] : []);
                },
                end: function() {
                    return this.prevObject || this.constructor(null);
                },
                push: push,
                sort: arr.sort,
                splice: arr.splice
            }, jQuery.extend = jQuery.fn.extend = function() {
                var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
                for ("boolean" == typeof target && (deep = target, target = arguments[i] || {}, 
                i++), "object" == typeof target || jQuery.isFunction(target) || (target = {}), i === length && (target = this, 
                i--); length > i; i++) if (null != (options = arguments[i])) for (name in options) src = target[name], 
                copy = options[name], target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, 
                clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, 
                target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
                return target;
            }, jQuery.extend({
                expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function(msg) {
                    throw new Error(msg);
                },
                noop: function() {},
                isFunction: function(obj) {
                    return "function" === jQuery.type(obj);
                },
                isArray: Array.isArray,
                isWindow: function(obj) {
                    return null != obj && obj === obj.window;
                },
                isNumeric: function(obj) {
                    return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
                },
                isPlainObject: function(obj) {
                    return "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj) ? !1 : obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ? !1 : !0;
                },
                isEmptyObject: function(obj) {
                    var name;
                    for (name in obj) return !1;
                    return !0;
                },
                type: function(obj) {
                    return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj;
                },
                globalEval: function(code) {
                    var script, indirect = eval;
                    code = jQuery.trim(code), code && (1 === code.indexOf("use strict") ? (script = document.createElement("script"), 
                    script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code));
                },
                camelCase: function(string) {
                    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
                },
                nodeName: function(elem, name) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
                },
                each: function(obj, callback, args) {
                    var value, i = 0, length = obj.length, isArray = isArraylike(obj);
                    if (args) {
                        if (isArray) for (;length > i && (value = callback.apply(obj[i], args), value !== !1); i++) ; else for (i in obj) if (value = callback.apply(obj[i], args), 
                        value === !1) break;
                    } else if (isArray) for (;length > i && (value = callback.call(obj[i], i, obj[i]), 
                    value !== !1); i++) ; else for (i in obj) if (value = callback.call(obj[i], i, obj[i]), 
                    value === !1) break;
                    return obj;
                },
                trim: function(text) {
                    return null == text ? "" : (text + "").replace(rtrim, "");
                },
                makeArray: function(arr, results) {
                    var ret = results || [];
                    return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [ arr ] : arr) : push.call(ret, arr)), 
                    ret;
                },
                inArray: function(elem, arr, i) {
                    return null == arr ? -1 : indexOf.call(arr, elem, i);
                },
                merge: function(first, second) {
                    for (var len = +second.length, j = 0, i = first.length; len > j; j++) first[i++] = second[j];
                    return first.length = i, first;
                },
                grep: function(elems, callback, invert) {
                    for (var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert; length > i; i++) callbackInverse = !callback(elems[i], i), 
                    callbackInverse !== callbackExpect && matches.push(elems[i]);
                    return matches;
                },
                map: function(elems, callback, arg) {
                    var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
                    if (isArray) for (;length > i; i++) value = callback(elems[i], i, arg), null != value && ret.push(value); else for (i in elems) value = callback(elems[i], i, arg), 
                    null != value && ret.push(value);
                    return concat.apply([], ret);
                },
                guid: 1,
                proxy: function(fn, context) {
                    var tmp, args, proxy;
                    return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), 
                    jQuery.isFunction(fn) ? (args = slice.call(arguments, 2), proxy = function() {
                        return fn.apply(context || this, args.concat(slice.call(arguments)));
                    }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0;
                },
                now: Date.now,
                support: support
            }), jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
                class2type["[object " + name + "]"] = name.toLowerCase();
            });
            var Sizzle = function(window) {
                function Sizzle(selector, context, results, seed) {
                    var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
                    if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), 
                    context = context || document, results = results || [], !selector || "string" != typeof selector) return results;
                    if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) return [];
                    if (documentIsHTML && !seed) {
                        if (match = rquickExpr.exec(selector)) if (m = match[1]) {
                            if (9 === nodeType) {
                                if (elem = context.getElementById(m), !elem || !elem.parentNode) return results;
                                if (elem.id === m) return results.push(elem), results;
                            } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), 
                            results;
                        } else {
                            if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), 
                            results;
                            if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), 
                            results;
                        }
                        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                            if (nid = old = expando, newContext = context, newSelector = 9 === nodeType && selector, 
                            1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
                                for (groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), 
                                nid = "[id='" + nid + "'] ", i = groups.length; i--; ) groups[i] = nid + toSelector(groups[i]);
                                newContext = rsibling.test(selector) && testContext(context.parentNode) || context, 
                                newSelector = groups.join(",");
                            }
                            if (newSelector) try {
                                return push.apply(results, newContext.querySelectorAll(newSelector)), results;
                            } catch (qsaError) {} finally {
                                old || context.removeAttribute("id");
                            }
                        }
                    }
                    return select(selector.replace(rtrim, "$1"), context, results, seed);
                }
                function createCache() {
                    function cache(key, value) {
                        return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key + " "] = value;
                    }
                    var keys = [];
                    return cache;
                }
                function markFunction(fn) {
                    return fn[expando] = !0, fn;
                }
                function assert(fn) {
                    var div = document.createElement("div");
                    try {
                        return !!fn(div);
                    } catch (e) {
                        return !1;
                    } finally {
                        div.parentNode && div.parentNode.removeChild(div), div = null;
                    }
                }
                function addHandle(attrs, handler) {
                    for (var arr = attrs.split("|"), i = attrs.length; i--; ) Expr.attrHandle[arr[i]] = handler;
                }
                function siblingCheck(a, b) {
                    var cur = b && a, diff = cur && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
                    if (diff) return diff;
                    if (cur) for (;cur = cur.nextSibling; ) if (cur === b) return -1;
                    return a ? 1 : -1;
                }
                function createInputPseudo(type) {
                    return function(elem) {
                        var name = elem.nodeName.toLowerCase();
                        return "input" === name && elem.type === type;
                    };
                }
                function createButtonPseudo(type) {
                    return function(elem) {
                        var name = elem.nodeName.toLowerCase();
                        return ("input" === name || "button" === name) && elem.type === type;
                    };
                }
                function createPositionalPseudo(fn) {
                    return markFunction(function(argument) {
                        return argument = +argument, markFunction(function(seed, matches) {
                            for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--; ) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                        });
                    });
                }
                function testContext(context) {
                    return context && typeof context.getElementsByTagName !== strundefined && context;
                }
                function setFilters() {}
                function toSelector(tokens) {
                    for (var i = 0, len = tokens.length, selector = ""; len > i; i++) selector += tokens[i].value;
                    return selector;
                }
                function addCombinator(matcher, combinator, base) {
                    var dir = combinator.dir, checkNonElements = base && "parentNode" === dir, doneName = done++;
                    return combinator.first ? function(elem, context, xml) {
                        for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
                    } : function(elem, context, xml) {
                        var oldCache, outerCache, newCache = [ dirruns, doneName ];
                        if (xml) {
                            for (;elem = elem[dir]; ) if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                        } else for (;elem = elem[dir]; ) if (1 === elem.nodeType || checkNonElements) {
                            if (outerCache = elem[expando] || (elem[expando] = {}), (oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
                            if (outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) return !0;
                        }
                    };
                }
                function elementMatcher(matchers) {
                    return matchers.length > 1 ? function(elem, context, xml) {
                        for (var i = matchers.length; i--; ) if (!matchers[i](elem, context, xml)) return !1;
                        return !0;
                    } : matchers[0];
                }
                function multipleContexts(selector, contexts, results) {
                    for (var i = 0, len = contexts.length; len > i; i++) Sizzle(selector, contexts[i], results);
                    return results;
                }
                function condense(unmatched, map, filter, context, xml) {
                    for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; len > i; i++) (elem = unmatched[i]) && (!filter || filter(elem, context, xml)) && (newUnmatched.push(elem), 
                    mapped && map.push(i));
                    return newUnmatched;
                }
                function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                    return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), 
                    postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), 
                    markFunction(function(seed, results, context, xml) {
                        var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] : context, []), matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml), matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                        if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for (temp = condense(matcherOut, postMap), 
                        postFilter(temp, [], context, xml), i = temp.length; i--; ) (elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                        if (seed) {
                            if (postFinder || preFilter) {
                                if (postFinder) {
                                    for (temp = [], i = matcherOut.length; i--; ) (elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                                    postFinder(null, matcherOut = [], temp, xml);
                                }
                                for (i = matcherOut.length; i--; ) (elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                            }
                        } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), 
                        postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
                    });
                }
                function matcherFromTokens(tokens) {
                    for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                        return elem === checkContext;
                    }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                        return indexOf.call(checkContext, elem) > -1;
                    }, implicitRelative, !0), matchers = [ function(elem, context, xml) {
                        return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                    } ]; len > i; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
                        if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
                            for (j = ++i; len > j && !Expr.relative[tokens[j].type]; j++) ;
                            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                                value: " " === tokens[i - 2].type ? "*" : ""
                            })).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens));
                        }
                        matchers.push(matcher);
                    }
                    return elementMatcher(matchers);
                }
                function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                    var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                        var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1, len = elems.length;
                        for (outermost && (outermostContext = context !== document && context); i !== len && null != (elem = elems[i]); i++) {
                            if (byElement && elem) {
                                for (j = 0; matcher = elementMatchers[j++]; ) if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                                outermost && (dirruns = dirrunsUnique);
                            }
                            bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                        }
                        if (matchedCount += i, bySet && i !== matchedCount) {
                            for (j = 0; matcher = setMatchers[j++]; ) matcher(unmatched, setMatched, context, xml);
                            if (seed) {
                                if (matchedCount > 0) for (;i--; ) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                                setMatched = condense(setMatched);
                            }
                            push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                        }
                        return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), 
                        unmatched;
                    };
                    return bySet ? markFunction(superMatcher) : superMatcher;
                }
                var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function(a, b) {
                    return a === b && (hasDuplicate = !0), 0;
                }, strundefined = "undefined", MAX_NEGATIVE = 1 << 31, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
                    for (var i = 0, len = this.length; len > i; i++) if (this[i] === elem) return i;
                    return -1;
                }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
                    ID: new RegExp("^#(" + characterEncoding + ")"),
                    CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
                    TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + attributes),
                    PSEUDO: new RegExp("^" + pseudos),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + booleans + ")$", "i"),
                    needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
                }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"), funescape = function(_, escaped, escapedWhitespace) {
                    var high = "0x" + escaped - 65536;
                    return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
                };
                try {
                    push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), 
                    arr[preferredDoc.childNodes.length].nodeType;
                } catch (e) {
                    push = {
                        apply: arr.length ? function(target, els) {
                            push_native.apply(target, slice.call(els));
                        } : function(target, els) {
                            for (var j = target.length, i = 0; target[j++] = els[i++]; ) ;
                            target.length = j - 1;
                        }
                    };
                }
                support = Sizzle.support = {}, isXML = Sizzle.isXML = function(elem) {
                    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
                    return documentElement ? "HTML" !== documentElement.nodeName : !1;
                }, setDocument = Sizzle.setDocument = function(node) {
                    var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
                    return doc !== document && 9 === doc.nodeType && doc.documentElement ? (document = doc, 
                    docElem = doc.documentElement, documentIsHTML = !isXML(doc), parent && parent !== parent.top && (parent.addEventListener ? parent.addEventListener("unload", function() {
                        setDocument();
                    }, !1) : parent.attachEvent && parent.attachEvent("onunload", function() {
                        setDocument();
                    })), support.attributes = assert(function(div) {
                        return div.className = "i", !div.getAttribute("className");
                    }), support.getElementsByTagName = assert(function(div) {
                        return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
                    }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function(div) {
                        return div.innerHTML = "<div class='a'></div><div class='a i'></div>", div.firstChild.className = "i", 
                        2 === div.getElementsByClassName("i").length;
                    }), support.getById = assert(function(div) {
                        return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
                    }), support.getById ? (Expr.find.ID = function(id, context) {
                        if (typeof context.getElementById !== strundefined && documentIsHTML) {
                            var m = context.getElementById(id);
                            return m && m.parentNode ? [ m ] : [];
                        }
                    }, Expr.filter.ID = function(id) {
                        var attrId = id.replace(runescape, funescape);
                        return function(elem) {
                            return elem.getAttribute("id") === attrId;
                        };
                    }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
                        var attrId = id.replace(runescape, funescape);
                        return function(elem) {
                            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                            return node && node.value === attrId;
                        };
                    }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                        return typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag) : void 0;
                    } : function(tag, context) {
                        var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                        if ("*" === tag) {
                            for (;elem = results[i++]; ) 1 === elem.nodeType && tmp.push(elem);
                            return tmp;
                        }
                        return results;
                    }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                        return typeof context.getElementsByClassName !== strundefined && documentIsHTML ? context.getElementsByClassName(className) : void 0;
                    }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
                        div.innerHTML = "<select msallowclip=''><option selected=''></option></select>", 
                        div.querySelectorAll("[msallowclip^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), 
                        div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), 
                        div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
                    }), assert(function(div) {
                        var input = doc.createElement("input");
                        input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("name", "D"), 
                        div.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), 
                        div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), 
                        div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
                    })), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                        support.disconnectedMatch = matches.call(div, "div"), matches.call(div, "[s!='']:x"), 
                        rbuggyMatches.push("!=", pseudos);
                    }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), 
                    hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                        var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                        return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
                    } : function(a, b) {
                        if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                        return !1;
                    }, sortOrder = hasCompare ? function(a, b) {
                        if (a === b) return hasDuplicate = !0, 0;
                        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                        return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 
                        1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : 4 & compare ? -1 : 1);
                    } : function(a, b) {
                        if (a === b) return hasDuplicate = !0, 0;
                        var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                        if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                        if (aup === bup) return siblingCheck(a, b);
                        for (cur = a; cur = cur.parentNode; ) ap.unshift(cur);
                        for (cur = b; cur = cur.parentNode; ) bp.unshift(cur);
                        for (;ap[i] === bp[i]; ) i++;
                        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
                    }, doc) : document;
                }, Sizzle.matches = function(expr, elements) {
                    return Sizzle(expr, null, null, elements);
                }, Sizzle.matchesSelector = function(elem, expr) {
                    if ((elem.ownerDocument || elem) !== document && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), 
                    !(!support.matchesSelector || !documentIsHTML || rbuggyMatches && rbuggyMatches.test(expr) || rbuggyQSA && rbuggyQSA.test(expr))) try {
                        var ret = matches.call(elem, expr);
                        if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret;
                    } catch (e) {}
                    return Sizzle(expr, document, null, [ elem ]).length > 0;
                }, Sizzle.contains = function(context, elem) {
                    return (context.ownerDocument || context) !== document && setDocument(context), 
                    contains(context, elem);
                }, Sizzle.attr = function(elem, name) {
                    (elem.ownerDocument || elem) !== document && setDocument(elem);
                    var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
                    return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }, Sizzle.error = function(msg) {
                    throw new Error("Syntax error, unrecognized expression: " + msg);
                }, Sizzle.uniqueSort = function(results) {
                    var elem, duplicates = [], j = 0, i = 0;
                    if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), 
                    results.sort(sortOrder), hasDuplicate) {
                        for (;elem = results[i++]; ) elem === results[i] && (j = duplicates.push(i));
                        for (;j--; ) results.splice(duplicates[j], 1);
                    }
                    return sortInput = null, results;
                }, getText = Sizzle.getText = function(elem) {
                    var node, ret = "", i = 0, nodeType = elem.nodeType;
                    if (nodeType) {
                        if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                            if ("string" == typeof elem.textContent) return elem.textContent;
                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
                        } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
                    } else for (;node = elem[i++]; ) ret += getText(node);
                    return ret;
                }, Expr = Sizzle.selectors = {
                    cacheLength: 50,
                    createPseudo: markFunction,
                    match: matchExpr,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(match) {
                            return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), 
                            "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                        },
                        CHILD: function(match) {
                            return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), 
                            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), 
                            match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), 
                            match;
                        },
                        PSEUDO: function(match) {
                            var excess, unquoted = !match[6] && match[2];
                            return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), 
                            match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                        }
                    },
                    filter: {
                        TAG: function(nodeNameSelector) {
                            var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                            return "*" === nodeNameSelector ? function() {
                                return !0;
                            } : function(elem) {
                                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                            };
                        },
                        CLASS: function(className) {
                            var pattern = classCache[className + " "];
                            return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                                return pattern.test("string" == typeof elem.className && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                            });
                        },
                        ATTR: function(name, operator, check) {
                            return function(elem) {
                                var result = Sizzle.attr(elem, name);
                                return null == result ? "!=" === operator : operator ? (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator ? result === check || result.slice(0, check.length + 1) === check + "-" : !1) : !0;
                            };
                        },
                        CHILD: function(type, what, argument, first, last) {
                            var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                            return 1 === first && 0 === last ? function(elem) {
                                return !!elem.parentNode;
                            } : function(elem, context, xml) {
                                var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                                if (parent) {
                                    if (simple) {
                                        for (;dir; ) {
                                            for (node = elem; node = node[dir]; ) if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                            start = dir = "only" === type && !start && "nextSibling";
                                        }
                                        return !0;
                                    }
                                    if (start = [ forward ? parent.firstChild : parent.lastChild ], forward && useCache) {
                                        for (outerCache = parent[expando] || (parent[expando] = {}), cache = outerCache[type] || [], 
                                        nodeIndex = cache[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], 
                                        node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop(); ) if (1 === node.nodeType && ++diff && node === elem) {
                                            outerCache[type] = [ dirruns, nodeIndex, diff ];
                                            break;
                                        }
                                    } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1]; else for (;(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (useCache && ((node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ]), 
                                    node !== elem)); ) ;
                                    return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
                                }
                            };
                        },
                        PSEUDO: function(pseudo, argument) {
                            var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                            return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [ pseudo, pseudo, "", argument ], 
                            Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                                for (var idx, matched = fn(seed, argument), i = matched.length; i--; ) idx = indexOf.call(seed, matched[i]), 
                                seed[idx] = !(matches[idx] = matched[i]);
                            }) : function(elem) {
                                return fn(elem, 0, args);
                            }) : fn;
                        }
                    },
                    pseudos: {
                        not: markFunction(function(selector) {
                            var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                            return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                                for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--; ) (elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                            }) : function(elem, context, xml) {
                                return input[0] = elem, matcher(input, null, xml, results), !results.pop();
                            };
                        }),
                        has: markFunction(function(selector) {
                            return function(elem) {
                                return Sizzle(selector, elem).length > 0;
                            };
                        }),
                        contains: markFunction(function(text) {
                            return function(elem) {
                                return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                            };
                        }),
                        lang: markFunction(function(lang) {
                            return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), 
                            lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                                var elemLang;
                                do if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return elemLang = elemLang.toLowerCase(), 
                                elemLang === lang || 0 === elemLang.indexOf(lang + "-"); while ((elem = elem.parentNode) && 1 === elem.nodeType);
                                return !1;
                            };
                        }),
                        target: function(elem) {
                            var hash = window.location && window.location.hash;
                            return hash && hash.slice(1) === elem.id;
                        },
                        root: function(elem) {
                            return elem === docElem;
                        },
                        focus: function(elem) {
                            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                        },
                        enabled: function(elem) {
                            return elem.disabled === !1;
                        },
                        disabled: function(elem) {
                            return elem.disabled === !0;
                        },
                        checked: function(elem) {
                            var nodeName = elem.nodeName.toLowerCase();
                            return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                        },
                        selected: function(elem) {
                            return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0;
                        },
                        empty: function(elem) {
                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeType < 6) return !1;
                            return !0;
                        },
                        parent: function(elem) {
                            return !Expr.pseudos.empty(elem);
                        },
                        header: function(elem) {
                            return rheader.test(elem.nodeName);
                        },
                        input: function(elem) {
                            return rinputs.test(elem.nodeName);
                        },
                        button: function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return "input" === name && "button" === elem.type || "button" === name;
                        },
                        text: function(elem) {
                            var attr;
                            return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase());
                        },
                        first: createPositionalPseudo(function() {
                            return [ 0 ];
                        }),
                        last: createPositionalPseudo(function(matchIndexes, length) {
                            return [ length - 1 ];
                        }),
                        eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                            return [ 0 > argument ? argument + length : argument ];
                        }),
                        even: createPositionalPseudo(function(matchIndexes, length) {
                            for (var i = 0; length > i; i += 2) matchIndexes.push(i);
                            return matchIndexes;
                        }),
                        odd: createPositionalPseudo(function(matchIndexes, length) {
                            for (var i = 1; length > i; i += 2) matchIndexes.push(i);
                            return matchIndexes;
                        }),
                        lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                            for (var i = 0 > argument ? argument + length : argument; --i >= 0; ) matchIndexes.push(i);
                            return matchIndexes;
                        }),
                        gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                            for (var i = 0 > argument ? argument + length : argument; ++i < length; ) matchIndexes.push(i);
                            return matchIndexes;
                        })
                    }
                }, Expr.pseudos.nth = Expr.pseudos.eq;
                for (i in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) Expr.pseudos[i] = createInputPseudo(i);
                for (i in {
                    submit: !0,
                    reset: !0
                }) Expr.pseudos[i] = createButtonPseudo(i);
                return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters(), 
                tokenize = Sizzle.tokenize = function(selector, parseOnly) {
                    var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
                    if (cached) return parseOnly ? 0 : cached.slice(0);
                    for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar; ) {
                        (!matched || (match = rcomma.exec(soFar))) && (match && (soFar = soFar.slice(match[0].length) || soFar), 
                        groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), 
                        tokens.push({
                            value: matched,
                            type: match[0].replace(rtrim, " ")
                        }), soFar = soFar.slice(matched.length));
                        for (type in Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), 
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        }), soFar = soFar.slice(matched.length));
                        if (!matched) break;
                    }
                    return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
                }, compile = Sizzle.compile = function(selector, match) {
                    var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
                    if (!cached) {
                        for (match || (match = tokenize(selector)), i = match.length; i--; ) cached = matcherFromTokens(match[i]), 
                        cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)), 
                        cached.selector = selector;
                    }
                    return cached;
                }, select = Sizzle.select = function(selector, context, results, seed) {
                    var i, tokens, token, type, find, compiled = "function" == typeof selector && selector, match = !seed && tokenize(selector = compiled.selector || selector);
                    if (results = results || [], 1 === match.length) {
                        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && "ID" === (token = tokens[0]).type && support.getById && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                            if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], 
                            !context) return results;
                            compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length);
                        }
                        for (i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], 
                        !Expr.relative[type = token.type]); ) if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                            if (tokens.splice(i, 1), selector = seed.length && toSelector(tokens), !selector) return push.apply(results, seed), 
                            results;
                            break;
                        }
                    }
                    return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context), 
                    results;
                }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, 
                support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
                    return 1 & div1.compareDocumentPosition(document.createElement("div"));
                }), assert(function(div) {
                    return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
                }) || addHandle("type|href|height|width", function(elem, name, isXML) {
                    return isXML ? void 0 : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
                }), support.attributes && assert(function(div) {
                    return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
                }) || addHandle("value", function(elem, name, isXML) {
                    return isXML || "input" !== elem.nodeName.toLowerCase() ? void 0 : elem.defaultValue;
                }), assert(function(div) {
                    return null == div.getAttribute("disabled");
                }) || addHandle(booleans, function(elem, name, isXML) {
                    var val;
                    return isXML ? void 0 : elem[name] === !0 ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }), Sizzle;
            }(window);
            jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, 
            jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, 
            jQuery.contains = Sizzle.contains;
            var rneedsContext = jQuery.expr.match.needsContext, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, risSimple = /^.[^:#\[\.,]*$/;
            jQuery.filter = function(expr, elems, not) {
                var elem = elems[0];
                return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [ elem ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
                    return 1 === elem.nodeType;
                }));
            }, jQuery.fn.extend({
                find: function(selector) {
                    var i, len = this.length, ret = [], self = this;
                    if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter(function() {
                        for (i = 0; len > i; i++) if (jQuery.contains(self[i], this)) return !0;
                    }));
                    for (i = 0; len > i; i++) jQuery.find(selector, self[i], ret);
                    return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, 
                    ret;
                },
                filter: function(selector) {
                    return this.pushStack(winnow(this, selector || [], !1));
                },
                not: function(selector) {
                    return this.pushStack(winnow(this, selector || [], !0));
                },
                is: function(selector) {
                    return !!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length;
                }
            });
            var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, init = jQuery.fn.init = function(selector, context) {
                var match, elem;
                if (!selector) return this;
                if ("string" == typeof selector) {
                    if (match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [ null, selector, null ] : rquickExpr.exec(selector), 
                    !match || !match[1] && context) return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
                    if (match[1]) {
                        if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), 
                        rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for (match in context) jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                        return this;
                    }
                    return elem = document.getElementById(match[2]), elem && elem.parentNode && (this.length = 1, 
                    this[0] = elem), this.context = document, this.selector = selector, this;
                }
                return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, 
                this) : jQuery.isFunction(selector) ? "undefined" != typeof rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, 
                this.context = selector.context), jQuery.makeArray(selector, this));
            };
            init.prototype = jQuery.fn, rootjQuery = jQuery(document);
            var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
            jQuery.extend({
                dir: function(elem, dir, until) {
                    for (var matched = [], truncate = void 0 !== until; (elem = elem[dir]) && 9 !== elem.nodeType; ) if (1 === elem.nodeType) {
                        if (truncate && jQuery(elem).is(until)) break;
                        matched.push(elem);
                    }
                    return matched;
                },
                sibling: function(n, elem) {
                    for (var matched = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && matched.push(n);
                    return matched;
                }
            }), jQuery.fn.extend({
                has: function(target) {
                    var targets = jQuery(target, this), l = targets.length;
                    return this.filter(function() {
                        for (var i = 0; l > i; i++) if (jQuery.contains(this, targets[i])) return !0;
                    });
                },
                closest: function(selectors, context) {
                    for (var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; l > i; i++) for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
                        matched.push(cur);
                        break;
                    }
                    return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
                },
                index: function(elem) {
                    return elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
                },
                add: function(selector, context) {
                    return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
                },
                addBack: function(selector) {
                    return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
                }
            }), jQuery.each({
                parent: function(elem) {
                    var parent = elem.parentNode;
                    return parent && 11 !== parent.nodeType ? parent : null;
                },
                parents: function(elem) {
                    return jQuery.dir(elem, "parentNode");
                },
                parentsUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "parentNode", until);
                },
                next: function(elem) {
                    return sibling(elem, "nextSibling");
                },
                prev: function(elem) {
                    return sibling(elem, "previousSibling");
                },
                nextAll: function(elem) {
                    return jQuery.dir(elem, "nextSibling");
                },
                prevAll: function(elem) {
                    return jQuery.dir(elem, "previousSibling");
                },
                nextUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "nextSibling", until);
                },
                prevUntil: function(elem, i, until) {
                    return jQuery.dir(elem, "previousSibling", until);
                },
                siblings: function(elem) {
                    return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
                },
                children: function(elem) {
                    return jQuery.sibling(elem.firstChild);
                },
                contents: function(elem) {
                    return elem.contentDocument || jQuery.merge([], elem.childNodes);
                }
            }, function(name, fn) {
                jQuery.fn[name] = function(until, selector) {
                    var matched = jQuery.map(this, fn, until);
                    return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), 
                    this.length > 1 && (guaranteedUnique[name] || jQuery.unique(matched), rparentsprev.test(name) && matched.reverse()), 
                    this.pushStack(matched);
                };
            });
            var rnotwhite = /\S+/g, optionsCache = {};
            jQuery.Callbacks = function(options) {
                options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
                var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function(data) {
                    for (memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, 
                    firingStart = 0, firingLength = list.length, firing = !0; list && firingLength > firingIndex; firingIndex++) if (list[firingIndex].apply(data[0], data[1]) === !1 && options.stopOnFalse) {
                        memory = !1;
                        break;
                    }
                    firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
                }, self = {
                    add: function() {
                        if (list) {
                            var start = list.length;
                            !function add(args) {
                                jQuery.each(args, function(_, arg) {
                                    var type = jQuery.type(arg);
                                    "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && add(arg);
                                });
                            }(arguments), firing ? firingLength = list.length : memory && (firingStart = start, 
                            fire(memory));
                        }
                        return this;
                    },
                    remove: function() {
                        return list && jQuery.each(arguments, function(_, arg) {
                            for (var index; (index = jQuery.inArray(arg, list, index)) > -1; ) list.splice(index, 1), 
                            firing && (firingLength >= index && firingLength--, firingIndex >= index && firingIndex--);
                        }), this;
                    },
                    has: function(fn) {
                        return fn ? jQuery.inArray(fn, list) > -1 : !(!list || !list.length);
                    },
                    empty: function() {
                        return list = [], firingLength = 0, this;
                    },
                    disable: function() {
                        return list = stack = memory = void 0, this;
                    },
                    disabled: function() {
                        return !list;
                    },
                    lock: function() {
                        return stack = void 0, memory || self.disable(), this;
                    },
                    locked: function() {
                        return !stack;
                    },
                    fireWith: function(context, args) {
                        return !list || fired && !stack || (args = args || [], args = [ context, args.slice ? args.slice() : args ], 
                        firing ? stack.push(args) : fire(args)), this;
                    },
                    fire: function() {
                        return self.fireWith(this, arguments), this;
                    },
                    fired: function() {
                        return !!fired;
                    }
                };
                return self;
            }, jQuery.extend({
                Deferred: function(func) {
                    var tuples = [ [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory") ] ], state = "pending", promise = {
                        state: function() {
                            return state;
                        },
                        always: function() {
                            return deferred.done(arguments).fail(arguments), this;
                        },
                        then: function() {
                            var fns = arguments;
                            return jQuery.Deferred(function(newDefer) {
                                jQuery.each(tuples, function(i, tuple) {
                                    var fn = jQuery.isFunction(fns[i]) && fns[i];
                                    deferred[tuple[1]](function() {
                                        var returned = fn && fn.apply(this, arguments);
                                        returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments);
                                    });
                                }), fns = null;
                            }).promise();
                        },
                        promise: function(obj) {
                            return null != obj ? jQuery.extend(obj, promise) : promise;
                        }
                    }, deferred = {};
                    return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
                        var list = tuple[2], stateString = tuple[3];
                        promise[tuple[1]] = list.add, stateString && list.add(function() {
                            state = stateString;
                        }, tuples[1 ^ i][2].disable, tuples[2][2].lock), deferred[tuple[0]] = function() {
                            return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), 
                            this;
                        }, deferred[tuple[0] + "With"] = list.fireWith;
                    }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
                },
                when: function(subordinate) {
                    var progressValues, progressContexts, resolveContexts, i = 0, resolveValues = slice.call(arguments), length = resolveValues.length, remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = 1 === remaining ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
                        return function(value) {
                            contexts[i] = this, values[i] = arguments.length > 1 ? slice.call(arguments) : value, 
                            values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
                        };
                    };
                    if (length > 1) for (progressValues = new Array(length), progressContexts = new Array(length), 
                    resolveContexts = new Array(length); length > i; i++) resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
                    return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
                }
            });
            var readyList;
            jQuery.fn.ready = function(fn) {
                return jQuery.ready.promise().done(fn), this;
            }, jQuery.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function(hold) {
                    hold ? jQuery.readyWait++ : jQuery.ready(!0);
                },
                ready: function(wait) {
                    (wait === !0 ? --jQuery.readyWait : jQuery.isReady) || (jQuery.isReady = !0, wait !== !0 && --jQuery.readyWait > 0 || (readyList.resolveWith(document, [ jQuery ]), 
                    jQuery.fn.triggerHandler && (jQuery(document).triggerHandler("ready"), jQuery(document).off("ready"))));
                }
            }), jQuery.ready.promise = function(obj) {
                return readyList || (readyList = jQuery.Deferred(), "complete" === document.readyState ? setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed, !1), 
                window.addEventListener("load", completed, !1))), readyList.promise(obj);
            }, jQuery.ready.promise();
            var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
                var i = 0, len = elems.length, bulk = null == key;
                if ("object" === jQuery.type(key)) {
                    chainable = !0;
                    for (i in key) jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw);
                } else if (void 0 !== value && (chainable = !0, jQuery.isFunction(value) || (raw = !0), 
                bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
                    return bulk.call(jQuery(elem), value);
                })), fn)) for (;len > i; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
            };
            jQuery.acceptData = function(owner) {
                return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType;
            }, Data.uid = 1, Data.accepts = jQuery.acceptData, Data.prototype = {
                key: function(owner) {
                    if (!Data.accepts(owner)) return 0;
                    var descriptor = {}, unlock = owner[this.expando];
                    if (!unlock) {
                        unlock = Data.uid++;
                        try {
                            descriptor[this.expando] = {
                                value: unlock
                            }, Object.defineProperties(owner, descriptor);
                        } catch (e) {
                            descriptor[this.expando] = unlock, jQuery.extend(owner, descriptor);
                        }
                    }
                    return this.cache[unlock] || (this.cache[unlock] = {}), unlock;
                },
                set: function(owner, data, value) {
                    var prop, unlock = this.key(owner), cache = this.cache[unlock];
                    if ("string" == typeof data) cache[data] = value; else if (jQuery.isEmptyObject(cache)) jQuery.extend(this.cache[unlock], data); else for (prop in data) cache[prop] = data[prop];
                    return cache;
                },
                get: function(owner, key) {
                    var cache = this.cache[this.key(owner)];
                    return void 0 === key ? cache : cache[key];
                },
                access: function(owner, key, value) {
                    var stored;
                    return void 0 === key || key && "string" == typeof key && void 0 === value ? (stored = this.get(owner, key), 
                    void 0 !== stored ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), 
                    void 0 !== value ? value : key);
                },
                remove: function(owner, key) {
                    var i, name, camel, unlock = this.key(owner), cache = this.cache[unlock];
                    if (void 0 === key) this.cache[unlock] = {}; else {
                        jQuery.isArray(key) ? name = key.concat(key.map(jQuery.camelCase)) : (camel = jQuery.camelCase(key), 
                        key in cache ? name = [ key, camel ] : (name = camel, name = name in cache ? [ name ] : name.match(rnotwhite) || [])), 
                        i = name.length;
                        for (;i--; ) delete cache[name[i]];
                    }
                },
                hasData: function(owner) {
                    return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {});
                },
                discard: function(owner) {
                    owner[this.expando] && delete this.cache[owner[this.expando]];
                }
            };
            var data_priv = new Data(), data_user = new Data(), rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /([A-Z])/g;
            jQuery.extend({
                hasData: function(elem) {
                    return data_user.hasData(elem) || data_priv.hasData(elem);
                },
                data: function(elem, name, data) {
                    return data_user.access(elem, name, data);
                },
                removeData: function(elem, name) {
                    data_user.remove(elem, name);
                },
                _data: function(elem, name, data) {
                    return data_priv.access(elem, name, data);
                },
                _removeData: function(elem, name) {
                    data_priv.remove(elem, name);
                }
            }), jQuery.fn.extend({
                data: function(key, value) {
                    var i, name, data, elem = this[0], attrs = elem && elem.attributes;
                    if (void 0 === key) {
                        if (this.length && (data = data_user.get(elem), 1 === elem.nodeType && !data_priv.get(elem, "hasDataAttrs"))) {
                            for (i = attrs.length; i--; ) attrs[i] && (name = attrs[i].name, 0 === name.indexOf("data-") && (name = jQuery.camelCase(name.slice(5)), 
                            dataAttr(elem, name, data[name])));
                            data_priv.set(elem, "hasDataAttrs", !0);
                        }
                        return data;
                    }
                    return "object" == typeof key ? this.each(function() {
                        data_user.set(this, key);
                    }) : access(this, function(value) {
                        var data, camelKey = jQuery.camelCase(key);
                        if (elem && void 0 === value) {
                            if (data = data_user.get(elem, key), void 0 !== data) return data;
                            if (data = data_user.get(elem, camelKey), void 0 !== data) return data;
                            if (data = dataAttr(elem, camelKey, void 0), void 0 !== data) return data;
                        } else this.each(function() {
                            var data = data_user.get(this, camelKey);
                            data_user.set(this, camelKey, value), -1 !== key.indexOf("-") && void 0 !== data && data_user.set(this, key, value);
                        });
                    }, null, value, arguments.length > 1, null, !0);
                },
                removeData: function(key) {
                    return this.each(function() {
                        data_user.remove(this, key);
                    });
                }
            }), jQuery.extend({
                queue: function(elem, type, data) {
                    var queue;
                    return elem ? (type = (type || "fx") + "queue", queue = data_priv.get(elem, type), 
                    data && (!queue || jQuery.isArray(data) ? queue = data_priv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), 
                    queue || []) : void 0;
                },
                dequeue: function(elem, type) {
                    type = type || "fx";
                    var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
                        jQuery.dequeue(elem, type);
                    };
                    "inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), 
                    delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire();
                },
                _queueHooks: function(elem, type) {
                    var key = type + "queueHooks";
                    return data_priv.get(elem, key) || data_priv.access(elem, key, {
                        empty: jQuery.Callbacks("once memory").add(function() {
                            data_priv.remove(elem, [ type + "queue", key ]);
                        })
                    });
                }
            }), jQuery.fn.extend({
                queue: function(type, data) {
                    var setter = 2;
                    return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
                        var queue = jQuery.queue(this, type, data);
                        jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
                    });
                },
                dequeue: function(type) {
                    return this.each(function() {
                        jQuery.dequeue(this, type);
                    });
                },
                clearQueue: function(type) {
                    return this.queue(type || "fx", []);
                },
                promise: function(type, obj) {
                    var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                        --count || defer.resolveWith(elements, [ elements ]);
                    };
                    for ("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--; ) tmp = data_priv.get(elements[i], type + "queueHooks"), 
                    tmp && tmp.empty && (count++, tmp.empty.add(resolve));
                    return resolve(), defer.promise(obj);
                }
            });
            var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, cssExpand = [ "Top", "Right", "Bottom", "Left" ], isHidden = function(elem, el) {
                return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem);
            }, rcheckableType = /^(?:checkbox|radio)$/i;
            !function() {
                var fragment = document.createDocumentFragment(), div = fragment.appendChild(document.createElement("div")), input = document.createElement("input");
                input.setAttribute("type", "radio"), input.setAttribute("checked", "checked"), input.setAttribute("name", "t"), 
                div.appendChild(input), support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, 
                div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue;
            }();
            var strundefined = "undefined";
            support.focusinBubbles = "onfocusin" in window;
            var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
            jQuery.event = {
                global: {},
                add: function(elem, types, handler, data, selector) {
                    var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.get(elem);
                    if (elemData) for (handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, 
                    selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), 
                    (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                        return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
                    }), types = (types || "").match(rnotwhite) || [ "" ], t = types.length; t--; ) tmp = rtypenamespace.exec(types[t]) || [], 
                    type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type && (special = jQuery.event.special[type] || {}, 
                    type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, 
                    handleObj = jQuery.extend({
                        type: type,
                        origType: origType,
                        data: data,
                        handler: handler,
                        guid: handler.guid,
                        selector: selector,
                        needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                        namespace: namespaces.join(".")
                    }, handleObjIn), (handlers = events[type]) || (handlers = events[type] = [], handlers.delegateCount = 0, 
                    special.setup && special.setup.call(elem, data, namespaces, eventHandle) !== !1 || elem.addEventListener && elem.addEventListener(type, eventHandle, !1)), 
                    special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), 
                    selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), 
                    jQuery.event.global[type] = !0);
                },
                remove: function(elem, types, handler, selector, mappedTypes) {
                    var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.hasData(elem) && data_priv.get(elem);
                    if (elemData && (events = elemData.events)) {
                        for (types = (types || "").match(rnotwhite) || [ "" ], t = types.length; t--; ) if (tmp = rtypenamespace.exec(types[t]) || [], 
                        type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
                            for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, 
                            handlers = events[type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                            origCount = j = handlers.length; j--; ) handleObj = handlers[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || tmp && !tmp.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (handlers.splice(j, 1), 
                            handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                            origCount && !handlers.length && (special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== !1 || jQuery.removeEvent(elem, type, elemData.handle), 
                            delete events[type]);
                        } else for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                        jQuery.isEmptyObject(events) && (delete elemData.handle, data_priv.remove(elem, "events"));
                    }
                },
                trigger: function(event, data, elem, onlyHandlers) {
                    var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [ elem || document ], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
                    if (cur = tmp = elem = elem || document, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (namespaces = type.split("."), 
                    type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, 
                    event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), 
                    event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), 
                    event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                    event.result = void 0, event.target || (event.target = elem), data = null == data ? [ event ] : jQuery.makeArray(data, [ event ]), 
                    special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || special.trigger.apply(elem, data) !== !1)) {
                        if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                            for (bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode) eventPath.push(cur), 
                            tmp = cur;
                            tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                        }
                        for (i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped(); ) event.type = i > 1 ? bubbleType : special.bindType || type, 
                        handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle"), 
                        handle && handle.apply(cur, data), handle = ontype && cur[ontype], handle && handle.apply && jQuery.acceptData(cur) && (event.result = handle.apply(cur, data), 
                        event.result === !1 && event.preventDefault());
                        return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && special._default.apply(eventPath.pop(), data) !== !1 || !jQuery.acceptData(elem) || ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem) && (tmp = elem[ontype], 
                        tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = void 0, 
                        tmp && (elem[ontype] = tmp)), event.result;
                    }
                },
                dispatch: function(event) {
                    event = jQuery.event.fix(event);
                    var i, j, ret, matched, handleObj, handlerQueue = [], args = slice.call(arguments), handlers = (data_priv.get(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
                    if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== !1) {
                        for (handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped(); ) for (event.currentTarget = matched.elem, 
                        j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped(); ) (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) && (event.handleObj = handleObj, 
                        event.data = handleObj.data, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), 
                        void 0 !== ret && (event.result = ret) === !1 && (event.preventDefault(), event.stopPropagation()));
                        return special.postDispatch && special.postDispatch.call(this, event), event.result;
                    }
                },
                handlers: function(event, handlers) {
                    var i, matches, sel, handleObj, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
                    if (delegateCount && cur.nodeType && (!event.button || "click" !== event.type)) for (;cur !== this; cur = cur.parentNode || this) if (cur.disabled !== !0 || "click" !== event.type) {
                        for (matches = [], i = 0; delegateCount > i; i++) handleObj = handlers[i], sel = handleObj.selector + " ", 
                        void 0 === matches[sel] && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [ cur ]).length), 
                        matches[sel] && matches.push(handleObj);
                        matches.length && handlerQueue.push({
                            elem: cur,
                            handlers: matches
                        });
                    }
                    return delegateCount < handlers.length && handlerQueue.push({
                        elem: this,
                        handlers: handlers.slice(delegateCount)
                    }), handlerQueue;
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(event, original) {
                        return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), 
                        event;
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(event, original) {
                        var eventDoc, doc, body, button = original.button;
                        return null == event.pageX && null != original.clientX && (eventDoc = event.target.ownerDocument || document, 
                        doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), 
                        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), 
                        event.which || void 0 === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), 
                        event;
                    }
                },
                fix: function(event) {
                    if (event[jQuery.expando]) return event;
                    var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
                    for (fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), 
                    copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), 
                    i = copy.length; i--; ) prop = copy[i], event[prop] = originalEvent[prop];
                    return event.target || (event.target = document), 3 === event.target.nodeType && (event.target = event.target.parentNode), 
                    fixHook.filter ? fixHook.filter(event, originalEvent) : event;
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            return this !== safeActiveElement() && this.focus ? (this.focus(), !1) : void 0;
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            return this === safeActiveElement() && this.blur ? (this.blur(), !1) : void 0;
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            return "checkbox" === this.type && this.click && jQuery.nodeName(this, "input") ? (this.click(), 
                            !1) : void 0;
                        },
                        _default: function(event) {
                            return jQuery.nodeName(event.target, "a");
                        }
                    },
                    beforeunload: {
                        postDispatch: function(event) {
                            void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result);
                        }
                    }
                },
                simulate: function(type, elem, event, bubble) {
                    var e = jQuery.extend(new jQuery.Event(), event, {
                        type: type,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), 
                    e.isDefaultPrevented() && event.preventDefault();
                }
            }, jQuery.removeEvent = function(elem, type, handle) {
                elem.removeEventListener && elem.removeEventListener(type, handle, !1);
            }, jQuery.Event = function(src, props) {
                return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, 
                this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === !1 ? returnTrue : returnFalse) : this.type = src, 
                props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), 
                void (this[jQuery.expando] = !0)) : new jQuery.Event(src, props);
            }, jQuery.Event.prototype = {
                isDefaultPrevented: returnFalse,
                isPropagationStopped: returnFalse,
                isImmediatePropagationStopped: returnFalse,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault();
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation();
                },
                stopImmediatePropagation: function() {
                    var e = this.originalEvent;
                    this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), 
                    this.stopPropagation();
                }
            }, jQuery.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout"
            }, function(orig, fix) {
                jQuery.event.special[orig] = {
                    delegateType: fix,
                    bindType: fix,
                    handle: function(event) {
                        var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                        return (!related || related !== target && !jQuery.contains(target, related)) && (event.type = handleObj.origType, 
                        ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
                    }
                };
            }), support.focusinBubbles || jQuery.each({
                focus: "focusin",
                blur: "focusout"
            }, function(orig, fix) {
                var handler = function(event) {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
                };
                jQuery.event.special[fix] = {
                    setup: function() {
                        var doc = this.ownerDocument || this, attaches = data_priv.access(doc, fix);
                        attaches || doc.addEventListener(orig, handler, !0), data_priv.access(doc, fix, (attaches || 0) + 1);
                    },
                    teardown: function() {
                        var doc = this.ownerDocument || this, attaches = data_priv.access(doc, fix) - 1;
                        attaches ? data_priv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), 
                        data_priv.remove(doc, fix));
                    }
                };
            }), jQuery.fn.extend({
                on: function(types, selector, data, fn, one) {
                    var origFn, type;
                    if ("object" == typeof types) {
                        "string" != typeof selector && (data = data || selector, selector = void 0);
                        for (type in types) this.on(type, selector, data, types[type], one);
                        return this;
                    }
                    if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, 
                    data = void 0) : (fn = data, data = selector, selector = void 0)), fn === !1) fn = returnFalse; else if (!fn) return this;
                    return 1 === one && (origFn = fn, fn = function(event) {
                        return jQuery().off(event), origFn.apply(this, arguments);
                    }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                        jQuery.event.add(this, types, fn, data, selector);
                    });
                },
                one: function(types, selector, data, fn) {
                    return this.on(types, selector, data, fn, 1);
                },
                off: function(types, selector, fn) {
                    var handleObj, type;
                    if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, 
                    jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), 
                    this;
                    if ("object" == typeof types) {
                        for (type in types) this.off(type, selector, types[type]);
                        return this;
                    }
                    return (selector === !1 || "function" == typeof selector) && (fn = selector, selector = void 0), 
                    fn === !1 && (fn = returnFalse), this.each(function() {
                        jQuery.event.remove(this, types, fn, selector);
                    });
                },
                trigger: function(type, data) {
                    return this.each(function() {
                        jQuery.event.trigger(type, data, this);
                    });
                },
                triggerHandler: function(type, data) {
                    var elem = this[0];
                    return elem ? jQuery.event.trigger(type, data, elem, !0) : void 0;
                }
            });
            var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
                option: [ 1, "<select multiple='multiple'>", "</select>" ],
                thead: [ 1, "<table>", "</table>" ],
                col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
                tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                _default: [ 0, "", "" ]
            };
            wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, 
            wrapMap.th = wrapMap.td, jQuery.extend({
                clone: function(elem, dataAndEvents, deepDataAndEvents) {
                    var i, l, srcElements, destElements, clone = elem.cloneNode(!0), inPage = jQuery.contains(elem.ownerDocument, elem);
                    if (!(support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem))) for (destElements = getAll(clone), 
                    srcElements = getAll(elem), i = 0, l = srcElements.length; l > i; i++) fixInput(srcElements[i], destElements[i]);
                    if (dataAndEvents) if (deepDataAndEvents) for (srcElements = srcElements || getAll(elem), 
                    destElements = destElements || getAll(clone), i = 0, l = srcElements.length; l > i; i++) cloneCopyEvent(srcElements[i], destElements[i]); else cloneCopyEvent(elem, clone);
                    return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), 
                    clone;
                },
                buildFragment: function(elems, context, scripts, selection) {
                    for (var elem, tmp, tag, wrap, contains, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; l > i; i++) if (elem = elems[i], 
                    elem || 0 === elem) if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [ elem ] : elem); else if (rhtml.test(elem)) {
                        for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), 
                        wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], 
                        j = wrap[0]; j--; ) tmp = tmp.lastChild;
                        jQuery.merge(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = "";
                    } else nodes.push(context.createTextNode(elem));
                    for (fragment.textContent = "", i = 0; elem = nodes[i++]; ) if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), 
                    tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp), 
                    scripts)) for (j = 0; elem = tmp[j++]; ) rscriptType.test(elem.type || "") && scripts.push(elem);
                    return fragment;
                },
                cleanData: function(elems) {
                    for (var data, elem, type, key, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++) {
                        if (jQuery.acceptData(elem) && (key = elem[data_priv.expando], key && (data = data_priv.cache[key]))) {
                            if (data.events) for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                            data_priv.cache[key] && delete data_priv.cache[key];
                        }
                        delete data_user.cache[elem[data_user.expando]];
                    }
                }
            }), jQuery.fn.extend({
                text: function(value) {
                    return access(this, function(value) {
                        return void 0 === value ? jQuery.text(this) : this.empty().each(function() {
                            (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = value);
                        });
                    }, null, value, arguments.length);
                },
                append: function() {
                    return this.domManip(arguments, function(elem) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var target = manipulationTarget(this, elem);
                            target.appendChild(elem);
                        }
                    });
                },
                prepend: function() {
                    return this.domManip(arguments, function(elem) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var target = manipulationTarget(this, elem);
                            target.insertBefore(elem, target.firstChild);
                        }
                    });
                },
                before: function() {
                    return this.domManip(arguments, function(elem) {
                        this.parentNode && this.parentNode.insertBefore(elem, this);
                    });
                },
                after: function() {
                    return this.domManip(arguments, function(elem) {
                        this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
                    });
                },
                remove: function(selector, keepData) {
                    for (var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0; null != (elem = elems[i]); i++) keepData || 1 !== elem.nodeType || jQuery.cleanData(getAll(elem)), 
                    elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), 
                    elem.parentNode.removeChild(elem));
                    return this;
                },
                empty: function() {
                    for (var elem, i = 0; null != (elem = this[i]); i++) 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), 
                    elem.textContent = "");
                    return this;
                },
                clone: function(dataAndEvents, deepDataAndEvents) {
                    return dataAndEvents = null == dataAndEvents ? !1 : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, 
                    this.map(function() {
                        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
                    });
                },
                html: function(value) {
                    return access(this, function(value) {
                        var elem = this[0] || {}, i = 0, l = this.length;
                        if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
                        if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                            value = value.replace(rxhtmlTag, "<$1></$2>");
                            try {
                                for (;l > i; i++) elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), 
                                elem.innerHTML = value);
                                elem = 0;
                            } catch (e) {}
                        }
                        elem && this.empty().append(value);
                    }, null, value, arguments.length);
                },
                replaceWith: function() {
                    var arg = arguments[0];
                    return this.domManip(arguments, function(elem) {
                        arg = this.parentNode, jQuery.cleanData(getAll(this)), arg && arg.replaceChild(elem, this);
                    }), arg && (arg.length || arg.nodeType) ? this : this.remove();
                },
                detach: function(selector) {
                    return this.remove(selector, !0);
                },
                domManip: function(args, callback) {
                    args = concat.apply([], args);
                    var fragment, first, scripts, hasScripts, node, doc, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
                    if (isFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return this.each(function(index) {
                        var self = set.eq(index);
                        isFunction && (args[0] = value.call(this, index, self.html())), self.domManip(args, callback);
                    });
                    if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this), 
                    first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), 
                    first)) {
                        for (scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; l > i; i++) node = fragment, 
                        i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), 
                        callback.call(this[i], node, i);
                        if (hasScripts) for (doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), 
                        i = 0; hasScripts > i; i++) node = scripts[i], rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery._evalUrl && jQuery._evalUrl(node.src) : jQuery.globalEval(node.textContent.replace(rcleanScript, "")));
                    }
                    return this;
                }
            }), jQuery.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(name, original) {
                jQuery.fn[name] = function(selector) {
                    for (var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; last >= i; i++) elems = i === last ? this : this.clone(!0), 
                    jQuery(insert[i])[original](elems), push.apply(ret, elems.get());
                    return this.pushStack(ret);
                };
            });
            var iframe, elemdisplay = {}, rmargin = /^margin/, rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"), getStyles = function(elem) {
                return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
            };
            !function() {
                function computePixelPositionAndBoxSizingReliable() {
                    div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", 
                    div.innerHTML = "", docElem.appendChild(container);
                    var divStyle = window.getComputedStyle(div, null);
                    pixelPositionVal = "1%" !== divStyle.top, boxSizingReliableVal = "4px" === divStyle.width, 
                    docElem.removeChild(container);
                }
                var pixelPositionVal, boxSizingReliableVal, docElem = document.documentElement, container = document.createElement("div"), div = document.createElement("div");
                div.style && (div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", 
                support.clearCloneStyle = "content-box" === div.style.backgroundClip, container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", 
                container.appendChild(div), window.getComputedStyle && jQuery.extend(support, {
                    pixelPosition: function() {
                        return computePixelPositionAndBoxSizingReliable(), pixelPositionVal;
                    },
                    boxSizingReliable: function() {
                        return null == boxSizingReliableVal && computePixelPositionAndBoxSizingReliable(), 
                        boxSizingReliableVal;
                    },
                    reliableMarginRight: function() {
                        var ret, marginDiv = div.appendChild(document.createElement("div"));
                        return marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", 
                        marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", 
                        docElem.appendChild(container), ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight), 
                        docElem.removeChild(container), ret;
                    }
                }));
            }(), jQuery.swap = function(elem, options, callback, args) {
                var ret, name, old = {};
                for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
                ret = callback.apply(elem, args || []);
                for (name in options) elem.style[name] = old[name];
                return ret;
            };
            var rdisplayswap = /^(none|table(?!-c[ea]).+)/, rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"), rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"), cssShow = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            }, cssNormalTransform = {
                letterSpacing: "0",
                fontWeight: "400"
            }, cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
            jQuery.extend({
                cssHooks: {
                    opacity: {
                        get: function(elem, computed) {
                            if (computed) {
                                var ret = curCSS(elem, "opacity");
                                return "" === ret ? "1" : ret;
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    flexGrow: !0,
                    flexShrink: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": "cssFloat"
                },
                style: function(elem, name, value, extra) {
                    if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                        var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
                        return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), 
                        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value ? hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name] : (type = typeof value, 
                        "string" === type && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), 
                        type = "number"), null != value && value === value && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), 
                        support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), 
                        hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (style[name] = value)), 
                        void 0);
                    }
                },
                css: function(elem, name, extra, styles) {
                    var val, num, hooks, origName = jQuery.camelCase(name);
                    return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), 
                    hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), 
                    void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), 
                    "" === extra || extra ? (num = parseFloat(val), extra === !0 || jQuery.isNumeric(num) ? num || 0 : val) : val;
                }
            }), jQuery.each([ "height", "width" ], function(i, name) {
                jQuery.cssHooks[name] = {
                    get: function(elem, computed, extra) {
                        return computed ? rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? jQuery.swap(elem, cssShow, function() {
                            return getWidthOrHeight(elem, name, extra);
                        }) : getWidthOrHeight(elem, name, extra) : void 0;
                    },
                    set: function(elem, value, extra) {
                        var styles = extra && getStyles(elem);
                        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles) : 0);
                    }
                };
            }), jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
                return computed ? jQuery.swap(elem, {
                    display: "inline-block"
                }, curCSS, [ elem, "marginRight" ]) : void 0;
            }), jQuery.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(prefix, suffix) {
                jQuery.cssHooks[prefix + suffix] = {
                    expand: function(value) {
                        for (var i = 0, expanded = {}, parts = "string" == typeof value ? value.split(" ") : [ value ]; 4 > i; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                        return expanded;
                    }
                }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
            }), jQuery.fn.extend({
                css: function(name, value) {
                    return access(this, function(elem, name, value) {
                        var styles, len, map = {}, i = 0;
                        if (jQuery.isArray(name)) {
                            for (styles = getStyles(elem), len = name.length; len > i; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                            return map;
                        }
                        return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
                    }, name, value, arguments.length > 1);
                },
                show: function() {
                    return showHide(this, !0);
                },
                hide: function() {
                    return showHide(this);
                },
                toggle: function(state) {
                    return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
                        isHidden(this) ? jQuery(this).show() : jQuery(this).hide();
                    });
                }
            }), jQuery.Tween = Tween, Tween.prototype = {
                constructor: Tween,
                init: function(elem, options, prop, end, easing, unit) {
                    this.elem = elem, this.prop = prop, this.easing = easing || "swing", this.options = options, 
                    this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
                },
                cur: function() {
                    var hooks = Tween.propHooks[this.prop];
                    return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
                },
                run: function(percent) {
                    var eased, hooks = Tween.propHooks[this.prop];
                    return this.pos = eased = this.options.duration ? jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : percent, 
                    this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                    hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
                }
            }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
                _default: {
                    get: function(tween) {
                        var result;
                        return null == tween.elem[tween.prop] || tween.elem.style && null != tween.elem.style[tween.prop] ? (result = jQuery.css(tween.elem, tween.prop, ""), 
                        result && "auto" !== result ? result : 0) : tween.elem[tween.prop];
                    },
                    set: function(tween) {
                        jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
                    }
                }
            }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
                set: function(tween) {
                    tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
                }
            }, jQuery.easing = {
                linear: function(p) {
                    return p;
                },
                swing: function(p) {
                    return .5 - Math.cos(p * Math.PI) / 2;
                }
            }, jQuery.fx = Tween.prototype.init, jQuery.fx.step = {};
            var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [ defaultPrefilter ], tweeners = {
                "*": [ function(prop, value) {
                    var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value), unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), start = (jQuery.cssNumber[prop] || "px" !== unit && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)), scale = 1, maxIterations = 20;
                    if (start && start[3] !== unit) {
                        unit = unit || start[3], parts = parts || [], start = +target || 1;
                        do scale = scale || ".5", start /= scale, jQuery.style(tween.elem, prop, start + unit); while (scale !== (scale = tween.cur() / target) && 1 !== scale && --maxIterations);
                    }
                    return parts && (start = tween.start = +start || +target || 0, tween.unit = unit, 
                    tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]), tween;
                } ]
            };
            jQuery.Animation = jQuery.extend(Animation, {
                tweener: function(props, callback) {
                    jQuery.isFunction(props) ? (callback = props, props = [ "*" ]) : props = props.split(" ");
                    for (var prop, index = 0, length = props.length; length > index; index++) prop = props[index], 
                    tweeners[prop] = tweeners[prop] || [], tweeners[prop].unshift(callback);
                },
                prefilter: function(callback, prepend) {
                    prepend ? animationPrefilters.unshift(callback) : animationPrefilters.push(callback);
                }
            }), jQuery.speed = function(speed, easing, fn) {
                var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
                    complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                    duration: speed,
                    easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
                };
                return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, 
                (null == opt.queue || opt.queue === !0) && (opt.queue = "fx"), opt.old = opt.complete, 
                opt.complete = function() {
                    jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
                }, opt;
            }, jQuery.fn.extend({
                fadeTo: function(speed, to, easing, callback) {
                    return this.filter(isHidden).css("opacity", 0).show().end().animate({
                        opacity: to
                    }, speed, easing, callback);
                },
                animate: function(prop, speed, easing, callback) {
                    var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                        var anim = Animation(this, jQuery.extend({}, prop), optall);
                        (empty || data_priv.get(this, "finish")) && anim.stop(!0);
                    };
                    return doAnimation.finish = doAnimation, empty || optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
                },
                stop: function(type, clearQueue, gotoEnd) {
                    var stopQueue = function(hooks) {
                        var stop = hooks.stop;
                        delete hooks.stop, stop(gotoEnd);
                    };
                    return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), 
                    clearQueue && type !== !1 && this.queue(type || "fx", []), this.each(function() {
                        var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = data_priv.get(this);
                        if (index) data[index] && data[index].stop && stopQueue(data[index]); else for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                        for (index = timers.length; index--; ) timers[index].elem !== this || null != type && timers[index].queue !== type || (timers[index].anim.stop(gotoEnd), 
                        dequeue = !1, timers.splice(index, 1));
                        (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
                    });
                },
                finish: function(type) {
                    return type !== !1 && (type = type || "fx"), this.each(function() {
                        var index, data = data_priv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                        for (data.finish = !0, jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0), 
                        index = timers.length; index--; ) timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), 
                        timers.splice(index, 1));
                        for (index = 0; length > index; index++) queue[index] && queue[index].finish && queue[index].finish.call(this);
                        delete data.finish;
                    });
                }
            }), jQuery.each([ "toggle", "show", "hide" ], function(i, name) {
                var cssFn = jQuery.fn[name];
                jQuery.fn[name] = function(speed, easing, callback) {
                    return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
                };
            }), jQuery.each({
                slideDown: genFx("show"),
                slideUp: genFx("hide"),
                slideToggle: genFx("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(name, props) {
                jQuery.fn[name] = function(speed, easing, callback) {
                    return this.animate(props, speed, easing, callback);
                };
            }), jQuery.timers = [], jQuery.fx.tick = function() {
                var timer, i = 0, timers = jQuery.timers;
                for (fxNow = jQuery.now(); i < timers.length; i++) timer = timers[i], timer() || timers[i] !== timer || timers.splice(i--, 1);
                timers.length || jQuery.fx.stop(), fxNow = void 0;
            }, jQuery.fx.timer = function(timer) {
                jQuery.timers.push(timer), timer() ? jQuery.fx.start() : jQuery.timers.pop();
            }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
                timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval));
            }, jQuery.fx.stop = function() {
                clearInterval(timerId), timerId = null;
            }, jQuery.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, jQuery.fn.delay = function(time, type) {
                return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", 
                this.queue(type, function(next, hooks) {
                    var timeout = setTimeout(next, time);
                    hooks.stop = function() {
                        clearTimeout(timeout);
                    };
                });
            }, function() {
                var input = document.createElement("input"), select = document.createElement("select"), opt = select.appendChild(document.createElement("option"));
                input.type = "checkbox", support.checkOn = "" !== input.value, support.optSelected = opt.selected, 
                select.disabled = !0, support.optDisabled = !opt.disabled, input = document.createElement("input"), 
                input.value = "t", input.type = "radio", support.radioValue = "t" === input.value;
            }();
            var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle;
            jQuery.fn.extend({
                attr: function(name, value) {
                    return access(this, jQuery.attr, name, value, arguments.length > 1);
                },
                removeAttr: function(name) {
                    return this.each(function() {
                        jQuery.removeAttr(this, name);
                    });
                }
            }), jQuery.extend({
                attr: function(elem, name, value) {
                    var hooks, ret, nType = elem.nodeType;
                    if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return typeof elem.getAttribute === strundefined ? jQuery.prop(elem, name, value) : (1 === nType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), 
                    hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), 
                    void 0 === value ? hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : (ret = jQuery.find.attr(elem, name), 
                    null == ret ? void 0 : ret) : null !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), 
                    value) : void jQuery.removeAttr(elem, name));
                },
                removeAttr: function(elem, value) {
                    var name, propName, i = 0, attrNames = value && value.match(rnotwhite);
                    if (attrNames && 1 === elem.nodeType) for (;name = attrNames[i++]; ) propName = jQuery.propFix[name] || name, 
                    jQuery.expr.match.bool.test(name) && (elem[propName] = !1), elem.removeAttribute(name);
                },
                attrHooks: {
                    type: {
                        set: function(elem, value) {
                            if (!support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                                var val = elem.value;
                                return elem.setAttribute("type", value), val && (elem.value = val), value;
                            }
                        }
                    }
                }
            }), boolHook = {
                set: function(elem, value, name) {
                    return value === !1 ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), 
                    name;
                }
            }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
                var getter = attrHandle[name] || jQuery.find.attr;
                attrHandle[name] = function(elem, name, isXML) {
                    var ret, handle;
                    return isXML || (handle = attrHandle[name], attrHandle[name] = ret, ret = null != getter(elem, name, isXML) ? name.toLowerCase() : null, 
                    attrHandle[name] = handle), ret;
                };
            });
            var rfocusable = /^(?:input|select|textarea|button)$/i;
            jQuery.fn.extend({
                prop: function(name, value) {
                    return access(this, jQuery.prop, name, value, arguments.length > 1);
                },
                removeProp: function(name) {
                    return this.each(function() {
                        delete this[jQuery.propFix[name] || name];
                    });
                }
            }), jQuery.extend({
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                },
                prop: function(elem, name, value) {
                    var ret, hooks, notxml, nType = elem.nodeType;
                    if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return notxml = 1 !== nType || !jQuery.isXMLDoc(elem), 
                    notxml && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), 
                    void 0 !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
                },
                propHooks: {
                    tabIndex: {
                        get: function(elem) {
                            return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ? elem.tabIndex : -1;
                        }
                    }
                }
            }), support.optSelected || (jQuery.propHooks.selected = {
                get: function(elem) {
                    var parent = elem.parentNode;
                    return parent && parent.parentNode && parent.parentNode.selectedIndex, null;
                }
            }), jQuery.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
                jQuery.propFix[this.toLowerCase()] = this;
            });
            var rclass = /[\t\r\n\f]/g;
            jQuery.fn.extend({
                addClass: function(value) {
                    var classes, elem, cur, clazz, j, finalValue, proceed = "string" == typeof value && value, i = 0, len = this.length;
                    if (jQuery.isFunction(value)) return this.each(function(j) {
                        jQuery(this).addClass(value.call(this, j, this.className));
                    });
                    if (proceed) for (classes = (value || "").match(rnotwhite) || []; len > i; i++) if (elem = this[i], 
                    cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
                        for (j = 0; clazz = classes[j++]; ) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
                        finalValue = jQuery.trim(cur), elem.className !== finalValue && (elem.className = finalValue);
                    }
                    return this;
                },
                removeClass: function(value) {
                    var classes, elem, cur, clazz, j, finalValue, proceed = 0 === arguments.length || "string" == typeof value && value, i = 0, len = this.length;
                    if (jQuery.isFunction(value)) return this.each(function(j) {
                        jQuery(this).removeClass(value.call(this, j, this.className));
                    });
                    if (proceed) for (classes = (value || "").match(rnotwhite) || []; len > i; i++) if (elem = this[i], 
                    cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
                        for (j = 0; clazz = classes[j++]; ) for (;cur.indexOf(" " + clazz + " ") >= 0; ) cur = cur.replace(" " + clazz + " ", " ");
                        finalValue = value ? jQuery.trim(cur) : "", elem.className !== finalValue && (elem.className = finalValue);
                    }
                    return this;
                },
                toggleClass: function(value, stateVal) {
                    var type = typeof value;
                    return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : this.each(jQuery.isFunction(value) ? function(i) {
                        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                    } : function() {
                        if ("string" === type) for (var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || []; className = classNames[i++]; ) self.hasClass(className) ? self.removeClass(className) : self.addClass(className); else (type === strundefined || "boolean" === type) && (this.className && data_priv.set(this, "__className__", this.className), 
                        this.className = this.className || value === !1 ? "" : data_priv.get(this, "__className__") || "");
                    });
                },
                hasClass: function(selector) {
                    for (var className = " " + selector + " ", i = 0, l = this.length; l > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
                    return !1;
                }
            });
            var rreturn = /\r/g;
            jQuery.fn.extend({
                val: function(value) {
                    var hooks, ret, isFunction, elem = this[0];
                    {
                        if (arguments.length) return isFunction = jQuery.isFunction(value), this.each(function(i) {
                            var val;
                            1 === this.nodeType && (val = isFunction ? value.call(this, i, jQuery(this).val()) : value, 
                            null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                                return null == value ? "" : value + "";
                            })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], 
                            hooks && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val));
                        });
                        if (elem) return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], 
                        hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : (ret = elem.value, 
                        "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
                    }
                }
            }), jQuery.extend({
                valHooks: {
                    option: {
                        get: function(elem) {
                            var val = jQuery.find.attr(elem, "value");
                            return null != val ? val : jQuery.trim(jQuery.text(elem));
                        }
                    },
                    select: {
                        get: function(elem) {
                            for (var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || 0 > index, values = one ? null : [], max = one ? index + 1 : options.length, i = 0 > index ? max : one ? index : 0; max > i; i++) if (option = options[i], 
                            !(!option.selected && i !== index || (support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup"))) {
                                if (value = jQuery(option).val(), one) return value;
                                values.push(value);
                            }
                            return values;
                        },
                        set: function(elem, value) {
                            for (var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--; ) option = options[i], 
                            (option.selected = jQuery.inArray(option.value, values) >= 0) && (optionSet = !0);
                            return optionSet || (elem.selectedIndex = -1), values;
                        }
                    }
                }
            }), jQuery.each([ "radio", "checkbox" ], function() {
                jQuery.valHooks[this] = {
                    set: function(elem, value) {
                        return jQuery.isArray(value) ? elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0 : void 0;
                    }
                }, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
                    return null === elem.getAttribute("value") ? "on" : elem.value;
                });
            }), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
                jQuery.fn[name] = function(data, fn) {
                    return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
                };
            }), jQuery.fn.extend({
                hover: function(fnOver, fnOut) {
                    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
                },
                bind: function(types, data, fn) {
                    return this.on(types, null, data, fn);
                },
                unbind: function(types, fn) {
                    return this.off(types, null, fn);
                },
                delegate: function(selector, types, data, fn) {
                    return this.on(types, selector, data, fn);
                },
                undelegate: function(selector, types, fn) {
                    return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
                }
            });
            var nonce = jQuery.now(), rquery = /\?/;
            jQuery.parseJSON = function(data) {
                return JSON.parse(data + "");
            }, jQuery.parseXML = function(data) {
                var xml, tmp;
                if (!data || "string" != typeof data) return null;
                try {
                    tmp = new DOMParser(), xml = tmp.parseFromString(data, "text/xml");
                } catch (e) {
                    xml = void 0;
                }
                return (!xml || xml.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + data), 
                xml;
            };
            var ajaxLocParts, ajaxLocation, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, prefilters = {}, transports = {}, allTypes = "*/".concat("*");
            try {
                ajaxLocation = location.href;
            } catch (e) {
                ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href;
            }
            ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: ajaxLocation,
                    type: "GET",
                    isLocal: rlocalProtocol.test(ajaxLocParts[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": allTypes,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": jQuery.parseJSON,
                        "text xml": jQuery.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(target, settings) {
                    return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
                },
                ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
                ajaxTransport: addToPrefiltersOrTransports(transports),
                ajax: function(url, options) {
                    function done(status, nativeStatusText, responses, headers) {
                        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                        2 !== state && (state = 2, timeoutTimer && clearTimeout(timeoutTimer), transport = void 0, 
                        responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0, isSuccess = status >= 200 && 300 > status || 304 === status, 
                        responses && (response = ajaxHandleResponses(s, jqXHR, responses)), response = ajaxConvert(s, response, jqXHR, isSuccess), 
                        isSuccess ? (s.ifModified && (modified = jqXHR.getResponseHeader("Last-Modified"), 
                        modified && (jQuery.lastModified[cacheURL] = modified), modified = jqXHR.getResponseHeader("etag"), 
                        modified && (jQuery.etag[cacheURL] = modified)), 204 === status || "HEAD" === s.type ? statusText = "nocontent" : 304 === status ? statusText = "notmodified" : (statusText = response.state, 
                        success = response.data, error = response.error, isSuccess = !error)) : (error = statusText, 
                        (status || !statusText) && (statusText = "error", 0 > status && (status = 0))), 
                        jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", 
                        isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]), 
                        jqXHR.statusCode(statusCode), statusCode = void 0, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [ jqXHR, s, isSuccess ? success : error ]), 
                        completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]), 
                        --jQuery.active || jQuery.event.trigger("ajaxStop")));
                    }
                    "object" == typeof url && (options = url, url = void 0), options = options || {};
                    var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, parts, fireGlobals, i, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = "canceled", jqXHR = {
                        readyState: 0,
                        getResponseHeader: function(key) {
                            var match;
                            if (2 === state) {
                                if (!responseHeaders) for (responseHeaders = {}; match = rheaders.exec(responseHeadersString); ) responseHeaders[match[1].toLowerCase()] = match[2];
                                match = responseHeaders[key.toLowerCase()];
                            }
                            return null == match ? null : match;
                        },
                        getAllResponseHeaders: function() {
                            return 2 === state ? responseHeadersString : null;
                        },
                        setRequestHeader: function(name, value) {
                            var lname = name.toLowerCase();
                            return state || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, 
                            requestHeaders[name] = value), this;
                        },
                        overrideMimeType: function(type) {
                            return state || (s.mimeType = type), this;
                        },
                        statusCode: function(map) {
                            var code;
                            if (map) if (2 > state) for (code in map) statusCode[code] = [ statusCode[code], map[code] ]; else jqXHR.always(map[jqXHR.status]);
                            return this;
                        },
                        abort: function(statusText) {
                            var finalText = statusText || strAbort;
                            return transport && transport.abort(finalText), done(0, finalText), this;
                        }
                    };
                    if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, 
                    jqXHR.error = jqXHR.fail, s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), 
                    s.type = options.method || options.type || s.method || s.type, s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [ "" ], 
                    null == s.crossDomain && (parts = rurl.exec(s.url.toLowerCase()), s.crossDomain = !(!parts || parts[1] === ajaxLocParts[1] && parts[2] === ajaxLocParts[2] && (parts[3] || ("http:" === parts[1] ? "80" : "443")) === (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? "80" : "443")))), 
                    s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), 
                    inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state) return jqXHR;
                    fireGlobals = s.global, fireGlobals && 0 === jQuery.active++ && jQuery.event.trigger("ajaxStart"), 
                    s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), cacheURL = s.url, 
                    s.hasContent || (s.data && (cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data, 
                    delete s.data), s.cache === !1 && (s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++)), 
                    s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), 
                    jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), 
                    (s.data && s.hasContent && s.contentType !== !1 || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), 
                    jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
                    for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
                    if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === !1 || 2 === state)) return jqXHR.abort();
                    strAbort = "abort";
                    for (i in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) jqXHR[i](s[i]);
                    if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
                        jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]), 
                        s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
                            jqXHR.abort("timeout");
                        }, s.timeout));
                        try {
                            state = 1, transport.send(requestHeaders, done);
                        } catch (e) {
                            if (!(2 > state)) throw e;
                            done(-1, e);
                        }
                    } else done(-1, "No Transport");
                    return jqXHR;
                },
                getJSON: function(url, data, callback) {
                    return jQuery.get(url, data, callback, "json");
                },
                getScript: function(url, callback) {
                    return jQuery.get(url, void 0, callback, "script");
                }
            }), jQuery.each([ "get", "post" ], function(i, method) {
                jQuery[method] = function(url, data, callback, type) {
                    return jQuery.isFunction(data) && (type = type || callback, callback = data, data = void 0), 
                    jQuery.ajax({
                        url: url,
                        type: method,
                        dataType: type,
                        data: data,
                        success: callback
                    });
                };
            }), jQuery.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(i, type) {
                jQuery.fn[type] = function(fn) {
                    return this.on(type, fn);
                };
            }), jQuery._evalUrl = function(url) {
                return jQuery.ajax({
                    url: url,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                });
            }, jQuery.fn.extend({
                wrapAll: function(html) {
                    var wrap;
                    return jQuery.isFunction(html) ? this.each(function(i) {
                        jQuery(this).wrapAll(html.call(this, i));
                    }) : (this[0] && (wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && wrap.insertBefore(this[0]), 
                    wrap.map(function() {
                        for (var elem = this; elem.firstElementChild; ) elem = elem.firstElementChild;
                        return elem;
                    }).append(this)), this);
                },
                wrapInner: function(html) {
                    return this.each(jQuery.isFunction(html) ? function(i) {
                        jQuery(this).wrapInner(html.call(this, i));
                    } : function() {
                        var self = jQuery(this), contents = self.contents();
                        contents.length ? contents.wrapAll(html) : self.append(html);
                    });
                },
                wrap: function(html) {
                    var isFunction = jQuery.isFunction(html);
                    return this.each(function(i) {
                        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
                    });
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
                    }).end();
                }
            }), jQuery.expr.filters.hidden = function(elem) {
                return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
            }, jQuery.expr.filters.visible = function(elem) {
                return !jQuery.expr.filters.hidden(elem);
            };
            var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
            jQuery.param = function(a, traditional) {
                var prefix, s = [], add = function(key, value) {
                    value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                };
                if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), 
                jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
                    add(this.name, this.value);
                }); else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
                return s.join("&").replace(r20, "+");
            }, jQuery.fn.extend({
                serialize: function() {
                    return jQuery.param(this.serializeArray());
                },
                serializeArray: function() {
                    return this.map(function() {
                        var elements = jQuery.prop(this, "elements");
                        return elements ? jQuery.makeArray(elements) : this;
                    }).filter(function() {
                        var type = this.type;
                        return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
                    }).map(function(i, elem) {
                        var val = jQuery(this).val();
                        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                            return {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            };
                        }) : {
                            name: elem.name,
                            value: val.replace(rCRLF, "\r\n")
                        };
                    }).get();
                }
            }), jQuery.ajaxSettings.xhr = function() {
                try {
                    return new XMLHttpRequest();
                } catch (e) {}
            };
            var xhrId = 0, xhrCallbacks = {}, xhrSuccessStatus = {
                0: 200,
                1223: 204
            }, xhrSupported = jQuery.ajaxSettings.xhr();
            window.ActiveXObject && jQuery(window).on("unload", function() {
                for (var key in xhrCallbacks) xhrCallbacks[key]();
            }), support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, 
            jQuery.ajaxTransport(function(options) {
                var callback;
                return support.cors || xhrSupported && !options.crossDomain ? {
                    send: function(headers, complete) {
                        var i, xhr = options.xhr(), id = ++xhrId;
                        if (xhr.open(options.type, options.url, options.async, options.username, options.password), 
                        options.xhrFields) for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
                        options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), 
                        options.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
                        for (i in headers) xhr.setRequestHeader(i, headers[i]);
                        callback = function(type) {
                            return function() {
                                callback && (delete xhrCallbacks[id], callback = xhr.onload = xhr.onerror = null, 
                                "abort" === type ? xhr.abort() : "error" === type ? complete(xhr.status, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, "string" == typeof xhr.responseText ? {
                                    text: xhr.responseText
                                } : void 0, xhr.getAllResponseHeaders()));
                            };
                        }, xhr.onload = callback(), xhr.onerror = callback("error"), callback = xhrCallbacks[id] = callback("abort");
                        try {
                            xhr.send(options.hasContent && options.data || null);
                        } catch (e) {
                            if (callback) throw e;
                        }
                    },
                    abort: function() {
                        callback && callback();
                    }
                } : void 0;
            }), jQuery.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(text) {
                        return jQuery.globalEval(text), text;
                    }
                }
            }), jQuery.ajaxPrefilter("script", function(s) {
                void 0 === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET");
            }), jQuery.ajaxTransport("script", function(s) {
                if (s.crossDomain) {
                    var script, callback;
                    return {
                        send: function(_, complete) {
                            script = jQuery("<script>").prop({
                                async: !0,
                                charset: s.scriptCharset,
                                src: s.url
                            }).on("load error", callback = function(evt) {
                                script.remove(), callback = null, evt && complete("error" === evt.type ? 404 : 200, evt.type);
                            }), document.head.appendChild(script[0]);
                        },
                        abort: function() {
                            callback && callback();
                        }
                    };
                }
            });
            var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
            jQuery.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
                    return this[callback] = !0, callback;
                }
            }), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
                var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== !1 && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
                return jsonProp || "jsonp" === s.dataTypes[0] ? (callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, 
                jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== !1 && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), 
                s.converters["script json"] = function() {
                    return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
                }, s.dataTypes[0] = "json", overwritten = window[callbackName], window[callbackName] = function() {
                    responseContainer = arguments;
                }, jqXHR.always(function() {
                    window[callbackName] = overwritten, s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, 
                    oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), 
                    responseContainer = overwritten = void 0;
                }), "script") : void 0;
            }), jQuery.parseHTML = function(data, context, keepScripts) {
                if (!data || "string" != typeof data) return null;
                "boolean" == typeof context && (keepScripts = context, context = !1), context = context || document;
                var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
                return parsed ? [ context.createElement(parsed[1]) ] : (parsed = jQuery.buildFragment([ data ], context, scripts), 
                scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
            };
            var _load = jQuery.fn.load;
            jQuery.fn.load = function(url, params, callback) {
                if ("string" != typeof url && _load) return _load.apply(this, arguments);
                var selector, type, response, self = this, off = url.indexOf(" ");
                return off >= 0 && (selector = jQuery.trim(url.slice(off)), url = url.slice(0, off)), 
                jQuery.isFunction(params) ? (callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), 
                self.length > 0 && jQuery.ajax({
                    url: url,
                    type: type,
                    dataType: "html",
                    data: params
                }).done(function(responseText) {
                    response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
                }).complete(callback && function(jqXHR, status) {
                    self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
                }), this;
            }, jQuery.expr.filters.animated = function(elem) {
                return jQuery.grep(jQuery.timers, function(fn) {
                    return elem === fn.elem;
                }).length;
            };
            var docElem = window.document.documentElement;
            jQuery.offset = {
                setOffset: function(elem, options, i) {
                    var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
                    "static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), 
                    curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1, 
                    calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, 
                    curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), 
                    jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), 
                    null != options.left && (props.left = options.left - curOffset.left + curLeft), 
                    "using" in options ? options.using.call(elem, props) : curElem.css(props);
                }
            }, jQuery.fn.extend({
                offset: function(options) {
                    if (arguments.length) return void 0 === options ? this : this.each(function(i) {
                        jQuery.offset.setOffset(this, options, i);
                    });
                    var docElem, win, elem = this[0], box = {
                        top: 0,
                        left: 0
                    }, doc = elem && elem.ownerDocument;
                    if (doc) return docElem = doc.documentElement, jQuery.contains(docElem, elem) ? (typeof elem.getBoundingClientRect !== strundefined && (box = elem.getBoundingClientRect()), 
                    win = getWindow(doc), {
                        top: box.top + win.pageYOffset - docElem.clientTop,
                        left: box.left + win.pageXOffset - docElem.clientLeft
                    }) : box;
                },
                position: function() {
                    if (this[0]) {
                        var offsetParent, offset, elem = this[0], parentOffset = {
                            top: 0,
                            left: 0
                        };
                        return "fixed" === jQuery.css(elem, "position") ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), 
                        offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), 
                        parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), 
                        {
                            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                        };
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var offsetParent = this.offsetParent || docElem; offsetParent && !jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"); ) offsetParent = offsetParent.offsetParent;
                        return offsetParent || docElem;
                    });
                }
            }), jQuery.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(method, prop) {
                var top = "pageYOffset" === prop;
                jQuery.fn[method] = function(val) {
                    return access(this, function(elem, method, val) {
                        var win = getWindow(elem);
                        return void 0 === val ? win ? win[prop] : elem[method] : void (win ? win.scrollTo(top ? window.pageXOffset : val, top ? val : window.pageYOffset) : elem[method] = val);
                    }, method, val, arguments.length, null);
                };
            }), jQuery.each([ "top", "left" ], function(i, prop) {
                jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
                    return computed ? (computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed) : void 0;
                });
            }), jQuery.each({
                Height: "height",
                Width: "width"
            }, function(name, type) {
                jQuery.each({
                    padding: "inner" + name,
                    content: type,
                    "": "outer" + name
                }, function(defaultExtra, funcName) {
                    jQuery.fn[funcName] = function(margin, value) {
                        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
                        return access(this, function(elem, type, value) {
                            var doc;
                            return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, 
                            Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                        }, type, chainable ? margin : void 0, chainable, null);
                    };
                });
            }), jQuery.fn.size = function() {
                return this.length;
            }, jQuery.fn.andSelf = jQuery.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
                return jQuery;
            });
            var _jQuery = window.jQuery, _$ = window.$;
            return jQuery.noConflict = function(deep) {
                return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), 
                jQuery;
            }, typeof noGlobal === strundefined && (window.jQuery = window.$ = jQuery), jQuery;
        });
    }, {} ],
    underscore: [ function(require, module, exports) {
        (function() {
            var root = this, previousUnderscore = root._, breaker = {}, ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype, push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty, nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, _ = function(obj) {
                return obj instanceof _ ? obj : this instanceof _ ? void (this._wrapped = obj) : new _(obj);
            };
            "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), 
            exports._ = _) : root._ = _, _.VERSION = "1.6.0";
            var each = _.each = _.forEach = function(obj, iterator, context) {
                if (null == obj) return obj;
                if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context); else if (obj.length === +obj.length) {
                    for (var i = 0, length = obj.length; length > i; i++) if (iterator.call(context, obj[i], i, obj) === breaker) return;
                } else for (var keys = _.keys(obj), i = 0, length = keys.length; length > i; i++) if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
                return obj;
            };
            _.map = _.collect = function(obj, iterator, context) {
                var results = [];
                return null == obj ? results : nativeMap && obj.map === nativeMap ? obj.map(iterator, context) : (each(obj, function(value, index, list) {
                    results.push(iterator.call(context, value, index, list));
                }), results);
            };
            var reduceError = "Reduce of empty array with no initial value";
            _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduce && obj.reduce === nativeReduce) return context && (iterator = _.bind(iterator, context)), 
                initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                if (each(obj, function(value, index, list) {
                    initial ? memo = iterator.call(context, memo, value, index, list) : (memo = value, 
                    initial = !0);
                }), !initial) throw new TypeError(reduceError);
                return memo;
            }, _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (null == obj && (obj = []), nativeReduceRight && obj.reduceRight === nativeReduceRight) return context && (iterator = _.bind(iterator, context)), 
                initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                var length = obj.length;
                if (length !== +length) {
                    var keys = _.keys(obj);
                    length = keys.length;
                }
                if (each(obj, function(value, index, list) {
                    index = keys ? keys[--length] : --length, initial ? memo = iterator.call(context, memo, obj[index], index, list) : (memo = obj[index], 
                    initial = !0);
                }), !initial) throw new TypeError(reduceError);
                return memo;
            }, _.find = _.detect = function(obj, predicate, context) {
                var result;
                return any(obj, function(value, index, list) {
                    return predicate.call(context, value, index, list) ? (result = value, !0) : void 0;
                }), result;
            }, _.filter = _.select = function(obj, predicate, context) {
                var results = [];
                return null == obj ? results : nativeFilter && obj.filter === nativeFilter ? obj.filter(predicate, context) : (each(obj, function(value, index, list) {
                    predicate.call(context, value, index, list) && results.push(value);
                }), results);
            }, _.reject = function(obj, predicate, context) {
                return _.filter(obj, function(value, index, list) {
                    return !predicate.call(context, value, index, list);
                }, context);
            }, _.every = _.all = function(obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !0;
                return null == obj ? result : nativeEvery && obj.every === nativeEvery ? obj.every(predicate, context) : (each(obj, function(value, index, list) {
                    return (result = result && predicate.call(context, value, index, list)) ? void 0 : breaker;
                }), !!result);
            };
            var any = _.some = _.any = function(obj, predicate, context) {
                predicate || (predicate = _.identity);
                var result = !1;
                return null == obj ? result : nativeSome && obj.some === nativeSome ? obj.some(predicate, context) : (each(obj, function(value, index, list) {
                    return result || (result = predicate.call(context, value, index, list)) ? breaker : void 0;
                }), !!result);
            };
            _.contains = _.include = function(obj, target) {
                return null == obj ? !1 : nativeIndexOf && obj.indexOf === nativeIndexOf ? -1 != obj.indexOf(target) : any(obj, function(value) {
                    return value === target;
                });
            }, _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2), isFunc = _.isFunction(method);
                return _.map(obj, function(value) {
                    return (isFunc ? method : value[method]).apply(value, args);
                });
            }, _.pluck = function(obj, key) {
                return _.map(obj, _.property(key));
            }, _.where = function(obj, attrs) {
                return _.filter(obj, _.matches(attrs));
            }, _.findWhere = function(obj, attrs) {
                return _.find(obj, _.matches(attrs));
            }, _.max = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.max.apply(Math, obj);
                var result = -1/0, lastComputed = -1/0;
                return each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed > lastComputed && (result = value, lastComputed = computed);
                }), result;
            }, _.min = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.min.apply(Math, obj);
                var result = 1/0, lastComputed = 1/0;
                return each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    lastComputed > computed && (result = value, lastComputed = computed);
                }), result;
            }, _.shuffle = function(obj) {
                var rand, index = 0, shuffled = [];
                return each(obj, function(value) {
                    rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value;
                }), shuffled;
            }, _.sample = function(obj, n, guard) {
                return null == n || guard ? (obj.length !== +obj.length && (obj = _.values(obj)), 
                obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n));
            };
            var lookupIterator = function(value) {
                return null == value ? _.identity : _.isFunction(value) ? value : _.property(value);
            };
            _.sortBy = function(obj, iterator, context) {
                return iterator = lookupIterator(iterator), _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iterator.call(context, value, index, list)
                    };
                }).sort(function(left, right) {
                    var a = left.criteria, b = right.criteria;
                    if (a !== b) {
                        if (a > b || void 0 === a) return 1;
                        if (b > a || void 0 === b) return -1;
                    }
                    return left.index - right.index;
                }), "value");
            };
            var group = function(behavior) {
                return function(obj, iterator, context) {
                    var result = {};
                    return iterator = lookupIterator(iterator), each(obj, function(value, index) {
                        var key = iterator.call(context, value, index, obj);
                        behavior(result, key, value);
                    }), result;
                };
            };
            _.groupBy = group(function(result, key, value) {
                _.has(result, key) ? result[key].push(value) : result[key] = [ value ];
            }), _.indexBy = group(function(result, key, value) {
                result[key] = value;
            }), _.countBy = group(function(result, key) {
                _.has(result, key) ? result[key]++ : result[key] = 1;
            }), _.sortedIndex = function(array, obj, iterator, context) {
                iterator = lookupIterator(iterator);
                for (var value = iterator.call(context, obj), low = 0, high = array.length; high > low; ) {
                    var mid = low + high >>> 1;
                    iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
                }
                return low;
            }, _.toArray = function(obj) {
                return obj ? _.isArray(obj) ? slice.call(obj) : obj.length === +obj.length ? _.map(obj, _.identity) : _.values(obj) : [];
            }, _.size = function(obj) {
                return null == obj ? 0 : obj.length === +obj.length ? obj.length : _.keys(obj).length;
            }, _.first = _.head = _.take = function(array, n, guard) {
                return null == array ? void 0 : null == n || guard ? array[0] : 0 > n ? [] : slice.call(array, 0, n);
            }, _.initial = function(array, n, guard) {
                return slice.call(array, 0, array.length - (null == n || guard ? 1 : n));
            }, _.last = function(array, n, guard) {
                return null == array ? void 0 : null == n || guard ? array[array.length - 1] : slice.call(array, Math.max(array.length - n, 0));
            }, _.rest = _.tail = _.drop = function(array, n, guard) {
                return slice.call(array, null == n || guard ? 1 : n);
            }, _.compact = function(array) {
                return _.filter(array, _.identity);
            };
            var flatten = function(input, shallow, output) {
                return shallow && _.every(input, _.isArray) ? concat.apply(output, input) : (each(input, function(value) {
                    _.isArray(value) || _.isArguments(value) ? shallow ? push.apply(output, value) : flatten(value, shallow, output) : output.push(value);
                }), output);
            };
            _.flatten = function(array, shallow) {
                return flatten(array, shallow, []);
            }, _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1));
            }, _.partition = function(array, predicate) {
                var pass = [], fail = [];
                return each(array, function(elem) {
                    (predicate(elem) ? pass : fail).push(elem);
                }), [ pass, fail ];
            }, _.uniq = _.unique = function(array, isSorted, iterator, context) {
                _.isFunction(isSorted) && (context = iterator, iterator = isSorted, isSorted = !1);
                var initial = iterator ? _.map(array, iterator, context) : array, results = [], seen = [];
                return each(initial, function(value, index) {
                    (isSorted ? index && seen[seen.length - 1] === value : _.contains(seen, value)) || (seen.push(value), 
                    results.push(array[index]));
                }), results;
            }, _.union = function() {
                return _.uniq(_.flatten(arguments, !0));
            }, _.intersection = function(array) {
                var rest = slice.call(arguments, 1);
                return _.filter(_.uniq(array), function(item) {
                    return _.every(rest, function(other) {
                        return _.contains(other, item);
                    });
                });
            }, _.difference = function(array) {
                var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
                return _.filter(array, function(value) {
                    return !_.contains(rest, value);
                });
            }, _.zip = function() {
                for (var length = _.max(_.pluck(arguments, "length").concat(0)), results = new Array(length), i = 0; length > i; i++) results[i] = _.pluck(arguments, "" + i);
                return results;
            }, _.object = function(list, values) {
                if (null == list) return {};
                for (var result = {}, i = 0, length = list.length; length > i; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
                return result;
            }, _.indexOf = function(array, item, isSorted) {
                if (null == array) return -1;
                var i = 0, length = array.length;
                if (isSorted) {
                    if ("number" != typeof isSorted) return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
                    i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted;
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
                for (;length > i; i++) if (array[i] === item) return i;
                return -1;
            }, _.lastIndexOf = function(array, item, from) {
                if (null == array) return -1;
                var hasIndex = null != from;
                if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
                for (var i = hasIndex ? from : array.length; i--; ) if (array[i] === item) return i;
                return -1;
            }, _.range = function(start, stop, step) {
                arguments.length <= 1 && (stop = start || 0, start = 0), step = arguments[2] || 1;
                for (var length = Math.max(Math.ceil((stop - start) / step), 0), idx = 0, range = new Array(length); length > idx; ) range[idx++] = start, 
                start += step;
                return range;
            };
            var ctor = function() {};
            _.bind = function(func, context) {
                var args, bound;
                if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError();
                return args = slice.call(arguments, 2), bound = function() {
                    if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                    ctor.prototype = func.prototype;
                    var self = new ctor();
                    ctor.prototype = null;
                    var result = func.apply(self, args.concat(slice.call(arguments)));
                    return Object(result) === result ? result : self;
                };
            }, _.partial = function(func) {
                var boundArgs = slice.call(arguments, 1);
                return function() {
                    for (var position = 0, args = boundArgs.slice(), i = 0, length = args.length; length > i; i++) args[i] === _ && (args[i] = arguments[position++]);
                    for (;position < arguments.length; ) args.push(arguments[position++]);
                    return func.apply(this, args);
                };
            }, _.bindAll = function(obj) {
                var funcs = slice.call(arguments, 1);
                if (0 === funcs.length) throw new Error("bindAll must be passed function names");
                return each(funcs, function(f) {
                    obj[f] = _.bind(obj[f], obj);
                }), obj;
            }, _.memoize = function(func, hasher) {
                var memo = {};
                return hasher || (hasher = _.identity), function() {
                    var key = hasher.apply(this, arguments);
                    return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
                };
            }, _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function() {
                    return func.apply(null, args);
                }, wait);
            }, _.defer = function(func) {
                return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
            }, _.throttle = function(func, wait, options) {
                var context, args, result, timeout = null, previous = 0;
                options || (options = {});
                var later = function() {
                    previous = options.leading === !1 ? 0 : _.now(), timeout = null, result = func.apply(context, args), 
                    context = args = null;
                };
                return function() {
                    var now = _.now();
                    previous || options.leading !== !1 || (previous = now);
                    var remaining = wait - (now - previous);
                    return context = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), 
                    timeout = null, previous = now, result = func.apply(context, args), context = args = null) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), 
                    result;
                };
            }, _.debounce = function(func, wait, immediate) {
                var timeout, args, context, timestamp, result, later = function() {
                    var last = _.now() - timestamp;
                    wait > last ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), 
                    context = args = null));
                };
                return function() {
                    context = this, args = arguments, timestamp = _.now();
                    var callNow = immediate && !timeout;
                    return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), 
                    context = args = null), result;
                };
            }, _.once = function(func) {
                var memo, ran = !1;
                return function() {
                    return ran ? memo : (ran = !0, memo = func.apply(this, arguments), func = null, 
                    memo);
                };
            }, _.wrap = function(func, wrapper) {
                return _.partial(wrapper, func);
            }, _.compose = function() {
                var funcs = arguments;
                return function() {
                    for (var args = arguments, i = funcs.length - 1; i >= 0; i--) args = [ funcs[i].apply(this, args) ];
                    return args[0];
                };
            }, _.after = function(times, func) {
                return function() {
                    return --times < 1 ? func.apply(this, arguments) : void 0;
                };
            }, _.keys = function(obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) _.has(obj, key) && keys.push(key);
                return keys;
            }, _.values = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, values = new Array(length), i = 0; length > i; i++) values[i] = obj[keys[i]];
                return values;
            }, _.pairs = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, pairs = new Array(length), i = 0; length > i; i++) pairs[i] = [ keys[i], obj[keys[i]] ];
                return pairs;
            }, _.invert = function(obj) {
                for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; length > i; i++) result[obj[keys[i]]] = keys[i];
                return result;
            }, _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) _.isFunction(obj[key]) && names.push(key);
                return names.sort();
            }, _.extend = function(obj) {
                return each(slice.call(arguments, 1), function(source) {
                    if (source) for (var prop in source) obj[prop] = source[prop];
                }), obj;
            }, _.pick = function(obj) {
                var copy = {}, keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                return each(keys, function(key) {
                    key in obj && (copy[key] = obj[key]);
                }), copy;
            }, _.omit = function(obj) {
                var copy = {}, keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                for (var key in obj) _.contains(keys, key) || (copy[key] = obj[key]);
                return copy;
            }, _.defaults = function(obj) {
                return each(slice.call(arguments, 1), function(source) {
                    if (source) for (var prop in source) void 0 === obj[prop] && (obj[prop] = source[prop]);
                }), obj;
            }, _.clone = function(obj) {
                return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj;
            }, _.tap = function(obj, interceptor) {
                return interceptor(obj), obj;
            };
            var eq = function(a, b, aStack, bStack) {
                if (a === b) return 0 !== a || 1 / a == 1 / b;
                if (null == a || null == b) return a === b;
                a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
                var className = toString.call(a);
                if (className != toString.call(b)) return !1;
                switch (className) {
                  case "[object String]":
                    return a == String(b);

                  case "[object Number]":
                    return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;

                  case "[object Date]":
                  case "[object Boolean]":
                    return +a == +b;

                  case "[object RegExp]":
                    return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
                }
                if ("object" != typeof a || "object" != typeof b) return !1;
                for (var length = aStack.length; length--; ) if (aStack[length] == a) return bStack[length] == b;
                var aCtor = a.constructor, bCtor = b.constructor;
                if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return !1;
                aStack.push(a), bStack.push(b);
                var size = 0, result = !0;
                if ("[object Array]" == className) {
                    if (size = a.length, result = size == b.length) for (;size-- && (result = eq(a[size], b[size], aStack, bStack)); ) ;
                } else {
                    for (var key in a) if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
                    if (result) {
                        for (key in b) if (_.has(b, key) && !size--) break;
                        result = !size;
                    }
                }
                return aStack.pop(), bStack.pop(), result;
            };
            _.isEqual = function(a, b) {
                return eq(a, b, [], []);
            }, _.isEmpty = function(obj) {
                if (null == obj) return !0;
                if (_.isArray(obj) || _.isString(obj)) return 0 === obj.length;
                for (var key in obj) if (_.has(obj, key)) return !1;
                return !0;
            }, _.isElement = function(obj) {
                return !(!obj || 1 !== obj.nodeType);
            }, _.isArray = nativeIsArray || function(obj) {
                return "[object Array]" == toString.call(obj);
            }, _.isObject = function(obj) {
                return obj === Object(obj);
            }, each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
                _["is" + name] = function(obj) {
                    return toString.call(obj) == "[object " + name + "]";
                };
            }), _.isArguments(arguments) || (_.isArguments = function(obj) {
                return !(!obj || !_.has(obj, "callee"));
            }), "function" != typeof /./ && (_.isFunction = function(obj) {
                return "function" == typeof obj;
            }), _.isFinite = function(obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj));
            }, _.isNaN = function(obj) {
                return _.isNumber(obj) && obj != +obj;
            }, _.isBoolean = function(obj) {
                return obj === !0 || obj === !1 || "[object Boolean]" == toString.call(obj);
            }, _.isNull = function(obj) {
                return null === obj;
            }, _.isUndefined = function(obj) {
                return void 0 === obj;
            }, _.has = function(obj, key) {
                return hasOwnProperty.call(obj, key);
            }, _.noConflict = function() {
                return root._ = previousUnderscore, this;
            }, _.identity = function(value) {
                return value;
            }, _.constant = function(value) {
                return function() {
                    return value;
                };
            }, _.property = function(key) {
                return function(obj) {
                    return obj[key];
                };
            }, _.matches = function(attrs) {
                return function(obj) {
                    if (obj === attrs) return !0;
                    for (var key in attrs) if (attrs[key] !== obj[key]) return !1;
                    return !0;
                };
            }, _.times = function(n, iterator, context) {
                for (var accum = Array(Math.max(0, n)), i = 0; n > i; i++) accum[i] = iterator.call(context, i);
                return accum;
            }, _.random = function(min, max) {
                return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1));
            }, _.now = Date.now || function() {
                return new Date().getTime();
            };
            var entityMap = {
                escape: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                }
            };
            entityMap.unescape = _.invert(entityMap.escape);
            var entityRegexes = {
                escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
            };
            _.each([ "escape", "unescape" ], function(method) {
                _[method] = function(string) {
                    return null == string ? "" : ("" + string).replace(entityRegexes[method], function(match) {
                        return entityMap[method][match];
                    });
                };
            }), _.result = function(object, property) {
                if (null == object) return void 0;
                var value = object[property];
                return _.isFunction(value) ? value.call(object) : value;
            }, _.mixin = function(obj) {
                each(_.functions(obj), function(name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function() {
                        var args = [ this._wrapped ];
                        return push.apply(args, arguments), result.call(this, func.apply(_, args));
                    };
                });
            };
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id;
            }, _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/, escapes = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "	": "t",
                "\u2028": "u2028",
                "\u2029": "u2029"
            }, escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            _.template = function(text, data, settings) {
                var render;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = new RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g"), index = 0, source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    return source += text.slice(index, offset).replace(escaper, function(match) {
                        return "\\" + escapes[match];
                    }), escape && (source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"), 
                    interpolate && (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"), 
                    evaluate && (source += "';\n" + evaluate + "\n__p+='"), index = offset + match.length, 
                    match;
                }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), 
                source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    render = new Function(settings.variable || "obj", "_", source);
                } catch (e) {
                    throw e.source = source, e;
                }
                if (data) return render(data, _);
                var template = function(data) {
                    return render.call(this, data, _);
                };
                return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", 
                template;
            }, _.chain = function(obj) {
                return _(obj).chain();
            };
            var result = function(obj) {
                return this._chain ? _(obj).chain() : obj;
            };
            _.mixin(_), each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    var obj = this._wrapped;
                    return method.apply(obj, arguments), "shift" != name && "splice" != name || 0 !== obj.length || delete obj[0], 
                    result.call(this, obj);
                };
            }), each([ "concat", "join", "slice" ], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    return result.call(this, method.apply(this._wrapped, arguments));
                };
            }), _.extend(_.prototype, {
                chain: function() {
                    return this._chain = !0, this;
                },
                value: function() {
                    return this._wrapped;
                }
            }), "function" == typeof define && define.amd && define("underscore", [], function() {
                return _;
            });
        }).call(this);
    }, {} ]
}, {}, []);
//# sourceMappingURL=folio-vendor.js.map