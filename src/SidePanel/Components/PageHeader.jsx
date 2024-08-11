import React from 'react';
import { Link, ChevronLeft, ExternalLink } from 'lucide-react';

const PageHeader = ({ page, onBack }) => {
    return (
        <div className='container'>
            <div className="page-header">
                <div className="page-header-left">
                    <button onClick={onBack} className="back-button">
                    <ChevronLeft size={16} />
                    </button>
                    <div className='body-regular'>{page.title}</div>
                </div>
                <a 
                    href={page.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="page-link"
                >
                    <ExternalLink size={15} />
                </a>
            </div>
        </div>
    );    
};

export default PageHeader;