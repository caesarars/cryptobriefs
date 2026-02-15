"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AirdropsPage.css";
import { api } from "../lib/backend";

const ListAirdrops = () => {
    const [airdrops, setAirdrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 20;
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

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
      
        if (isNaN(temp)) return { label: "Unknown", className: "temp-unknown" };
      
        if (temp >= 70) {
          return { label: "Hot", className: "temp-hot" };
        } else if (temp >= 40) {
          return { label: "Warm", className: "temp-warm" };
        } else {
          return { label: "Cool", className: "temp-cool" };
        }
    };

    const sourceHostname = (url) => {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return "source";
        }
    };

    useEffect(() => {
        const fetchAirdrops = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(api('/api/airdrops/list'), {
                    params: {
                        page,
                        limit,
                        search
                    }
                });
                setAirdrops(Array.isArray(response.data.data) ? response.data.data : []);
                setTotalPages(Number(response.data.totalPages) || 1);
            } catch (error) {
                console.error("Error fetching airdrops:", error);
                setError("Failed to load airdrops. Please try again.");
                setAirdrops([]);
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
        <div className="container airdrops-content">
            <div className="airdrops-toolbar">
                <input
                    type="text"
                    className="form-control airdrops-search"
                    placeholder="Search by project or keyword..."
                    value={search}
                    onChange={handleSearch}
                />
                <div className="airdrops-meta general-font">
                    {loading ? "Loading..." : `${airdrops.length} results on this page`}
                </div>
            </div>

            {error ? (
                <div className="airdrops-state airdrops-state-error general-font">{error}</div>
            ) : null}

            {loading ? (
                <div className="airdrops-grid">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="airdrop-card airdrop-skeleton" />
                    ))}
                </div>
            ) : airdrops.length === 0 ? (
                <div className="airdrops-state general-font">
                    No airdrops found. Try a different keyword.
                </div>
            ) : (
                <div className="airdrops-grid">
                    {airdrops.map((airdrop) => {
                        const tempBadge = getTemperatureBadge(airdrop.temperature);
                        return (
                            <article className="airdrop-card general-font" key={airdrop._id}>
                                <div className="airdrop-image-wrap">
                                    <img 
                                        loading="lazy"
                                        src={airdrop.image} 
                                        className="airdrop-image" 
                                        alt={airdrop.title}
                                    />
                                    <span className={`airdrop-temp ${tempBadge.className}`}>{tempBadge.label}</span>
                                </div>
                                <div className="airdrop-body">
                                    <h3 className="airdrop-title">{airdrop.title}</h3>
                                    <p className="airdrop-action"><strong>Action:</strong> {airdrop.action ?? "-"}</p>
                                    <p className="airdrop-desc">{airdrop.shortDescription ?? "-"}</p>
                                    <div className="airdrop-footer">
                                        <span className="airdrop-date">{formatPublishedDate(airdrop.publishedDate)}</span>
                                        <span className="airdrop-source">{sourceHostname(airdrop.sourceUrl)}</span>
                                    </div>
                                    <a className="btn btn-glow airdrop-cta"
                                        href={airdrop.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                    >
                                        View source
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <div className="airdrops-pagination">
                <button 
                        className="btn airdrops-page-btn"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1 || loading}
                    >
                        Previous
                </button>
                <span className="airdrops-page-info general-font">
                    Page {page} of {totalPages}
                </span>
                <button 
                        className="btn airdrops-page-btn"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || loading}
                    >
                        Next
                </button>
            </div>
        </div>
    );
};

export default ListAirdrops;
