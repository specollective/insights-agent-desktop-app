global frontAppName, windowTitle, currentTabUrl, currentTabTitle

set windowTitle to ""
set currentTabUrl to ""
set currentTabTitle to ""

tell application "System Events"
	set frontApp to first application process whose frontmost is true
	set frontAppName to name of frontApp

  tell process frontAppName
    try
      tell (1st window whose value of attribute "AXMain" is true)
        set windowTitle to value of attribute "AXTitle"
      end tell
    end try
  end tell

  if (frontAppName = "Google Chrome") then
    tell application "Google Chrome" to set currentTabUrl to URL of active tab of front window
    tell application "Google Chrome" to set currentTabTitle to title of active tab of front window
  end if
end tell

return frontAppName & "\n" & currentTabTitle & "\n" & currentTabUrl
