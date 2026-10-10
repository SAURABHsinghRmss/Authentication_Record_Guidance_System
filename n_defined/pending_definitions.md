# Pending Definitions & Future Scope

This document details items that are currently simulated, stubbed, or left to define for full enterprise production scaling, along with their resolution paths defined in the **Dependencies & Cloud Computing Master Plan**.

> 📘 **Master Architecture Reference**: See **[`dependencies_and_cloud_computing_plan.md`](dependencies_and_cloud_computing_plan.md)** for detailed specifications on GPU node provisioning, multi-cloud storage drivers, and dependency profiles.

---

## 1. Heavy Neural Tensor Execution (DeepFace / SpeechBrain / Qwen3)
* **Current State**: Uses lightweight vector matching and algorithmic simulations to ensure instant zero-friction execution on all development CPUs (including ARM64/Windows).
* **Pending Definition**: Integration of heavy GPU container runtimes (CUDA 12.x) with ONNX runtime / TensorRT weight files for raw neural tensor inferencing of face embeddings and voice spectrograms.
* **Resolution Path in Cloud Plan**: Provision dedicated GPU worker nodes (AWS EC2 `g4dn.xlarge` / Azure `NC4as_T4_v3` / GCP Cloud Run GPU) installing dependencies from `backend/requirements-ai.txt` and loading offline weights from `dependencies/ai_weights/`.

## 2. Production OAuth2 / OIDC Integration with National Portals
* **Current State**: Sandbox endpoints simulating APAAR ID validation and DigiLocker certificate retrieval.
* **Pending Definition**: Official production OAuth2/OIDC handshake integration with DigiLocker and National Academic Depository (NAD) gateway APIs requiring cryptographic client certificates.
* **Resolution Path in Cloud Plan**: Deploy mutual TLS (mTLS) gateway certificates stored in cloud secret vaults (AWS Secrets Manager / Azure Key Vault / GCP Secret Manager) to securely sign API requests to Indian national government gateways.

## 3. Distributed Redis/Valkey Cluster Persistence
* **Current State**: Valkey configured via Docker Compose with an in-memory fallback for rate limiting and session caching.
* **Pending Definition**: Full distributed clustering with Redis Sentinel for high-availability rate limiting, token revocation blacklists, and multi-node WebSocket synchronization.
* **Resolution Path in Cloud Plan**: Transition from local Docker containers to managed cloud caching clusters (AWS ElastiCache Redis, Azure Managed Redis, or Upstash Serverless) supporting multi-AZ automated failover and sub-millisecond latencies.

## 4. Native Mobile Client Wrappers
* **Current State**: Responsive web application built with Lit Web Components and Alpine.js.
* **Pending Definition**: Native mobile application wrappers (Flutter / React Native) for iOS and Android featuring native hardware biometric bindings (FaceID / Fingerprint).
* **Resolution Path in Cloud Plan**: Mobile apps will interface directly with the FastAPI REST API and WebSocket streams over secure HTTPS/WSS with JWT bearer authorization.

## 5. Live Cloud Storage User Log Sync (GCS / S3 / Azure Bucket Uploads)
* **Current State**: User work sessions and login histories are partitioned by user Gmail/email and stored locally in `storage/logs/users/{user_email}/` (`last_work.json`, `login_history.jsonl`, `activity_stream.jsonl`). Pre-wired with target cloud URIs (`gs://eduidentity-user-logs/...`) and staging validation via `/api/auth/work-logs/cloud-sync`.
* **Pending Definition**: Direct integration with the `google-cloud-storage`, `boto3`, or `azure-storage-blob` client libraries utilizing cloud workload identity credentials to enable background auto-sync of local user logs to the live cloud storage bucket upon each login and session termination.
* **Resolution Path in Cloud Plan**: Enable `CLOUD_STORAGE_ENABLED=true` in cloud environment variables; background tasks in `UserWorkLogger` stream Gzip-compressed session logs to `gs://eduidentity-user-logs/users/{user_email}/` with lifecycle tiering (Standard ➔ Nearline ➔ Coldline).
