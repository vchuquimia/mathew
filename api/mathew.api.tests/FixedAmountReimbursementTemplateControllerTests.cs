using mathew.entities;
using mathew.api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.tests;

public class FixedAmountReimbursementTemplateControllerTests
{
    private ExpenseDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ExpenseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ExpenseDbContext(options);
    }

    private static FixedAmountReimbursementTemplate SampleTemplate(int familyId = 1) => new()
    {
        Name = "Mortgage",
        FixedAmount = 500m,
        NumberOfPayments = 12,
        PaymentDescriptionTemplate = "Monthly mortgage split",
        UserName = "vh",
        FamilyId = familyId
    };

    [Fact]
    public async Task Get_ReturnsTemplatesForFamily()
    {
        var ctx = CreateContext();
        ctx.FixedAmountReimbursementTemplates.Add(SampleTemplate(1));
        ctx.FixedAmountReimbursementTemplates.Add(SampleTemplate(2));
        await ctx.SaveChangesAsync();

        var controller = new FixedAmountReimbursementTemplateController();
        var result = await controller.Get(ctx, familyId: 1);

        Assert.Single(result);
    }

    [Fact]
    public async Task Get_FiltersByUserName()
    {
        var ctx = CreateContext();
        var t1 = SampleTemplate(1);
        var t2 = SampleTemplate(1);
        t2.UserName = "other";
        ctx.FixedAmountReimbursementTemplates.AddRange(t1, t2);
        await ctx.SaveChangesAsync();

        var controller = new FixedAmountReimbursementTemplateController();
        var result = await controller.Get(ctx, familyId: 1, userName: "vh");

        Assert.Single(result);
        Assert.Equal("vh", result[0].UserName);
    }

    [Fact]
    public async Task GetById_ReturnsTemplate_WhenFound()
    {
        var ctx = CreateContext();
        var template = SampleTemplate();
        ctx.FixedAmountReimbursementTemplates.Add(template);
        await ctx.SaveChangesAsync();

        var controller = new FixedAmountReimbursementTemplateController();
        var result = await controller.GetById(ctx, template.Id, familyId: 1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.IsType<FixedAmountReimbursementTemplate>(ok.Value);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        var ctx = CreateContext();
        var controller = new FixedAmountReimbursementTemplateController();

        var result = await controller.GetById(ctx, id: 99, familyId: 1);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Save_CreatesNewTemplate()
    {
        var ctx = CreateContext();
        var controller = new FixedAmountReimbursementTemplateController();

        await controller.Save(ctx, SampleTemplate());

        Assert.Equal(1, await ctx.FixedAmountReimbursementTemplates.CountAsync());
    }

    [Fact]
    public async Task Save_ReturnsBadRequest_WhenFamilyIdMissing()
    {
        var ctx = CreateContext();
        var controller = new FixedAmountReimbursementTemplateController();

        var result = await controller.Save(ctx, SampleTemplate(familyId: 0));

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Save_UpdatesExistingTemplate()
    {
        var ctx = CreateContext();
        var template = SampleTemplate();
        ctx.FixedAmountReimbursementTemplates.Add(template);
        await ctx.SaveChangesAsync();

        template.FixedAmount = 999m;
        var controller = new FixedAmountReimbursementTemplateController();
        await controller.Save(ctx, template);

        var updated = await ctx.FixedAmountReimbursementTemplates.FindAsync(template.Id);
        Assert.Equal(999m, updated!.FixedAmount);
    }

    [Fact]
    public async Task Delete_RemovesTemplate()
    {
        var ctx = CreateContext();
        var template = SampleTemplate();
        ctx.FixedAmountReimbursementTemplates.Add(template);
        await ctx.SaveChangesAsync();

        var controller = new FixedAmountReimbursementTemplateController();
        await controller.Delete(ctx, template.Id, familyId: 1);

        Assert.Empty(ctx.FixedAmountReimbursementTemplates);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        var ctx = CreateContext();
        var controller = new FixedAmountReimbursementTemplateController();

        var result = await controller.Delete(ctx, id: 99, familyId: 1);

        Assert.IsType<NotFoundResult>(result.Result);
    }
}

