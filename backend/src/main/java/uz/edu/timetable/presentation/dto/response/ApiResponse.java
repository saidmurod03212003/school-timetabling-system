package uz.edu.timetable.presentation.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private PageMeta meta;
    private ErrorDetail error;
    private Instant timestamp;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> ok(T data, PageMeta meta) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .meta(meta)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(ErrorDetail.of(code, message))
                .timestamp(Instant.now())
                .build();
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PageMeta {
        private long total;
        private int page;
        private int size;
        private int totalPages;

        public static PageMeta of(long total, int page, int size) {
            int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;
            return PageMeta.builder()
                    .total(total).page(page).size(size).totalPages(totalPages)
                    .build();
        }
    }

    @Data
    @Builder
    public static class ErrorDetail {
        private String code;
        private String message;

        public static ErrorDetail of(String code, String message) {
            return ErrorDetail.builder().code(code).message(message).build();
        }
    }
}
