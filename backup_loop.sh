while true
do
    sleep 30
    echo "backup wird durchgeführt..."
    cp ./dump.rdb  "/run/media/server/BACKUP1/dump.rbp"
    cp ./dump.rdb  "/run/media/server/BACKUP1/dump+$(date +"%Y%m%d-%H%M%S").rdb"

done
