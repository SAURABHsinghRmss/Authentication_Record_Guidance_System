# Cloud Storage & Computing Future Plan

> **Platform**: EduIdentityAI  
> **Objective**: Comprehensive architectural roadmap for multi-cloud object storage, automated log tiering, Kubernetes container orchestration, and GPU-accelerated AI computing.

---

## 📑 Table of Contents

1. [Executive Cloud Strategy](#1-executive-cloud-strategy)
2. [Multi-Cloud Object Storage Architecture](#2-multi-cloud-object-storage-architecture)
3. [Gzip Log Tiering & Lifecycle Management](#3-gzip-log-tiering--lifecycle-management)
4. [Cloud Computing & Container Orchestration (Kubernetes)](#4-cloud-computing--container-orchestration-kubernetes)
5. [GPU Acceleration & Distributed AI Inference](#5-gpu-acceleration--distributed-ai-inference)

---

## 1. Executive Cloud Strategy

EduIdentityAI is designed for **cloud-agnostic flexibility**, supporting deployment across AWS, Google Cloud Platform (GCP), Microsoft Azure, and private campus data centers. The future cloud plan leverages containerized microservices, immutable infrastructure, and serverless edge functions to guarantee 99.99% availability and low-latency access.

---

## 2. Multi-Cloud Object Storage Architecture

* **Partitioned User Storage**:
  * User activity streams, login histories, and session snapshots are partitioned locally under `storage/logs/users/{user_email}/`.
* **Multi-Cloud Adapters (`UserWorkLogger`)**:
  * Configured via environment variables (`CLOUD_PROVIDER=gcs|s3|azure`), the system automatically stages and synchronizes compressed audit logs to:
    * Google Cloud Storage: `gs://eduidentity-user-logs/users/{email}/`
    * Amazon S3: `s3://eduidentity-user-logs/users/{email}/`
    * Azure Blob Storage: `azure-blob://eduidentity-user-logs/users/{email}/`
* **Workload Identity Federation**:
  * Eliminates long-lived cloud credentials by authenticating containers directly via short-lived OIDC tokens.

---

## 3. Gzip Log Tiering & Lifecycle Management

To optimize cloud storage expenditures and maintain high-speed forensic searchability:

* **Hot Storage (0 - 24 Hours)**:
  * Raw uncompressed JSONL logs stored on high-performance NVMe SSD volumes for real-time admin inspection.
* **Warm Storage (1 - 30 Days)**:
  * Automatic background cron tasks compress logs into `.jsonl.gz` streams, reducing storage volume by ~75%.
* **Cold / Archival Storage (30+ Days)**:
  * Lifecycle rules transition archived logs to low-cost archival tiers (AWS Glacier, GCP Archive, Azure Coldline) for regulatory compliance and audit retention.

---

## 4. Cloud Computing & Container Orchestration (Kubernetes)

* **Kubernetes (AKS / GKE / EKS)**:
  * Migrating from Docker Compose to production Kubernetes clusters managed via Helm charts.
* **Horizontal Pod Autoscaling (HPA)**:
  * FastAPI backend pods automatically scale based on CPU utilization metrics and Prometheus request queue depth.
* **Zero-Trust Service Mesh (Istio / Linkerd)**:
  * Encrypts all east-west internal microservice traffic using mTLS and enforces strict service-to-service access policies.

---

## 5. GPU Acceleration & Distributed AI Inference

* **GPU Inference Nodes**:
  * Deploying NVIDIA GPU node pools (T4 / A10G / H100) running vLLM or TensorRT-LLM for high-throughput Qwen3 and DeepSeek model inference.
* **Vector Store Sharding**:
  * Distributing Qdrant vector database clusters across multi-region nodes to maintain sub-10ms semantic retrieval latency for 10M+ student knowledge vectors.
