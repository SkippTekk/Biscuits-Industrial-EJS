#!/bin/bash
CB='\033[0;32m';
CE='\033[0m';

clear
echo -e "${CB}Hello, This is a testing script, please don't break me.${CE}";
echo -e "${CB}Downloading file now. This may take a few minutes.. DO NOT CLOSE THIS WINDOW.${CE}"
wget -q --user-agent="Biscuits Industrial by SkippTekk" https://www.fuzzwork.co.uk/dump/mysql-latest.tar.bz2;


echo -e "${CB}Download complete, Now tasking stages.${CE}";

echo -e "${CB}Stage 1:${CE} Unzip of bz2";
bzip2 -d mysql-latest.tar.bz2;


echo -e "${CB}Stage 2:${CE} Unzipping tar file.";
tar -xvf mysql-latest.tar;

echo -e "${CB}Stage 2 complete.${CE}";

cd $(ls -td -- */ | head -n 1);

echo -e "${CB}Moved to correct directory${CE}";
echo -e "${CB}Uploading SQL file to the MariaDB now... Hopefully it works${CE}";
#
# You had the wrong syntax :P Also ensure /var is correct as it's a system directory.
#
ls | while read -r file; do
        #
        # Import SQL files only!
        #
        if [[ "$file" == *".sql" ]]; then
                mysql -u [USERNAME HERE] -p[password goes here without the []] [DATABASE NAME] < "${file}";
                echo -e "Importing file ${CB}${file}${CE}";
        fi
done

echo -e "${CB}There, Import is done, Now to nuke files.?${CE}";

cd ..;
echo -e "Nuking mysql files now.";

find . -type f ! -name '*.sh' -delete
find . -type d -delete