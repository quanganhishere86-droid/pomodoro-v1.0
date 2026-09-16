!macro customInit
  nsExec::ExecToStack 'taskkill /F /IM "Pomofruti.exe" /T'
  Sleep 2000
!macroend

!macro customUnInit
  nsExec::ExecToStack 'taskkill /F /IM "Pomofruti.exe" /T'
  Sleep 2000
!macroend
