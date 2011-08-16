# (c) Ahmad Rizqi Meydiarso <rizqi@namaku.de> MIT Licensed

batik = (fn) ->
	render = (name, args...) ->
		renderer = batik.getRenderer(@self, name)
		if renderer
			@que.push renderer.apply @self, args
	
	return (args...) ->
		batik.render.apply {self:this, render:render}, [fn].concat(args)

batik.version = '0.1.2alpha'

# Taken from CoffeeKup (c) <maurice@bitbending.com>
batik.tags = 'a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont
|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup
|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption
|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr
|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta
|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre
|progress|q|rp|rt|ruby|s|samp|section|select|small|source|span|strike
|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title
|tr|tt|u|ul|video|xmp'.replace(/\n/g, '').split '|'

# Taken from CoffeeKup
cshelpers = """
  var __slice = Array.prototype.slice;
  var __hasProp = Object.prototype.hasOwnProperty;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  var __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype;
    return child; };
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    } return -1; };
""".replace /\n/g, ''

# Taken from CoffeeKup
batik.self_closing = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr',
  'img', 'input', 'link', 'meta', 'param']

batik.nodes = {}

# Inspired by CoffeeKup
batik.resolveArgs = (args...) ->
	for a in args
      switch typeof a
        when 'function'
          contents = a
        when 'object'
          attrs = a
        when 'number', 'boolean'
          contents = a
        when 'string'
          if args.length is 1
            contents = a
          else
            if a is args[0]
              idclass = a
            else
              contents = a
	
	if idclass?
		attrs or= {}
		attrs.id = idclass
	return contents:contents, attrs:attrs
	

batik.renderTag = (tagname, attributes, contents) ->
	self_closing = batik.self_closing.indexOf(tagname) > -1
	@que.push "<#{tagname}"
	if attributes
		@que.push ' '
		@que.push ("#{key}=\"#{value.toString().replace('"','\\"')}\"" for key, value of attributes).join(' ')
	if self_closing
		@que.push '/>'
	else
		@que.push '>'
		if typeof contents is 'function'
			contents.call this
		else if contents?
			@que.push contents.toString()
		@que.push "</#{tagname}>"

for tag in batik.tags
	do (tag) -> 
		batik.nodes[tag] = (args...) ->
			{contents, attrs} = batik.resolveArgs(args...)
			batik.renderTag.call this, tag, attrs, contents

batik.nodes.script = (args...) ->
	{contents, attrs} = batik.resolveArgs(args...)
	
	attrs or= {}
	if !attrs.type and !attrs.language
		attrs.type = 'text/javascript'
	
	{type, language} = attrs
	
	if (type is 'text/javascript' or language is 'javascript') and typeof contents is 'function'
		batik.renderTag.call this, 'script', attrs, ->
			@que.push "(function(){#{cshelpers}"
			@que.push "(#{contents.toString()}).call(this);"
			@que.push "}).call(this);"
	else
		batik.renderTag.call this, 'script', attrs, contents
		

class batik.Scope
	constructor: ->
		@que = []

batik.Scope.prototype = batik.nodes

batik.render = (fn, args...) ->
	scope = new batik.Scope
	for key of this
		scope[key] = this[key]
	fn.apply scope, args
	return scope.que.join('')

batik.getRenderer = (scope, name) ->
	name = name.charAt(0).toUpperCase() + name.slice(1)
	if typeof scope["render#{name}"] is 'function'
		return scope["render#{name}"]

@batik = batik
module.exports = batik
