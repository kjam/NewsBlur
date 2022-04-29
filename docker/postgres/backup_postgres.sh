#!/usr/bin/env bash

now=$(date '+%Y-%m-%d-%H-%M')
BACKUP_PATH="/var/lib/postgresql/backup/"
UPLOAD_PATH="/srv/newsblur/backups/"
BACKUP_FILENAME="backup_postgresql_${now}.sql"
BACKUP_FILE="${BACKUP_PATH}${BACKUP_FILENAME}"
UPLOAD_FILE="${UPLOAD_PATH}${BACKUP_FILENAME}"
echo "---> PG dumping - ${now}: ${BACKUP_FILE}"
sudo docker exec -it postgres sh -c "mkdir -p $BACKUP_PATH"
sudo docker exec -it postgres sh -c "/usr/lib/postgresql/13/bin/pg_dump -U newsblur -h 127.0.0.1 -Fc newsblur > $BACKUP_FILE"


echo " ---> Uploading postgres backup to S3"
sudo docker run --user 1000:1001 --rm \
    -v /srv/newsblur:/srv/newsblur \
    --network=host \
    newsblur/newsblur_python3 \
    python /srv/newsblur/utils/backups/backup_psql.py $UPLOAD_FILE

# Don't delete backup since the backup_mongo.py script will rm them
## rm /opt/mongo/newsblur/backup/backup_mongo_${now}.tgz
## rm /opt/mongo/newsblur/backup/backup_mongo_${now}
echo " ---> Finished uploading backups to S3"
