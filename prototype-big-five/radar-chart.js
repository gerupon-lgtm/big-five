import { SCORE_FACTORS, validateScores } from "./score-validation.js";

export function radarPoints(scores, centerX, centerY, radius) {
  validateScores(scores);
  return SCORE_FACTORS.map((factor, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / SCORE_FACTORS.length;
    const scaled = radius * (scores[factor] / 100);
    return [centerX + Math.cos(angle) * scaled, centerY + Math.sin(angle) * scaled];
  });
}

export function drawRadar(canvas, scores) {
  const context = canvas.getContext("2d");
  const radius = Math.min(canvas.width, canvas.height) * 0.36;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#cbd8d4";
  context.fillStyle = "rgba(40,106,90,.22)";
  context.lineWidth = 2;

  const points = radarPoints(scores, centerX, centerY, radius);
  context.beginPath();
  points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
  context.closePath();
  context.fill();
  context.stroke();
}
