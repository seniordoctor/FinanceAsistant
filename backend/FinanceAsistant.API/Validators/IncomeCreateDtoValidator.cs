using FinanceAsistant.API.DTOs;
using FluentValidation;

namespace FinanceAsistant.API.Validators;

public class IncomeCreateDtoValidator : AbstractValidator<IncomeCreateDto>
{
    public IncomeCreateDtoValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0);
        RuleFor(x => x.CategoryId)
            .GreaterThan(0);
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Tutar sıfırdan büyük olmalıdır");
        RuleFor(x => x.Date)
            .NotEmpty().LessThanOrEqualTo(DateTime.Now).WithMessage("Gelecek tarih girilemez");
    }
}