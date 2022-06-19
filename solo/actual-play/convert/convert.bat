@echo off

rem USAGE: convert.bat <story name> <story directory>
rem        "story name" will be used as both the page title and its header


set TARGET=%~dpn2

if exist ".\html" rmdir /s /q ".\html"
mkdir ".\html"

mkdir ".\html\css"
copy "*.css" ".\html\css"

for %%I in ("%TARGET%\*.md") do (
	pandoc --metadata title="%~1" -c "./css/style.css" -s "%%I" -o ".\html\%%~nI.html" --from=gfm+hard_line_breaks --to=html --lua-filter=convert-links.lua
)

if exist "%TARGET%\chapters" (
	mkdir ".\html\chapters"

	for %%I in ("%TARGET%\chapters\*.md") do (
		pandoc --metadata title="%~1" -c "../css/style.css" -c "../css/emphasis.css" -s "%%I" -o ".\html\chapters\%%~nI.html" --from=gfm+hard_line_breaks --to=html --lua-filter=convert-links.lua
	)
)

@echo.
@echo Conversion complete!
@echo.

@echo on