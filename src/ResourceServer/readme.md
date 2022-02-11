dotnet restore

dotnet ef migrations add dbdataeventrecord --context DataEventRecordContext

dotnet ef database update --context DataEventRecordContext



dotnet ef migrations add dbdataprotection --context DataProtectionDbContext

dotnet ef database update --context DataProtectionDbContext

