import React from 'react';

const GraphNode = ({ x, y,id, onClick }) => (
  <circle 
    cx={x}
    cy={y} 
    r="5" 
    className="dot" 
    id={"dot_"+id}
    onClick={onClick}
  />
);

const Graph = ({ structure, onNodeClick, properties }) => {
  
  const length = structure.length;
  const height = calcHeight(structure);
  console.log("Height: ", height);
  console.log("Length: ", length);
  let r = calcZoom(length, height);
  console.log("Zoom: ", r);

  function handleFork(array,x,y,properties) {
    let l = array.length;
    // calculate the integer division of the length of the array
    let half = l/2 ;
    let nodesRendered = [];
    for (let j = 0; j < l; j++) {
      let place = j - half + 0.5;
      const new_nodes = calculateNodes(array[j], x + properties.varX, y + properties.varY*place);
      nodesRendered = nodesRendered.concat(new_nodes);
    }
    return nodesRendered
  }

  const calculateNodes = (nodes, x, y) => {
    // Recursive function to render nodes and paths
    let nodesRendered = [];
    for(let i = 0; i < nodes.length; i++) {
      if (Array.isArray(nodes[i])) {
        const nds = handleFork(nodes[i],x,y,properties);
        nodesRendered = nodesRendered.concat(nds);
        // get the node with the maximum x value
        let max_x = 0;
        for (let j = 0; j < nds.length; j++) {
          let node = nds[j];
          let x = node.x;
          if (x > max_x) {
            max_x = x;
          }
        }
        console.log("Max X: ", max_x);
        x = max_x + properties.varX;
      } else {
        const node = nodes[i];
        nodesRendered.push(
          {
            id: node,
            x: x,
            y: y
          }
        );
        x += properties.varX;
      }
    }
    return nodesRendered;
  };

  const renderNodes = (nodes) => {
    // get the nodes to render
    const nodesToRender = calculateNodes(nodes, properties.startX, properties.startY);

    return nodesToRender.map((node) => (
      <GraphNode
        key={node.id}
        x={node.x}
        y={node.y}
        id={"dot_"+node.id}
        onClick={() => onNodeClick(node.id)}
      />
    ));
  }

  return (
    <svg width="100%" height="100%" className="graph">
      {renderNodes(structure, properties.startX, properties.startY)}
    </svg>
  );
};

function calcHeight(structure) {
  let st = [];
  let height = 0;
  for (let i = 0; i < structure.length; i++) {
    if (Array.isArray(structure[i])) {
      let new_h = structure[i].length;
      for (let j = 0; j < structure[i].length; j++) {
        new_h += calcHeight(structure[i][j]);
      }
      height = new_h
    }
    st.push(height);
  }
  // return the maximum height in the array
  return Math.max(...st);
}

function calcZoom(length, height) {
  return 1
}

const GraphApp = () => {
  const graphStructure = ["N1", "N2", [["N3", "N4", "N5"], ["N5"]] , [["N6"],["N7"]] , "N8"];
 
  let properties = {
    startX: 20,
    startY: 20,
    varX: 30,
    varY: 20,
  }
  return (
    <Graph
      structure={graphStructure}
      onNodeClick={(nodeId) => console.log(nodeId)}
      properties={properties}
    />
  );
};


function Navigation({slideChanger}) {
    // JSX: JavaScript XML
    return <table style={{width:"100%"}}>
    <tr style={{display:"flex"}}>
      <td className="left">
        <span className="prev" onClick={() => {slideChanger(-1)}}>Previous</span>
      </td>
      <td className="middle" nota="InsertNavGraph">
        <div className="graph-container">
          <GraphApp />
        </div>
      </td>
      <td className="right"><span className="next" onClick={() => {slideChanger(1)}} >Next</span></td>
    </tr>
  </table>
}

export default Navigation;