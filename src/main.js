import kaboom from "kaboom"

kaboom()

loadSprite("bird", "sprites/bird.png")
loadSprite("bg", "sprites/bg.png")
loadSprite("pipe", "sprites/pipe.png")

let highScore = 0;

scene("game", () => {
	const PIPE_GAP = 140;
	let score = 0;
	setGravity(1600);

	add([
		sprite("bg", { width: width(), height: height()})
	])

	const scoreText = add([
		text(score, pos(120,120))
	])

	const player = add([
		sprite("bird"),
		scale(1.2),
		pos(100, 50),
		area(),
		body()
	])

	onKeyPress("space", () => {
		console.log("jump")
		player.jump(400);
	});

	function createPipes() {
		const offset = rand(-50, 50);
		add([
			sprite("pipe"),
			pos(width(), height() / 2 + offset + PIPE_GAP / 2),
			"pipe",
			scale(2),
			area(),
			{ passed: false },
		]);

		add([
			sprite("pipe", { flipY: true }),
			pos(width(), height() / 2 + offset - PIPE_GAP / 2),
			"pipe",
			anchor("botleft"),
			scale(2),
			area(),
		]);
	}

	onUpdate("pipe", (pipe) => {
		pipe.move(-300, 0);

		if (pipe.passed === false && pipe.pos.x < player.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreText.text = score;
		}
	});

	player.onCollide("pipe", () => {
		const ss = screenshot();
		go("gameover", score, ss);
	});

	player.onUpdate(() => {
		if (player.pos.y > height()) {
			const ss = screenshot();
			go("gameover", score, ss);
		}
	});
	
	loop(1.5, () => createPipes());
})

scene("gameover", (score, screenshot) => {
	if (score > highScore) {
		highScore = score;
		localStorage.setItem("highScore", highScore);
	}
	loadSprite("gameOverScreen", screenshot);
	add([sprite("gameOverScreen", { width: width(), height: height() })]);

	add([
		text("gameover!\n" + "score: " + score + "\nhigh score: " + highScore, { size: 45 }),
		pos(width() / 2, height() / 3),
	]);

	onKeyPress("space", () => {
		go("game");
	});
})

scene("startmenu", () => {
	highScore = localStorage.getItem("highScore");
	add([
		sprite("bg", { width: width(), height: height()})
	])

	add([
		text("High score: " + highScore, { size: 45 }),
		pos(200, height() / 2 - 150),
	]);

	const start = add([
		text("Start game", { size: 45 }),
		pos(200, height() / 2),
		area(),
		body()
	]);

	start.onClick(() => go("game"))
});

go("startmenu")