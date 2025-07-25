package com.condoflow.condo.handler;

import com.condoflow.condo.exception.DocumentAlreadyUsedException;
import com.condoflow.condo.exception.EmailAlreadyUsedException;
import com.condoflow.condo.exception.ResidentAlreadyExistsException;
import com.condoflow.condo.exception.ResidentNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DocumentAlreadyUsedException.class)
    public ResponseEntity<String> handler(DocumentAlreadyUsedException exp) {
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(exp.getMsg());
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<String> handler(EmailAlreadyUsedException exp) {
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(exp.getMsg());
    }

    @ExceptionHandler(ResidentNotFoundException.class)
    public ResponseEntity<String> handler(ResidentNotFoundException exp) {
        return ResponseEntity
                .status(NOT_FOUND)
                .body(exp.getMsg());
    }

    @ExceptionHandler(ResidentAlreadyExistsException.class)
    public ResponseEntity<String> handler(ResidentAlreadyExistsException exp) {
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(exp.getMsg());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException exp) {
        Map<String, String> errors = new HashMap<String, String>();
        exp.getAllErrors()
                .forEach(error -> {
                    String fieldName = ((FieldError) error).getField();
                    String errorMessage = error.getDefaultMessage();
                    errors.put(fieldName, errorMessage);
                });

        return ResponseEntity
                .status(BAD_REQUEST)
                .body(new ErrorResponse(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception exp) {
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .body("Internal error, contact the admin " + exp);
    }
}
