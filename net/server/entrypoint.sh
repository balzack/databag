#!/bin/sh
set -e

sqlite3 /var/lib/databag/databag.db "VACUUM;"
sqlite3 /var/lib/databag/databag.db "CREATE TABLE IF NOT EXISTS 'configs' ('id' integer NOT NULL UNIQUE,'config_id' text NOT NULL,'str_value' text,'num_value' integer,'bool_value' numeric,'bin_value' blob,PRIMARY KEY ('id'));"
sqlite3 /var/lib/databag/databag.db "CREATE UNIQUE INDEX IF NOT EXISTS 'idx_configs_config_id' ON 'configs'('config_id');"

if [[ -n "$ADMIN" ]]; then
	sqlite3 /var/lib/databag/databag.db "delete from configs where config_id='configured';"
	sqlite3 /var/lib/databag/databag.db "delete from configs where config_id='token';"
	sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, str_value) values ('token', '$ADMIN');"
	sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, bool_value) values ('configured', true);"
fi

if [[ -z "$DATABAG_PORT" ]]; then
	DATABAG_PORT=7000
fi

cd /app/databag/net/server
if [[ "$DEV" == "1" ]]; then
  touch nohup.out
  CGO_ENABLED=1 nohup go run main.go -p $DATABAG_PORT -w /app/databag/net/web/build -s /var/lib/databag -t /opt/databag/transform &
  tail -f nohup.out
else
  ./databag -p $DATABAG_PORT -w /app/databag/net/web/build -s /var/lib/databag -t /opt/databag/transform
fi
