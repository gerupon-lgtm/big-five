function timestampOf(result) {
  const timestamp = Date.parse(result.completedAt);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function orderSelectedResultsChronologically(history, selectedIds) {
  const selected = selectedIds
    .map((id) => {
      const historyIndex = history.findIndex((result) => result.id === id);
      return historyIndex === -1 ? null : { historyIndex, result: history[historyIndex] };
    })
    .filter(Boolean);

  selected.sort((left, right) => {
    const leftTime = timestampOf(left.result);
    const rightTime = timestampOf(right.result);
    if (leftTime !== null && rightTime !== null && leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return right.historyIndex - left.historyIndex;
  });

  return selected.map(({ result }) => result);
}
