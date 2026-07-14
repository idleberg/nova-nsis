; ── Block Keywords ──

(function_definition "Function" @keyword)
(function_definition "FunctionEnd" @keyword)

(section_definition "Section" @keyword)
(section_definition "SectionEnd" @keyword)

(section_group "SectionGroup" @keyword)
(section_group "SectionGroupEnd" @keyword)

(page_ex_block "PageEx" @keyword)
(page_ex_block "PageExEnd" @keyword)

(macro_definition "!macro" @processing)
(macro_definition "!macroend" @processing)

; ── Block Names ──

(function_definition
  name: (_) @identifier.function)

(section_definition
  parameter: (_) @string)

(macro_definition
  name: (identifier) @identifier.function)

(macro_definition
  parameter: (identifier) @identifier.argument)

; ── Preprocessor ──

(preproc_conditional
  keyword: (preproc_keyword) @processing)

(preproc_conditional "!endif" @processing)

(preproc_else "!else" @processing)

(preproc_directive
  directive: (preproc_keyword) @processing)

; ── Variable Declaration ──

(variable_declaration "Var" @keyword)
(variable_declaration
  name: (identifier) @identifier.variable)

; ── Plugin Calls ──

(plugin_call
  plugin: (identifier) @identifier.type)
(plugin_call
  "::" @operator)
(plugin_call
  function: (identifier) @identifier.method)

; ── Macro Invocations ──

