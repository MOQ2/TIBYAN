from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import os
import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, AutoConfig, TFAutoModelForSequenceClassification
from arabert.preprocess import ArabertPreprocessor
from sklearn.preprocessing import LabelEncoder
import uvicorn
from contextlib import asynccontextmanager

# Pydantic models for request/response
class TextRequest(BaseModel):
    text: str = Field(..., description="Arabic text to classify")

class BatchRequest(BaseModel):
    texts: List[str] = Field(..., description="List of Arabic texts to classify")

class SentimentResponse(BaseModel):
    original_text: str
    processed_text: str
    predicted_class: str
    confidence: float
    all_probabilities: Dict[str, float]

class BatchResponse(BaseModel):
    results: List[SentimentResponse]
    total_processed: int

# Global classifier instance
classifier = None

class ArabicSentimentClassifier:
    def __init__(self, model_path, model_name="aubmindlab/bert-base-arabertv2"):
        print("Initializing Arabic Sentiment Classifier...")
        self.arabert_prep = ArabertPreprocessor(model_name=model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.mapping = {
            "0": "negative",
            "1": "neutral",
            "2": "positive"
        }
        # Load the model
        try:
            config = AutoConfig.from_pretrained(os.path.join(model_path, 'config.json'))
            print("Config loaded successfully.")
            self.model = TFAutoModelForSequenceClassification.from_pretrained(
                model_path, config=config, from_tf=True
            )
            print("Model loaded from directory using config and .h5!")
        except Exception as e:
            print(f"Error loading from directory: {e}")
            print("Attempting fallback loading with model_name and weights...")
            self.model = TFAutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3)
            # Manually load weights
            h5_file = next((f for f in os.listdir(model_path) if f.endswith(".h5")), None)
            if not h5_file:
                raise ValueError("No .h5 file found in the provided directory.")
            self.model.load_weights(os.path.join(model_path, h5_file))
            print("Model weights loaded successfully.")
        
        # Setup label encoder
        self.label_encoder = LabelEncoder()
        self.label_encoder.fit(['0', '1', '2'])
    
    def classify_text(self, text: str) -> Dict[str, Any]:
        processed_text = self.arabert_prep.preprocess(text)
        encoding = self.tokenizer(
            processed_text,
            truncation=True,
            padding='max_length',
            max_length=512,
            return_tensors='tf'
        )
        
        output = self.model(encoding)
        probabilities = tf.nn.softmax(output.logits, axis=-1).numpy()[0]
        predicted_idx = np.argmax(probabilities)
        confidence = probabilities[predicted_idx]
        
        
        # If confidence is less than 0.6, set label as neutral
        if confidence < 0.6:
            predicted_label = "1"  
        else:
            predicted_label = self.label_encoder.classes_[predicted_idx]
        
        return {
            "original_text": text,
            "processed_text": processed_text,
            "predicted_class": self.mapping[predicted_label],
            "confidence": float(confidence),
            "all_probabilities": {
            self.map[label]: float(prob) for label, prob in zip(self.label_encoder.classes_, probabilities)
            }
        }
    
    def classify_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        return [self.classify_text(text) for text in texts]

# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global classifier
    model_path = os.getenv("MODEL_PATH", "./arabic_sentiment_model/")
    
    if not os.path.exists(model_path):
        raise RuntimeError(f"Model path {model_path} does not exist. Please set MODEL_PATH environment variable.")
    
    try:
        classifier = ArabicSentimentClassifier(model_path)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise RuntimeError(f"Failed to initialize classifier: {e}")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="Arabic Sentiment Analysis API",
    description="API for Arabic text sentiment classification using AraBERT",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Arabic Sentiment Analysis API is running!",
        "status": "healthy",
        "endpoints": {
            "single_text": "/classify",
            "batch_text": "/classify-batch",
            "docs": "/docs"
        }
    }

@app.post("/classify", response_model=SentimentResponse)
async def classify_single_text(request: TextRequest):
    """
    Classify sentiment of a single Arabic text
    
    - **text**: Arabic text to analyze
    
    Returns sentiment classification with confidence scores
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = classifier.classify_text(request.text)
        return SentimentResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@app.post("/classify-batch", response_model=BatchResponse)
async def classify_batch_texts(request: BatchRequest):
    """
    Classify sentiment of multiple Arabic texts
    
    - **texts**: List of Arabic texts to analyze
    
    Returns batch sentiment classification results
    """
    try:
        if not request.texts:
            raise HTTPException(status_code=400, detail="Texts list cannot be empty")
        
        if len(request.texts) > 100:  # Limit batch size
            raise HTTPException(status_code=400, detail="Batch size cannot exceed 100 texts")
        
        # Filter out empty texts
        valid_texts = [text.strip() for text in request.texts if text.strip()]
        
        if not valid_texts:
            raise HTTPException(status_code=400, detail="No valid texts provided")
        
        results = classifier.classify_batch(valid_texts)
        
        return BatchResponse(
            results=[SentimentResponse(**result) for result in results],
            total_processed=len(results)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch classification failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": classifier is not None,
        "tensorflow_version": tf.__version__,
        "model_classes": list(classifier.label_encoder.classes_) if classifier else None
    }

# # Optional: Add a quick test endpoint
# @app.post("/test")
# async def test_classification():
#     """Test endpoint with sample Arabic texts"""
#     sample_texts = [
#         "هذه الشركة ممتازة وأنصح بالعمل بها",
#         "الإدارة سيئة جداً والراتب قليل",
#         "الشركة عادية، لا بأس بها"
#     ]
    
#     try:
#         results = classifier.classify_batch(sample_texts)
#         return {
#             "message": "Test completed successfully",
#             "results": results
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")

if __name__ == "__main__":
    # Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting Arabic Sentiment Analysis API on {HOST}:{PORT}")
    print(f"📂 Model path: {os.getenv('MODEL_PATH', './arabic_sentiment_model/')}")
    print(f"📖 Documentation: http://{HOST}:{PORT}/docs")
    
    uvicorn.run(
        "main:app",  # Change this to your filename if different
        host=HOST,
        port=PORT,
        reload=False,  # Set to True for development
        workers=1  # Single worker to avoid loading model multiple times
    )