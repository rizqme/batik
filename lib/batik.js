(function() {
  var batik, cshelpers, tag, _fn, _i, _len, _ref;
  var __slice = Array.prototype.slice;
  batik = function(fn) {
    return function(data) {
      return batik.render(fn, data);
    };
  };
  batik.version = '0.1';
  batik.tags = 'a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont\
|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup\
|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption\
|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr\
|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta\
|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre\
|progress|q|rp|rt|ruby|s|samp|section|select|small|source|span|strike\
|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title\
|tr|tt|u|ul|video|xmp'.replace(/\n/g, '').split('|');
  cshelpers = "var __slice = Array.prototype.slice;\nvar __hasProp = Object.prototype.hasOwnProperty;\nvar __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\nvar __extends = function(child, parent) {\n  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype;\n  return child; };\nvar __indexOf = Array.prototype.indexOf || function(item) {\n  for (var i = 0, l = this.length; i < l; i++) {\n    if (this[i] === item) return i;\n  } return -1; };".replace(/\n/g, '');
  batik.self_closing = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'link', 'meta', 'param'];
  batik.nodes = {};
  batik.resolveArgs = function() {
    var a, args, attrs, contents, idclass, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      switch (typeof a) {
        case 'function':
          contents = a;
          break;
        case 'object':
          attrs = a;
          break;
        case 'number':
        case 'boolean':
          contents = a;
          break;
        case 'string':
          if (args.length === 1) {
            contents = a;
          } else {
            if (a === args[0]) {
              idclass = a;
            } else {
              contents = a;
            }
          }
      }
    }
    if (idclass != null) {
      attrs || (attrs = {});
      attrs.id = idclass;
    }
    return {
      contents: contents,
      attrs: attrs
    };
  };
  batik.renderTag = function(tagname, attributes, contents) {
    var key, self_closing, value;
    self_closing = batik.self_closing.indexOf(tagname) > -1;
    this.que.push("<" + tagname);
    if (attributes) {
      this.que.push(' ');
      this.que.push(((function() {
        var _results;
        _results = [];
        for (key in attributes) {
          value = attributes[key];
          _results.push("" + key + "=\"" + (value.toString().replace('"', '\\"')) + "\"");
        }
        return _results;
      })()).join(' '));
    }
    if (self_closing) {
      return this.que.push('/>');
    } else {
      this.que.push('>');
      if (typeof contents === 'function') {
        contents.call(this);
      } else if (contents != null) {
        this.que.push(contents.toString());
      }
      return this.que.push("</" + tagname + ">");
    }
  };
  _ref = batik.tags;
  _fn = function(tag) {
    return batik.nodes[tag] = function() {
      var args, attrs, contents, _ref2;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref2 = batik.resolveArgs.apply(batik, args), contents = _ref2.contents, attrs = _ref2.attrs;
      return batik.renderTag.call(this, tag, attrs, contents);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tag = _ref[_i];
    _fn(tag);
  }
  batik.nodes.script = function() {
    var args, attrs, contents, language, type, _ref2;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref2 = batik.resolveArgs.apply(batik, args), contents = _ref2.contents, attrs = _ref2.attrs;
    attrs || (attrs = {});
    if (!attrs.type && !attrs.language) {
      attrs.type = 'text/javascript';
    }
    type = attrs.type, language = attrs.language;
    if ((type === 'text/javascript' || language === 'javascript') && typeof contents === 'function') {
      return batik.renderTag.call(this, 'script', attrs, function() {
        this.que.push("(function(){" + cshelpers);
        this.que.push("(" + (contents.toString()) + ").call(this);");
        return this.que.push("}).call(this);");
      });
    } else {
      return batik.renderTag.call(this, 'script', attrs, contents);
    }
  };
  batik.Scope = (function() {
    function Scope() {
      this.que = [];
    }
    return Scope;
  })();
  batik.Scope.prototype = batik.nodes;
  batik.render = function(fn, data) {
    var scope;
    scope = new batik.Scope;
    fn.call(scope, data);
    return scope.que.join('');
  };
  module.exports = batik;
}).call(this);
