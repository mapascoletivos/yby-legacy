# Mapas Coletivos

Mapas Coletivos is collaborative mapped narratives platform built on top of [YBY](http://github.com/oeco/yby) and [YBY Client](http://github.com/oeco/yby-client).

## Installation

 - Run a [YBY server](http://github.com/oeco/yby);
 - Clone and install a [YBY client](http://github.com/oeco/yby-client) following it's installation process;
 - Clone this repository inside a directory called `themes`, on your yby client root;
 - Add this properties to your config.js 
```
   	theme: 'mapascoletivos',
	pages: [
		{
			path: '/tutorial/',
			template: '/views/pages/tutorial.html',
			title: 'Tutorial'
		},
		{
			path: '/terms-of-use/',
			template: '/views/pages/terms-of-use.html',
			title: 'Termos de uso'
		},
		{
			path: '/about/',
			template: '/views/pages/about.html',
			title: 'Sobre'
		}
	]
```
 - Run `grunt` again and start the server.
