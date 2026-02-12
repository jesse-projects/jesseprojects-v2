# Code vs Content Separation

This project maintains a clear separation between **CODE** (application logic, managed via Replit/GitHub) and **CONTENT** (images, YAML metadata, managed via SFTP).

## Directory Structure

```
/project-root/
├── CODE (Git-tracked, deployed from GitHub)
│   ├── api/                    # PHP API endpoints
│   │   ├── photography.php
│   │   ├── workshops.php
│   │   ├── image-processor.php
│   │   └── contact.php
│   ├── js/                     # JavaScript modules
│   ├── css/                    # Stylesheets
│   ├── docs/                   # Documentation
│   ├── content-templates/      # Reference templates (Git-tracked)
│   ├── index.php               # Main entry point
│   ├── schema-version.json     # Current schema version
│   └── CHANGELOG.md            # Code/schema change history
│
└── CONTENT (NOT in Git, managed via SFTP on Dreamhost)
    ├── photography/            # Photography galleries
    │   ├── [category-name]/
    │   │   ├── _template.yaml  # Schema reference (auto-synced)
    │   │   ├── metadata.yaml   # Actual content metadata
    │   │   └── *.jpg/png       # Images
    │   └── ...
    ├── workshops/              # Workshop projects
    │   ├── [project-name]/
    │   │   ├── _template.yaml  # Schema reference (auto-synced)
    │   │   ├── metadata.yaml   # Actual content metadata
    │   │   ├── originals/      # Original uploaded images
    │   │   └── sizes/          # Processed image sizes
    │   └── ...
    ├── data/                   # JSON data files
    │   └── events.json
    └── _meta/                  # Content-side metadata
        └── schema-version.json # Installed schema version
```

## What Goes Where

| Type | Location | Managed By | Git Tracked |
|------|----------|------------|-------------|
| PHP APIs | `api/` | Replit/GitHub | Yes |
| JavaScript | `js/` | Replit/GitHub | Yes |
| CSS | `css/` | Replit/GitHub | Yes |
| HTML/PHP templates | root | Replit/GitHub | Yes |
| Schema templates | `content-templates/` | Replit/GitHub | Yes |
| Documentation | `docs/` | Replit/GitHub | Yes |
| Photography images | `photography/` | SFTP | No |
| Photography metadata | `photography/*/metadata.yaml` | SFTP | No |
| Workshop images | `workshops/` | SFTP | No |
| Workshop metadata | `workshops/*/metadata.yaml` | SFTP | No |
| Processed images | `workshops/*/sizes/` | Auto-generated | No |

## Deployment Workflow

### Code Deployment (Replit → GitHub → Dreamhost)

1. **Develop in Replit** - Make code changes, test locally
2. **Commit to GitHub** - Push changes to main branch
3. **Deploy to Dreamhost** - Use rsync/FTP to deploy CODE directories only
4. **Exclude content** - Never overwrite photography/, workshops/, data/

### Recommended rsync command:
```bash
rsync -avz --delete \
  --exclude 'photography/' \
  --exclude 'workshops/' \
  --exclude 'data/' \
  --exclude 'attached_assets/' \
  --exclude '_meta/' \
  ./ user@dreamhost:/path/to/site/
```

### Content Updates (SFTP directly to Dreamhost)

1. **Connect via SFTP** to Dreamhost
2. **Navigate** to photography/ or workshops/
3. **Reference** the `_template.yaml` file in each folder
4. **Create/Edit** `metadata.yaml` following the template
5. **Upload** images to the same folder

## Schema Versioning

The schema version is tracked in two places:
- `schema-version.json` (in Git) - Current expected version
- `_meta/schema-version.json` (on Dreamhost) - Installed version

When schema changes are deployed:
1. Check CHANGELOG.md for migration notes
2. Update content YAML files as needed
3. Update `_meta/schema-version.json` to match

## Template Files

Each content folder should contain a `_template.yaml` file showing:
- All available fields with example values
- Required vs optional fields
- Field descriptions as comments

These templates are synced during code deployment and serve as a reference for content creators.
