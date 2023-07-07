# MONGODB BACKUP

I create this project to help me backup and restore my mongodb databases.
I use the https://github.com/trulymittal/mongodb_backup_nodejs project, and imrpove it (for my needs).

## Features

### Backup Databases

`yarn backup`

The code take the names you add in a `DATABASES` env variable (separate with comma);

If it's the first time you backup this database, it will create a new folder with his name in the **backup** folder.

Each new save is gziped and use the ISO date format:

`backup/myDb/myDb-2023-03-12.gzip`

By default, each database folder can contain 20 backup files. You can edit this with the `FILES_LIMIT` env variable. The default value is 20.

**BE CAREFUL !!**

If the folder is full, the first file in this folder will be delete so the new backup can be saved.

### Backup Databases with CRON

`yarn start`

### Restore Database

TODO
