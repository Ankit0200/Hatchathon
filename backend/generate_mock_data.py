"""
Generate 50 mock conversation JSON files for dashboard testing.
"""
import os
import json
import random
from datetime import datetime, timedelta, timezone

# Ensure conversations directory exists
CONVERSATIONS_DIR = "conversations"
os.makedirs(CONVERSATIONS_DIR, exist_ok=True)

# Mock data templates
SENTIMENTS = ["Positive", "Negative", "Neutral", "Frustrated", "Satisfied", "Confused", "Happy", "Disappointed"]
FEEDBACK_TEMPLATES = [
    "The checkout process was slow and confusing",
    "Great customer service, very helpful",
    "Product quality exceeded expectations",
    "Website navigation needs improvement",
    "Fast shipping and delivery",
    "User manual was unclear and hard to follow",
    "Excellent product features",
    "Customer support response time was too long",
    "Love the new design and interface",
    "Had trouble finding what I was looking for",
    "Price is reasonable for the value",
    "Mobile app crashes frequently",
    "Very satisfied with the purchase",
    "Return process was complicated",
    "Product arrived damaged",
    "Great value for money",
    "Checkout had technical issues",
    "Recommend to friends and family",
    "Packaging was poor quality",
    "Fast and efficient service",
    "Product didn't match description",
    "Easy to use and intuitive",
    "Customer service was unhelpful",
    "Would buy again",
    "Shipping took longer than expected",
    "Product quality is excellent",
    "Website is difficult to navigate",
    "Very happy with my purchase",
    "Had to contact support multiple times",
    "Great overall experience",
    "Product features are limited",
    "Excellent customer support",
    "Checkout process needs improvement",
    "Product met all expectations",
    "Had issues with payment processing",
    "Love the product design",
    "Delivery was delayed",
    "Very user-friendly interface",
    "Product broke after first use",
    "Highly recommend this product",
    "Confusing return policy",
    "Fast and reliable service",
    "Product quality is poor",
    "Great shopping experience",
    "Website has too many bugs",
    "Very satisfied customer",
    "Customer support was slow",
    "Product exceeded expectations",
    "Had trouble with account setup",
    "Excellent product and service",
    "Not worth the price"
]

INITIAL_FEEDBACK_POINTS = [
    ["Fast shipping", "Good packaging"],
    ["Slow checkout", "Confusing navigation"],
    ["Excellent quality", "Great value"],
    ["Poor customer service", "Long wait times"],
    ["Easy to use", "Intuitive design"],
    ["Product damaged", "Poor packaging"],
    ["Helpful support", "Quick response"],
    ["Website bugs", "Technical issues"],
    ["Love the design", "Great features"],
    ["Return process", "Complicated refund"],
    ["Fast delivery", "Good communication"],
    ["Product mismatch", "Wrong item"],
    ["Excellent service", "Would recommend"],
    ["Payment issues", "Checkout problems"],
    ["Great product", "Meets expectations"],
    ["Poor quality", "Not as described"],
    ["User-friendly", "Easy navigation"],
    ["Shipping delay", "Late delivery"],
    ["High quality", "Durable product"],
    ["Support unhelpful", "No resolution"],
]

