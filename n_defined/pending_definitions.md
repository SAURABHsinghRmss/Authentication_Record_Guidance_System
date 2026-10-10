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

## 5. Live Cloud Storage User Log Sync (GCS Bucket Uploads)
* **Current State**: User work sessions and login histories are partitioned by user Gmail/email and stored locally in `storage/logs/users/{user_email}/` (`last_work.json`, `login_history.jsonl`, `activity_stream.jsonl`). Pre-wired with target cloud URIs (`gs://eduidentity-user-logs/...`) and staging validation via `/api/auth/work-logs/cloud-sync`.
* **Pending Definition**: Direct integration with the `google-cloud-storage` client library utilizing GCP Application Default Credentials (ADC) to enable background auto-sync of local user logs to the live Cloud Storage bucket upon each login and session termination.
