import React, { useRef, useState } from 'react';
import './Dragable.css';

const Dragable = () => {
    const [dragging, setDragging] = useState(false); //at the beginning the ddragging is off
    const [taskPosition, setTaskPosition] = useState({ left: -200, top: 0 }); //this is the test task box gonna need changes
    const [dropAreas, setDropAreas] = useState([ //drop areas where we will be storing tasks
        { id: "dropArea1", left: 0 },
    ]);

    const handleDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.setData("text", e.target.id); //sets the id of the task box
    };

    const handleDragOver = (e) => {
        e.preventDefault(); //by preventing the default we allow the dropping
    };

    const handleDrop = (e, dropAreaId) => {
        e.preventDefault();

        //containers pos
        const container = document.querySelector(".container");
        const containerRect = container.getBoundingClientRect();

        //by getting the id od drop area we get the pos of the drop area pos
        const dropArea = document.getElementById(dropAreaId).getBoundingClientRect();
        const draggedTaskId = e.dataTransfer.getData("text");
        const draggedTask = document.getElementById(draggedTaskId);

        // pos of the dropped task basically rn at the top but 
        const offsetX = (dropArea.width / 2) - (draggedTask.offsetWidth / 2);
        const offsetY = (dropArea.height / 2) - (draggedTask.offsetHeight);

        //continer offset relative to the page
        const containerOffsetX = dropArea.left - containerRect.left;
        const containerOffsetY = dropArea.top - containerRect.top;

        //update the task pos
        setTaskPosition({
            left: containerOffsetX + offsetX,
            top: containerOffsetY + offsetY
        });

        draggedTask.style.position = 'absolute';
        draggedTask.style.left = `${containerOffsetX + offsetX}px`;
        draggedTask.style.top = `${containerOffsetY + offsetY}px`;
    };

    const addDropArea = () => {
        //positinoning the new drop area's pos
        const col = 3;
        const gap = 200; //this should be wid and height of the drop box STC

        const newDropAreaLeft = (dropAreas.length%col) * gap;
        const newDropAreaTop = Math.floor(dropAreas.length/col) * gap;

        const newDropAreaId = `dropArea${dropAreas.length + 1}`;

        // adding the new drop area to the state
        setDropAreas([...dropAreas, { id: newDropAreaId, left: newDropAreaLeft, top: newDropAreaTop}]);
    };

    return (
        <div className="container">
            {/*task box*/}
            <div
                id="dragBox"
                className={`task ${dragging ? "dragging" : ""}`}
                draggable
                onDragStart={handleDragStart}
                style={{ left: `${taskPosition.left}px`, top: `${taskPosition.top}px`, position: 'absolute' }}
            >
                Drag Me
            </div>

            {/*drop areas*/}
            {dropAreas.map((dropArea) => (
                <div
                    key={dropArea.id}
                    id={dropArea.id}
                    className="drop-area"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dropArea.id)} // Handle drop for each drop area
                    style={{ left: `${dropArea.left}px`, top: `${dropArea.top}px` }}
                >
                    Drop Here {dropArea.id}
                </div>
            ))}
            
            {/*add button*/}
            <button onClick={addDropArea}
            style={{
                width: '200px',
                height: '200px'
            }}
            >Add Drop Area</button>
        </div>
    );
};

export default Dragable;
