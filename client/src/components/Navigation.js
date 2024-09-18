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
    return nodes.map((node) => (
      <GraphNode
        key={node.id}
        x={node.x}
        y={node.y}
        id={"dot_"+node.id}
        onClick={() => onNodeClick(node.id)}
      />
    ));
  }

  const renderPaths = (nodes,structure) => {
    let paths = [];
    let prevNodes = [];
    const drawPath = (prevNode, node) => {
      return <line
          key={prevNode.id + "-" + node.id}
          x1={prevNode.x}
          y1={prevNode.y}
          x2={node.x}
          y2={node.y}
          className="path"
        />
    }
    const findNode = (id) => {
      return nodes.find((n) => n.id == id);
    }

    for(let i = 0; i < structure.length; i++) {
      if (Array.isArray(structure[i])) {
        for(let j = 0; j < structure[i].length; j++){
          let pthsRndrd = renderPaths(nodes,structure[i][j]);
          paths = paths.concat(pthsRndrd);
        }
        let from_this = getFirsts(structure.slice(i,structure.length));
        for(let j = 0; j < from_this.length; j++){
          // get the current node and its properties
          let node = findNode(from_this[j]);
          for(let k = 0; k < prevNodes.length; k++){
            // get the previous node and its properties
            let prvNode = findNode(prevNodes[k]);
            // create a path between the nodes
            paths.push(drawPath(prvNode,node));
          }
        }
        prevNodes = getLasts(structure.slice(0,i+1));
      }else{
        if(prevNodes.length > 0){
          // get the current node and its properties
          let node = findNode(structure[i]);
          for(let j = 0; j < prevNodes.length; j++){
            // get the previous node and its properties
            let prvNode = findNode(prevNodes[j]);
            // create a path between the nodes
            paths.push(drawPath(prvNode,node));
          }
        }
        prevNodes = [structure[i]];
      }
    }
    return paths;
  }


  const renderAll = (nodes) => {
    // get the nodes to render
    const nodesToRender = calculateNodes(nodes, properties.startX, properties.startY);
    let nodesRendered = renderNodes(nodesToRender);
    let pathsRendered = renderPaths(nodesToRender,structure);
    let all = nodesRendered.concat(pathsRendered);
    return all;
  }

  return (
    <svg width="100%" height="100%" className="graph">
      {renderAll(structure, properties.startX, properties.startY)}
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
  lasts = [...new Set(lasts)];
  return lasts;
}

const Previous = ({order,slideChanger,currentSlide}) => {
  

  function getPrevious(order,currentSlide){
    // return the list of immediate previous slides
    let prvs = [];
    // for each element in the order
    for (let i = 0; i < order.length; i++) {
      // if it is a fork
      if (Array.isArray(order[i])) {
        let pr = [];
        // call getPrevious for each element in the fork and add them to the list
        for(let j = 0; j < order[i].length; j++) {
          let p = getPrevious(order[i][j],currentSlide);
          if(p && p.length > 0){
            if(p[0]==-1){
              if(i==0)
                return [-1];
              let lasts = getLasts(order.slice(0,i));
              return lasts;
            }
            return p;
          }else{
            let lasts = getLasts(order[i][j]);
            pr = pr.concat(lasts)
          }
        }
        prvs = pr;
      }// if it is a leaf 
      else {
        // if the leaf is the current slide return the prvs list
        if (order[i] == currentSlide) {
          if(i == 0)
            return [-1];
          return [... new Set(prvs)];
        }
        // if it is not, update the prvs list
        prvs = [order[i]];
      }
    }
  }

  let previous = getPrevious(order,currentSlide);
  console.log("Previous of", currentSlide, "is", previous);
  if(previous.length == 1){
    if(previous[0] == -1){
      return <span className="prev">X</span>
    }
    return <span className="prev" onClick={() => {slideChanger(previous[0])}}>Previous</span>
  }else{
    return previous.map((slide) => (
      <span className="prev" onClick={() => {slideChanger(slide)}}>{slide}</span>
    ));
  }
}

function getFirsts(order){
  // return the list of last slides
  let firsts = [];
  let l = order[0];
  if (Array.isArray(l)) {
    for(let j = 0; j < l.length; j++) {
      firsts = firsts.concat(getFirsts(l[j]));
    }
  } else {
    firsts = [l];
  }
  return firsts;
}

const Next = ({order,slideChanger,currentSlide}) => {
  
  function getNext(order,currentSlide){
    // return the list of immediate previous slides
    for(let i = 0; i < order.length; i++){
      if(Array.isArray(order[i])){
        for(let j = 0; j < order[i].length; j++){
          let next = getNext(order[i][j],currentSlide);
          if(next && next.length > 0){
            if(next[0] == -1){
              if(i == order.length-1)
                return [-1];
              return getFirsts(order.slice(i+1,order.length));
            }
            return next;
          }
        }
      }else{
        if(order[i] == currentSlide){
          if (i == order.length-1){
            return [-1];
          }
          return getFirsts(order.slice(i+1,order.length));
        }
      }
    }
  }

  let next = getNext(order,currentSlide);
  console.log("Next of", currentSlide, "is", next);
  if(next.length == 1){
    if(next[0] == -1){
      return <span className="next">X</span>
    }
    return <span className="next" onClick={() => {slideChanger(next[0])}}>Next</span>
  }else{
    return next.map((slide) => (
      <span className="next" onClick={() => {slideChanger(slide)}}>{slide}</span>
    ));
  }
}

function Navigation({order, slideChanger, currentSlide}) {
  // JSX: JavaScript XML
  return (currentSlide) ? (
  <table style={{width:"100%"}}>
    <tr style={{display:"flex"}}>
      <td className="left">
        <Previous order={order} slideChanger={slideChanger} currentSlide={currentSlide}/>
      </td>
      <td className="middle" nota="InsertNavGraph">
        <div className="graph-container">
          <GraphApp order={order} slideChanger={slideChanger} />
        </div>
      </td>
      <td className="right">
        <Next order={order} slideChanger={slideChanger} currentSlide={currentSlide}/>
      </td>
    </tr>
  </table>
  ) : (null);
}

export default Navigation;