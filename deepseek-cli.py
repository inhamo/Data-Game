import os, sys, requests

api_key = os.getenv("DEEPSEEK_API_KEY")
prompt = " ".join(sys.argv[1:])

resp = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}"},
    json={
        "model": "deepseek-coder",   # or "deepseek-chat"
        "messages": [{"role": "user", "content": prompt}]
    }
)

data = resp.json()

if "choices" in data:
    print(data["choices"][0]["message"]["content"])
else:
    print("Error:", data)
