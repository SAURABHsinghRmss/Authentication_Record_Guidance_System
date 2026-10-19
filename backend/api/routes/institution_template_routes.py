from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json

from backend.services.db import get_db
from backend.models.student import (
    InstitutionTemplateModel,
    InstitutionTemplateCreate,
    InstitutionTemplateUpdate,
    InstitutionTemplateResponse,
    UserModel
)
from backend.services.institution_templates import (
    INSTITUTION_TYPES,
    DEFAULT_TEMPLATES,
    normalize_institution_type,
    get_active_template_for_institution,
    save_or_update_template,
    seed_default_templates_if_empty
)

router = APIRouter(prefix="/institutions", tags=["Institution Templates & Developer Mode"])

@router.get("/developer/presets")
def get_developer_presets(db: Session = Depends(get_db)):
    """Returns canonical default presets for all 5 institution types: School, College, University, Company, Start-up."""
    seed_default_templates_if_empty(db)
    return {
        "status": "SUCCESS",
        "institution_types": INSTITUTION_TYPES,
        "presets": DEFAULT_TEMPLATES
    }

@router.get("/templates/all")
def get_all_templates(db: Session = Depends(get_db)):
    """Returns all institution templates stored in the database."""
    seed_default_templates_if_empty(db)
    templates = db.query(InstitutionTemplateModel).all()
    results = []
    for t in templates:
        try:
            theme = json.loads(t.theme_config) if t.theme_config else {}
        except Exception:
            theme = {}
        try:
            data = json.loads(t.template_data) if t.template_data else {}
        except Exception:
            data = {}
        results.append({
            "id": t.id,
            "institution_id": t.institution_id,
            "institution_type": t.institution_type,
            "institution_name": t.institution_name,
            "template_name": t.template_name,
            "template_category": t.template_category,
            "developer_mode_enabled": t.developer_mode_enabled,
            "is_active": t.is_active,
            "version": t.version,
            "published_to_roles": t.published_to_roles,
            "theme_config": theme,
            "template_data": data,
            "created_by": t.created_by,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        })
    return {
        "status": "SUCCESS",
        "total_templates": len(results),
        "templates": results
    }

@router.get("/{inst_id_or_type}/template")
def get_institution_template(inst_id_or_type: str, db: Session = Depends(get_db)):
    """
    Returns the active template for an institution ID (e.g. 'inst_glbitm')
    or an institution type ('School', 'College', 'University', 'Company', 'Start-up').
    """
    tpl = get_active_template_for_institution(db, inst_id_or_type)
    return {
        "status": "SUCCESS",
        "institution_target": inst_id_or_type,
        "template": tpl
    }

@router.post("/{inst_id_or_type}/template")
def publish_institution_template(
    inst_id_or_type: str,
    payload: InstitutionTemplateCreate,
    db: Session = Depends(get_db)
):
    """
    Saves or publishes a custom template created in Developer Mode.
    Immediately reflects on the Student and other role portals.
    """
    if not payload.institution_id:
        payload.institution_id = inst_id_or_type
    
    updated_template = save_or_update_template(db, payload, user=payload.institution_name or "developer_mode_admin")
    return {
        "status": "SUCCESS",
        "message": f"Custom template '{payload.template_name}' successfully published in Developer Mode! Live for student view.",
        "template": updated_template
    }

@router.post("/{inst_id_or_type}/developer-mode/toggle")
def toggle_institution_developer_mode(
    inst_id_or_type: str,
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """Toggles developer mode on or off for the given institution or institution type."""
    enabled = payload.get("enabled", True)
    norm_type = normalize_institution_type(inst_id_or_type)
    type_key = f"type_{norm_type.lower().replace('-', '_')}"

    tpls = db.query(InstitutionTemplateModel).filter(
        (InstitutionTemplateModel.institution_id == inst_id_or_type) |
        (InstitutionTemplateModel.institution_id == type_key) |
        (InstitutionTemplateModel.institution_type == norm_type)
    ).all()

    for tpl in tpls:
        tpl.developer_mode_enabled = enabled

    db.commit()

    return {
        "status": "SUCCESS",
        "institution_target": inst_id_or_type,
        "institution_type": norm_type,
        "developer_mode_enabled": enabled,
        "message": f"Developer Mode for {norm_type} is now {'ENABLED (Custom templates active)' if enabled else 'DISABLED (Default presets)'}."
    }

@router.post("/{inst_id_or_type}/template/reset")
def reset_institution_template(inst_id_or_type: str, db: Session = Depends(get_db)):
    """Resets an institution's template to the canonical preset for its type."""
    norm_type = normalize_institution_type(inst_id_or_type)
    type_key = f"type_{norm_type.lower().replace('-', '_')}"
    preset = DEFAULT_TEMPLATES.get(norm_type, DEFAULT_TEMPLATES["College"])

    existing = db.query(InstitutionTemplateModel).filter(
        (InstitutionTemplateModel.institution_id == inst_id_or_type) |
        (InstitutionTemplateModel.institution_id == type_key)
    ).first()

    theme_str = json.dumps({
        "badge": preset["badge"],
        "icon": preset["icon"],
        "accent_color": preset["accent_color"],
        "banner_notice": preset.get("banner_notice", "")
    })
    data_str = json.dumps({
        "program": preset["program"],
        "department": preset["department"],
        "role_badge_title": preset.get("role_badge_title"),
        "financial_label": preset.get("financial_label"),
        "courses": preset["courses"],
        "timetable": preset["timetable"],
        "fee_or_stipend": preset["fee_or_stipend"],
        "documents": preset["documents"]
    })

    if existing:
        existing.template_name = preset["template_name"]
        existing.version = "1.0.0"
        existing.theme_config = theme_str
        existing.template_data = data_str
        existing.developer_mode_enabled = True
        existing.is_active = True
    else:
        new_tpl = InstitutionTemplateModel(
            id=f"tpl_{type_key}_{uuid.uuid4().hex[:6]}",
            institution_id=type_key,
            institution_type=norm_type,
            institution_name=f"{norm_type} Standard Authority",
            template_name=preset["template_name"],
            template_category="FULL_PORTAL",
            developer_mode_enabled=True,
            is_active=True,
            version="1.0.0",
            published_to_roles="student,faculty,parent,admin,all",
            theme_config=theme_str,
            template_data=data_str,
            created_by="system_reset"
        )
        db.add(new_tpl)

    db.commit()
    tpl = get_active_template_for_institution(db, inst_id_or_type)
    return {
        "status": "SUCCESS",
        "message": f"Successfully reset {norm_type} to standard default preset.",
        "template": tpl
    }
