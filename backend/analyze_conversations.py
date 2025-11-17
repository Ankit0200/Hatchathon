"""
Standalone analysis script for saved conversation JSON files.

Usage:
------
1. Install dependencies (once):
       python3 -m venv .venv && source .venv/bin/activate
       pip install pandas
2. Run the analyzer:
       python analyze_conversations.py --dir conversations

Outputs:
- Prints summary metrics to stdout.
- Saves `conversation_report.csv` with one row per conversation.
"""

import argparse
import json
import os
from collections import Counter
from datetime import datetime

import pandas as pd


def load_conversations(directory: str) -> pd.DataFrame:
    """
    Load all conversation JSON files from the given directory into a DataFrame.
    """
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"Directory '{directory}' not found.")

    records = []
    for filename in sorted(os.listdir(directory)):
        if not filename.endswith(".json"):
            continue

        path = os.path.join(directory, filename)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        turns = data.get("turns", [])
        final_analysis = data.get("final_analysis", {})

        records.append(
            {
                "filename": filename,
                "saved_at": data.get("saved_at"),
                "score": data.get("score"),
                "sentiment": data.get("sentiment") or final_analysis.get("sentiment"),
                "requires_followup": final_analysis.get("requiresFollowUp"),
                "conversation_complete": final_analysis.get("conversationComplete"),
                "total_turns": len(turns),
                "initial_transcription": data.get("initial_transcription"),
                "final_transcription": final_analysis.get("transcription"),
                "final_response": final_analysis.get("conversationalResponse"),
                "initial_feedback_points": data.get("initial_feedback_points")
                or data.get("initial_feedback")
                or [],
            }
        )

    if not records:
        raise ValueError(f"No JSON files found in '{directory}'.")

    return pd.DataFrame(records)


def summarize(df: pd.DataFrame) -> dict:
    """
    Compute high-level summary metrics.
    """
    summary = {
        "conversations": len(df),
        "avg_score": round(df["score"].mean(), 2),
        "median_score": df["score"].median(),
        "sentiment_breakdown": df["sentiment"].value_counts().to_dict(),
        "followup_required_pct": round(
            100 * df["requires_followup"].fillna(False).mean(), 2
        ),
        "avg_turns": round(df["total_turns"].mean(), 2),
        "max_turns": int(df["total_turns"].max()),
        "completed_pct": round(
            100 * df["conversation_complete"].fillna(False).mean(), 2
        ),
    }
    return summary


def top_feedback_points(df: pd.DataFrame, top_n: int = 5) -> list[tuple[str, int]]:
    """
    Return the most common feedback points across all conversations.
    """
    counter = Counter()
    for points in df["initial_feedback_points"]:
        if isinstance(points, list):
            counter.update([p.strip() for p in points if p])
    return counter.most_common(top_n)


def print_summary(summary: dict, top_feedback: list[tuple[str, int]]) -> None:
    print("\n=== Conversation Summary ===")
    for key, value in summary.items():
        if isinstance(value, dict):
            print(f"{key.replace('_', ' ').title()}:")
            for sub_key, sub_val in value.items():
                print(f"  - {sub_key}: {sub_val}")
        else:
            print(f"{key.replace('_', ' ').title()}: {value}")

    if top_feedback:
        print("\n=== Top Feedback Themes ===")
        for text, count in top_feedback:
            print(f"- {text}: {count} mention(s)")
    else:
        print("\nNo feedback points available.")


def export_csv(df: pd.DataFrame, output_path: str) -> None:
    df.to_csv(output_path, index=False)
    print(f"\n📄 Exported detailed report to {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Analyze saved customer conversation JSON files."
    )
    parser.add_argument(
        "--dir",
        default="conversations",
        help="Directory containing conversation JSON files (default: conversations)",
    )
    parser.add_argument(
        "--output",
        default=f"conversation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        help="Path to export the detailed CSV report.",
    )
    args = parser.parse_args()

    df = load_conversations(args.dir)
    summary = summarize(df)
    top_feedback = top_feedback_points(df)

    print_summary(summary, top_feedback)
    export_csv(df, args.output)


if __name__ == "__main__":
    main()

