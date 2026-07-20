export function initialState() {
  return {
    screen: "start",
    mode: "manual",
    currentIndex: 0,
    answers: {},
    selectedHistoryIds: [],
  };
}

export function transition(state, event) {
  switch (event.type) {
    case "START":
      return { ...initialState(), screen: "questions", mode: event.mode };
    case "ANSWER": {
      const answers = { ...state.answers, [event.questionId]: event.value };
      const currentIndex = state.currentIndex + 1;
      const screen =
        currentIndex === 20
          ? "basicResult"
          : currentIndex === 50
            ? "detailedResult"
            : "questions";
      return { ...state, answers, currentIndex, screen };
    }
    case "BACK":
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
        screen: "questions",
      };
    case "CONTINUE":
      return { ...state, screen: "questions", currentIndex: 20 };
    case "SHOW_SHARE":
      return { ...state, screen: "share" };
    case "SHOW_HISTORY":
      return { ...state, screen: "history" };
    case "SHOW_COMPARE":
      return { ...state, screen: "compare", selectedHistoryIds: event.ids };
    case "GO_START":
      return initialState();
    default:
      return state;
  }
}
