import React from "react";

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close" onClick={() => props.setTrigger(false)}>close</button>
                { props.children }
            </div>
        </div>
    ) : "";
}

export default Popup