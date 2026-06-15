package uz.edu.timetable.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.edu.timetable.infrastructure.persistence.entity.UserJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.UserJpaRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserJpaRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserJpaEntity user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Foydalanuvchi topilmadi: " + email));
        return new CustomUserDetails(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(UUID id) {
        UserJpaEntity user = userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Foydalanuvchi topilmadi: " + id));
        return new CustomUserDetails(user);
    }
}