FOLLOW_UP_RESPONSES = [
    "The checkout page kept freezing when I tried to pay",
    "It took about 5 minutes just to complete one purchase",
    "The navigation menu was hard to find and confusing",
    "I couldn't find the product I was looking for",
    "The customer service rep was very patient and helpful",
    "They responded within minutes and solved my issue",
    "The product arrived in perfect condition",
    "Packaging was secure and well done",
    "The manual didn't explain how to assemble it properly",
    "I had to watch a YouTube video to figure it out",
    "The product quality is amazing, very durable",
    "I've been using it for months and it still works great",
    "The mobile app crashes every time I try to checkout",
    "I had to use the website instead",
    "The return process required too many steps",
    "I had to call support multiple times",
    "The shipping was super fast, got it in 2 days",
    "Much faster than I expected",
    "The product description didn't match what I received",
    "It was smaller than advertised",
    "The customer support team was excellent",
    "They went above and beyond to help me",
    "The website is really easy to navigate",
    "I found everything I needed quickly",
    "The product broke after just one week",
    "I'm very disappointed with the quality",
    "The design is beautiful and modern",
    "I love how it looks in my home",
    "The features are exactly what I needed",
    "It has everything I was looking for",
    "The price is too high for what you get",
    "I don't think it's worth the money",
    "The checkout process was smooth",
    "No issues at all, very easy",
    "I had trouble setting up my account",
    "The verification process was confusing",
    "The product quality is outstanding",
    "Best purchase I've made this year",
    "The customer service was unresponsive",
    "I waited days for a reply",
    "The shipping was delayed by a week",
    "I was expecting it much sooner",
    "The product features are limited",
    "I wish it had more options",
    "The overall experience was great",
    "I would definitely buy again",
    "The website has too many technical issues",
    "I had to refresh multiple times",
    "The product exceeded my expectations",
    "I'm very happy with my purchase"
]

AI_RESPONSES = [
    "Thank you for that feedback. We really appreciate you taking the time to share your experience with us.",
    "I'm sorry to hear about that issue. Could you tell me more about what specifically was confusing?",
    "That's wonderful to hear! We're so glad you had a positive experience.",
    "Thank you for the detailed feedback. This helps us understand where we can improve.",
    "I understand your frustration. Let me see if I can help clarify that for you.",
    "We really appreciate your patience and feedback. This information is valuable to us.",
    "Thank you for sharing that. Could you provide a bit more detail about what went wrong?",
    "That's great to hear! We're thrilled that you're satisfied with our service.",
    "I'm sorry you had that experience. We take all feedback seriously and will look into this.",
    "Thank you for your feedback. We've noted your concerns and will work on improvements.",
    "We appreciate you taking the time to share your thoughts with us.",
    "That's helpful context. Could you tell me which specific part was the most frustrating?",
    "Thank you for the positive feedback! We're glad we could meet your expectations.",
    "I understand your concern. Let me see what we can do to address this issue.",
    "We really value your input. Thank you for helping us improve our service.",
    "I'm sorry to hear about the delay. We'll investigate this and work to prevent it in the future.",
    "Thank you for your detailed feedback. This is exactly the kind of information we need.",
    "We're sorry for the inconvenience. Could you share more details about what happened?",
    "That's wonderful feedback! We're so happy you're enjoying the product.",
    "Thank you for bringing this to our attention. We'll make sure to address this issue."
]

def generate_mock_conversation(index):
    """Generate a single mock conversation with realistic data."""
    # Generate timestamp (spread over last 30 days)
    days_ago = random.randint(0, 30)
    timestamp = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59))
    
    # Generate score (weighted towards middle scores for realism)
    score = random.choices(
        range(11),
        weights=[2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10]  # More 7-10 scores
    )[0]
    
    # Determine sentiment based on score
    if score >= 9:
        sentiment = random.choice(["Positive", "Happy", "Satisfied"])
    elif score >= 7:
        sentiment = random.choice(["Neutral", "Satisfied", "Positive"])
    elif score >= 4:
        sentiment = random.choice(["Negative", "Frustrated", "Disappointed"])
    else:
        sentiment = random.choice(["Negative", "Frustrated", "Disappointed"])
    
    # Generate initial transcription
    initial_transcription = random.choice(FEEDBACK_TEMPLATES)
    
    # Generate feedback points
    feedback_points = random.choice(INITIAL_FEEDBACK_POINTS)
    
    # Determine if follow-up is needed (more likely for low scores)
    requires_followup = score < 7 or (score < 9 and random.random() < 0.4)
    
    # Generate conversation turns (0-5 turns)
    if requires_followup:
        num_turns = random.choices([1, 2, 3, 4, 5], weights=[30, 35, 20, 10, 5])[0]
    else:
        num_turns = 0
    
    # Build turns
    turns = []
    for i in range(num_turns):
        user_response = random.choice(FOLLOW_UP_RESPONSES)
        ai_response = random.choice(AI_RESPONSES)
        turns.append({
            "user": user_response,
            "ai": ai_response
        })
    
    # Final analysis
    final_analysis = {
        "transcription": turns[-1]["user"] if turns else initial_transcription,
        "conversationalResponse": turns[-1]["ai"] if turns else random.choice(AI_RESPONSES),
        "requiresFollowUp": False,  # All saved conversations are complete
        "conversationComplete": True,
        "score": score
    }
    
    # Build complete conversation
    conversation = {
        "score": score,
        "sentiment": sentiment,
        "initial_transcription": initial_transcription,
        "initial_feedback_points": feedback_points,
        "turns": turns,
        "final_analysis": final_analysis,
        "metadata": {
            "total_turns": num_turns,
            "completed_at": timestamp.isoformat() + "Z"
        },
        "saved_at": timestamp.isoformat() + "Z"
    }
    
    return conversation

