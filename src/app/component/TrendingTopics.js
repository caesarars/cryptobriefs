// Filename: TrendingTopics.js

'use client';

import { useState, useEffect } from 'react';

const TopicTag = ({ topic, onTopicClick }) => (
  <button 
    onClick={() => onTopicClick(topic)}
    className="btn btn-outline-primary btn-sm me-2 mb-2"
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
        const response = await fetch('https://ces.dbrata.my.id/api/news/trending');
        if (!response.ok) {
          throw new Error('Failed to fetch trending topics');
        }
        const result = await response.json();
        console.log(result.data)
        console.log(Array.isArray(result.data))
        // Pastikan result.data adalah array sebelum di-set
        if (Array.isArray(result.data)) {
            setTopics(result.data);
        } else {
            // Jika format tidak sesuai, set ke array kosong untuk mencegah error
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

  // ✅ 1. KEMBALIKAN LOGIKA LOADING
  // Tampilkan placeholder yang informatif saat data sedang diambil.
  if (loading) {
    return (
      <div className="mb-4">
        <h5 className="fw-bold mb-3">Trending Now:</h5>
        <div>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="btn btn-outline-secondary btn-sm me-2 mb-2 disabled placeholder col-1"></span>
          ))}
        </div>
      </div>
    );
  }

  // ✅ 2. KEMBALIKAN LOGIKA EMPTY STATE
  // Jangan render apapun jika tidak ada topik yang tren. Ini membuat UI lebih bersih.
  if (topics.length === 0) {
    return null;
  }

  // ✅ 3. TAMPILKAN HASIL JIKA SEMUA BERHASIL
  return (
    <div className="mb-4">
      <h5 className="fw-bold mb-3">Trending Now:</h5>
      <div>
        {topics.map(topic => (
          <TopicTag key={topic} topic={topic} onTopicClick={onTopicSelect} />
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
