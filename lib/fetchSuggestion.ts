import { Board } from "@/typings";
import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
  try {
    const todos = formatTodosForAI(board);
    console.log("FORMATTED TODOS=>", todos);

    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todos }),
    });

    if (!res.ok) {
      throw new Error("Request failed with status " + res.status);
    }

    const GPTData = await res.json();
    const { content } = GPTData;

    return content;
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
};

export default fetchSuggestion;
