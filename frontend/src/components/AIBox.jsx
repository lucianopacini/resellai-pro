function AIBox({ text }) {
    return (
        <div className="ai-box">
            <div className="ai-header">🤖 AI Assistant</div>
            <p className="ai-text">{text}</p>
        </div>
    );
}

export default AIBox;