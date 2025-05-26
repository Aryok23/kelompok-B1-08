package utils

import (
	"bytes"
	"os/exec"
)

// Contoh: Gunakan pdftotext dari poppler (pastikan tersedia di sistem)
func ExtractTextFromPDF(pdfPath string) (string, error) {
	cmd := exec.Command("pdftotext", "-layout", pdfPath, "-")
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return "", err
	}
	return out.String(), nil
}
