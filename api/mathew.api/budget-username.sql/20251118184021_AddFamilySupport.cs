using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mathew.api.budgetusername.sql
{
    /// <inheritdoc />
    public partial class AddFamilySupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reinbursements_Expenses_ExpenseId",
                table: "Reinbursements");

            migrationBuilder.DropIndex(
                name: "IX_Users_Name",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_IncomeSources_Name",
                table: "IncomeSources");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Name",
                table: "Categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reinbursements",
                table: "Reinbursements");

            migrationBuilder.RenameTable(
                name: "Reinbursements",
                newName: "Reimbursements");

            migrationBuilder.RenameColumn(
                name: "Percent",
                table: "Reimbursements",
                newName: "Percentage");

            migrationBuilder.RenameIndex(
                name: "IX_Reinbursements_ExpenseId",
                table: "Reimbursements",
                newName: "IX_Reimbursements_ExpenseId");

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "IncomeSources",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Incomes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Expenses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Categories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Budgets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "Reimbursements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Pending",
                table: "Reimbursements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reimbursements",
                table: "Reimbursements",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Families",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Families", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_FamilyId",
                table: "Users",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Name_FamilyId",
                table: "Users",
                columns: new[] { "Name", "FamilyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IncomeSources_FamilyId",
                table: "IncomeSources",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_IncomeSources_Name_FamilyId",
                table: "IncomeSources",
                columns: new[] { "Name", "FamilyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_FamilyId",
                table: "Incomes",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_FamilyId",
                table: "Expenses",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_FamilyId",
                table: "Categories",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name_FamilyId",
                table: "Categories",
                columns: new[] { "Name", "FamilyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_FamilyId",
                table: "Budgets",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Reimbursements_FamilyId",
                table: "Reimbursements",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Families_Name",
                table: "Families",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Budgets_Families_FamilyId",
                table: "Budgets",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Families_FamilyId",
                table: "Categories",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_Families_FamilyId",
                table: "Expenses",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Incomes_Families_FamilyId",
                table: "Incomes",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_IncomeSources_Families_FamilyId",
                table: "IncomeSources",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reimbursements_Expenses_ExpenseId",
                table: "Reimbursements",
                column: "ExpenseId",
                principalTable: "Expenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reimbursements_Families_FamilyId",
                table: "Reimbursements",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Families_FamilyId",
                table: "Users",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Budgets_Families_FamilyId",
                table: "Budgets");

            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Families_FamilyId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_Families_FamilyId",
                table: "Expenses");

            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_Families_FamilyId",
                table: "Incomes");

            migrationBuilder.DropForeignKey(
                name: "FK_IncomeSources_Families_FamilyId",
                table: "IncomeSources");

            migrationBuilder.DropForeignKey(
                name: "FK_Reimbursements_Expenses_ExpenseId",
                table: "Reimbursements");

            migrationBuilder.DropForeignKey(
                name: "FK_Reimbursements_Families_FamilyId",
                table: "Reimbursements");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Families_FamilyId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Families");

            migrationBuilder.DropIndex(
                name: "IX_Users_FamilyId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Name_FamilyId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_IncomeSources_FamilyId",
                table: "IncomeSources");

            migrationBuilder.DropIndex(
                name: "IX_IncomeSources_Name_FamilyId",
                table: "IncomeSources");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_FamilyId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_FamilyId",
                table: "Expenses");

            migrationBuilder.DropIndex(
                name: "IX_Categories_FamilyId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Name_FamilyId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Budgets_FamilyId",
                table: "Budgets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reimbursements",
                table: "Reimbursements");

            migrationBuilder.DropIndex(
                name: "IX_Reimbursements_FamilyId",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "IncomeSources");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Incomes");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "Pending",
                table: "Reimbursements");

            migrationBuilder.RenameTable(
                name: "Reimbursements",
                newName: "Reinbursements");

            migrationBuilder.RenameColumn(
                name: "Percentage",
                table: "Reinbursements",
                newName: "Percent");

            migrationBuilder.RenameIndex(
                name: "IX_Reimbursements_ExpenseId",
                table: "Reinbursements",
                newName: "IX_Reinbursements_ExpenseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reinbursements",
                table: "Reinbursements",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Name",
                table: "Users",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IncomeSources_Name",
                table: "IncomeSources",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reinbursements_Expenses_ExpenseId",
                table: "Reinbursements",
                column: "ExpenseId",
                principalTable: "Expenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
