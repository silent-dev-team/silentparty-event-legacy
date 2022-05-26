while true
do
    sleep 30
    #echo "backup wird durchgeführt..."
    TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
    cp ./dump.rdb  "/run/media/jan/BACKUP1/dump+$(date +"%Y%m%d-%H%M%S").rdb"

done
