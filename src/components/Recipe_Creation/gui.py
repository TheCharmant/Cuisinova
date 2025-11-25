encrypted_message = "DQQ LV WKH JXDUGLDQ RI WKH FRGHV."
shift = 3
decrypted = ""

for char in encrypted_message:
    if char.isalpha():
        if char.isupper():
            # handle uppercase letters (A-Z)
            new_char = chr((ord(char) - shift - 65) % 26 + 65)
        else:
            # handle lowercase letters (a-z) — not needed here but included for completeness
            new_char = chr((ord(char) - shift - 97) % 26 + 97)
        decrypted += new_char
    else:
        # keep non-letters (spaces, punctuation) unchanged
        decrypted += char

print("Encrypted message:")
print(encrypted_message)
print()
print("Decrypted message (shift -3):")
print(decrypted)
