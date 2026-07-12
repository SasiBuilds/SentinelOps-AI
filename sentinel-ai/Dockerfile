FROM python:3.13-slim

WORKDIR /app

COPY sentinel-ai/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY sentinel-ai/ .

COPY recovery-engine/ /recovery-engine/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
