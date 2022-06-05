# Windows Data Tracker

C# .NET console app used for fetching the window data.

dotnet publish -r win-x64 --self-contained=false /p:PublishSingleFile=true

dotnet publish -r win-x64 /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=false /p:SelfContained=false --output "C:\Users\PC\Desktop"