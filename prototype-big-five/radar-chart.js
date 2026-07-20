const order = ["O", "C", "E", "A", "N"];

export function radarPoints(scores, centerX, centerY, radius) {
  return order.map((factor, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / order.length;
    const scaled = radius * (scores[factor] / 100);
    return [centerX + Math.cos(angle) * scaled, centerY + Math.sin(angle) * scaled];
  });
}

export function drawRadar(canvas, scores) {
  const context = canvas.getContext("2d");
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = size * 0.36;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#cbd8d4";
  context.fillStyle = "rgba(40,106,90,.22)";
  context.lineWidth = 2;

  const points = radarPoints(scores, center, center, radius);
  context.beginPath();
  points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
  context.closePath();
  context.fill();
  context.stroke();
}
