

## Pour obtenir un aperçu du schéma de votre base de données PostgreSQL depuis la ligne de commande, vous pouvez utiliser la commande `pg_dump` avec l'option `--schema-only`. Voici comment vous pouvez le faire :

1. **Exporter le schéma de la base de données** :
```bash
pg_dump -U yohannravino -h localhost -s -O -f schema.sql tirok_db
```