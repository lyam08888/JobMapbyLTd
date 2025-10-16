# Guide de déploiement - JobMap by LTd

## Déploiement en production

### Prérequis
- Un serveur Linux (Ubuntu 20.04+ recommandé)
- Node.js v14 ou supérieur
- npm ou yarn
- Un nom de domaine (optionnel mais recommandé)
- Certificat SSL (Let's Encrypt recommandé)

## Option 1: Déploiement manuel sur VPS

### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js et npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 pour la gestion de processus
sudo npm install -g pm2

# Installer git
sudo apt install -y git
```

### 2. Cloner et configurer l'application

```bash
# Cloner le repository
cd /var/www
sudo git clone https://github.com/lyam08888/JobMapbyLTd.git
cd JobMapbyLTd

# Installer les dépendances
sudo npm install

# Créer et configurer le fichier .env
sudo nano .env
```

Contenu du `.env` pour la production :
```env
PORT=3000
JWT_SECRET=VOTRE_CLE_SECRETE_TRES_LONGUE_ET_ALEATOIRE
NODE_ENV=production
DB_PATH=./backend/database.sqlite
```

⚠️ **Important** : Générez une clé JWT sécurisée :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Initialiser la base de données

```bash
sudo npm run seed
```

### 4. Configurer PM2

```bash
# Démarrer l'application avec PM2
pm2 start server.js --name jobmap

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save
```

### 5. Configurer Nginx comme reverse proxy

```bash
# Installer Nginx
sudo apt install -y nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/jobmap
```

Contenu de `/etc/nginx/sites-available/jobmap` :
```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/jobmap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configurer SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Le renouvellement automatique est configuré par défaut
```

### 7. Configurer le firewall

```bash
# Autoriser SSH, HTTP et HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Option 2: Déploiement sur Heroku

### 1. Préparer l'application

Créer un fichier `Procfile` à la racine :
```
web: node server.js
```

### 2. Configuration Heroku

```bash
# Installer Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Se connecter
heroku login

# Créer l'application
heroku create jobmap-votrenom

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set NODE_ENV=production

# Déployer
git push heroku main
```

## Option 3: Déploiement sur Vercel/Netlify

⚠️ **Note** : Ces plateformes sont principalement pour les sites statiques. Pour une application full-stack avec backend, préférez un VPS ou Heroku.

Pour Vercel (serverless) :
```bash
npm install -g vercel
vercel
```

Il faudra adapter le code pour utiliser des fonctions serverless.

## Option 4: Déploiement avec Docker

### Créer un Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Créer docker-compose.yml

```yaml
version: '3.8'
services:
  jobmap:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - DB_PATH=/data/database.sqlite
    volumes:
      - ./data:/data
    restart: unless-stopped
```

### Déployer

```bash
# Builder l'image
docker-compose build

# Lancer l'application
docker-compose up -d

# Initialiser la base de données
docker-compose exec jobmap npm run seed
```

## Sauvegardes

### Sauvegarder la base de données

```bash
# Script de sauvegarde automatique
cat > /usr/local/bin/backup-jobmap.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/jobmap"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /var/www/JobMapbyLTd/backend/database.sqlite $BACKUP_DIR/database_$DATE.sqlite
# Garder seulement les 30 dernières sauvegardes
find $BACKUP_DIR -name "database_*.sqlite" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-jobmap.sh

# Ajouter au cron (tous les jours à 2h du matin)
echo "0 2 * * * /usr/local/bin/backup-jobmap.sh" | sudo crontab -
```

## Monitoring et maintenance

### 1. Surveiller l'application avec PM2

```bash
# Voir les logs en temps réel
pm2 logs jobmap

# Voir le statut
pm2 status

# Redémarrer l'application
pm2 restart jobmap

# Voir les métriques
pm2 monit
```

### 2. Mettre à jour l'application

```bash
cd /var/www/JobMapbyLTd
sudo git pull
sudo npm install
pm2 restart jobmap
```

### 3. Nettoyer les logs

```bash
# Nettoyer les logs PM2
pm2 flush

# Configurer la rotation des logs
pm2 install pm2-logrotate
```

## Sécurité en production

### Checklist de sécurité

- [x] Utiliser HTTPS (SSL/TLS)
- [x] Changer le JWT_SECRET par défaut
- [x] Configurer un firewall (ufw)
- [x] Activer les mises à jour automatiques de sécurité
- [x] Limiter les tentatives de connexion (rate limiting)
- [x] Utiliser un mot de passe fort pour l'admin
- [x] Sauvegarder régulièrement la base de données
- [x] Surveiller les logs d'erreur
- [x] Mettre à jour régulièrement les dépendances

### Ajouter le rate limiting

Dans `server.js`, ajouter :

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

app.use('/api/', limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 // 5 tentatives de connexion par 15 minutes
});

app.use('/api/auth/login', authLimiter);
```

Installer la dépendance :
```bash
npm install express-rate-limit
```

## Optimisations pour la production

### 1. Compression

```bash
npm install compression
```

Dans `server.js` :
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Helmet pour la sécurité

```bash
npm install helmet
```

Dans `server.js` :
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Migrer vers PostgreSQL (optionnel mais recommandé)

Pour une application en production avec beaucoup d'utilisateurs, PostgreSQL est recommandé :

```bash
# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres psql
CREATE DATABASE jobmap;
CREATE USER jobmap_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE jobmap TO jobmap_user;
\q
```

Installer le driver :
```bash
npm install pg
```

Adapter le code pour utiliser PostgreSQL au lieu de SQLite.

## Troubleshooting

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs jobmap
cat /var/www/JobMapbyLTd/error.log
```

### Erreur de permissions

```bash
# Donner les bonnes permissions
sudo chown -R $USER:$USER /var/www/JobMapbyLTd
```

### Base de données corrompue

```bash
# Restaurer depuis une sauvegarde
cp /backups/jobmap/database_YYYYMMDD_HHMMSS.sqlite /var/www/JobMapbyLTd/backend/database.sqlite
pm2 restart jobmap
```

## Support

Pour toute question ou problème :
- Consultez les logs : `pm2 logs jobmap`
- Vérifiez la documentation : README.md et INTEGRATION.md
- Créez une issue sur GitHub

---

**Dernière mise à jour** : 2025-10-15
