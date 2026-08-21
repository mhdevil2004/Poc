package models

import "time"

type Loan struct {
	ID             string    `json:"id"`
	ApplicantName  string    `json:"applicant_name"`
	Email          string    `json:"email"`
	Amount         float64   `json:"amount"`
	TermMonths     int       `json:"term_months"`
	InterestRate   float64   `json:"interest_rate"`
	MonthlyPayment float64   `json:"monthly_payment"`
	TotalPayment   float64   `json:"total_payment"`
	Status         string    `json:"status"` // pending, approved, rejected, active, completed
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// NewLoan creates a new loan instance from the request
func NewLoan(req LoanRequest, monthlyPayment, totalPayment, interestRate float64) *Loan {
	return &Loan{
		ApplicantName:  req.ApplicantName,
		Email:          req.Email,
		Amount:         req.Amount,
		TermMonths:     req.TermMonths,
		InterestRate:   interestRate,
		MonthlyPayment: monthlyPayment,
		TotalPayment:   totalPayment,
		Status:         "pending",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}
}

type LoanRequest struct {
	ApplicantName string  `json:"applicant_name"`
	Email         string  `json:"email"`
	Amount        float64 `json:"amount"`
	TermMonths    int     `json:"term_months"`
}

type LoanResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  []string    `json:"errors,omitempty"`
}

type UpdateLoanRequest struct {
	Status string `json:"status"`
}

type UpdateLoanDetailsRequest struct {
	ApplicantName string  `json:"applicant_name"`
	Email         string  `json:"email"`
	Amount        float64 `json:"amount"`
	TermMonths    int     `json:"term_months"`
}
