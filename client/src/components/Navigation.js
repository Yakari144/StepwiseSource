import React from 'react';

function Navigation({slideChanger}) {
    // JSX: JavaScript XML
    return <table style={{width:"100%"}}>
    <tr style={{display:"flex"}}>
      <td className="left">
        <span className="prev" onClick={() => {slideChanger(-1)}}>Previous</span>
      </td>
      <td className="middle" nota="InsertNavGraph">
        <div className="graph-container">
          <svg width="200" height="100" className="graph">
            <circle cx="20" cy="20" r="5" className="dot" id="dot1" stroke=""></circle>
            <circle cx="50" cy="50" r="5" className="dot" id="dot2"></circle>
            <circle cx="80" cy="20" r="5" className="dot" id="dot3"></circle>
            <line x1="20" y1="20" x2="50" y2="50" stroke="black" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="black" />
            <line x1="80" y1="20" x2="120" y2="50" stroke="black" />
          </svg>
        </div>
      </td>
      <td className="right"><span className="next" onClick={() => {slideChanger(1)}} >Next</span></td>
    </tr>
  </table>
}

export default Navigation;