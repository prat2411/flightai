import { useEffect, useMemo, useRef, useState } from "react";

import { buildChatbotUrl, isChatbotConfigured } from "../api/config";
import "./ChatBot.css";

const buildHistoryPairs = (messages) => {
	const pairs = [];
	let pendingUserMessage = null;

	for (const item of messages) {
		if (item.role === "user") {
			pendingUserMessage = item.content;
			continue;
		}

		if (item.role === "assistant" && pendingUserMessage !== null) {
			pairs.push([pendingUserMessage, item.content]);
			pendingUserMessage = null;
		}
	}

	return pairs;
};

const ChatBot = () => {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: "Hello. I am your FlightAI assistant. Ask me about routes, fares, or travel tips.",
		},
	]);

	const listRef = useRef(null);

	useEffect(() => {
		if (!open || !listRef.current) {
			return;
		}

		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages, open]);

	const history = useMemo(() => buildHistoryPairs(messages), [messages]);

	const sendMessage = async (event) => {
		event.preventDefault();
		const trimmed = input.trim();
		if (!trimmed || loading) {
			return;
		}

		const nextMessages = [...messages, { role: "user", content: trimmed }];
		setMessages(nextMessages);
		setInput("");
		setError("");
		setLoading(true);

		try {
			if (!isChatbotConfigured) {
				throw new Error("Chatbot API URL is not configured.");
			}

			const response = await fetch(buildChatbotUrl("/chat"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: trimmed,
					history,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Unable to fetch chatbot response.");
			}

			const reply = typeof data.response === "string" ? data.response : "I could not generate a response.";
			setMessages((previous) => [...previous, { role: "assistant", content: reply }]);
		} catch (requestError) {
			setError(requestError.message || "Chat service is currently unavailable.");
			setMessages((previous) => [
				...previous,
				{
					role: "assistant",
					content: "I am unable to respond right now. Please try again shortly.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="chatbot-root" aria-live="polite">
			{open ? (
				<section className="chatbot-panel" aria-label="FlightAI Assistant">
					<header className="chatbot-header">
						<div>
							<p className="chatbot-kicker">FlightAI Assistant</p>
							<h3>Chat Support</h3>
						</div>
						<button
							type="button"
							className="chatbot-close"
							onClick={() => setOpen(false)}
							aria-label="Close chat"
						>
							x
						</button>
					</header>

					<div className="chatbot-messages" ref={listRef}>
						{messages.map((message, index) => (
							<div
								key={`${message.role}-${index}`}
								className={message.role === "user" ? "chat-bubble chat-bubble-user" : "chat-bubble chat-bubble-assistant"}
							>
								{message.content}
							</div>
						))}

						{loading ? <p className="chatbot-loading">Assistant is typing...</p> : null}
						{error ? <p className="chatbot-error">{error}</p> : null}
					</div>

					<form className="chatbot-form" onSubmit={sendMessage}>
						<input
							type="text"
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder="Ask about flights and fares"
							disabled={loading}
						/>
						<button type="submit" disabled={loading || !input.trim()}>
							Send
						</button>
					</form>
				</section>
			) : null}

			<button
				type="button"
				className="chatbot-toggle"
				onClick={() => setOpen((previous) => !previous)}
				aria-label={open ? "Close chatbot" : "Open chatbot"}
			>
				Chat
			</button>
		</div>
	);
};

export default ChatBot;
