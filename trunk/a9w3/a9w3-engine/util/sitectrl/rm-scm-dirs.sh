#!/bin/bash
read -p "CTRL + C to break, others to continue."
find . -name CVS -type d -exec rm -rf {} \;
find . -name .svn -type d -exec rm -rf {} \;
