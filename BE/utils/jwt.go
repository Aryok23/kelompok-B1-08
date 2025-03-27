package utils

import (
	"time"

	"github.com/Timotius2005/InfoLoker-BE/models"
	"github.com/golang-jwt/jwt/v4"
)

// Secret key untuk JWT
var jwtSecret = []byte("your_secret_key")

// GenerateJWT membuat token JWT untuk user
func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.RoleUsers,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token berlaku 24 jam
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// GenerateVerificationToken membuat token verifikasi untuk email user
func GenerateVerificationToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token berlaku 24 jam
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateVerificationToken memeriksa apakah token masih valid
func ValidateVerificationToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", err
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", err
	}
	return email, nil
}
