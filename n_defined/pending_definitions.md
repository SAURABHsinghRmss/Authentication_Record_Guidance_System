# Pending Definitions & Future Scope

This document details items that are currently simulated, stubbed, or left to define for full enterprise production scaling.

---

## 1. Heavy Neural Tensor Execution (DeepFace / SpeechBrain / Qwen3)
* **Current State**: Uses lightweight vector matching and algorithmic simulations to ensure instant zero-friction execution on all development CPUs (including ARM64/Windows).
* **Pending Definition**: Integration of heavy GPU container runtimes (CUDA 12.x) with ONNX runtime / TensorRT weight files for raw neural tensor inferencing of face embeddings and voice spectrograms.

## 2. Production OAuth2 / OIDC Integration with National Portals
* **Current State**: Sandbox endpoints simulating APAAR ID validation and DigiLocker certificate retrieval.
* **Pending Definition**: Official production OAuth2/OIDC handshake integration with DigiLocker and National Academic Depository (NAD) gateway APIs requiring cryptographic client certificates.

## 3. Distributed Redis/Valkey Cluster Persistence
* **Current State**: Valkey configured via Docker Compose with an in-memory fallback for rate limiting and session caching.
* **Pending Definition**: Full distributed clustering with Redis Sentinel for high-availability rate limiting, token revocation blacklists, and multi-node WebSocket synchronization.

## 4. Native Mobile Client Wrappers
* **Current State**: Responsive web application built with Lit Web Components and Alpine.js.
* **Pending Definition**: Native mobile application wrappers (Flutter / React Native) for iOS and Android featuring native hardware biometric bindings (FaceID / Fingerprint).
