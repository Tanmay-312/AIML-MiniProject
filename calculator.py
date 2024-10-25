from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.classify.naivebayes import NaiveBayesClassifier

# Initialize Flask app
app = Flask(__name__)

def get_words_in_tweets(tweets):
    all_words = []
    for (words, sentiment) in tweets:
        all_words.extend(words)
    return all_words

def get_word_features(wordlist):
    wordlist = nltk.FreqDist(wordlist)
    word_features = wordlist.keys()
    return word_features

def read_tweets(fname, t_type):
    tweets = []
    with open(fname, 'r', encoding='utf-8') as f:
        for line in f:
            tweets.append([line, t_type])
    return tweets

def extract_features(document):
    document_words = set(document)
    features = {}
    for word in word_features:
        features['contains(%s)' % word] = (word in document_words)
    return features

def classify_tweet(tweet):
    return classifier.classify(extract_features(nltk.word_tokenize(tweet)))

# Read in positive and negative training tweets
pos_tweets = read_tweets('happy.txt', 'It is not racist/sexist')
neg_tweets = read_tweets('sad.txt', 'It is racist/sexist')

# Filter words that are less than 3 letters to form the training data
tweets = []
for (words, sentiment) in pos_tweets + neg_tweets:
    words_filtered = [e.lower() for e in words.split() if len(e) >= 3]
    tweets.append((words_filtered, sentiment))

# Extract word features from the training data
word_features = get_word_features(get_words_in_tweets(tweets))

# Train the Naive Bayes Classifier
training_set = nltk.classify.util.apply_features(extract_features, tweets)
classifier = NaiveBayesClassifier.train(training_set)

# Enable CORS for all routes and allow requests from your frontend origin
CORS(app, resources={r"/analyze": {"origins": "http://localhost:5173"}})

# Flask route to classify tweets
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    tweet = data['input']
    tweet = tweet.lower()
    # Classify the input tweet
    sentiment = classify_tweet(tweet)
    
    return jsonify({'result': sentiment})

# Main driver function
if __name__ == '__main__':
    app.run(debug=True)