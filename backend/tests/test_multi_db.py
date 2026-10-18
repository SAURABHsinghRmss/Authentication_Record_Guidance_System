from backend.services.db_federation import DatabaseFederationManager
import json

diag = DatabaseFederationManager.get_federation_diagnostics()
print("Federation Status:", diag["status"])
print("Databases Count:", diag["databases_count"])
print("Total Records:", diag["total_records_synchronized"])
for name, info in diag["databases"].items():
    print(f"[{name}] status={info['status']}, latency={info['latency_ms']}ms, tables={list(info['tables'].keys())}")
