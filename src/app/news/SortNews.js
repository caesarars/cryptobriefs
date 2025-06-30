// Filename: SortNews.js

'use client';

const SortNews = ({ onHandleSort }) => {
  // This function is called every time the user changes the dropdown selection
  const handleChange = (event) => {
    const newSortValue = event.target.value;
    // Calls the function passed from the parent component with the new value
    onHandleSort(newSortValue);
  };

  return (
    <div className="d-flex align-items-center mt-4" style={{ width: '250px' }}>
      <select 
        id="sort-select" 
        className="form-select" 
        onChange={handleChange}
        defaultValue="latest" // The default selected value on initial render
      >
        <option value="latest">Latest</option>
        <option value="positive">Positive Sentiment</option>
        <option value="negative">Negative Sentiment</option>
      </select>
    </div>
  );
};

export default SortNews;