using Models.Primitives;

namespace Budget.Functions.Functions.Subcategories.Requests;

public sealed record UpdateAssignmentRequest(decimal AssignedAmount, MonthDate AssignmentMonth);