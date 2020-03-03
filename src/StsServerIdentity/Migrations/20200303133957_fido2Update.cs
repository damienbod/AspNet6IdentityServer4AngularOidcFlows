using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IdentityServerWithAspNetIdentity.Migrations
{
    public partial class fido2Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FidoStoredCredential",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(nullable: true),
                    UserId = table.Column<byte[]>(nullable: true),
                    PublicKey = table.Column<byte[]>(nullable: true),
                    UserHandle = table.Column<byte[]>(nullable: true),
                    SignatureCounter = table.Column<uint>(nullable: false),
                    CredType = table.Column<string>(nullable: true),
                    RegDate = table.Column<DateTime>(nullable: false),
                    AaGuid = table.Column<Guid>(nullable: false),
                    DescriptorJson = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FidoStoredCredential", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FidoStoredCredential");
        }
    }
}
