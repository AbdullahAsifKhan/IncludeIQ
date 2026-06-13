import os
import json
from groq import Groq

def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set")
    return Groq(api_key=api_key)

async def analyze_text(text: str):
    client = get_groq_client()
    
    prompt = f"""
    You are IncludeIQ, an AI Chief Accessibility Officer.
    You evaluate workplace text for accessibility and inclusion risks.
    
    Analyze the following text:
    ---
    {text}
    ---
    
    Perform the following reasoning:
    1. Work IQ: Understand the workplace context (is this a job description, meeting transcript, policy?)
    2. Foundry IQ: Evaluate against ADA/WCAG and accessibility best practices.
    3. Fabric IQ: Determine the organizational risk level.
    
    Output a JSON object exactly with this schema, no other text:
    {{
        "accessibility_score": <number 0-100>,
        "inclusion_risk_score": <number 0-100 (where 100 is highest risk)>,
        "context": "<brief string about what this document is>",
        "highest_risk_areas": [
            {{ "area": "<name>", "description": "<description>" }}
        ],
        "recommended_actions": [
            "<action 1>", "<action 2>"
        ]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI that strictly outputs valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        return {"error": "Failed to parse AI response", "details": str(e)}
