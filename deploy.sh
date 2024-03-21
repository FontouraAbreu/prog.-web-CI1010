#!/bin/bash
# a script that checks if a repository has any changes in a specific branch and if so, pulls and deploys the changes
# Usage: ./deploy.sh <branch> <path_to_repository>
# Example: ./deploy.sh master /var/www/html/my-repo

LOG_FILE=/nobackup/bcc/${USER}/deploy.log

WEBSITE_DIR="/home/bcc/vfa20/desktop/prog.-web-CI1010/"
DINF_WEBSITE_DIR="/home/html/inf/vfa20/"

# BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN
DINF_WEBSITE_DIR_SYMBOLIC="/home/bcc/vfa20/public_html" # BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN
# BE CAREFUL WITH THE SYMBOLIC LINK AS IT WILL BE REMOVED AND CREATED AGAIN


# check if the number of arguments is correct
if [ "$#" -ne 2 ]; then
    echo "Usage: ./deploy.sh <branch> <path_to_repository>"
    exit 1
fi
echo "[${date}] Starting script" >> $LOG_FILE
# get the branch and the path to the repository
branch=$1
path=$2

# check if the repository exists
if [ ! -d "$path" ]; then
    echo "[${date}] The repository does not exist" >> $LOG_FILE
    exit 1
fi

# check if the branch exists
if ! git -C $path show-ref --verify --quiet refs/heads/$branch; then
    echo "[${date}] The branch does not exist" >> $LOG_FILE
    exit 1
fi

# check if the repository has any changes in the branch
if [ -n "$(git -C $path status --porcelain)" ]; then
    echo "[${date}] The repository has changes" >> $LOG_FILE
    # pull the changes
    git -C $path pull origin $branch >> $LOG_FILE
    # deploy the changes
    echo "[${date}] Deploying the changes" >> $LOG_FILE
    # add your deployment commands here

    if [ -d $DINF_WEBSITE_DIR_SYMBOLIC ]; then
        echo "[${date}] Removing symbolic link" >> $LOG_FILE
        rm -rf $DINF_WEBSITE_DIR_SYMBOLIC
    fi

    echo "[${date}] Creating symbolic link" >> $LOG_FILE

    ln -vs $DINF_WEBSITE_DIR $DINF_WEBSITE_DIR_SYMBOLIC

    echo "[${date}] Copying files" >> $LOG_FILE
    rsync -avz --delete --exclude='*.git' $WEBSITE_DIR $DINF_WEBSITE_DIR_SYMBOLIC

    echo "[${date}] Changing permissions" >> $LOG_FILE
    chmod -R 755 $DINF_WEBSITE_DIR_SYMBOLIC

    echo "Done"
else
    echo "[${date}] The repository does not have any changes" >> $LOG_FILE
fi

echo "[${date}] Script finished" >> $LOG_FILE
