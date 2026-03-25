import os
import json
from openai import OpenAI
from dotenv import load_dotenv
import sqlite3

# Load env
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

if groq_api_key:
    print(f"Groq API Key exists and begins {groq_api_key[:4]}")
else:
    print("GROQ_API_KEY not found. Chatbot will use local fallback responses.")

# OpenAI (Groq)
client = None
if groq_api_key:
    client = OpenAI(
        api_key=groq_api_key,
        base_url="https://api.groq.com/openai/v1"
    )

system_message = """
You are a helpful and friendly assistant for an Airline called FlightAI.
Greet users warmly and answer general questions conversationally.
You have access to one tool: get_ticket_price.
Use this tool ONLY when the user asks about ticket prices.
After calling the tool, directly return the result.
Do NOT call the tool again.
Give short, courteous answers.
"""

# Database setup
DB = "prices.db"

def init_db():
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "CREATE TABLE IF NOT EXISTS prices (city TEXT PRIMARY KEY, price REAL)"
        )
        data = [
            ("london", 650),
            ("paris", 750),
            ("tokyo", 1200),
            ("sydney", 1500),
            ("new york", 1000),
            ("dubai", 1300),
            ("singapore", 1400),
            ("barcelona", 800),
        ]
        cursor.executemany("INSERT OR IGNORE INTO prices VALUES (?, ?)", data)
        conn.commit()

init_db()

# Tool function
def get_ticket_price(city):
    print(f"DATABASE TOOL CALLED: {city}", flush=True)

    if not city:
        return "No city provided"

    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT price FROM prices WHERE city = ?", (city.lower(),)
        )
        result = cursor.fetchone()

    return (
        f"${result[0]}" if result
        else "Price unavailable"
    )

# Tool schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_ticket_price",
            "description": "Get ticket price for a destination city",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination_city": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["destination_city"]
            }
        }
    }
]


def fallback_reply(message):
    text = (message or "").strip().lower()

    price_markers = ("price", "fare", "ticket", "cost")
    if any(marker in text for marker in price_markers):
        for city in [
            "london",
            "paris",
            "tokyo",
            "sydney",
            "new york",
            "dubai",
            "singapore",
            "barcelona",
        ]:
            if city in text:
                return f"Current ticket price to {city.title()} is {get_ticket_price(city)}."
        return "I can help with fares. Try asking: 'What is the ticket price to Paris?'"

    if "hello" in text or "hi" in text or "hey" in text:
        return "Hello! I am FlightAI assistant. Ask me about destinations or ticket prices."

    return "I am currently in limited mode. I can answer basic travel questions and ticket prices for supported cities."

def handle_tool_calls(message):
    responses = []

    for tool_call in message.tool_calls:
        if tool_call.function.name != "get_ticket_price":
            continue

        try:
            args = json.loads(tool_call.function.arguments)
            city = args.get("destination_city") or args.get("city")

            if not city:
                result = "Price unavailable"
            else:
                result = get_ticket_price(city)

        except Exception as e:
            print("Tool error:", e, flush=True)
            result = "Error fetching price"

        responses.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": result
        })

    return responses

def chat(message, history):
    print("User:", message, flush=True)

    try:
        if client is None:
            return fallback_reply(message)

        messages = []
        for human, assistant in history:
            messages.append({"role": "user", "content": human})
            if assistant:
                messages.append({"role": "assistant", "content": assistant})

        messages = (
            [{"role": "system", "content": system_message}]
            + messages
            + [{"role": "user", "content": message}]
        )

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        choice = response.choices[0]

        # CASE 1: Tool call
        if choice.finish_reason == "tool_calls":
            msg = choice.message

            tool_responses = handle_tool_calls(msg)

            messages.append(msg.model_dump(exclude_none=True))
            messages.extend(tool_responses)

            second_response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages
            )

            final = second_response.choices[0].message.content
            return final or "Price unavailable"

        # CASE 2: Normal response
        return choice.message.content or "Hello! How can I help you?"

    except Exception as e:
        print("ERROR:", str(e), flush=True)
        return "Something went wrong, please try again."


if __name__ == "__main__":
    import gradio as gr

    gr.ChatInterface(fn=chat).launch(
        server_name="0.0.0.0",
        server_port=7860
    )