; Built-in macros
(macro_invocation
  name: (define_reference) @identifier.core
  (#match? @identifier.core "^\\$\\{(?i)(If|IfNot|Unless|ElseIf|ElseIfNot|ElseUnless|Else|EndIf|EndUnless|AndIf|AndIfNot|AndUnless|OrIf|OrIfNot|OrUnless|IfCmd|IfThen|IfNotThen|Switch|Select|Case|Case2|Case3|Case4|Case5|CaseElse|Case_Else|Default|EndSwitch|EndSelect|For|ForEach|Next|ExitFor|Do|DoWhile|DoUntil|Loop|LoopWhile|LoopUntil|ExitDo|While|EndWhile|ExitWhile|Break|Continue|Cmd|Abort|Errors|FileExists|RebootFlag|Silent|AltRegView|RtlLanguage|ShellVarContextAll|RegKeyIsEmpty|SectionIsBold|SectionIsExpanded|SectionIsPartiallySelected|SectionIsReadOnly|SectionIsSectionGroup|SectionIsSectionGroupEnd|SectionIsSelected|SectionIsSubSection|SectionIsSubSectionEnd|Contains|ContainsS|EndsWith|EndsWithS|StartsWith|StartsWithS|IsLowerCase|IsUpperCase|IsDomainController|IsNT|IsSafeBootMode|IsServerOS|IsServicePack|IsStarterEdition|IsWin2003R2|OSHasMediaCenter|OSHasTabletSupport|BannerTrimPath|DirState|DriveSpace|GetBaseName|GetDrives|GetExeName|GetExePath|GetFileAttributes|GetFileExt|GetFileName|GetFileVersion|GetOptions|GetOptionsS|GetParameters|GetParent|GetRoot|GetSize|GetTime|Locate|RefreshShellIcons|StrFilter|StrFilterS|VersionCompare|VersionConvert|WordAdd|WordAddS|WordFind|WordFind2X|WordFind2XS|WordFind3X|WordFind3XS|WordFindS|WordInsert|WordInsertS|WordReplace|WordReplaceS|ConfigRead|ConfigReadS|ConfigWrite|ConfigWriteS|FileJoin|FileReadFromEnd|FileRecode|LineFind|LineRead|LineSum|TextCompare|TextCompareS|TrimNewLines|DisableX64FSRedirection|EnableX64FSRedirection|GetNativeMachineArchitecture|IsNativeAMD64|IsNativeARM64|IsNativeIA32|IsNativeMachineArchitecture|IsWow64|RunningX64|AtLeastBuild|AtLeastServicePack|AtLeastWaaS|AtLeastWin7|AtLeastWin8|AtLeastWin8\\.1|AtLeastWin10|AtLeastWin11|AtLeastWin95|AtLeastWin98|AtLeastWin2000|AtLeastWin2003|AtLeastWin2008|AtLeastWin2008R2|AtLeastWin2012|AtLeastWin2012R2|AtLeastWin2016|AtLeastWinME|AtLeastWinNT4|AtLeastWinVista|AtLeastWinXP|AtMostBuild|AtMostServicePack|AtMostWaaS|AtMostWin7|AtMostWin8|AtMostWin8\\.1|AtMostWin10|AtMostWin11|AtMostWin95|AtMostWin98|AtMostWin2000|AtMostWin2003|AtMostWin2008|AtMostWin2008R2|AtMostWin2012|AtMostWin2012R2|AtMostWin2016|AtMostWinME|AtMostWinNT4|AtMostWinVista|AtMostWinXP|IsWin7|IsWin8|IsWin8\\.1|IsWin10|IsWin95|IsWin98|IsWin2000|IsWin2003|IsWin2008|IsWin2008R2|IsWin2012|IsWin2012R2|IsWin2016|IsWinME|IsWinNT4|IsWinVista|IsWinXP|WinVerGetBuild|WinVerGetMajor|WinVerGetMinor|WinVerGetServicePackLevel|MementoSection|MementoSectionDone|MementoSectionEnd|MementoSectionEx|MementoSectionRestore|MementoSectionSave|MementoUnselectedSection)\\}$"))

; User-defined macros
(macro_invocation
  name: (define_reference) @identifier.function)

; ── Labels ──

(label
  name: (identifier) @identifier.property)

(label_reference) @identifier.property

; ── Constants ──

(identifier) @identifier.constant
(#match? @identifier.constant "^(?i)(ARCHIVE|FILE_ATTRIBUTE_ARCHIVE|FILE_ATTRIBUTE_HIDDEN|FILE_ATTRIBUTE_NORMAL|FILE_ATTRIBUTE_OFFLINE|FILE_ATTRIBUTE_READONLY|FILE_ATTRIBUTE_SYSTEM|FILE_ATTRIBUTE_TEMPORARY|HIDDEN|HKCC|HKCR|HKCR32|HKCR64|HKCU|HKCU32|HKCU64|HKDD|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_DYN_DATA|HKEY_LOCAL_MACHINE|HKEY_PERFORMANCE_DATA|HKEY_USERS|HKLM|HKLM32|HKLM64|HKPD|HKU|IDABORT|IDCANCEL|IDD_DIR|IDD_INST|IDD_INSTFILES|IDD_LICENSE|IDD_SELCOM|IDD_UNINST|IDD_VERIFY|IDIGNORE|IDNO|IDOK|IDRETRY|IDYES|MB_ABORTRETRYIGNORE|MB_DEFBUTTON1|MB_DEFBUTTON2|MB_DEFBUTTON3|MB_DEFBUTTON4|MB_ICONEXCLAMATION|MB_ICONINFORMATION|MB_ICONQUESTION|MB_ICONSTOP|MB_OK|MB_OKCANCEL|MB_RETRYCANCEL|MB_RIGHT|MB_RTLREADING|MB_SETFOREGROUND|MB_TOPMOST|MB_USERICON|MB_YESNO|MB_YESNOCANCEL|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SW_HIDE|SW_SHOWDEFAULT|SW_SHOWMAXIMIZED|SW_SHOWMINIMIZED|SW_SHOWNORMAL|SYSTEM|TEMPORARY)$")

; ── Booleans ──

(identifier) @value.boolean
(#match? @value.boolean "^(?i)(true|on|false|off)$")

; ── Commands ──

(command
  name: (identifier) @keyword
  (#match? @keyword "^(?i)(Abort|AddBrandingImage|AddSize|AllowRootDirInstall|AllowSkipFiles|AutoCloseWindow|BGFont|BGGradient|BrandingText|BringToFront|Call|CallInstDLL|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CPU|CRCCheck|CreateDirectory|CreateFont|CreateShortCut|Delete|DeleteINISec|DeleteINIStr|DeleteRegKey|DeleteRegValue|DetailPrint|DetailsButtonText|DirText|DirVar|DirVerify|EnableWindow|EnumRegKey|EnumRegValue|Exch|Exec|ExecShell|ExecShellWait|ExecWait|ExpandEnvStrings|File|FileBufSize|FileClose|FileErrorText|FileOpen|FileRead|FileReadByte|FileReadUTF16LE|FileReadWord|FileWriteUTF16LE|FileSeek|FileWrite|FileWriteByte|FileWriteWord|FindClose|FindFirst|FindNext|FindWindow|FlushINI|GetCurInstType|GetCurrentAddress|GetDlgItem|GetDLLVersion|GetDLLVersionLocal|GetErrorLevel|GetFileTime|GetFileTimeLocal|GetFullPathName|GetFunctionAddress|GetInstDirError|GetKnownFolderPath|GetLabelAddress|GetRegView|GetShellVarContext|GetTempFileName|GetWinVer|Goto|HideWindow|Icon|IfAbort|IfAltRegView|IfErrors|IfFileExists|IfRebootFlag|IfRtlLanguage|IfShellVarContextAll|IfSilent|InitPluginsDir|InstallButtonText|InstallColors|InstallDir|InstallDirRegKey|InstProgressFlags|InstType|InstTypeGetText|InstTypeSetText|Int64Cmp|Int64CmpU|Int64Fmt|IntCmp|IntCmpU|IntFmt|IntOp|IntPtrCmp|IntPtrCmpU|IntPtrOp|IsWindow|LangString|LicenseBkColor|LicenseData|LicenseForceSelection|LicenseLangString|LicenseText|LoadAndSetImage|LoadLanguageFile|LockWindow|LogSet|LogText|ManifestAppendCustomString|ManifestDisableWindowFiltering|ManifestDPIAware|ManifestGdiScaling|ManifestLongPathAware|ManifestMaxVersionTested|ManifestSupportedOS|MessageBox|MiscButtonText|Name|Nop|OutFile|Page|PageCallbacks|PEAddResource|PEDllCharacteristics|PERemoveResource|PESubsysVer|Pop|Push|Quit|ReadEnvStr|ReadINIStr|ReadMemory|ReadRegDWORD|ReadRegStr|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|SectionGetFlags|SectionGetInstTypes|SectionGetSize|SectionGetText|SectionIn|SectionSetFlags|SectionSetInstTypes|SectionSetSize|SectionSetText|SendMessage|SetAutoClose|SetBrandingImage|SetCompress|SetCompressionLevel|SetCompressor|SetCompressorDictSize|SetCtlColors|SetCurInstType|SetDatablockOptimize|SetDateSave|SetDetailsPrint|SetDetailsView|SetErrorLevel|SetErrors|SetFileAttributes|SetFont|SetOutPath|SetOverwrite|SetRebootFlag|SetRegView|SetShellVarContext|SetSilent|ShowInstDetails|ShowUninstDetails|ShowWindow|SilentInstall|SilentUnInstall|Sleep|SpaceTexts|StrCmp|StrCmpS|StrCpy|StrLen|SubCaption|Target|Unicode|UninstallButtonText|UninstallCaption|UninstallIcon|UninstallSubCaption|UninstallText|UninstPage|UnRegDLL|UnsafeStrCpy|VIAddVersionKey|VIFileVersion|VIProductVersion|WindowIcon|WriteINIStr|WriteRegBin|WriteRegDWORD|WriteRegExpandStr|WriteRegMultiStr|WriteRegNone|WriteRegStr|WriteUninstaller|XPStyle)$"))

; ── Deprecated Commands ──

(command
  name: (identifier) @invalid
  (#match? @invalid "^(?i)(CompareDLLVersions|CompareFileTimes|DirShow|DisabledBitmap|EnabledBitmap|GetFullDLLPath|GetParent|GetWinampInstPath|LangStringUP|PackEXEHeader|SectionDivider|SetPluginUnload|SubSection|SubSectionEnd|UninstallExeName)$"))

; ── Variables & References ──

(variable) @identifier.variable
(define_reference) @identifier.constant
(lang_string_reference) @string

; ── Built-in Variables ──

(variable) @identifier.global
(#match? @identifier.global "^\\$(?i)(ADMINTOOLS|APPDATA|CDBURN_AREA|CMDLINE|COMMONFILES|COOKIES|DESKTOP|DOCUMENTS|EXEDIR|EXEFILE|EXEPATH|FAVORITES|FONTS|HISTORY|HWNDPARENT|INSTDIR|INTERNET_CACHE|LANGUAGE|LOCALAPPDATA|MUSIC|NETHOOD|NSIS_MAX_STRLEN|NSIS_VERSION|NSISDIR|OUTDIR|PICTURES|PLUGINSDIR|PRINTHOOD|PROFILE|PROGRAMFILES|PROGRAMFILES32|PROGRAMFILES64|QUICKLAUNCH|RECENT|RESOURCES|RESOURCES_LOCALIZED|SENDTO|SMPROGRAMS|SMSTARTUP|STARTMENU|SYSDIR|TEMP|TEMPLATES|VIDEOS|WINDIR)$")

; ── Strings ──

(string) @string
(raw_string) @string
(backtick_string) @string
(escape_sequence) @string.escape

; ── Numbers ──

(number) @value.number

; ── Flags ──

(flag) @keyword.modifier

; ── Operators ──

(comparison_operator) @operator
(pipe_operator) @operator

; ── Comments ──

(comment) @comment
(block_comment) @comment
