# Batik
## Super Simple CoffeeScript Templating

Batik is an inline templating engine for CoffeeScript, inspired by CoffeeKup, that lets you write your template directly as a CoffeeScript function


## Why Using Batik?
Batik lets you write your template directly in CoffeeScript an it will compile to javascript like your other *.coffee* files do. No on-runtime parsing are needed, no eval, so it's probably blazing fast.

## Installing

Just grab [node.js](http://nodejs.org/#download) and [npm](http://github.com/isaacs/npm) and you're set:

    npm install batik

## Using

Using batik is simple

    batik = require 'batik'
	
	myTemplate = batik (title, desc) ->
		@h1 title
		@p desc
	
	# using node.js's util.puts
	puts myTemplate("Batik", "Batik is traditional textile dyeing technique originated from Java")

output:

	<h1>Batik</h1>
	<p>Batik is traditional textile dyeing technique originated from Java</p>


You can write nested elements just like in CoffeeKup:

	hcard = batik ({name, surname, tel, email, address, website}) ->
		@div "hcard-#{name.split(' ').join('-')}-#{surname}", class:'vcard', ->
			fn = ->
				@span class:'given-name', name
				@span class:'family-name', surname

			if website
				@a class:'url fn n', href:website, fn
			else
				@span class:'fn n', fn

			@a class:'email', href:"mailto:#{email}", email
			if address
				{street, city} = address
				@div class:'adr', ->
					@span(class:'street-address', street) if street
					@span(class:'locality', city) if city
			if tel
				@div class:'tel', tel
	
	# using node.js's util.puts
	puts hcard
		name: 'Ahmad Rizqi'
		surname: 'Meydiarso'
		tel: '+49 99 9999 9999'
		email: 'rizqi@namaku.de'
		address: {city: 'Hamburg'}
		website: 'http://rizqi.namaku.de'
output:

	<div class="vcard" id="hcard-Ahmad-Rizqi-Meydiarso">
		<a class="url fn n" href="http://rizqi.namaku.de">
			<span class="given-name">Ahmad Rizqi</span>
			<span class="family-name">Meydiarso</span>
		</a>
		<a class="email" href="mailto:rizqi@namaku.de">rizqi@namaku.de</a>
		<div class="adr">
			<span class="locality">Hamburg</span>
		</div>
		<div class="tel">+49 99 9999 9999</div>
	</div>

You can also use it with MVC framework like Backbone.js or any other and make use of it's render proxy

	view =
		items: [
			{city:'Jakarta', country:'Indonesia'}
			{city:'Hamburg', country:'Germany'}
		]
		renderItem: batik ({city, country}) ->
			@li class:'item', ->
				@h2 city
				@p country

		render: batik ->
			@h1 "Cities and Its Countries"
			@ul ->
				for item in @self.items
					@render 'item', item # this calls renderItem

	puts view.render()

output:

	<h1>Cities and Its Countries</h1>
	<ul>
		<li class="item">
			<h2>Jakarta</h2>
			<p>Indonesia</p>
		</li>
		<li class="item">
			<h2>Hamburg</h2>
			<p>Germany</p>
		</li>
	</ul>
