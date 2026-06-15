package uz.edu.timetable.infrastructure.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import uz.edu.timetable.infrastructure.persistence.entity.UserJpaEntity;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String fullName;
    private final UUID schoolId;
    private final boolean active;
    private final List<String> roleNames;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(UserJpaEntity user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();
        this.fullName = user.getFullName();
        this.schoolId = user.getSchoolId();
        this.active = user.isActive();
        this.roleNames = user.getRoles().stream()
                .map(r -> r.getName())
                .collect(Collectors.toList());
        this.authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                .collect(Collectors.toList());
    }

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
}
