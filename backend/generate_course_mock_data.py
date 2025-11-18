"""
Generate mock course feedback conversation data for testing the course dashboard.
Creates 15 mock conversations in the courseconversations folder.
"""
import os
import json
import random
from datetime import datetime, timedelta, timezone

COURSE_CONVERSATIONS_DIR = "courseconversations"
os.makedirs(COURSE_CONVERSATIONS_DIR, exist_ok=True)

# Course-specific feedback templates
COURSE_FEEDBACK_TEMPLATES = {
    "positive": [
        "The course content was excellent and well-structured. I learned a lot about web development fundamentals.",
        "Great instructor! The explanations were clear and the examples were very helpful.",
        "Really enjoyed the course. The practical exercises helped me understand the concepts better.",
        "Amazing course! The step-by-step approach made it easy to follow along.",
        "The course exceeded my expectations. I feel confident building websites now.",
        "Excellent course material and delivery. Highly recommend to anyone starting web development.",
        "The instructor's teaching style was perfect. I understood everything clearly.",
        "Great value for money. The course covered everything I needed to know.",
        "Loved the course! The projects were engaging and practical.",
        "Best web development course I've taken. Very comprehensive and well-paced."
    ],
    "negative": [
        "The course was too fast-paced. I couldn't keep up with the content.",
        "The instructor didn't explain concepts clearly. I was confused most of the time.",
        "The course material was outdated. Some examples didn't work with current versions.",
        "Not enough practice exercises. I needed more hands-on experience.",
        "The course was too basic. I expected more advanced content.",
        "Poor video quality made it hard to see the code examples.",
        "The instructor was not responsive to questions in the discussion forum.",
        "The course structure was confusing. Topics were not organized well.",
        "Too much theory, not enough practical application.",
        "The course didn't meet my expectations. Content was shallow."
    ],
    "frustrated": [
        "I'm frustrated because the course videos kept buffering and I couldn't complete lessons.",
        "Very disappointed with the course quality. The instructor seemed unprepared.",
        "The course materials were incomplete. Several modules had broken links.",
        "I'm frustrated that I paid for this course but didn't learn what was promised.",
        "The course platform had technical issues that prevented me from accessing content.",
        "I'm angry that the course description didn't match the actual content.",
        "Frustrated with the lack of support. My questions went unanswered for days.",
        "The course was a waste of time. I didn't learn anything useful.",
        "Very disappointed. The course was poorly organized and hard to follow.",
        "I'm frustrated because the course didn't cover the topics I needed."
    ],
    "neutral": [
        "The course was okay. It covered the basics but nothing exceptional.",
        "Decent course overall. Some parts were good, others could be improved.",
        "The course met my basic expectations but didn't exceed them.",
        "Average course. It was informative but not particularly engaging.",
        "The course was fine. I learned some things but expected more depth.",
        "It's an okay course for beginners. More experienced learners might find it too basic.",
        "The course was satisfactory. Nothing special but it served its purpose.",
        "Decent content but the delivery could be more engaging.",
        "The course was acceptable. Some modules were better than others.",
        "Average quality course. It works but there's room for improvement."
    ]
}

COURSE_FEEDBACK_POINTS = {
    "positive": [
        "Clear explanations",
        "Well-structured content",
        "Good examples",
        "Helpful exercises",
        "Engaging instructor",
        "Practical projects",
        "Comprehensive coverage",
        "Easy to follow",
        "Great value",
        "Excellent pacing"
    ],
    "negative": [
        "Too fast-paced",
        "Unclear explanations",
        "Outdated content",
        "Not enough practice",
        "Too basic",
        "Poor video quality",
        "Unresponsive instructor",
        "Confusing structure",
        "Too much theory",
        "Shallow content"
    ],
    "frustrated": [
        "Technical issues",
        "Poor quality",
        "Incomplete materials",
        "Broken promises",
        "Platform problems",
        "Misleading description",
        "Lack of support",
        "Waste of time",
        "Poor organization",
        "Missing topics"
    ],
    "neutral": [
        "Average quality",
        "Basic coverage",
        "Decent content",
        "Room for improvement",
        "Acceptable delivery",
        "Mixed quality",
        "Satisfactory",
        "Could be better",
        "Nothing special",
        "Standard course"
    ]
}

