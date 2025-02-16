import React, { useState } from 'react';
import './Dragable.css';

const Dragable = () => {
    const [dragging, setDragging] = useState(false);
    const [boxPosition, setBoxPosition] = useState({ left: -200, top: 0 }); // Global position for the box
    const [dropAreas, setDropAreas] = useState([
        { id: "dropArea1", left: 0 }, // Initial drop area with left position
    ]);

    const handleDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.setData("text", e.target.id); // Set the dragged box ID
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow dropping
    };

    const handleDrop = (e, dropAreaId) => {
        e.preventDefault();

        // Get the container's position (relative to the page)
        const container = document.querySelector(".container");
        const containerRect = container.getBoundingClientRect();

        // Get the drop area position based on the dropAreaId
        const dropArea = document.getElementById(dropAreaId).getBoundingClientRect();
        const draggedBoxId = e.dataTransfer.getData("text");
        const draggedBox = document.getElementById(draggedBoxId);

        // Calculate the position of the dropped box relative to the drop area
        const offsetX = (dropArea.width / 2) - (draggedBox.offsetWidth / 2);
        const offsetY = (dropArea.height / 2) - (draggedBox.offsetHeight / 2);

        // Adjust for the container offset relative to the page
        const containerOffsetX = dropArea.left - containerRect.left;
        const containerOffsetY = dropArea.top - containerRect.top;

        // Update the box position state for the specific drop area
        setBoxPosition({
            left: containerOffsetX + offsetX,
            top: containerOffsetY + offsetY
        });

        draggedBox.style.position = "absolute";
        draggedBox.style.left = `${containerOffsetX + offsetX}px`;
        draggedBox.style.top = `${containerOffsetY + offsetY}px`;
    };

    const addDropArea = () => {
        // Calculate new position for the next drop area
        const newDropAreaLeft = dropAreas.length * 150; // 150px apart
        const newDropAreaId = `dropArea${dropAreas.length + 1}`;

        // Add the new drop area to the state
        setDropAreas([...dropAreas, { id: newDropAreaId, left: newDropAreaLeft }]);
    };

    return (
        <div className="container">
            {/* Draggable Box */}
            <div
                id="dragBox"
                className={`draggable-box ${dragging ? "dragging" : ""}`}
                draggable
                onDragStart={handleDragStart}
                style={{ left: `${boxPosition.left}px`, top: `${boxPosition.top}px`, position: 'absolute' }}
            >
                Drag Me
            </div>

            {/* Existing Drop Areas */}
            {dropAreas.map((dropArea) => (
                <div
                    key={dropArea.id}
                    id={dropArea.id}
                    className="drop-box"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dropArea.id)} // Handle drop for each drop area
                    style={{ left: `${dropArea.left}px`, top: `0px` }}
                >
                    Drop Here {dropArea.id}
                </div>
            ))}

            {/* Button to Add Drop Area */}
            <button onClick={addDropArea}>Add Drop Area</button>
        </div>
    );
};

export default Dragable;
