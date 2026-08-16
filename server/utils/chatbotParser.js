const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/chatbotknowledgebase.json');

// ─── Read knowledge base ──────────────────────
const readKnowledgeBase = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      return { intents: [] };
    }
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return { intents: [] };
  }
};

// ─── Extract keywords from user message ──────
const extractKeywords = (message) => {
  const text = message.toLowerCase();
  const stopWords = ['i', 'me', 'my', 'you', 'your', 'he', 'she', 'it', 'we', 'they',
                     'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                     'do', 'does', 'did', 'have', 'has', 'had', 'can', 'will', 'would',
                     'could', 'should', 'may', 'might', 'must', 'for', 'to', 'of', 'with',
                     'on', 'at', 'from', 'by', 'in', 'about', 'like', 'through', 'over',
                     'before', 'after', 'between', 'among', 'without', 'but', 'so', 'or', 'and'];
  const words = text.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));
  return words;
};

// ─── Score intents based on keyword matches ──
const scoreIntents = (keywords, intents) => {
  const results = [];
  for (const intent of intents) {
    let score = 0;
    const matched = [];
    for (const keyword of intent.keywords) {
      const kw = keyword.toLowerCase();
      if (keywords.some(k => k.includes(kw) || kw.includes(k))) {
        score++;
        matched.push(keyword);
      }
    }
    if (score > 0) {
      results.push({ ...intent, score, matched });
    }
  }
  return results.sort((a, b) => b.score - a.score);
};

// ─── Extract contextually relevant replies ──
const extractContext = (message, intent) => {
  const text = message.toLowerCase();
  const contextReplies = [];
  if (intent.context) {
    for (const [key, value] of Object.entries(intent.context)) {
      if (text.includes(key.toLowerCase())) {
        contextReplies.push(value);
      }
    }
  }
  return contextReplies;
};

// ─── Build final response ────────────────────
const buildResponse = (intent, contextReplies) => {
  let response = intent.reply;
  if (contextReplies.length > 0) {
    response += ' ' + contextReplies.join(' ');
  }
  response += ' Is there anything else I can help with?';
  return response;
};

// ─── Main parser function ─────────────────────
const parseAndReply = (message) => {
  const data = readKnowledgeBase();
  const intents = data.intents || [];

  const keywords = extractKeywords(message);
  const matches = scoreIntents(keywords, intents);

  if (matches.length === 0 || matches[0].score === 0) {
    const defaultIntent = intents.find(i => i.id === 'default');
    return defaultIntent ? defaultIntent.reply : "I'm not sure how to respond.";
  }

  const bestMatch = matches[0];
  const contextReplies = extractContext(message, bestMatch);
  return buildResponse(bestMatch, contextReplies);
};

module.exports = { parseAndReply };