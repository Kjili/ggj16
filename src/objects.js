Objects = function() {
	
	var playerGrp, sheepGrp, parrotGrp, goatGrp, wormGrp, staticGrp, deadheadGrp, doorsGrp;	// sprite groupes
	
	var playerstate;
	var locked;
	var carriedObject = null;
	var lockThrow = false;
	
	
	var ritualSounds = [
		'ritual_tier_brennt',
		'ritual_kanelbullar',
		'ritual_mörkret',
		'ritual_öppna_fönstret',
		'ritual_ostfralla',
		'ritual_fika'
	];
	
	this.resetPlayerTint = function() {
		player.tint = "0xFFFFFF";
		playerImmune = false;
	}
	
	var ritualSound, splashSnd, crushsnd;
	
	this.preload = function() {
		// object spritesheets
		game.load.spritesheet('wizard', 'assets/spritesheets/wizard.png', 42, 72, 24);
		game.load.spritesheet('sheep', 'assets/spritesheets/sheep.png', 36, 36, 15);
		game.load.spritesheet('goat', 'assets/spritesheets/goat.png', 36, 36, 15);
		game.load.spritesheet('worm', 'assets/spritesheets/worm.png', 36, 36, 8);
		game.load.spritesheet('deadhead', 'assets/spritesheets/enemy.png', 36, 36, 4);
		game.load.spritesheet('parrot', 'assets/spritesheets/parrot.png', 36, 36, 15);
		// statics
		game.load.spritesheet('key', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('pearl', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('torch', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('bucket', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('book', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('abyss', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('spikes', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('runestone', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('questionmark', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('exclamationmark', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		game.load.spritesheet('chest', 'assets/tilesets/objecttiles.png', 36, 36, 20);
		// rituals
		game.load.audio('ritual_tier_brennt', 'assets/audio/ritual_tier_brennt.ogg');
		game.load.audio('ritual_kanelbullar', 'assets/audio/kanelbullar.ogg');
		game.load.audio('ritual_mörkret', 'assets/audio/moerkret.ogg');
		game.load.audio('ritual_öppna_fönstret', 'assets/audio/oeppna_foenstret.ogg');
		game.load.audio('ritual_ostfralla', 'assets/audio/ostfralla.ogg');
		game.load.audio('ritual_fika', 'assets/audio/fika.ogg');
		// animal sounds
		game.load.audio('meh', 'assets/audio/meh.ogg');
		game.load.audio('worm', 'assets/audio/worm.ogg');
		game.load.audio('skull', 'assets/audio/skull.ogg');
		game.load.audio('goat', 'assets/audio/goat.ogg');
		game.load.audio('parrot', 'assets/audio/parrot.ogg');
		game.load.audio('splash', 'assets/audio/splash.ogg');
		game.load.audio('crack', 'assets/audio/crack.ogg');
		game.load.audio('pain', 'assets/audio/pain.ogg');
		// door
		game.load.spritesheet('door', 'assets/tilesets/objecttiles.png', 36, 36, 40);
		game.load.spritesheet('opendoor', 'assets/tilesets/opendoor.png', 36, 36, 40);
	};
	
	this.create = function() {
		playerImmune = false;
		// sounds
		splashSnd = game.add.audio('splash');
		crushsnd = game.add.audio('crack');
		
		playerstate = 'passive';
		
		// enable user input
		cursors = game.input.keyboard.createCursorKeys();
		
		// static item group
		staticGrp = game.add.group();
		map.createFromObjects('objects', 101, 'key', 0, true, false, staticGrp);
		map.createFromObjects('objects', 104, 'pearl', 3, true, false, staticGrp);
		map.createFromObjects('objects', 105, 'torch', 4, true, false, staticGrp);
		map.createFromObjects('objects', 106, 'bucket', 5, true, false, staticGrp);
		map.createFromObjects('objects', 108, 'book', 7, true, false, staticGrp);
		map.createFromObjects('objects', 109, 'abyss', 8, true, false, staticGrp);
		map.createFromObjects('objects', 110, 'spikes', 9, true, false, staticGrp);
		map.createFromObjects('objects', 111, 'runestone', 10, true, false, staticGrp);
		map.createFromObjects('objects', 112, 'questionmark', 11, true, false, staticGrp);
		map.createFromObjects('objects', 113, 'exclamationmark', 12, true, false, staticGrp);
		map.createFromObjects('objects', 120, 'chest', 19, true, false, staticGrp);
		

		/*dmgGrp = game.add.group();
		map.createFromObjects('objects', 110, 'spikes', 9, true, false, dmgGrp);
		dmgGrp.forEach(function(spike) {
			game.physics.p2.enable(spike);
			spike.body.fixedRotation = true;
			spike.body.setCollisionGroup(dmgObjCG);
			spike.body.collides(playerCG, playerHitsDmgObj, this);
			
		}, this);*/
		

		//doors
		doorsGrp = game.add.group();
		map.createFromObjects('objects', 118, 'door', 17, true, false, doorsGrp);
		map.createFromObjects('objects', 119, 'opendoor', 0, true, false, doorsGrp);

		
		// player group
		playerGrp = game.add.group();
		map.createFromObjects('objects', 102, 'wizard', 1, true, false, playerGrp);
		player = playerGrp.getTop();
		var playerAnimFPS = 10;
		player.animations.add('player_idle', [ 0 ], playerAnimFPS, true);
		player.animations.add('player_down', [ 0, 1, 0, 2 ], playerAnimFPS, true);
		player.animations.add('player_up', [ 3, 4, 3, 5 ], playerAnimFPS, true);
		player.animations.add('player_right', [ 6, 7, 6, 8 ], playerAnimFPS, true);
		player.animations.add('player_left', [ 9, 10, 9, 11 ], playerAnimFPS, true);
		player.animations.add('player_carrying_idle', [ 12 ], playerAnimFPS, true);
		player.animations.add('player_carrying_down', [ 12, 13, 12, 14 ], playerAnimFPS, true);
		player.animations.add('player_carrying_up', [ 15, 16, 15, 17 ], playerAnimFPS, true);
		player.animations.add('player_carrying_right', [ 18, 19, 18, 20 ], playerAnimFPS, true);
		player.animations.add('player_carrying_left', [ 21, 22, 21, 23 ], playerAnimFPS, true);
		// player.body.debug = true;
		
		// set health
		player.health = 5;
		player.snd = game.add.audio('pain');
		
		// enable physics for player
		game.physics.p2.enable(player);
		player.body.setRectangle(38, 36, 2, 18);
		player.body.fixedRotation = true;
		player.body.setCollisionGroup(playerCG);
		player.body.collides(tileCG);
		player.body.collides(npcCG);
		//player.body.collides(dmgObjCG);
		
		// add worms
		wormGrp = game.add.group();
		map.createFromObjects('objects', 114, 'worm', 1, true, false, wormGrp);
		wormGrp.forEach(function(worm) {
			var wormAnimFPS = 10;
			worm.animations.add('down', [ 4, 5 ], wormAnimFPS, true);
			worm.animations.add('up', [ 6, 7 ], wormAnimFPS, true);
			worm.animations.add('right', [ 0, 1 ], wormAnimFPS, true);
			worm.animations.add('left', [ 2, 3 ], wormAnimFPS, true);
			worm.animations.add('panic', [ 0 ], wormAnimFPS, true);
			// set health
			worm.health = 2;
			worm.snd = game.add.audio('worm');
			// enable physics for sheep
			game.physics.p2.enable(worm);
			worm.body.fixedRotation = true;
			worm.body.setCollisionGroup(npcCG);
			worm.body.collides(playerCG, npcBumpedPlayer, this);
			worm.body.collides(tileCG, npcBumpedWall, this);
			worm.body.collides(bulletsCG, collideWithBullet, this);
		}, this);
		
		// add sheeps
		sheepGrp = game.add.group();
		map.createFromObjects('objects', 103, 'sheep', 1, true, false, sheepGrp);
		sheepGrp.forEach(function(sheep) {
			var sheepAnimFPS = 10;
			sheep.animations.add('idle', [ 0 ], sheepAnimFPS, true);
			sheep.animations.add('down', [ 9, 10, 11 ], sheepAnimFPS, true);
			sheep.animations.add('up', [ 6, 7, 8 ], sheepAnimFPS, true);
			sheep.animations.add('right', [ 0, 1, 2 ], sheepAnimFPS, true);
			sheep.animations.add('left', [ 3, 4, 5 ], sheepAnimFPS, true);
			sheep.animations.add('panic', [ 12, 13, 14 ], sheepAnimFPS, true);
			// set health
			sheep.health = 3;
			sheep.snd = game.add.audio('meh');
			// enable physics for sheep
			game.physics.p2.enable(sheep);
			sheep.body.fixedRotation = true;
			sheep.body.setCollisionGroup(npcCG);
			sheep.body.collides(playerCG, npcBumpedPlayer, this);
			sheep.body.collides(tileCG, npcBumpedWall, this);
			sheep.body.collides(bulletsCG, collideWithBullet, this);
		}, this);

		// add goats
		goatGrp = game.add.group();
		map.createFromObjects('objects', 107, 'goat', 1, true, false, goatGrp);
		goatGrp.forEach(function(goat) {
			var goatAnimFPS = 10;
			goat.animations.add('idle', [ 0 ], goatAnimFPS, true);
			goat.animations.add('down', [ 9, 10, 11 ], goatAnimFPS, true);
			goat.animations.add('up', [ 6, 7, 8 ], goatAnimFPS, true);
			goat.animations.add('right', [ 0, 1, 2 ], goatAnimFPS, true);
			goat.animations.add('left', [ 3, 4, 5 ], goatAnimFPS, true);
			goat.animations.add('panic', [ 12, 13, 14 ], goatAnimFPS, true);
			// set health
			goat.health = 3;
			goat.snd = game.add.audio('goat');
			// enable physics for goat
			game.physics.p2.enable(goat);
			goat.body.fixedRotation = true;
			goat.body.setCollisionGroup(npcCG);
			goat.body.collides(playerCG, npcBumpedPlayer, this);
			goat.body.collides(tileCG, npcBumpedWall, this);
			goat.body.collides(bulletsCG, collideWithBullet, this);
		}, this);
		
		// add parrot
		parrotGrp = game.add.group();
		map.createFromObjects('objects', 117, 'parrot', 0, true, false, parrotGrp);
		parrotGrp.forEach(function(parrot) {
			var parrotAnimFPS = 10;
			parrot.animations.add('idle', [ 0 ], parrotAnimFPS, true);
			parrot.animations.add('down', [ 10, 11, 12 ], parrotAnimFPS, true);
			parrot.animations.add('up', [ 8, 9 ], parrotAnimFPS, true);
			parrot.animations.add('right', [ 0, 1, 2, 3 ], parrotAnimFPS, true);
			parrot.animations.add('left', [ 4, 5, 6, 7 ], parrotAnimFPS, true);
			parrot.animations.add('panic', [ 13, 14 ], parrotAnimFPS, true);
			// set health
			parrot.health = 2;
			parrot.snd = game.add.audio('parrot');
			// enable physics for parrot
			game.physics.p2.enable(parrot);
			parrot.body.fixedRotation = true;
			parrot.body.setCollisionGroup(npcCG);
			parrot.body.collides(playerCG, npcBumpedPlayer, this);
			parrot.body.collides(tileCG, npcBumpedWall, this);
			parrot.body.collides(bulletsCG, collideWithBullet, this);
		}, this);
		
		// add deadhead
		deadheadGrp = game.add.group();
		map.createFromObjects('objects', 115, 'deadhead', 0, true, false, deadheadGrp);
		deadheadGrp.forEach(function(deadhead) {
			var deadheadAnimFPS = 10;
			deadhead.animations.add('idle', [ 0 ], deadheadAnimFPS, true);
			deadhead.animations.add('down', [ 0 ], deadheadAnimFPS, true);
			deadhead.animations.add('up', [ 3 ], deadheadAnimFPS, true);
			deadhead.animations.add('right', [ 1 ], deadheadAnimFPS, true);
			deadhead.animations.add('left', [ 2 ], deadheadAnimFPS, true);
			// set health
			deadhead.health = 3;
			deadhead.snd = game.add.audio('skull');
			// enable physics for deadhead
			game.physics.p2.enable(deadhead);
			deadhead.body.fixedRotation = true;
			deadhead.body.setCollisionGroup(npcCG);
			deadhead.body.collides(playerCG, caughtPlayer, this);
			deadhead.body.collides(tileCG, npcBumpedWall, this);
			deadhead.body.collides(bulletsCG, hitByBullet, this);
		}, this);
	};
	
	this.update = function() {
		// if player dies
		if (!player.alive) {
			effects.particleEffectBloodExplosion(player.body.x, player.body.y, 20, 2000);
			playerImmune = false;
			carrierObject = null;
			player.animations.play('player_idle');
			game.state.restart();
		}
		
		var speed = 300;
		if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			player.body.velocity.x = -speed;
			if (carriedObject != null) {
				player.animations.play('player_carrying_left');
			} else {
				player.animations.play('player_left');
			}
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			player.body.velocity.x = speed;
			if (carriedObject != null) {
				player.animations.play('player_carrying_right');
			} else {
				player.animations.play('player_right');
			}
		} else {
			player.body.velocity.x = 0;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			player.body.velocity.y = -speed;
			if (carriedObject != null) {
				player.animations.play('player_carrying_up');
			} else {
				player.animations.play('player_up');
			}
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			player.body.velocity.y = speed;
			if (carriedObject != null) {
				player.animations.play('player_carrying_down');
			} else {
				player.animations.play('player_down');
			}
		} else {
			player.body.velocity.y = 0;
		}

		if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
			if (carriedObject != null) {
				player.animations.play('player_carrying_idle', 3, true);
			} else {
				player.animations.play('player_idle', 3, true);
			}
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.N)) {
			if (levelNum + 1 < levelNames.length) {
				levelNum += 1;
			}
			carrierObject = null;
			player.animations.play('player_idle');
			game.state.restart();
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.P)) {
			if (levelNum > 0) {
				levelNum -= 1;
			}
			carrierObject = null;
			player.animations.play('player_idle');
			game.state.restart();
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.R) && !locked) {
			locked = true;
			var tmpInd = Math.floor(Math.random()*ritualSounds.length);
			//console.log(tmpInd);
			ritualSound = game.add.audio(ritualSounds[tmpInd]);
			ritualSound.play();
			effects.particleEffectBloodExplosion(player.body.x, player.body.y, 30, 2000);
		}
		
		if (!game.input.keyboard.isDown(Phaser.Keyboard.R)) {
			locked = false;
		}
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
			playerstate = 'angeredNPC';
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
			effects.fire(player.x, player.y);
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.B)) {
			effects.doSomeEffects();
		}

		if (carriedObject != null && game.input.keyboard.isDown(Phaser.Keyboard.Y)) {
			if (carriedObject.ritualized)
			{
				var npcSprite = carriedObject.sprite;
				
				if (carriedObject.emitter)
				{
					carriedObject.emitter.on = false;
					carriedObject.emitter = null;
				}
				if (carriedObject.body != null) {
					 sacrificeAnimal(npcSprite);
				 }
				 carriedObject = null;
			} else
			{
				carriedObject = null;
			}
			
		}
		
		sheepGrp.forEach(function(obj) { resolveAImovement(obj, 'sheep') }, this);
		goatGrp.forEach(function(obj) { resolveAImovement(obj, 'goat') }, this);
		wormGrp.forEach(function(obj) { resolveAImovement(obj, 'worm') }, this);
		deadheadGrp.forEach(function(obj) { resolveAImovement(obj, 'deadhead') }, this);
		parrotGrp.forEach(function(obj) { resolveAImovement(obj, 'parrot') }, this);
		staticGrp.forEach(function(obj) { resolveStatics(obj) }, this);
		doorsGrp.forEach(function(obj) { if (obj.name == 'openDoor' && Phaser.Rectangle.intersects(player, obj) || carriedObject != null && Phaser.Rectangle.intersects(player, obj) && carriedObject.name == 'key') { if (levelNum + 1 < levelNames.length) {
				levelNum += 1;
			}
			carrierObject = null;
			player.animations.play('player_idle');
			game.state.restart(); }}, this);
	};
	
	function sacrificeAnimal(npcSprite)
	{
		var tmpX = npcSprite.x;
		var tmpY = npcSprite.y;

		if (npcSprite.group) {
			npcSprite.group.remove(npcSprite);
		} else if (npcSprite.parent) {
			npcSprite.parent.removeChild(npcSprite);
		}
		console.log("animal destroyed " + tmpX + ", " + tmpY);
		effects.particleEffectBloodExplosion(tmpX, tmpY, 50, 3000);
		lockThrow = false;
	}
	
	this.getPlayer = function() {
		return player;
	};
	
	function resolveStatics(static) {
		if (carriedObject === static) {
			static.x = player.body.x - 17;
			static.y = player.body.y - 40;
			return;
		}
		if (Phaser.Rectangle.intersects(player, static))
		{
			var key;
			if ("sprite" in static) {
				key = keystatic.sprite.key;
			} else {
				key = static.key;
			}
			if (key == 'spikes')
			{
				if (!playerImmune) 
				{
					objects.playerHitsDmgObj();
					playerImmune = true;
				
				}
			}
			else{
				if ( game.input.keyboard.isDown(Phaser.Keyboard.F)) {
					carriedObject = static;
				}
			}
		}
	}
	
	function resolveAImovement(npc, type) {
		
		if (carriedObject === npc.body) {
			if (type == 'deadhead') {
				player.damage(1);
				player.tint = 0xDD0000;
				game.time.events.add(Phaser.Timer.SECOND * .4, this.resetPlayerTint, this);
				playerBody.sprite.snd.play();
				return;
			}
			else if (type == 'parrot' || type == 'sheep' || type == 'goat' || type == 'worm') {
				npc.animations.play('panic');
			}
			npc.body.x = player.body.x + 0.01;
			npc.body.y = player.body.y - 15;
			return;
		}

		// random walk
		if (playerstate == 'passive' && type != 'deadhead') {
			// npc.body.force.x = ((game.rnd.integer() % 20) - 10) * 10;
			// npc.body.force.y = ((game.rnd.integer() % 20) - 10) * 10;
			var newVelo = new Phaser.Point(((game.rnd.integer() % 300) - 150),
					((game.rnd.integer() % 300) - 150));
			npc.body.force.x = newVelo.x;
			npc.body.force.y = newVelo.y;
		}
		// seek
		if (playerstate == 'angeredNPC' || type == 'deadhead') {
			var maxSpeed = 100;
			var target = new Phaser.Point(player.body.x, player.body.y);
			var seeker = new Phaser.Point(npc.body.x, npc.body.y);
			var distNPCPlayer = Phaser.Point.normalize(Phaser.Point.subtract(
					target, Phaser.Point.add(seeker, new Phaser.Point(
							npc.body.velocity.x, npc.body.velocity.y))));
			npc.body.force.x = distNPCPlayer.x * maxSpeed;
			npc.body.force.y = distNPCPlayer.y * maxSpeed;
		}
		
		// animation
		if (type == 'sheep' || type == 'worm' || type == 'goat' || type == 'deadhead' || type == 'parrot') {
			if (Math.abs(npc.body.velocity.y) > Math.abs(npc.body.velocity.x)) {
				if (npc.body.velocity.y > 0) {
					npc.animations.play('down');
				} else if (npc.body.velocity.y < 0) {
					npc.animations.play('up');
				} else {
					npc.animations.play('idle');
				}
			}
			if (Math.abs(npc.body.velocity.y) < Math.abs(npc.body.velocity.x)) {
				if (npc.body.velocity.x > 0) {
					npc.animations.play('right');
				} else if (npc.body.velocity.x < 0) {
					npc.animations.play('left');
				} else {
					npc.animations.play('idle');
				}
			}
		}
	};

	function npcBumpedWall(npcBody, wallBody) {
		npcBody.velocity.x = -npcBody.velocity.x;
		npcBody.velocity.y = -npcBody.velocity.y;
	};

	function npcBumpedPlayer(npcBody, playerBody) {
		if (playerstate == 'angeredNPC') {
			player.damage(1);
			player.tint = 0xDD0000;
			game.time.events.add(Phaser.Timer.SECOND * .4, this.resetPlayerTint, this);
			playerBody.sprite.snd.play();
		}
		playerstate = 'passive';
		if (carriedObject == null
				&& game.input.keyboard.isDown(Phaser.Keyboard.F)) {
			carriedObject = npcBody;
		}
	};
	
	function caughtPlayer(npcBody, playerBody) {
		player.damage(1);
		player.tint = 0xDD0000;
		game.time.events.add(Phaser.Timer.SECOND * .4, this.resetPlayerTint, this);
		playerBody.sprite.snd.play();
	};
	
	this.playerHitsDmgObj = function() {
		player.damage(1);
		player.tint = 0xDD0000;
		game.time.events.add(Phaser.Timer.SECOND * .4, this.resetPlayerTint, this);
		player.snd.play();
	};
	
	function hitByBullet(npcBody, bulletBody) {
		if (!bulletBody.sprite.alive) {
			return;
		}
		bulletBody.sprite.kill();
		effects.particleEffectBloodExplosion(npcBody.x, npcBody.y, 20, 500);
		npcSprite = npcBody.sprite;
		npcBody.sprite.damage(1);
		if (!npcSprite.alive) {
			crushsnd.play();
			if (npcSprite.group) {
				npcSprite.group.remove(npcSprite);
			} else if (npcSprite.parent) {
				npcSprite.parent.removeChild(npcSprite);
			}
		} else {
			npcSprite.snd.play();
		}
	}

	function collideWithBullet(npcBody, bulletBody) {
		if (!bulletBody.sprite.alive) {
			return;
		}
		bulletBody.sprite.kill();
		playerstate = 'angeredNPC';
		effects.particleEffectBloodExplosion(npcBody.x, npcBody.y, 20, 500);
		npcSprite = npcBody.sprite;
		npcBody.sprite.damage(1);
		if (!npcSprite.alive) {
			splashSnd.play();
			if (npcSprite.group) {
				npcSprite.group.remove(npcSprite);
			} else if (npcSprite.parent) {
				npcSprite.parent.removeChild(npcSprite);
			}
		} else {
			npcSprite.snd.play();
		}
	}
	
	function opendoors(door) {
		var xPos = door.x;
		var yPos = door.y;
		
		door.kill();
		if (door.group) {
			door.group.remove(door);
		} else if (door.parent) {
			door.parent.removeChild(door);
		}
		var od = game.add.sprite(xPos, yPos, 'opendoor');
		od.name = 'openDoor';
		doorsGrp.add(od);
		od.moveDown();		// alter z depth so the door is behind the player
		//od.height -= 10;
	}

	this.getCarriedObject = function (){
		if (carriedObject) {
			/*if ("sprite" in carriedObject) {
				console.log(carriedObject.sprite.key);
			} else {
				console.log(carriedObject.key);
			}*/
		}
		return carriedObject;
	};
	
	this.getCarriedSprite = function (){
		if (carriedObject) {
			if ("sprite" in carriedObject) {
				return carriedObject.sprite;
			} else {
				return carriedObject;
			}
		}
	};
	
	this.playRitualSoundRnd = function () {
		var tmpInd = Math.floor(Math.random()*ritualSounds.length);
		//console.log(tmpInd);
		ritualSound = game.add.audio(ritualSounds[tmpInd]);
		ritualSound.play();
	};
	
	this.opendoor = function () {
		doorsGrp.forEach(function(obj) { opendoors(obj); }, this);
	};
	
	this.changeToSth = function (tmpObj) {
		var xPos = tmpObj.x;
		var yPos = tmpObj.y;
		
		tmpObj.kill();
		if (tmpObj.group) {
			tmpObj.group.remove(tmpObj);
		} else if (tmpObj.parent) {
			tmpObj.parent.removeChild(tmpObj);
		}
		var od = game.add.sprite(xPos, yPos, 'key');
		staticGrp.add(od);
		od.moveDown();		// alter z depth so the door is behind the player
		carriedObject = od;
		od.name = 'key';
	};
	
	
	this.setPlayerState = function(nStat) {playerstate=nStat;};
};
