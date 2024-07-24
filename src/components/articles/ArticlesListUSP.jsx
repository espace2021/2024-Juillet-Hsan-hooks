import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tot, setTot] = useState(0);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || 5);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const fetchArticles = async (page, limit) => {
    try {
      const response = await fetch(`http://localhost:3002/api/articles/art/paginationUSP?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
      const data = await response.json();
      setArticles(data.results.results);
      setTot(data.tot);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    
    fetchArticles(page, limit);
  }, [searchParams, limit]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, limit, q: searchQuery });
  };

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(tot / limit);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer', background: i === currentPage ? '#007bff' : '#fff', color: i === currentPage ? '#fff' : '#007bff' }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleSearchChange= (event) => {
    setSearchQuery(event.target.value);
    setSearchParams({ page: 1, limit, q: event.target.value });
    fetchArticles(1, limit);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setSearchParams({ page: 1, limit: newLimit, q: searchQuery });
    setLimit(newLimit);
  };

  return (
    <div>
      <div> 
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => handleSearchChange(event)}
        />
      </div>   
  
      <div>
        <ul>
          {articles.map(article => (
            <li key={article._id}>{article.designation}</li>
          ))}
        </ul>
        <div style={{ "display": "flex", "justifyContent": "right"}}> 
          <div className="limit-selector-container">
            <label>
              Afficher &nbsp;
              <select
                value={limit}
                onChange={(event) => handleLimitChange(event)}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage <= 1}
              style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Previous
            </button>
            {renderPageNumbers()}
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage >= totalPages}
              style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
