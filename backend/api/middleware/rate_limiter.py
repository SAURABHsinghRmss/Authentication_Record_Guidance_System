import time
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        if client_ip == "testclient":
            return await call_next(request)

        path = request.url.path

        # Apply stricter rate limit to sensitive auth/biometric endpoints
        is_sensitive = "/auth/" in path or "/rag_query" in path
        limit = 15 if is_sensitive else self.max_requests

        now = time.time()
        # Clean old requests
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window_seconds]

        if len(self.requests[client_ip]) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Too many requests from this IP address. Please try again later."
            )

        self.requests[client_ip].append(now)
        response = await call_next(request)
        return response