def main():
    """Generate 20 mock conversation files with good mix of sentiments."""
    print("Generating 20 mock conversation files...")
    
    # Clear existing mock files (optional - comment out if you want to keep real data)
    # for filename in os.listdir(CONVERSATIONS_DIR):
    #     if filename.startswith("conversation_") and filename.endswith(".json"):
    #         os.remove(os.path.join(CONVERSATIONS_DIR, filename))
    
    # Generate 20 conversations with better distribution
    # Ensure we have a good mix of negative/frustrated for the focus areas feature
    conversations_to_generate = 20
    
    # Pre-define some conversations to ensure variety
    # 8 negative/frustrated (40%), 6 positive (30%), 6 neutral/mixed (30%)
    sentiment_distribution = [
        "Negative", "Frustrated", "Negative", "Frustrated", 
        "Disappointed", "Negative", "Frustrated", "Angry",
        "Positive", "Happy", "Satisfied", "Positive",
        "Happy", "Satisfied", "Positive",
        "Neutral", "Neutral", "Satisfied", "Neutral", "Positive"
    ]
    
    for i in range(conversations_to_generate):
        conversation = generate_mock_conversation(i)
        
        # Override sentiment for better distribution if needed
        if i < len(sentiment_distribution):
            # Adjust score to match sentiment
            if sentiment_distribution[i] in ["Negative", "Frustrated", "Disappointed", "Angry"]:
                conversation["score"] = random.choice([1, 2, 3, 4, 5, 6])
                conversation["sentiment"] = sentiment_distribution[i]
            elif sentiment_distribution[i] in ["Positive", "Happy", "Satisfied"]:
                conversation["score"] = random.choice([8, 9, 10])
                conversation["sentiment"] = sentiment_distribution[i]
            else:  # Neutral
                conversation["score"] = random.choice([6, 7, 8])
                conversation["sentiment"] = sentiment_distribution[i]
        
        # Create filename with timestamp
        timestamp_str = conversation["saved_at"].replace(":", "").replace("-", "").split(".")[0]
        filename = f"conversation_{timestamp_str}.json"
        filepath = os.path.join(CONVERSATIONS_DIR, filename)
        
        # Save to file
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(conversation, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Generated {filename} (Score: {conversation['score']}, Sentiment: {conversation['sentiment']}, Turns: {len(conversation['turns'])})")
    
    print(f"\n✅ Successfully generated {conversations_to_generate} mock conversation files in {CONVERSATIONS_DIR}/")
    print("   Refresh your dashboard to see the new data!")
    print("   Note: 8 conversations have negative/frustrated sentiment for 'Top 3 Focus Areas' feature")

if __name__ == "__main__":
    main()

