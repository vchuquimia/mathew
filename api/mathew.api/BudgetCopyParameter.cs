public class BudgetCopyParameter
{
    public int SourceMonth{ get; set; }
    public int SourceYear{ get; set; }
    public int TargetMonth{ get; set; }
    public int TargetYear{ get; set; }
    public bool OverwriteExisting{ get; set; }
}