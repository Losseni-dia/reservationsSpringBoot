package be.event.smartbooking.errorHandler;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String messageKey;
    private final Object[] messageArgs;

    /** Constructor for raw (pre-localized) messages. */
    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.messageKey = null;
        this.messageArgs = null;
    }

    /** Constructor for message key + args; resolved by GlobalExceptionHandler via MessageSource. */
    public BusinessException(String messageKey, HttpStatus status, Object... messageArgs) {
        super(messageKey);
        this.status = status;
        this.messageKey = messageKey;
        this.messageArgs = messageArgs != null ? messageArgs : new Object[0];
    }
}