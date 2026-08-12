I want to create an SVG text fill-reveal animation.

The text should start fully hidden. A reveal should travel from the
beginning of the word to the end, progressively revealing the filled
glyphs.

I do NOT want:
- textPath
- an outline/stroke drawing animation
- the entire text simply fading in
- a basic left-to-right opacity animation

I want the text itself to be an SVG shape, with the fill progressively
revealed by an SVG mask or clipPath.

The reveal should feel like the letters are being written/drawn,
but the final result should be solid filled typography.

Use SVG + CSS/JavaScript. Keep the text as vector geometry so the
animation follows the actual shape of the glyphs.

Start by implementing it with the word "HELLO" and explain the
architecture before adding animation polish.