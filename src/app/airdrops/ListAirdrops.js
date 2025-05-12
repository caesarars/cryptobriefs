"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const ListAirdrops = () => {
    const [airdrops, setAirdrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const formatPublishedDate = (dateString) => {
        if (!dateString) return "-";

        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const hour = dateString.substring(8, 10);
        const minute = dateString.substring(10, 12);

        const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}`);

        return dateObj.toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getTemperatureBadge = (temperature) => {
        const temp = parseInt(temperature, 10);
      
        if (isNaN(temp)) return null; // Kalau temperature invalid
      
        if (temp >= 70) {
          return <span className="badge bg-danger mb-2">🔥 Hot</span>; // Merah
        } else if (temp >= 40) {
          return <span className="badge bg-warning text-dark mb-2">🌡️ Warm</span>; // Kuning
        } else {
          return <span className="badge bg-primary mb-2">❄️ Cool</span>; // Biru
        }
      };

    useEffect(() => {
        const fetchAirdrops = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://crypto-blog-backend.vercel.app/api/airdrops/list', {
                    params: {
                        page,
                        limit,
                        search
                    }
                });
                setAirdrops(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('❌ Error fetching airdrops:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAirdrops();
    }, [page, limit, search]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1); // Reset to page 1 when a new search is performed
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="container my-5">
            <div className="mb-4 mt-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search airdrops"
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {loading ? (
                    <div className="col-12 general-font">Loading...</div>
                ) : (
                    airdrops.map((airdrop) => (
                        <div className="col col-12 col-sm-6 col-md-4 col-lg-3 general-font" key={airdrop._id}>
                            <div 
                                className="card h-100"
                                style={{
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', 
                                    border: 'none',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                }}
                            >
                                <img 
                                    loading="lazy"
                                    src={airdrop.image} 
                                    className="card-img-top" 
                                    alt={airdrop.title} 
                                    style={{ height: '200px', objectFit: 'cover' }} 
                                />
                                
                                <div className="card-body d-flex flex-column">
                                    <span>{getTemperatureBadge(airdrop.temperature)}</span>
                                    <h5 className="card-title mb-3 general-font">{airdrop.title}  </h5>
                                    <p className="card-text"><strong>Action</strong> <br></br>{airdrop.action ?? "-"}</p>
                                    <p className="card-text"><strong>Desc</strong><br></br>{airdrop.shortDescription ?? "-"}</p>
                                    <p className="card-text">
                                        <span><strong>Published:</strong> <br></br>{formatPublishedDate(airdrop.publishedDate)}</span>
                                    </p>
                                    <a className="btn btn-glow mt-auto"
                                        href={airdrop.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                    >
                                        Visit Source
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="d-flex justify-content-center mt-4 mb-4 p-5">
            <div className="align-items-end">
                <button 
                        className="btn btn-primary"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2 align-items-center">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        className="btn btn-primary"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
            </div>
            </div>
        </div>
    );
};

export default ListAirdrops;
