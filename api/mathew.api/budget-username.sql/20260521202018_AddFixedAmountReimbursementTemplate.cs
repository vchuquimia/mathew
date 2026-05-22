using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mathew.api.budgetusername.sql
{
    /// <inheritdoc />
    public partial class AddFixedAmountReimbursementTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Percentage",
                table: "Reimbursements",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Reimbursements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ReimbursementDate",
                table: "Reimbursements",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FixedAmountReimbursementTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FixedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NumberOfPayments = table.Column<int>(type: "int", nullable: false),
                    PaymentDescriptionTemplate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedAmountReimbursementTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixedAmountReimbursementTemplates_Families_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Families",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HomeProjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Feedback = table.Column<int>(type: "int", nullable: true),
                    FeedbackComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeProjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Done = table.Column<bool>(type: "bit", nullable: false),
                    DueDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    RatingComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeTasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: false),
                    Done = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingLists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeProjectLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HomeProjectId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeProjectLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeProjectLogs_HomeProjects_HomeProjectId",
                        column: x => x.HomeProjectId,
                        principalTable: "HomeProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HomeProjectTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HomeProjectId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Done = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeProjectTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeProjectTasks_HomeProjects_HomeProjectId",
                        column: x => x.HomeProjectId,
                        principalTable: "HomeProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShoppingListItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BudgetAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ShoppingListId = table.Column<int>(type: "int", nullable: false),
                    Done = table.Column<bool>(type: "bit", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingListItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShoppingListItems_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShoppingListItems_ShoppingLists_ShoppingListId",
                        column: x => x.ShoppingListId,
                        principalTable: "ShoppingLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FixedAmountReimbursementTemplates_FamilyId",
                table: "FixedAmountReimbursementTemplates",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeProjectLogs_HomeProjectId",
                table: "HomeProjectLogs",
                column: "HomeProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeProjectTasks_HomeProjectId",
                table: "HomeProjectTasks",
                column: "HomeProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingListItems_CategoryId",
                table: "ShoppingListItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingListItems_ShoppingListId",
                table: "ShoppingListItems",
                column: "ShoppingListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FixedAmountReimbursementTemplates");

            migrationBuilder.DropTable(
                name: "HomeProjectLogs");

            migrationBuilder.DropTable(
                name: "HomeProjectTasks");

            migrationBuilder.DropTable(
                name: "HomeTasks");

            migrationBuilder.DropTable(
                name: "ShoppingListItems");

            migrationBuilder.DropTable(
                name: "HomeProjects");

            migrationBuilder.DropTable(
                name: "ShoppingLists");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "ReimbursementDate",
                table: "Reimbursements");

            migrationBuilder.AlterColumn<int>(
                name: "Percentage",
                table: "Reimbursements",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }
    }
}
