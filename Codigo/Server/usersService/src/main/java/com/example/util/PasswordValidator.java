package com.example.util;

import com.example.exception.WeakPasswordException;
import java.util.regex.Pattern;

public class PasswordValidator {

    private static final String PASSWORD_PATTERN = 
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public static void validate(String password) {
        if (password == null || !pattern.matcher(password).matches()) {
            throw new WeakPasswordException("A senha deve ter pelo menos 8 caracteres, " +
                "incluindo letra maiúscula, minúscula, número e caractere especial.");
        }
    }
}
