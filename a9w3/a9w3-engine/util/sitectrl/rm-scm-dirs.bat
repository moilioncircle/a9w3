@echo off
Rem rm CVS dirs
echo CTRL + C to break, others to continue.
pause
for /r . %%a in (.) do @if exist "%%a\CVS\" rmdir /q /s "%%a\CVS\"
for /r . %%a in (.) do @if exist "%%a\.svn\" rmdir /q /s "%%a\.svn\"
