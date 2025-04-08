using FinanceAsistant.API.DTOs;
using FluentValidation;

namespace FinanceAsistant.API.Validators;

public class InstallmentCreateDtoValidator : AbstractValidator<InstallmentCreateDto>
{
    public InstallmentCreateDtoValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(100);
        RuleFor(x => x.MonthlyAmount).GreaterThan(0);
        RuleFor(x => x.TotalMonths).InclusiveBetween(1, 120);
        RuleFor(x => x.StartDate).LessThanOrEqualTo(DateTime.Today);
    }
}