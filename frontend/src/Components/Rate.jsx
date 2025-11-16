import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Rate.css';

const Rate = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [savedFeedback, setSavedFeedback] = useState([]);
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [savedAudioRecordings, setSavedAudioRecordings] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

  // Map star rating (1-5) to NPS score (0-10)
  const getNPSScore = (starRating) => {
    const mapping = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 };
    return mapping[starRating] || 0;
  };

  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setShowQuestion(true);
    setShowThankYou(false);
    setAiQuestion('What was the experience like?');
    setIsFirstResponse(true);
    setConversationEnded(false);
    conversationHistoryRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Save audio recording
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioData = {
          blob: audioBlob,
          url: audioUrl,
          timestamp: new Date().toISOString(),
          rating: selectedRating,
        };
        setSavedAudioRecordings(prev => [...prev, audioData]);
        
        // Save to localStorage
        try {
          const existingAudio = JSON.parse(localStorage.getItem('audioRecordings') || '[]');
          // Convert blob to base64 for storage
          const reader = new FileReader();
          reader.onloadend = () => {
            existingAudio.push({
              base64: reader.result,
              timestamp: audioData.timestamp,
              rating: audioData.rating,
            });
            localStorage.setItem('audioRecordings', JSON.stringify(existingAudio));
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Error saving audio to localStorage:', error);
        }
        
        await submitFeedback(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const saveFeedbackToStorage = (feedbackData) => {
    const npsScore = getNPSScore(selectedRating);
    const feedbackEntry = {
      ...feedbackData,
      rating: selectedRating,
      npsScore: npsScore,
      timestamp: new Date().toISOString(),
    };
    
    const updatedFeedback = [...savedFeedback, feedbackEntry];
    setSavedFeedback(updatedFeedback);
    
    // Save to localStorage
    try {
      const existingData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
      existingData.push(feedbackEntry);
      localStorage.setItem('feedbackData', JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    console.log('Saved feedback:', feedbackEntry);
  };

  const submitFeedback = async (audioBlob) => {
    setIsProcessing(true);
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      // Convert blob to File for upload
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Upload file to Gemini
      const uploadResult = await genAI.uploadFile(audioFile, {
        mimeType: 'audio/webm',
        displayName: 'feedback-recording',
      });

      // Wait for file to be processed
      await uploadResult.waitForProcessing();

      let prompt;
      let model;
      const npsScore = getNPSScore(selectedRating);
      
      if (isFirstResponse) {
        // First response: analyze and get JSON with decision logic
        model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash-exp",
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        prompt = `You are a conversational customer feedback analyst. Your job is to analyze NPS (Net Promoter Score) feedback and decide the correct response.

The user gave a score of: ${npsScore}/10

Here is their audio feedback:

Instructions:

1. Transcribe the user's audio feedback exactly.

2. Provide a single-word sentiment (e.g., "Positive", "Negative", "Frustrated", "Confused").

3. Extract the key feedback points or action items as a list of strings.

4. *Decide the Next Step:*

○ *IF score is 0-6 (Detractor):* The user is unhappy. Generate an empathetic response that asks a follow-up question to get more detail. Set requiresFollowUp to true.

(Example response: "I'm very sorry to hear that. To help us improve, could you tell me more about what part was slow?")

○ *IF score is 7-8 (Passive) AND feedback is vague:* Ask a clarifying question. Set requiresFollowUp to true.

(Example response: "Thanks for the feedback. What's one thing we could do to make that a 10 for you?")

○ *IF score is 9-10 (Promoter) OR score is 7-8 and feedback is clear: The user is happy or satisfied. Just say thank you. Do not ask a question.* Set requiresFollowUp to false.

(Example response: "That's wonderful to hear! We've noted your feedback and really appreciate you sharing.")

○ *IF audio is unclear:* Ask them to type their feedback. Set requiresFollowUp to true.

(Example response: "Sorry, I couldn't quite catch that. Could you please type your feedback instead?")

5. *Respond ONLY with a valid JSON object in this exact format:*

{
  "transcription": "...",
  "sentiment": "...",
  "feedback": ["..."],
  "conversationalResponse": "...",
  "requiresFollowUp": true
}`;

        // Generate content with audio
        const result = await model.generateContent([prompt, uploadResult.file]);
        const response = await result.response;
        const responseText = response.text();

        // Parse JSON response
        let analysisData;
        try {
          analysisData = JSON.parse(responseText);
        } catch (parseError) {
          // Try to extract JSON from markdown code blocks
          const jsonMatch = responseText.match(/```(?:json)?\s*(\{.*?\})\s*```/s);
          if (jsonMatch) {
            analysisData = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Failed to parse JSON response');
          }
        }

        // Save the feedback data
        saveFeedbackToStorage({
          transcription: analysisData.transcription,
          sentiment: analysisData.sentiment,
          feedback: analysisData.feedback,
          conversationalResponse: analysisData.conversationalResponse,
          requiresFollowUp: analysisData.requiresFollowUp,
        });

        // Add to conversation history
        conversationHistoryRef.current.push({
          role: 'user',
          parts: [{ text: `NPS Score: ${npsScore}/10. Audio feedback provided.` }]
        });
        conversationHistoryRef.current.push({
          role: 'model',
          parts: [{ text: analysisData.conversationalResponse }]
        });

        // Show conversational response
        setAiQuestion(analysisData.conversationalResponse);
        
        // If no follow-up needed, end conversation
        if (!analysisData.requiresFollowUp) {
          setConversationEnded(true);
          setShowThankYou(true);
          setShowQuestion(false);
          
          setTimeout(() => {
            setSelectedRating(0);
            setShowThankYou(false);
            setShowQuestion(false);
            setAiQuestion('');
            setIsFirstResponse(true);
            setConversationEnded(false);
            conversationHistoryRef.current = [];
            setRecordingTime(0);
          }, 3000);
        } else {
          setIsFirstResponse(false);
        }
      } else {
        // Follow-up responses: use same decision logic with updated NPS context
        model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash-exp",
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        // Build conversation context for prompt
        const conversationContext = conversationHistoryRef.current.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0].text}`
        ).join('\n');

        prompt = `You are a conversational customer feedback analyst. The user gave an NPS score of ${npsScore}/10.

Previous conversation:
${conversationContext}

The user just provided additional audio feedback. Your tasks:

1. Transcribe the user's audio feedback exactly.

2. Provide a single-word sentiment (e.g., "Positive", "Negative", "Frustrated", "Confused").

3. Extract the key feedback points or action items as a list of strings.

4. *Decide the Next Step:*

○ *IF score is 0-6 (Detractor):* The user is unhappy. Generate an empathetic response that asks a follow-up question to get more detail. Set requiresFollowUp to true.

○ *IF score is 7-8 (Passive) AND feedback is vague:* Ask a clarifying question. Set requiresFollowUp to true.

○ *IF score is 9-10 (Promoter) OR score is 7-8 and feedback is clear: The user is happy or satisfied. Just say thank you. Do not ask a question.* Set requiresFollowUp to false.

○ *IF audio is unclear:* Ask them to type their feedback. Set requiresFollowUp to true.

5. *Respond ONLY with a valid JSON object in this exact format:*

{
  "transcription": "...",
  "sentiment": "...",
  "feedback": ["..."],
  "conversationalResponse": "...",
  "requiresFollowUp": true
}`;

        // Generate content with audio - pass history and new content
        const historyContent = conversationHistoryRef.current.map(msg => ({
          role: msg.role,
          parts: msg.parts
        }));
        
        const result = await model.generateContent([
          ...historyContent,
          { role: 'user', parts: [{ text: prompt }, uploadResult.file] }
        ]);
        const response = await result.response;
        const responseText = response.text();

        // Parse JSON response
        let analysisData;
        try {
          analysisData = JSON.parse(responseText);
        } catch (parseError) {
          // Try to extract JSON from markdown code blocks
          const jsonMatch = responseText.match(/```(?:json)?\s*(\{.*?\})\s*```/s);
          if (jsonMatch) {
            analysisData = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Failed to parse JSON response');
          }
        }

        // Save the feedback data
        saveFeedbackToStorage({
          transcription: analysisData.transcription,
          sentiment: analysisData.sentiment,
          feedback: analysisData.feedback,
          conversationalResponse: analysisData.conversationalResponse,
          requiresFollowUp: analysisData.requiresFollowUp,
        });

        // Add to conversation history
        conversationHistoryRef.current.push({
          role: 'user',
          parts: [{ text: 'Additional audio feedback provided.' }]
        });
        conversationHistoryRef.current.push({
          role: 'model',
          parts: [{ text: analysisData.conversationalResponse }]
        });

        // Show conversational response
        setAiQuestion(analysisData.conversationalResponse);

        // If no follow-up needed, end conversation
        if (!analysisData.requiresFollowUp) {
          setConversationEnded(true);
          setShowThankYou(true);
          setShowQuestion(false);
          
          setTimeout(() => {
            setSelectedRating(0);
            setShowThankYou(false);
            setShowQuestion(false);
            setAiQuestion('');
            setIsFirstResponse(true);
            setConversationEnded(false);
            conversationHistoryRef.current = [];
            setRecordingTime(0);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const endConversation = () => {
    setConversationEnded(true);
    setShowThankYou(true);
    setShowQuestion(false);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedRating(0);
      setShowThankYou(false);
      setShowQuestion(false);
      setAiQuestion('');
      setIsFirstResponse(true);
      setConversationEnded(false);
      conversationHistoryRef.current = [];
      setRecordingTime(0);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderStar = (index) => {
    const isFilled = index <= selectedRating;
    return (
      <svg
        key={index}
        className={`star ${isFilled ? 'filled' : 'outline'} ${selectedRating === 0 ? '' : 'clickable'}`}
        viewBox="0 0 24 24"
        fill={isFilled ? 'currentColor' : 'none'}
        stroke="currentColor"
        onClick={() => handleStarClick(index)}
        style={{ cursor: 'pointer' }}
      >
        <path d={starPath} strokeWidth={isFilled ? 0 : 1.5} />
      </svg>
    );
  };

  return (
    <div className="rate-us-container">
      <div className="rate-us-card">
        {!showThankYou ? (
          <>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(index => renderStar(index))}
            </div>
            
            {!showQuestion ? (
              <p className="thank-you-message">
                Rate your experience
              </p>
            ) : (
              <div className="question-section">
                <p className="question-text">
                  {aiQuestion || 'What was the experience like?'}
                </p>
                <div className="voice-controls">
                  {!isRecording && !isProcessing && (
                    <>
                      <button 
                        className="record-button"
                        onClick={startRecording}
                      >
                        <svg className="mic-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                        {isFirstResponse ? 'Start Recording' : 'Record Response'}
                      </button>
                      {!isFirstResponse && (
                        <button 
                          className="end-button"
                          onClick={endConversation}
                        >
                          End Conversation
                        </button>
                      )}
                    </>
                  )}
                  
                  {isRecording && (
                    <div className="recording-status">
                      <div className="recording-indicator"></div>
                      <span>Recording... {recordingTime}s</span>
                      <button 
                        className="stop-button"
                        onClick={stopRecording}
                      >
                        Stop
                      </button>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="processing-status">
                      <div className="spinner"></div>
                      <span>Processing with Gemini Pro...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="thank-you-message">
            Thanks for sharing—it's great to know we're on the<br />
            right track!
          </p>
        )}
        
        <div className="branding">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="brand-text">Asklet by Sunbeam</span>
        </div>
      </div>
    </div>
  );
};

export default Rate;

