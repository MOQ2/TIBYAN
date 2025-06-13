// Test script to debug the sentiment analysis
import { SentimentService } from './src/lib/services/sentiment.js';

async function testSentiment() {
  const testTexts = [
    'السلام عليكم، أريد المساعدة في فهم فاتورتي',
    'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً بك. سأكون سعيدة لمساعدتك',
    'شكراً لك، الخدمة ممتازة جداً',
    'أنا غاضب جداً من هذه الخدمة السيئة',
    'الموضوع عادي، لا أعرف'
  ];

  console.log('Testing sentiment analysis...');
  console.log('FastAPI should be running on http://localhost:8000');
  
  for (const text of testTexts) {
    try {
      console.log(`\nAnalyzing: "${text}"`);
      const result = await SentimentService.analyzeSentiment({ text });
      console.log(`Result: ${result.sentiment} (confidence: ${result.confidence.toFixed(3)})`);
      console.log(`Scores: +${result.scores.positive.toFixed(3)} -${result.scores.negative.toFixed(3)} ~${result.scores.neutral.toFixed(3)}`);
    } catch (error) {
      console.error(`Error analyzing "${text}":`, error);
    }
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testSentiment().catch(console.error);
