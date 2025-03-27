package utils

import (
	"net/smtp"
	"os"

	"github.com/joho/godotenv"
)

func SendVerificationEmail(email, token string) error {
	godotenv.Load()
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	senderEmail := os.Getenv("SMTP_EMAIL")
	senderPassword := os.Getenv("SMTP_PASSWORD")

	msg := "Subject: Email Verification\n\nClick the link to verify: http://localhost:8080/auth/verify?token=" + token

	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpHost)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, senderEmail, []string{email}, []byte(msg))
}
