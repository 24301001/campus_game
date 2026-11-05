(function () {
  "use strict";

  const P = {
    edge: "#25343a", scarf: "#d4dfb9", scarfShade: "#9faf8c",
    skin: "#e7b78b", skinShade: "#b98165", hair: "#3c302b",
    coat: "#b75e43", coatLight: "#d77a55", coatShade: "#8e4338",
    apron: "#e7b873", apronShade: "#bb884e", trousers: "#3e5360",
    shoes: "#28353a", sleeve: "#e4d0a5"
  };

  function pixel(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function buildSprite(direction, mode, phase, emotion = "neutral") {
    const canvas = document.createElement("canvas");
    canvas.width = 18;
    canvas.height = 30;
    const g = canvas.getContext("2d");
    g.imageSmoothingEnabled = false;
    const px = (x, y, w, h, c) => pixel(g, x, y, w, h, c);
    const bob = mode === "idle" && phase % 2 ? 1 : 0;
    const talk = mode === "talk" && phase % 2 === 1;
    const walking = mode === "walk";
    const leftFoot = walking && phase % 4 < 2 ? -1 : 0;
    const rightFoot = walking && phase % 4 >= 2 ? -1 : 0;
    let side = direction === "left" || direction === "right";
    if (direction === "right") {
      g.translate(18, 0);
      g.scale(-1, 1);
    }

    // Feet are kept at the same anchor while the upper body breathes.
    px(5 + leftFoot, 22, 3, 4, P.trousers);
    px(10 + rightFoot, 22, 3, 4, P.trousers);
    px(4 + leftFoot, 26, 5, 2, P.shoes);
    px(9 + rightFoot, 26, 5, 2, P.shoes);
    px(4 + leftFoot, 26, 4, 1, "#52626a");
    px(9 + rightFoot, 26, 4, 1, "#52626a");

    const upper = -bob;
    if (side) {
      px(4, 3 + upper, 9, 7, P.edge);
      px(4, 2 + upper, 8, 3, P.scarf);
      px(11, 3 + upper, 3, 4, P.scarfShade);
      px(4, 6 + upper, 7, 5, P.skin);
      px(3, 8 + upper, 2, 2, P.skinShade); // nose
      px(5, 7 + upper, 1, 1, P.hair);
      px(4, 10 + upper, 5, 1, talk ? "#7e3c37" : emotion === "happy" ? "#8e5342" : P.skinShade);
      px(5, 11 + upper, 8, 11, P.edge);
      px(5, 11 + upper, 7, 10, P.coat);
      px(5, 12 + upper, 2, 8, P.coatLight);
      px(5, 14 + upper, 4, 8, P.apron);
      px(8, 15 + upper, 1, 7, P.apronShade);
      px(11, 12 + upper, 3, 8, P.sleeve);
      px(11, 19 + upper, 3, 2, P.skin);
      px(13, 6 + upper, 3, 3, P.scarf);
    } else {
      px(5, 2 + upper, 8, 8, P.edge);
      px(4, 2 + upper, 10, 4, P.scarf);
      px(5, 1 + upper, 8, 2, "#e5ebcd");
      px(4, 5 + upper, 1, 4, P.scarfShade);
      px(13, 5 + upper, 1, 4, P.scarfShade);
      if (direction === "up") {
        px(5, 5 + upper, 8, 5, P.scarfShade);
        px(7, 8 + upper, 4, 3, P.scarf);
        px(8, 11 + upper, 2, 3, P.scarfShade);
      } else {
        px(5, 5 + upper, 8, 5, P.skin);
        px(5, 5 + upper, 8, 1, P.hair);
        px(6, 7 + upper, 1, 1, P.hair);
        px(11, 7 + upper, 1, 1, P.hair);
        if (emotion === "thinking") px(6, 6 + upper, 3, 1, P.hair);
        px(8, 8 + upper, 2, 1, P.skinShade);
        px(emotion === "happy" ? 7 : 8, 9 + upper, emotion === "happy" ? 4 : 2, 1,
          talk ? "#6f342f" : emotion === "happy" ? "#915248" : P.skinShade);
      }
      px(3, 11 + upper, 12, 11, P.edge);
      px(4, 11 + upper, 10, 10, P.coat);
      px(4, 12 + upper, 3, 8, P.coatLight);
      px(12, 12 + upper, 2, 8, P.coatShade);
      px(2, 12 + upper, 3, 7, P.sleeve);
      px(14, 12 + upper, 3, 7, P.sleeve);
      px(2, 19 + upper, 3, 2, P.skin);
      px(14, 19 + upper, 3, 2, P.skinShade);
      if (direction === "up") {
        px(6, 12 + upper, 6, 9, P.coatShade);
        px(8, 12 + upper, 2, 9, P.apronShade);
      } else {
        px(6, 12 + upper, 6, 10, P.apron);
        px(6, 12 + upper, 6, 1, "#f2cd8e");
        px(7, 17 + upper, 4, 3, P.apronShade);
        px(8, 17 + upper, 2, 2, P.apron);
      }
    }
    return canvas;
  }

  function drawScene(canvas, direction, mode, phase, emotion = "neutral") {
    if (!canvas) return;
    const g = canvas.getContext("2d");
    g.imageSmoothingEnabled = false;
    const W = canvas.width, H = canvas.height;
    g.clearRect(0, 0, W, H);
    pixel(g, 0, 0, W, H, "#365057");
    // A small service window grounds the character in the canteen world.
    pixel(g, 16, 17, 208, 146, "#31454b");
    pixel(g, 25, 29, 190, 121, "#526b69");
    pixel(g, 32, 41, 176, 103, "#67807b");
    pixel(g, 23, 155, 194, 6, "#1e343b");
    pixel(g, 35, 14, 170, 22, "#8c563d");
    pixel(g, 41, 19, 158, 12, "#a76b45");
    g.fillStyle = "#f6d99c";
    g.font = "bold 12px 'Microsoft YaHei', sans-serif";
    g.textAlign = "center";
    g.fillText("热 饭 热 菜", 120, 29);
    pixel(g, 39, 51, 37, 31, "#334b50");
    pixel(g, 42, 54, 31, 25, "#8ca19a");
    pixel(g, 164, 51, 37, 31, "#334b50");
    pixel(g, 167, 54, 31, 25, "#8ca19a");
    pixel(g, 0, 162, W, 88, "#53645e");
    for (let y = 166; y < H; y += 18) {
      pixel(g, 0, y, W, 2, "#40524f");
      for (let x = (y % 36 ? 0 : 12); x < W; x += 32) pixel(g, x, y + 2, 2, 16, "#465a55");
    }
    pixel(g, 26, 206, 188, 16, "#ad754e");
    pixel(g, 32, 222, 176, 10, "#815238");
    pixel(g, 45, 185, 21, 20, "#344e4b");
    pixel(g, 48, 180, 15, 6, "#d3a767");
    pixel(g, 174, 190, 21, 15, "#415d55");
    pixel(g, 178, 184, 13, 6, "#d3a767");
    // Draw 18×30 sprite at 5×; same source dimensions as the campus NPC.
    const sprite = buildSprite(direction, mode, phase, emotion);
    g.drawImage(sprite, 0, 0, 18, 30, 75, 57, 90, 150);
    pixel(g, 0, 238, W, 12, "#2c454a");
  }

  window.AuntSprite = { buildSprite, drawScene };
})();
