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
  let r = calcZoom(length, height);

  function handleFork(array,x,y,properties) {
    let l = array.length;
    // calculate the integer division of the length of the array
    let half = l/2 ;
    let nodesRendered = [];
    for (let j = 0; j < l; j++) {
      let place = j - half + 0.5;
      const new_nodes = calculateNodes(array[j], x, y + properties.varY*place);
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

function getLasts(order){
  // return the list of last slides
  let lasts = [];
  let l = order[order.length-1];
  if (Array.isArray(l)) {
    for(let j = 0; j < l.length; j++) {
      lasts = lasts.concat(getLasts(l[j]));
    }
  } else {
    lasts = [l];
  }
  return lasts;
}

function getPrevious(order,currentSlide){
  // return the list of immediate previous slides
  let previous = [];
  for (let i = 0; i < order.length; i++) {
    if (Array.isArray(order[i])) {
      pr = [];
      for(let j = 0; j < order[i].length; j++) {
        p = getPrevious(order[i][j],currentSlide);
        if(p.length > 0){
          return p;
        }else{
          pr.extend(getLasts(order[i][j]));
        }
      }
      previous = pr;
    } else {
      if (order[i] === currentSlide) {
        return previous;
      }
      previous = [order[i]];
    }
  }
}

const GraphApp = ({order,slideChanger}) => {
  let properties = {
    startX: 20,
    startY: 20,
    varX: 30,
    varY: 20,
  }
  return (
    <Graph
      structure={order}
      onNodeClick={(nodeId) => slideChanger(nodeId)}
      properties={properties}
    />
  );
};


function Navigation({order, slideChanger}) {
  console.log("Previous of", order[5], "is", getPrevious(order,order[0]));
  // JSX: JavaScript XML
  return <table style={{width:"100%"}}>
    <tr style={{display:"flex"}}>
      <td className="left">
        <span className="prev" onClick={() => {slideChanger(-1)}}>Previous</span>
      </td>
      <td className="middle" nota="InsertNavGraph">
        <div className="graph-container">
          <GraphApp order={order} slideChanger={slideChanger} />
        </div>
      </td>
      <td className="right"><span className="next" onClick={() => {slideChanger(1)}} >Next</span></td>
    </tr>
  </table>
}

export default Navigation;