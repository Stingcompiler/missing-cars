# PythonAnywhere Deployment Guide

## 1. Upload Project to GitHub

```bash
cd /home/musabsting/pureProjects/missing_cars
git add .
git commit -m "Prepare for PythonAnywhere deployment"
git push origin main
```

## 2. Create PythonAnywhere Account
- Go to https://www.pythonanywhere.com
- Sign up for a free or paid account
- Note your username (used in domain: `username.pythonanywhere.com`)

## 3. Clone Repository on PythonAnywhere

Open a **Bash console** on PythonAnywhere:
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/mscars
```

## 4. Create Virtual Environment

```bash
python3.10 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

## 5. Set Environment Variables

In PythonAnywhere dashboard, go to **Web** tab → click on your web app → **Environment variables**:

| Variable | Value |
|----------|-------|
| `PRODUCTION` | `1` |
| `SECRET_KEY` | `your-secure-random-secret-key` |
| `PYTHONANYWHERE_USERNAME` | `your_username` |

## 6. Configure Web App

### WSGI Configuration
In **Web** tab → click **WSGI configuration file**, replace content with:

```python
import os
import sys

# Add project to path
path = '/home/YOUR_USERNAME/YOUR_REPO/mscars'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'mscars.settings'
os.environ['PRODUCTION'] = '1'
os.environ['PYTHONANYWHERE_USERNAME'] = 'YOUR_USERNAME'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### Static Files
In **Web** tab → **Static files**:

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/YOUR_USERNAME/YOUR_REPO/mscars/staticfiles/` |
| `/media/` | `/home/YOUR_USERNAME/YOUR_REPO/mscars/media/` |

## 7. Run Migrations

In Bash console:
```bash
cd ~/YOUR_REPO/mscars
source env/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
```

## 8. Create Superuser (if needed)

```bash
python manage.py createsuperuser
```

## 9. Reload Web App

In **Web** tab, click the **Reload** button.

---

## Important Notes

1. **Free Account Limit**: Free accounts have 512MB disk and 3 months expiry
2. **HTTPS**: PythonAnywhere provides free HTTPS
3. **Database**: SQLite works but consider MySQL for production
4. **Media Files**: Ensure `/media/` directory is writable

## Troubleshooting

- **500 Error**: Check error logs in Web tab
- **Static files not loading**: Verify static files paths
- **CORS errors**: Check CORS_ALLOWED_ORIGINS in settings

## Updating Deployment

```bash
cd ~/YOUR_REPO
git pull origin main
cd mscars
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```
Then reload the web app.
