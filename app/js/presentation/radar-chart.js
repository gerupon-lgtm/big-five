const GUIDE_LEVELS = Object.freeze([25, 50, 75]);
const AXIS_COUNT = 5;

function point(centerX, centerY, radius, index) {
  const angle = (-Math.PI / 2) + ((Math.PI * 2 * index) / AXIS_COUNT);
  return {
    x: centerX + (Math.cos(angle) * radius),
    y: centerY + (Math.sin(angle) * radius),
  };
}

function tracePolygon(context, centerX, centerY, radiusForIndex) {
  context.beginPath();
  for (let index = 0; index < AXIS_COUNT; index += 1) {
    const { x, y } = point(centerX, centerY, radiusForIndex(index), index);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
}

export function drawResultRadar(
  canvas,
  factors,
  { factorLabels = {} } = {},
) {
  let context;
  try {
    context = typeof canvas?.getContext === "function" ? canvas.getContext("2d") : null;
  } catch {
    return { drawn: false, errorCode: "RADAR_DRAW_FAILED" };
  }
  if (!context) {
    return { drawn: false, errorCode: "RADAR_CONTEXT_UNAVAILABLE" };
  }

  try {
    const width = canvas.width || 300;
    const height = canvas.height || 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const maximumRadius = Math.max(0, (Math.min(width, height) / 2) - 52);

    context.save();
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = "#9aa3ad";

    for (const guide of GUIDE_LEVELS) {
      tracePolygon(
        context,
        centerX,
        centerY,
        () => maximumRadius * (guide / 100),
      );
      context.stroke();
    }

    for (let index = 0; index < AXIS_COUNT; index += 1) {
      const end = point(centerX, centerY, maximumRadius, index);
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(end.x, end.y);
      context.stroke();
    }

    context.font = "600 11px system-ui, sans-serif";
    context.fillStyle = "#365b52";
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let index = 0; index < AXIS_COUNT; index += 1) {
      const labelPoint = point(centerX, centerY, maximumRadius + 28, index);
      const factorId = factors[index].factorId;
      context.fillText(
        factorLabels[factorId] ?? factorId,
        labelPoint.x,
        labelPoint.y,
      );
    }

    context.strokeStyle = "#2f6f73";
    context.fillStyle = "rgba(47, 111, 115, 0.2)";
    context.lineWidth = 2;
    tracePolygon(context, centerX, centerY, (index) => {
      const score = Math.min(100, Math.max(0, factors[index].displayScore));
      return maximumRadius * (score / 100);
    });
    context.fill();
    context.stroke();
    context.restore();
    return { drawn: true, errorCode: null };
  } catch {
    return { drawn: false, errorCode: "RADAR_DRAW_FAILED" };
  }
}
