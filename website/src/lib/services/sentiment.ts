// Sentiment Analysis Service Integration
interface SentimentRequest {
  text: string;
  language?: 'ar' | 'en';
  platform?: 'whatsapp' | 'messenger' | 'chat';
}

interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export class SentimentService {
  private static baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  private static requestQueue: Array<() => Promise<unknown>> = [];
  private static isProcessing = false;
  private static maxConcurrentRequests = 3;
  private static currentRequests = 0;

  // Rate limiting and request queuing to prevent overwhelming the FastAPI service
  private static async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0 && this.currentRequests < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      if (request) {
        this.currentRequests++;
        request().finally(() => {
          this.currentRequests--;
        });
      }
    }
    
    this.isProcessing = false;
    
    // Continue processing if there are more requests
    if (this.requestQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private static async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  static async analyzeSentiment(request: SentimentRequest): Promise<SentimentResponse> {
    return this.queueRequest(async () => {
      try {        console.log(`Analyzing sentiment for text: "${request.text.substring(0, 50)}..."`);
        
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
        
        try {
          const response = await fetch(`${this.baseUrl}/classify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: request.text
            }),
            signal: controller.signal
          });

          if (!response.ok) {
            throw new Error(`Sentiment analysis failed: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();
          console.log('FastAPI response:', result);
          
          // Map the FastAPI response to our format
          // FastAPI returns: {"predicted_class": "positive", "confidence": 0.98866206407547, "all_probabilities": {"0": neg, "1": neu, "2": pos}}
          
          let mappedSentiment: 'positive' | 'negative' | 'neutral';
          
          // Handle if FastAPI returns the actual class name
          if (result.predicted_class === 'positive' || result.predicted_class === 'negative' || result.predicted_class === 'neutral') {
            mappedSentiment = result.predicted_class;
          } else {
            // Handle if it returns numeric labels - need to map them
            // Based on all_probabilities structure: 0=negative, 1=neutral, 2=positive (common mapping)
            mappedSentiment = 'neutral'; // default fallback
          }
          
          // Extract probability scores if available
          let scores = {
            positive: 0.33,
            negative: 0.33,
            neutral: 0.34
          };
          
          if (result.all_probabilities) {
            scores = {
              negative: result.all_probabilities["0"] || 0,
              neutral: result.all_probabilities["1"] || 0,
              positive: result.all_probabilities["2"] || 0
            };
          }
          
          const sentimentResult = {
            sentiment: mappedSentiment,
            confidence: result.confidence,
            scores: scores
          };
          
          console.log('Mapped sentiment result:', sentimentResult);
          return sentimentResult;
          
        } finally {
          clearTimeout(timeoutId);
        }
        
      } catch (error) {
        console.error('Sentiment analysis error:', error);
        
        // Fallback to neutral sentiment if API fails
        const fallbackResult = {
          sentiment: 'neutral' as const,
          confidence: 0.5,
          scores: {
            positive: 0.33,
            negative: 0.33,
            neutral: 0.34
          }
        };
        
        console.log('Using fallback result:', fallbackResult);
        return fallbackResult;
      }
    });
  }
  static async batchAnalyze(texts: string[]): Promise<SentimentResponse[]> {
    // For batch processing, we'll analyze each text individually to avoid overwhelming the API
    // but use Promise.all with limited concurrency
    try {
      console.log(`Starting batch analysis for ${texts.length} texts`);
      
      // Process texts in smaller batches to avoid overwhelming the API
      const batchSize = 5;
      const results: SentimentResponse[] = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
        
        const batchPromises = batch.map(text => 
          this.analyzeSentiment({ text })
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to prevent overwhelming the API
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      console.log(`Completed batch analysis for ${results.length} texts`);
      return results;
      
    } catch (error) {
      console.error('Batch sentiment analysis error:', error);
      
      // Return neutral sentiments for all texts if API fails
      return texts.map(() => ({
        sentiment: 'neutral' as const,
        confidence: 0.5,
        scores: { positive: 0.33, negative: 0.33, neutral: 0.34 }
      }));
    }
  }
}