def generate_course_mock_conversation(index):
    """Generate a single mock course feedback conversation."""
    # Generate timestamp within last 30 days
    days_ago = random.randint(0, 30)
    hours_ago = random.randint(0, 23)
    minutes_ago = random.randint(0, 59)
    timestamp = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
    
    # Determine sentiment (ensure good mix for dashboard)
    # 5 negative/frustrated, 5 positive, 5 neutral
    if index < 5:
        sentiment = random.choice(["Negative", "Frustrated", "Disappointed"])
        score = random.choice([1, 2, 3, 4, 5, 6])
    elif index < 10:
        sentiment = random.choice(["Positive", "Happy", "Satisfied"])
        score = random.choice([8, 9, 10])
    else:
        sentiment = random.choice(["Neutral", "Satisfied"])
        score = random.choice([6, 7, 8])
    
    # Get feedback based on sentiment
    sentiment_key = "positive" if sentiment.lower() in ["positive", "happy", "satisfied"] else \
                   "negative" if sentiment.lower() in ["negative", "disappointed"] else \
                   "frustrated" if sentiment.lower() in ["frustrated", "angry"] else "neutral"
    
    feedback_text = random.choice(COURSE_FEEDBACK_TEMPLATES[sentiment_key])
    feedback_points = random.sample(COURSE_FEEDBACK_POINTS[sentiment_key], random.randint(2, 4))
    
    # Generate turns (some conversations have follow-ups)
    turns = []
    num_turns = random.randint(0, 3) if score < 7 else random.randint(0, 1)
    
    for i in range(num_turns):
        turn_feedback = random.choice(COURSE_FEEDBACK_TEMPLATES[sentiment_key])
        turns.append({
            "user": turn_feedback,
            "ai": f"Thank you for that additional feedback. {'We appreciate you taking the time to share more details.' if sentiment_key == 'positive' else 'We understand your concerns and will work on improving this.'}"
        })
    
    # Determine if conversation is complete
    requires_followup = num_turns < 2 and score < 7
    conversation_complete = not requires_followup
    
    conversation = {
        "score": score,
        "sentiment": sentiment,
        "initial_transcription": feedback_text,
        "initial_feedback_points": feedback_points,
        "turns": turns,
        "final_analysis": {
            "transcription": feedback_text if not turns else turns[-1]["user"],
            "conversationalResponse": "Thank you for your feedback! We appreciate you taking the time to share your experience with our course." if conversation_complete else "We'd love to hear more about your experience. Could you tell us what specific aspects you'd like to see improved?",
            "requiresFollowUp": requires_followup,
            "conversationComplete": conversation_complete,
            "sentiment": sentiment
        },
        "metadata": {
            "total_turns": len(turns),
            "completed_at": timestamp.isoformat() + "Z"
        },
        "saved_at": timestamp.isoformat() + "Z"
    }
    
    return conversation

def main():
    """Generate 15 mock course conversation files."""
    print("Generating 15 mock course feedback conversation files...")
    
    # Clear existing mock files (optional - comment out if you want to keep real data)
    # for filename in os.listdir(COURSE_CONVERSATIONS_DIR):
    #     if filename.startswith("conversation_") and filename.endswith(".json"):
    #         os.remove(os.path.join(COURSE_CONVERSATIONS_DIR, filename))
    
    # Generate 15 conversations with good distribution
    # 5 negative/frustrated, 5 positive, 5 neutral
    for i in range(15):
        conversation = generate_course_mock_conversation(i)
        
        # Create filename with timestamp
        timestamp_str = conversation["saved_at"].replace(":", "").replace("-", "").split(".")[0]
        filename = f"conversation_{timestamp_str}.json"
        filepath = os.path.join(COURSE_CONVERSATIONS_DIR, filename)
        
        # Save to file
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(conversation, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Generated {filename} (Score: {conversation['score']}, Sentiment: {conversation['sentiment']}, Turns: {len(conversation['turns'])})")
    
    print(f"\n✅ Successfully generated 15 mock course feedback conversation files in {COURSE_CONVERSATIONS_DIR}/")
    print("   Refresh your course dashboard to see the new data!")
    print("   Distribution: 5 negative/frustrated, 5 positive, 5 neutral")

if __name__ == "__main__":
    main()

