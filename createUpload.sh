# remove old folder and zip
rm -rf archive archive.zip

# create folders
mkdir -p archive/other
mkdir -p archive/press
mkdir -p archive/release
mkdir -p archive/src

# copy
cp screenshots/*.png archive/press
cp -R index.html src/ assets/ archive/src
cp LICENSE archive/license.txt
echo "In order to start the game start a webserver inside the source folder and open index.html." > archive/release/notes.txt
echo "A live version is avaiable at http://qtux.github.io/ggj16/." >> archive/release/notes.txt

# create zip
zip -r archive.zip archive
