@echo On
@Rem rm CVS dirs

@for /r . %%a in (.) do @if exist "%%a\CVS\" rmdir /q /s "%%a\CVS\"

@echo Mission Completed.
@pause