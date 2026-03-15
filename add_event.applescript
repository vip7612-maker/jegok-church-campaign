tell application "Calendar"
    activate
    delay 2
    set calFound to false
    repeat with c in calendars
        if name of c is "vip7612@gmail.com" then
            set calFound to true
            tell c
                set startDate to (current date)
                set year of startDate to 2026
                set month of startDate to 3
                set day of startDate to 29
                set hours of startDate to 12
                set minutes of startDate to 0
                set seconds of startDate to 0
                
                set endDate to startDate + (2 * hours)
                
                make new event with properties {summary:"큰삼촌 팔순", location:"서울 강서구", description:"큰삼촌 팔순 잔치", start date:startDate, end date:endDate}
            end tell
        end if
    end repeat
    if not calFound then
        error "Calendar 'vip7612@gmail.com' not found"
    end if
end tell
