# Offline Dependency Cache & Model Registry

This directory contains pre-cached packages, model weights, and node dependency artifacts to support **air-gapped**, **intranet**, and **reproducible zero-internet** installations for **EduIdentityAI**.

---

## 📁 Directory Structure

```text
dependencies/
├── README.md               # This documentation and operational guide
├── python_wheels/          # Pre-compiled .whl binaries for backend Python dependencies
├── ai_weights/             # Pre-trained neural model weights & vector checkpoints
└── node_cache/             # Offline npm cache tarballs for frontend dependencies
```

---

## 🐍 1. Python Wheels (`python_wheels/`)

### Purpose
Allows installing backend requirements on offline production servers or container builds without public internet access to PyPI.

### Caching Dependencies (Online Machine)
Run this command from the repository root:
```bash
pip download -r backend/requirements.txt -d dependencies/python_wheels/
```

To include production AI extensions:
```bash
pip download -r backend/requirements-ai.txt -d dependencies/python_wheels/
```

### Installing from Cache (Offline Target Machine)
```bash
pip install --no-index --find-links=dependencies/python_wheels/ -r backend/requirements.txt
```

---

## 🧠 2. AI Model Weights (`ai_weights/`)

### Purpose
Houses pre-trained neural network weights for biometric recognition, OCR, and vector embeddings, eliminating runtime downloads from Hugging Face or Google Drive during deployment.

### Expected Model Checkpoints:
| Model Name | Pipeline Role | Expected File Name | Approx Size | Source / Framework |
| :--- | :--- | :--- | :--- | :--- |
| **FaceNet-512** | Facial Biometrics & Anti-Spoofing | `facenet512_weights.h5` | ~92 MB | DeepFace / Keras |
| **ECAPA-TDNN** | Voice Biometrics & Speaker Verification | `ecapa_tdnn_speechbrain.pt` | ~85 MB | SpeechBrain / PyTorch |
| **Qwen3-0.5B Embeddings** | Academic Knowledge Base Dense RAG | `qwen3_0_5b_embeddings.onnx`| ~180 MB | ONNX / HuggingFace |
| **CRAFT Text Detector** | Student ID Card OCR | `craft_mlt_25k.pth` | ~75 MB | EasyOCR / PyTorch |

### Downloading Models to Cache:
```bash
# Example Hugging Face download into local cache
huggingface-cli download Qwen/Qwen2.5-0.5B --local-dir dependencies/ai_weights/qwen3_base
```

---

## 📦 3. Node Package Cache (`node_cache/`)

### Purpose
Vendors npm tarballs to support offline `npm install` on air-gapped frontend web servers.

### Pre-populating Cache:
```bash
cd frontend
npm cache add lit@^3.0.0 alpinejs@^3.13.0 vite@^5.0.0 --cache ../dependencies/node_cache/
```

### Offline Installation:
```bash
cd frontend
npm install --prefer-offline --cache ../dependencies/node_cache/
```

---

*Refer to `n_defined/dependencies_and_cloud_computing_plan.md` for full supply-chain security and architectural specifications.*
