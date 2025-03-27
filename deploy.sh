#!/bin/bash
# a script that checks if a repository has any changes in a specific branch and if so, pulls and deploys the changes
# Usage: ./deploy.sh

#loading environment variables
export $(grep -v '^#' .env | xargs)

USER_GROUP=$(id -gn)
LOG_FILE="/nobackup/${USER_GROUP}/${USER}/${LOG_FILE_NAME}"

WEBSITE_DIR="/home/${USER_GROUP}/${USER}/${WEBSITE_DIR_PATH}"
DINF_WEBSITE_DIR="/home/html/inf/${USER}/"

# BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN. DONT 
DINF_WEBSITE_DIR_SYMBOLIC="/home/${USER_GROUP}/${USER}/public_html" # BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN
# BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN


if [ ! -d "${LOG_FILE}" ]; then
    touch ${LOG_FILE}
fi

echo "[$(date)] Starting script" >> $LOG_FILE

# deploy the changes
echo "[$(date)] Deploying the changes" >> $LOG_FILE

# remove the symbolic link if it exists
if [ -d $DINF_WEBSITE_DIR_SYMBOLIC ]; then
    echo "[$(date)] Removing existing symbolic link: $DINF_WEBSITE_DIR_SYMBOLIC" >> $LOG_FILE
    rm -rf $DINF_WEBSITE_DIR_SYMBOLIC
fi

# create the symbolic link
echo "[$(date)] Creating symbolic link" >> $LOG_FILE
ln -vs $DINF_WEBSITE_DIR $DINF_WEBSITE_DIR_SYMBOLIC

# copy the files
echo "[$(date)] Copying files" >> $LOG_FILE
echo "[$(date)] Excluding files: ${EXCLUDE_LIST}" >> $LOG_FILE
rsync -avz --delete --exclude={'*.git','*.env',} --exclude=${EXCLUDE_LIST} $WEBSITE_DIR/* $DINF_WEBSITE_DIR_SYMBOLIC

echo "[$(date)] Changing permissions" >> $LOG_FILE
chmod -R 755 $DINF_WEBSITE_DIR_SYMBOLIC

echo "Done"

echo "[$(date)] Script finished" >> $LOG_FILE
