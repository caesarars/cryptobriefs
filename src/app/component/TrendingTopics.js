'use client';

import { useState, useEffect } from 'react';
import { api } from "../lib/backend";

const TopicTag = ({ topic, onTopicClick }) => (
  <button 
    type="button"
    onClick={() => onTopicClick(topic)}
    className="topic-chip"
  >
    {topic}
  </button>
);

const TrendingTopics = ({ onTopicSelect }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(api('/api/news/trending'));
        if (!response.ok) {
          throw new Error('Failed to fetch trending topics');
        }
        const result = await response.json();
        if (Array.isArray(result.data)) {
            setTopics(result.data);
        } else {
            setTopics([]);
        }
      } catch (error) {
        console.error("Trending fetch error:", error);
        setTopics([]); 
      }
      setLoading(false);
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="topics-panel">
        <h5 className="topics-title">Trending now</h5>
        <div className="topics-wrap">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="topic-chip topic-chip-loading"></span>
          ))}
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="topics-panel">
      <h5 className="topics-title">Trending now</h5>
      <div className="topics-wrap">
        {topics.map(topic => (
          <TopicTag key={topic} topic={topic} onTopicClick={onTopicSelect} />
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
