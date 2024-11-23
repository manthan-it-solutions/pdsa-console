import React, { useState, useEffect } from 'react';
import "../css/managebot.css";
import AddIcon from "../Assets/images/plus.png";
import deleteIcon from "../Assets/images/delete.png";
import homeIcon from "../Assets/images/home_icon.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Managebot = () => {
  const [structure, setStructure] = useState([]);
  const [parentQuestion, setParentQuestion] = useState('');
  const [parentAnswer, setParentAnswer] = useState('');

  // Add a child node to a specific parent or to the root if no parent is provided
  const handleAddChild = (parent, parentQuestion, parentAnswer) => {
    const newChild = { question: parentQuestion, answer: parentAnswer, children: [] };
    if (parent) {
      parent.children.push(newChild);
      setStructure([...structure]); // Trigger re-render
    } else {
      setStructure([...structure, newChild]); // Trigger re-render
    }
  };

  // Remove a child node from a parent or from the root if no parent is provided
  const handleDeleteChild = (parent, index) => {
    if (parent) {
      // Removing a child from a parent
      parent.children.splice(index, 1);
      setStructure([...structure]); // Trigger re-render
    } else {
      // Removing a top-level item
      const updatedStructure = [...structure];
      updatedStructure.splice(index, 1);
      setStructure(updatedStructure); // Trigger re-render
    }
  };

  // Recursively render tree rows
  const renderTreeRows = (children, parent = null) => {
    if (children.length === 0) return null;

    return (
      <div className="tree-row">
        {children.map((child, index) => (
          <div className="tree-item" key={index}>
            <div className="Item_parent">
          <input
            type="text"
            placeholder="Question Title"
            value=""
            className="form-control QuestionInput"
          />
              <input
                type="text"
                placeholder="Question"
                value={child.question}
                onChange={(e) => {
                  child.question = e.target.value;
                  setStructure([...structure]); // Trigger re-render
                }}
                className="form-control QuestionInput"
              />
              <div className="Bot_group">
                <select
                  name="Qtype"
                  id="Qtype"
                >
                  <option value="">Question Type</option>
                  <option value="textsms">Text SMS</option>
                  <option value="pdf">PDF</option>
                  <option value="media">Media</option>
                </select>
              </div>
              <textarea name="Answer" id="Answer" placeholder='Answer' rows={3} className="form-control"></textarea>
             
             <div className='IputBtn_contain'>
             <button
                type="button"
                className="AddBtn"
                onClick={() => handleAddChild(child, child.question, child.answer)}
              >
                <img src={AddIcon} alt="Add" />
              </button>
              <button
                type="button"
                className="DeleteBtn"
                onClick={() => handleDeleteChild(parent, index)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
             </div>
            </div>
            {renderTreeRows(child.children, child)}
          </div>
        ))}
      </div>
    );
  };


  
  const setTreeRowStyles = () => {
    const rows = document.querySelectorAll('.tree-row');
  
    if (rows.length === 0) return;
  
    // Get the first row
    const firstRow = rows[0];
    console.log(firstRow, "first row");
  
    // Get the first item in the first row
    const firstItem = firstRow.querySelector(':scope > .tree-item');
    if (firstItem) {
      const firstItemWidth = firstItem.offsetWidth;
      console.log(firstItemWidth, "first item's width");
      document.documentElement.style.setProperty('--tree-width', `${firstItemWidth}px`);
      // Get window width
  const windowWidth = window.innerWidth;
  console.log(windowWidth, "window width");
  document.documentElement.style.setProperty('--window-width', `${windowWidth}px`);
      // Check if the first item width is greater than 1304px
      if (firstItemWidth > 1304) {
        const treeElement = document.querySelector('.tree');
        if (treeElement) {
          treeElement.classList.add('Maximum');
        }
      }
    } else {
      console.log("No items found in the first row.");
    }

 // Check if .ManageBot_contain's height is greater than 80vh
 const manageBotContain = document.querySelector('.tree');
 if (manageBotContain) {
   const elementHeight = manageBotContain.offsetHeight;
   const viewportHeight = window.innerHeight;
   const thresholdHeight = 0.7 * viewportHeight; // 80% of viewport height

   console.log(elementHeight, "element height");
   console.log(thresholdHeight, "80% of viewport height");

   // Set the custom property based on the height comparison
   if (elementHeight > thresholdHeight) {
     document.documentElement.style.setProperty('--manage-bot-height', '5px');
   } else {
     document.documentElement.style.setProperty('--manage-bot-height', '0px');
   }
 } else {
   console.log(".ManageBot_contain not found.");
 }
  
    rows.forEach(row => {
      const items = Array.from(row.querySelectorAll(':scope > .tree-item'));
      const itemCount = items.length;
      if (itemCount === 0) return;
  
      const itemWidths = items.map(item => item.offsetWidth);
      const itemWidth = itemWidths[0];
      const lastItemWidth = itemWidths[itemCount - 1];
      const rowWidth = row.offsetWidth;
      const leftWidth = itemWidth;
  
      row.style.setProperty('--item-width', `${itemWidth}px`);
      row.style.setProperty('--last-item-width', `${lastItemWidth}px`);
      row.style.setProperty('--row-width', `${rowWidth}px`);
      row.style.setProperty('--left-width', `${leftWidth}px`);
    });
  };
  
  // Call the function to test it
  setTreeRowStyles();
  
  

  useEffect(() => {
    setTreeRowStyles();
  }, [structure]);

  return (
    <section id='ManageBot'>
      <div className="ManageBot_header">
        <div className='d-flex'><Link to="/createbot"> <img src={homeIcon} alt="icon"  className='HomeIcon'/></Link>
        <h4>Manage bot</h4>
        </div>
        <h4>Bot Id: 1001</h4>
        <button className='GenerateBot'>Generate Bot</button>
      </div>
      <div className="ManageBot_contain">
      <div className="First_roW">
        <div className="parent-inputs  justify-content-center First_roW_child">
          <input
            type="text"
            placeholder="Question Title"
            value=""
            className="form-control QuestionInput"
          />
          <input
            type="text"
            placeholder="Question"
            value={parentQuestion}
            onChange={(e) => setParentQuestion(e.target.value)}
            className="form-control QuestionInput"
          />
          <div className="Bot_group">
            <select
              name="Qtype"
              id="Qtype"
            >
              <option value="">Question Type</option>
              <option value="textsms">Text SMS</option>
              <option value="pdf">PDF</option>
              <option value="media">Media</option>
            </select>
          </div>
          <textarea name="Answer" id="Answer" placeholder='Answer' rows={3}
            className="form-control"></textarea>
          <button type="button" className="AddBtn" onClick={() => handleAddChild(null, parentQuestion, parentAnswer)}>
            <img src={AddIcon} alt="Add" />
          </button>
        </div>
        </div>

        {/* Render the hierarchical structure in rows */}
        <div className="tree">
          {renderTreeRows(structure)}
        </div>
      </div>
    </section>
    
  
  );
};

export default Managebot;


