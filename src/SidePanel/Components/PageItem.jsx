import React, { useState, useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FileIcon } from '../../Icons/FileIcon';
import { ChevronRight } from 'lucide-react';

export const PageItem = ({ page, onClick, onDrop, onReorder, isCircularReference, subpages, allPages }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'PAGE',
        item: { id: page.id, parentId: page.parentId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'PAGE',
        canDrop: (item) => !isCircularReference(item.id, page.id) && item.id !== page.id,
        drop: (item) => {
            onDrop(item.id, page.id);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const [{ isOverTop }, dropTop] = useDrop(() => ({
        accept: 'PAGE',
        canDrop: (item) => !isCircularReference(item.id, page.id) && item.id !== page.id,
        drop: (item) => onReorder(item.id, page.id, 'before', page.parentId),
        collect: (monitor) => ({
            isOverTop: !!monitor.isOver(),
        }),
    }));

    const [{ isOverBottom }, dropBottom] = useDrop(() => ({
        accept: 'PAGE',
        canDrop: (item) => !isCircularReference(item.id, page.id) && item.id !== page.id,
        drop: (item) => onReorder(item.id, page.id, 'after', page.parentId),
        collect: (monitor) => ({
            isOverBottom: !!monitor.isOver(),
        }),
    }));

    const dragDropRef = useCallback((node) => {
        ref.current = node;
        drag(drop(node));
    }, [drag, drop]);

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <div ref={dropTop} style={{ height: '5px', background: isOverTop ? '#6798E1' : 'transparent' }} />
            <div ref={dragDropRef}>
                <div 
                    className={`file-item ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
                    onClick={() => onClick(page)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        opacity: isDragging ? 0.5 : 1,
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
            </div>
            <div ref={dropBottom} style={{ height: '5px', background: isOverBottom ? '#6798E1' : 'transparent' }} />
            {isExpanded && subpages && subpages.length > 0 && (
                <div className="subpages" style={{ marginLeft: '20px' }}>
                    {subpages.map(subpage => (
                        <PageItem
                            key={subpage.id}
                            page={subpage}
                            onClick={onClick}
                            onDrop={onDrop}
                            onReorder={onReorder}
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