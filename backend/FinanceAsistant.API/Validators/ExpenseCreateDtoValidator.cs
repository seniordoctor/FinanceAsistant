using FinanceAsistant.API.DTOs;
using FluentValidation;

namespace FinanceAsistant.API.Validators;

public class ExpenseCreateDtoValidator : AbstractValidator<ExpenseCreateDto>
{
    public ExpenseCreateDtoValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0);
        RuleFor(x => x.CategoryId)
            .GreaterThan(0);
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Tutar sıfırdan büyük olmalı");
        RuleFor(x => x.Date)
            .NotEmpty().LessThanOrEqualTo(DateTime.Now).WithMessage("Geçerli bir tarih girilmelidir");
    }
}