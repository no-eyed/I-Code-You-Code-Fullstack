import React from "react";

const Message = ({userName, Time, Text, isUserMessage}) => {
    return (
        <div className={`Message ${isUserMessage ? 'user-message' : 'other-message'}`}>
            <p className="meta">
                <span>{userName}</span> <span>{Time}</span>
            </p>
            <p className="text">{Text}</p>
        </div>
    )
}

export default Message