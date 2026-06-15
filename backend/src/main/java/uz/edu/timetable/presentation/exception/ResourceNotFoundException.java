package uz.edu.timetable.presentation.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
    public ResourceNotFoundException(String resource, String id) {
        super(resource + " topilmadi: " + id);
    }
}
