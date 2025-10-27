#    #!/bin/bash
#
#    USER="site40393"
#    HOST="site40393.siteasp.net"
#    LOCAL_FILE="./mathew.api/bin/Debug/net8.0/mathew.api"
#    REMOTE_PATH="/wwwroot"
#
#    sftp "$USER@$HOST" <<EOF
#    put "$LOCAL_FILE" "$REMOTE_PATH"
#    bye
#    EOF


    #!/bin/bash

    # Configuration variables
    SFTP_USER="site40393"
    SFTP_HOST="site40393.siteasp.net"
    LOCAL_FILE="./mathew.api/bin/Debug/net8.0/mathew.api.dll"
   REMOTE_PATH="/wwwroot"

    # Set password in an environment variable and run the command
    export SSHPASS="fT#46eA=-Y9x"
    sshpass -e sftp -oBatchMode=no "${SFTP_USER}@${SFTP_HOST}" <<EOF
      put "${LOCAL_FILE}" "${REMOTE_PATH}"
      bye
    EOF

    # Unset the environment variable immediately after the command
    unset SSHPASS
