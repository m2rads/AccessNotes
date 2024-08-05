import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FileIcon } from '../../Icons/FileIcon';
import { ChevronRight } from 'lucide-react';

export const PageItem = ({ page, onClick, onDrop, isCircularReference, subpages, allPages }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'PAGE',
        item: { id: page.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'PAGE',
        canDrop: (item) => !isCircularReference(item.id, page.id) && item.id !== page.id,
        drop: (item, monitor) => {
            if (!monitor.didDrop()) {
                console.log(`Dropping ${item.id} onto ${page.id}`);
                onDrop(item.id, page.id);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const dragDropRef = useCallback((node) => {
        drag(node);
        drop(node);
    }, [drag, drop]);

    const isActive = isOver && canDrop;

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div ref={dragDropRef}>
            <div 
                className={`file-item ${isDragging ? 'dragging' : ''} ${isActive ? 'drop-target' : ''}`}
                onClick={() => onClick(page)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className='file-icon' style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B7B6B4' }}>
                    {subpages && subpages.length > 0 ? (
                        <ChevronRight
                            size={16}
                            onClick={toggleExpand}
                            style={{
                                cursor: 'pointer',
                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.3s ease',
                                opacity: isHovered ? 1 : 0,
                            }}
                        />
                    ) : null}
                    {(!isHovered || !subpages || subpages.length === 0) && (
                        <div style={{ opacity: isHovered && subpages && subpages.length > 0 ? 0 : 1, transition: 'opacity 0.3s ease' }}>
                            <FileIcon />
                        </div>
                    )}
                </div>
                <div className={`file-item-title file-icon ${isHovered ? 'label-emphasised' : 'label'}`} style={{ marginLeft: '8px' }}>
                    {page.title}
                </div>
            </div>
            {isExpanded && subpages && subpages.length > 0 && (
                <div className="subpages" style={{ marginLeft: '20px' }}>
                    {subpages.map(subpage => (
                        <PageItem 
                            key={subpage.id}
                            page={subpage}
                            onClick={onClick}
                            onDrop={onDrop}
                            isCircularReference={isCircularReference}
                            subpages={allPages.filter(p => p.parentId === subpage.id)}
                            allPages={allPages}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};