package com.condoflow.user;

import com.condoflow.user.user.Role;
import com.condoflow.user.user.User;

public class LombokSanityCheck {
    public static void main(String[] args) {
        User user = User.builder()
                .id(1L)
                .firstName("Jesús")
                .lastName("Pérez")
                .email("jesus@correo.com")
                .document("V123456")
                .role(Role.ADMIN)
                .build();

        System.out.println(user.getFirstName()); // debería imprimir "Jesús"
        user.setEmail("nuevo@correo.com");
        System.out.println(user.getEmail());     // debería imprimir "nuevo@correo.com"
    }
}
